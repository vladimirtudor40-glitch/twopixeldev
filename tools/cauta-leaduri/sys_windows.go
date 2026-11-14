//go:build windows

package main

import (
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"syscall"

	"golang.org/x/sys/windows"
)

const scraperName = "gmaps-scraper.exe"

const createNoWindow = 0x08000000

func hideWindow(cmd *exec.Cmd) {
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true, CreationFlags: createNoWindow}
}

// killTree stops the scraper and the Chromium it started.
func killTree(pid int) {
	c := exec.Command("taskkill", "/T", "/F", "/PID", strconv.Itoa(pid))
	hideWindow(c)
	_ = c.Run()
}

func documentsDir() string {
	if p, err := windows.KnownFolderPath(windows.FOLDERID_Documents, 0); err == nil && p != "" {
		return filepath.Join(p, "Leaduri")
	}
	home, _ := os.UserHomeDir()
	return filepath.Join(home, "Documents", "Leaduri")
}

func localAppData() string {
	if p := os.Getenv("LOCALAPPDATA"); p != "" {
		return p
	}
	home, _ := os.UserHomeDir()
	return filepath.Join(home, "AppData", "Local")
}

func openPath(p string) {
	c := exec.Command("rundll32", "url.dll,FileProtocolHandler", p)
	hideWindow(c)
	_ = c.Start()
}

func revealFile(p string) {
	_ = exec.Command("explorer", "/select,", p).Start()
}

// openWindow shows the UI in its own app window (Edge, else Chrome, else the default browser).
func openWindow(u string) {
	profile := filepath.Join(localAppData(), "CautaLeaduri", "window")
	args := []string{"--app=" + u, "--user-data-dir=" + profile, "--window-size=1320,880",
		"--no-first-run", "--no-default-browser-check", "--disable-features=Translate"}
	for _, env := range []string{"ProgramFiles(x86)", "ProgramFiles", "LOCALAPPDATA"} {
		base := os.Getenv(env)
		if base == "" {
			continue
		}
		for _, rel := range []string{`Microsoft\Edge\Application\msedge.exe`, `Google\Chrome\Application\chrome.exe`} {
			p := filepath.Join(base, rel)
			if _, err := os.Stat(p); err == nil {
				if exec.Command(p, args...).Start() == nil {
					return
				}
			}
		}
	}
	openPath(u)
}
