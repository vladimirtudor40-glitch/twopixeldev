//go:build !windows

// Non-Windows stubs, only so the app can be built and tested on Linux/macOS.
package main

import (
	"os"
	"os/exec"
	"path/filepath"
	"syscall"
)

const scraperName = "gmaps-scraper"

func hideWindow(cmd *exec.Cmd) { cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true} }
func killTree(pid int)         { _ = syscall.Kill(-pid, syscall.SIGKILL) }

func documentsDir() string {
	if p := os.Getenv("CAUTA_LEADURI_OUT"); p != "" {
		return p
	}
	home, _ := os.UserHomeDir()
	return filepath.Join(home, "Documents", "Leaduri")
}

func localAppData() string {
	home, _ := os.UserHomeDir()
	return filepath.Join(home, ".local", "share")
}

func openPath(p string)   { _ = exec.Command("xdg-open", p).Start() }
func revealFile(p string) { openPath(filepath.Dir(p)) }
func openWindow(u string) { openPath(u) }
