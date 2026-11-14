// Caută leaduri — twopixeldev
//
// A small desktop app around github.com/gosom/google-maps-scraper: the user types what to
// search (e.g. "frizerie" in "Constanța"), the scraper runs hidden, and the app shows which
// businesses have no website. The CSV is saved in Documents\Leaduri and can be imported in
// twopixeldev.com/app → Site-uri → „importă leaduri”.
//
// The UI is a local web page (embedded) opened in an Edge/Chrome app window, served only on
// 127.0.0.1. The app quits when that window is closed.
package main

import (
	"bytes"
	"embed"
	"encoding/csv"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"net"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
	"unicode"

	"golang.org/x/text/unicode/norm"
)

//go:embed ui
var uiFS embed.FS

const (
	port    = 47823
	appURL  = "https://twopixeldev.com/app"
	version = "1.0.0"
)

var (
	exeDir  string
	outDir  string
	dataDir string
	scraper string
)

func main() {
	exe, _ := os.Executable()
	exeDir = filepath.Dir(exe)
	outDir = documentsDir()
	dataDir = filepath.Join(localAppData(), "CautaLeaduri")
	_ = os.MkdirAll(outDir, 0o755)
	_ = os.MkdirAll(dataDir, 0o755)
	scraper = findScraper()

	addr := fmt.Sprintf("127.0.0.1:%d", port)
	ln, err := net.Listen("tcp", addr)
	if err != nil {
		// Already running: just bring up another window on the running instance.
		openWindow("http://" + addr + "/")
		return
	}

	mux := http.NewServeMux()
	sub, _ := fs.Sub(uiFS, "ui")
	mux.Handle("/", http.FileServer(http.FS(sub)))
	mux.HandleFunc("/api/info", apiInfo)
	mux.HandleFunc("/api/search", apiSearch)
	mux.HandleFunc("/api/stop", apiStop)
	mux.HandleFunc("/api/status", apiStatus)
	mux.HandleFunc("/api/results", apiResults)
	mux.HandleFunc("/api/history", apiHistory)
	mux.HandleFunc("/api/delete", apiDelete)
	mux.HandleFunc("/api/export", apiExport)
	mux.HandleFunc("/api/open", apiOpen)
	mux.HandleFunc("/api/ping", apiPing)

	go func() { _ = http.Serve(ln, guard(mux)) }()

	if os.Getenv("CAUTA_LEADURI_NO_WINDOW") == "" {
		openWindow("http://" + addr + "/")
	}
	watchWindow()
	job.stop()
}

// guard blocks other web pages from talking to this local server (DNS rebinding / CSRF).
func guard(h http.Handler) http.Handler {
	okHost := map[string]bool{fmt.Sprintf("127.0.0.1:%d", port): true, fmt.Sprintf("localhost:%d", port): true}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !okHost[r.Host] {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}
		if strings.HasPrefix(r.URL.Path, "/api/") && r.Method != http.MethodGet && r.Header.Get("X-TPD") != "1" {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}
		w.Header().Set("Cache-Control", "no-store")
		h.ServeHTTP(w, r)
	})
}

// ---------- window lifetime ----------

var (
	pingMu   sync.Mutex
	lastPing time.Time
)

func apiPing(w http.ResponseWriter, r *http.Request) {
	pingMu.Lock()
	lastPing = time.Now()
	pingMu.Unlock()
	writeJSON(w, map[string]bool{"ok": true})
}

// watchWindow returns when no window has pinged for a while (the user closed it).
func watchWindow() {
	start := time.Now()
	for {
		time.Sleep(2 * time.Second)
		pingMu.Lock()
		lp := lastPing
		pingMu.Unlock()
		if lp.IsZero() {
			if time.Since(start) > 3*time.Minute {
				return // the window never opened
			}
			continue
		}
		if time.Since(lp) > 20*time.Second {
			return
		}
	}
}

// ---------- the scraper job ----------

type Job struct {
	mu       sync.Mutex
	cmd      *exec.Cmd
	running  bool
	started  time.Time
	finished time.Time
	query    string
	file     string
	log      []string
	err      string
	stopped  bool
}

var job = &Job{}

func (j *Job) addLog(line string) {
	j.mu.Lock()
	defer j.mu.Unlock()
	line = strings.TrimSpace(line)
	if line == "" {
		return
	}
	j.log = append(j.log, line)
	if len(j.log) > 200 {
		j.log = j.log[len(j.log)-200:]
	}
}

func (j *Job) stop() {
	j.mu.Lock()
	cmd := j.cmd
	j.stopped = true
	j.mu.Unlock()
	if cmd != nil && cmd.Process != nil {
		killTree(cmd.Process.Pid)
	}
}

type searchReq struct {
	What  string `json:"what"`
	Where string `json:"where"`
	Depth int    `json:"depth"`
	Email bool   `json:"email"`
}

func apiSearch(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method", http.StatusMethodNotAllowed)
		return
	}
	var req searchReq
	if err := json.NewDecoder(io.LimitReader(r.Body, 1<<16)).Decode(&req); err != nil {
		writeErr(w, "Cerere invalidă.")
		return
	}
	query := strings.Join(strings.Fields(strings.TrimSpace(req.What+" "+req.Where)), " ")
	if query == "" {
		writeErr(w, "Scrie ce cauți, de exemplu „frizerie”.")
		return
	}
	if scraper == "" {
		writeErr(w, "Nu găsesc gmaps-scraper.exe lângă aplicație. Reinstalează aplicația.")
		return
	}
	depth := req.Depth
	if depth < 1 {
		depth = 1
	}
	if depth > 20 {
		depth = 20
	}

	job.mu.Lock()
	if job.running {
		job.mu.Unlock()
		writeErr(w, "O căutare e deja în curs.")
		return
	}
	stamp := time.Now().Format("2006-01-02-1504")
	file := filepath.Join(outDir, fmt.Sprintf("leaduri-%s-%s.csv", slug(query), stamp))
	qfile := filepath.Join(dataDir, "queries.txt")
	if err := os.WriteFile(qfile, []byte(query+"\n"), 0o644); err != nil {
		job.mu.Unlock()
		writeErr(w, "Nu pot scrie fișierul de căutare: "+err.Error())
		return
	}
	args := []string{"-input", qfile, "-results", file, "-depth", strconv.Itoa(depth), "-lang", "ro",
		"-exit-on-inactivity", "3m", "-c", "2"}
	if req.Email {
		args = append(args, "-email")
	}
	cmd := exec.Command(scraper, args...)
	cmd.Dir = dataDir
	hideWindow(cmd)
	pr, pw := io.Pipe()
	cmd.Stdout, cmd.Stderr = pw, pw
	if err := cmd.Start(); err != nil {
		job.mu.Unlock()
		writeErr(w, "Nu pot porni căutarea: "+err.Error())
		return
	}
	job.cmd, job.running, job.started, job.finished = cmd, true, time.Now(), time.Time{}
	job.query, job.file, job.log, job.err, job.stopped = query, file, nil, "", false
	job.mu.Unlock()

	go func() {
		buf := make([]byte, 4096)
		var rest string
		for {
			n, err := pr.Read(buf)
			if n > 0 {
				parts := strings.Split(rest+string(buf[:n]), "\n")
				rest = parts[len(parts)-1]
				for _, p := range parts[:len(parts)-1] {
					job.addLog(p)
				}
			}
			if err != nil {
				job.addLog(rest)
				return
			}
		}
	}()
	go func() {
		err := cmd.Wait()
		_ = pw.Close()
		job.mu.Lock()
		defer job.mu.Unlock()
		job.running = false
		job.finished = time.Now()
		job.cmd = nil
		if err != nil && !job.stopped {
			if _, statErr := os.Stat(job.file); statErr != nil {
				job.err = "Căutarea s-a oprit cu o eroare. Vezi „detalii tehnice”."
			}
		}
	}()
	writeJSON(w, map[string]string{"file": filepath.Base(file)})
}

func apiStop(w http.ResponseWriter, r *http.Request) {
	job.stop()
	writeJSON(w, map[string]bool{"ok": true})
}

func apiStatus(w http.ResponseWriter, r *http.Request) {
	job.mu.Lock()
	defer job.mu.Unlock()
	end := time.Now()
	if !job.running && !job.finished.IsZero() {
		end = job.finished
	}
	found := 0
	if job.file != "" {
		found = countRows(job.file)
	}
	elapsed := 0
	if !job.started.IsZero() {
		elapsed = int(end.Sub(job.started).Seconds())
	}
	logs := job.log
	if len(logs) > 60 {
		logs = logs[len(logs)-60:]
	}
	writeJSON(w, map[string]any{
		"running": job.running, "query": job.query, "file": filepath.Base(job.file), "found": found,
		"elapsed": elapsed, "error": job.err, "stopped": job.stopped, "log": logs, "phase": phase(job.log, found),
	})
}

// phase turns the scraper's technical log into a short Romanian status line.
func phase(log []string, found int) string {
	if found > 0 {
		return fmt.Sprintf("Am găsit %d firme până acum…", found)
	}
	all := strings.ToLower(strings.Join(log, "\n"))
	switch {
	case strings.Contains(all, "download") || strings.Contains(all, "install"):
		return "Pregătesc browserul (doar prima dată, câteva minute)…"
	case len(log) > 0:
		return "Caut pe Google Maps…"
	default:
		return "Pornesc…"
	}
}

func countRows(file string) int {
	b, err := os.ReadFile(file)
	if err != nil || len(b) == 0 {
		return 0
	}
	rows, _ := readCSV(bytes.NewReader(b))
	if len(rows) == 0 {
		return 0
	}
	return len(rows) - 1
}

// ---------- results ----------

type Lead struct {
	Name     string `json:"name"`
	Phone    string `json:"phone"`
	Email    string `json:"email"`
	Website  string `json:"website"`
	Kind     string `json:"kind"` // "none" | "social" | "site"
	Category string `json:"category"`
	Address  string `json:"address"`
	Rating   string `json:"rating"`
	Reviews  string `json:"reviews"`
	Maps     string `json:"maps"`
	Closed   bool   `json:"closed"`
	row      int
}

var social = regexp.MustCompile(`(?i)(^|\.)(facebook|fb|instagram|tiktok|linktr|linkedin|wa)\.(com|me|ee)$|(^|\.)(m\.me|business\.site)$`)

func siteKind(website string) string {
	w := strings.TrimSpace(website)
	if w == "" {
		return "none"
	}
	if !strings.Contains(w, "://") {
		w = "https://" + w
	}
	host := w
	if u, err := url.Parse(w); err == nil && u.Hostname() != "" {
		host = u.Hostname()
	}
	if social.MatchString(host) {
		return "social"
	}
	return "site"
}

func readCSV(r io.Reader) ([][]string, error) {
	cr := csv.NewReader(r)
	cr.FieldsPerRecord = -1
	cr.LazyQuotes = true
	var rows [][]string
	for {
		rec, err := cr.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			// a row still being written at the end of the file
			break
		}
		rows = append(rows, rec)
	}
	return rows, nil
}

func parseLeads(file string) ([]Lead, [][]string, error) {
	f, err := os.Open(file)
	if err != nil {
		return nil, nil, err
	}
	defer f.Close()
	rows, _ := readCSV(f)
	if len(rows) == 0 {
		return []Lead{}, rows, nil
	}
	head := rows[0]
	if len(head) > 0 {
		head[0] = strings.TrimPrefix(head[0], "\ufeff")
	}
	idx := func(names ...string) int {
		for i, h := range head {
			h = strings.ToLower(strings.TrimSpace(h))
			for _, n := range names {
				if h == n {
					return i
				}
			}
		}
		return -1
	}
	c := map[string]int{
		"name": idx("title", "name"), "phone": idx("phone"), "email": idx("emails", "email"), "web": idx("website"),
		"cat": idx("category"), "addr": idx("address", "complete_address"), "rating": idx("review_rating", "rating"),
		"reviews": idx("review_count", "reviews"), "link": idx("link", "url"), "status": idx("status"),
	}
	get := func(r []string, k string) string {
		i := c[k]
		if i < 0 || i >= len(r) {
			return ""
		}
		return strings.TrimSpace(r[i])
	}
	var out []Lead
	for ri, r := range rows[1:] {
		name := get(r, "name")
		if name == "" {
			continue
		}
		web := get(r, "web")
		out = append(out, Lead{
			Name: name, Phone: get(r, "phone"), Email: firstEmail(get(r, "email")), Website: web, Kind: siteKind(web),
			Category: get(r, "cat"), Address: get(r, "addr"), Rating: get(r, "rating"), Reviews: get(r, "reviews"),
			Maps: get(r, "link"), Closed: strings.Contains(strings.ToLower(get(r, "status")), "permanent"), row: ri + 1,
		})
	}
	if out == nil {
		out = []Lead{}
	}
	return out, rows, nil
}

func firstEmail(s string) string {
	for _, p := range strings.FieldsFunc(s, func(r rune) bool { return strings.ContainsRune("[]\",; ", r) }) {
		if strings.Contains(p, "@") {
			return p
		}
	}
	return ""
}

// safeFile resolves a file name inside the output folder only.
func safeFile(name string) (string, error) {
	base := filepath.Base(name)
	if base != name || !strings.HasSuffix(strings.ToLower(base), ".csv") {
		return "", errors.New("bad name")
	}
	return filepath.Join(outDir, base), nil
}

func apiResults(w http.ResponseWriter, r *http.Request) {
	p, err := safeFile(r.URL.Query().Get("file"))
	if err != nil {
		writeErr(w, "Fișier invalid.")
		return
	}
	leads, _, err := parseLeads(p)
	if err != nil {
		writeErr(w, "Nu pot deschide fișierul.")
		return
	}
	writeJSON(w, map[string]any{"file": filepath.Base(p), "leads": leads})
}

type histItem struct {
	File    string `json:"file"`
	Query   string `json:"query"`
	Date    string `json:"date"`
	Total   int    `json:"total"`
	NoSite  int    `json:"nosite"`
	modTime time.Time
}

var stampRe = regexp.MustCompile(`^leaduri-(.*?)-?(\d{4}-\d{2}-\d{2}-\d{4})(-fara-site)?\.csv$`)

func apiHistory(w http.ResponseWriter, r *http.Request) {
	entries, _ := os.ReadDir(outDir)
	var items []histItem
	for _, e := range entries {
		n := e.Name()
		if e.IsDir() || !strings.HasSuffix(strings.ToLower(n), ".csv") || strings.HasSuffix(n, "-fara-site.csv") {
			continue
		}
		info, err := e.Info()
		if err != nil {
			continue
		}
		it := histItem{File: n, modTime: info.ModTime(), Date: info.ModTime().Format("02.01.2006 15:04")}
		if m := stampRe.FindStringSubmatch(n); m != nil {
			it.Query = strings.ReplaceAll(m[1], "-", " ")
		} else {
			it.Query = strings.TrimSuffix(n, filepath.Ext(n))
		}
		if leads, _, err := parseLeads(filepath.Join(outDir, n)); err == nil {
			it.Total = len(leads)
			for _, l := range leads {
				if l.Kind != "site" && !l.Closed {
					it.NoSite++
				}
			}
		}
		items = append(items, it)
	}
	sort.Slice(items, func(i, j int) bool { return items[i].modTime.After(items[j].modTime) })
	if items == nil {
		items = []histItem{}
	}
	writeJSON(w, map[string]any{"items": items, "folder": outDir, "version": version})
}

func apiDelete(w http.ResponseWriter, r *http.Request) {
	var body struct{ File string }
	_ = json.NewDecoder(io.LimitReader(r.Body, 1<<12)).Decode(&body)
	p, err := safeFile(body.File)
	if err != nil {
		writeErr(w, "Fișier invalid.")
		return
	}
	job.mu.Lock()
	busy := job.running && filepath.Base(job.file) == body.File
	job.mu.Unlock()
	if busy {
		writeErr(w, "Căutarea încă rulează.")
		return
	}
	_ = os.Remove(p)
	writeJSON(w, map[string]bool{"ok": true})
}

// apiExport writes a copy with only the businesses without a website (same columns, so it
// can still be imported in the twopixeldev app).
func apiExport(w http.ResponseWriter, r *http.Request) {
	var body struct{ File string }
	_ = json.NewDecoder(io.LimitReader(r.Body, 1<<12)).Decode(&body)
	p, err := safeFile(body.File)
	if err != nil {
		writeErr(w, "Fișier invalid.")
		return
	}
	leads, rows, err := parseLeads(p)
	if err != nil || len(rows) == 0 {
		writeErr(w, "Nu pot deschide fișierul.")
		return
	}
	out := [][]string{rows[0]}
	for _, l := range leads {
		if l.Kind != "site" && !l.Closed {
			out = append(out, rows[l.row])
		}
	}
	dst := strings.TrimSuffix(p, ".csv") + "-fara-site.csv"
	var buf bytes.Buffer
	buf.WriteString("\ufeff") // Excel opens UTF-8 correctly with a BOM
	cw := csv.NewWriter(&buf)
	_ = cw.WriteAll(out)
	if err := os.WriteFile(dst, buf.Bytes(), 0o644); err != nil {
		writeErr(w, "Nu pot salva: "+err.Error())
		return
	}
	revealFile(dst)
	writeJSON(w, map[string]any{"file": filepath.Base(dst), "count": len(out) - 1})
}

func apiOpen(w http.ResponseWriter, r *http.Request) {
	var body struct{ What, File, URL string }
	_ = json.NewDecoder(io.LimitReader(r.Body, 1<<12)).Decode(&body)
	switch body.What {
	case "folder":
		if p, err := safeFile(body.File); err == nil && body.File != "" {
			revealFile(p)
		} else {
			openPath(outDir)
		}
	case "file":
		if p, err := safeFile(body.File); err == nil {
			openPath(p)
		}
	case "app":
		openPath(appURL)
	case "maps":
		if u, err := url.Parse(body.URL); err == nil && u.Scheme == "https" && strings.HasSuffix(u.Hostname(), "google.com") {
			openPath(u.String())
		}
	}
	writeJSON(w, map[string]bool{"ok": true})
}

func apiInfo(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, map[string]any{"version": version, "folder": outDir, "scraper": scraper != ""})
}

// ---------- helpers ----------

func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	_ = json.NewEncoder(w).Encode(v)
}

func writeErr(w http.ResponseWriter, msg string) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusBadRequest)
	_ = json.NewEncoder(w).Encode(map[string]string{"error": msg})
}

func slug(s string) string {
	t := norm.NFD.String(strings.ToLower(s))
	var b strings.Builder
	dash := false
	for _, r := range t {
		switch {
		case unicode.Is(unicode.Mn, r):
		case r < 128 && (unicode.IsLetter(r) || unicode.IsDigit(r)):
			b.WriteRune(r)
			dash = false
		default:
			if !dash && b.Len() > 0 {
				b.WriteByte('-')
				dash = true
			}
		}
	}
	out := strings.Trim(b.String(), "-")
	if len(out) > 40 {
		out = strings.Trim(out[:40], "-")
	}
	if out == "" {
		out = "cautare"
	}
	return out
}

func findScraper() string {
	for _, p := range []string{
		filepath.Join(exeDir, "scraper", scraperName),
		filepath.Join(exeDir, scraperName),
		os.Getenv("CAUTA_LEADURI_SCRAPER"),
	} {
		if p == "" {
			continue
		}
		if st, err := os.Stat(p); err == nil && !st.IsDir() {
			return p
		}
	}
	return ""
}
