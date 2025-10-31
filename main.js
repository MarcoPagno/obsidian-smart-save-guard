const { Plugin } = require("obsidian");
const fs = require("fs");
const path = require("path");

module.exports = class SmartSaveGuard extends Plugin {
  async onload() {
    console.log("SmartSaveGuard loaded");

    this.cacheDir = path.join(this.app.vault.adapter.getBasePath(), ".smart-save-guard");
    if (!fs.existsSync(this.cacheDir)) fs.mkdirSync(this.cacheDir, { recursive: true });

    this.lastContent = {};
    this.flushInterval = 4000;
    this.statusEl = this.addStatusBarItem();
    this.statusEl.setText("Idle");
    this.statusEl.style.color = "var(--text-muted)";

    const updateHandler = () => {
      this.lastInput = Date.now();
      this.statusEl.setText("Editing...");
      this.statusEl.style.color = "var(--text-accent)";
      this.saveToCache();
    };

    this.registerDomEvent(document, "input", updateHandler);
    this.registerDomEvent(document, "keyup", updateHandler);
    this.registerDomEvent(document, "change", updateHandler);

    this.registerInterval(window.setInterval(() => this.flushCache(), this.flushInterval));
  }

  async saveToCache() {
    const file = this.app.workspace.getActiveFile();
    const editor = this.app.workspace.activeEditor?.editor;
    if (!file || !editor) return;

    const content = editor.getValue();
    if (this.lastContent[file.path] === content) return;

    this.lastContent[file.path] = content;
    const cachePath = path.join(this.cacheDir, file.path.replace(/\//g, "_"));

    fs.writeFileSync(cachePath, content, "utf8");
    console.log(`[SmartSaveGuard] Cached ${file.path}`);
  }

  async flushCache() {
    const file = this.app.workspace.getActiveFile();
    if (!file) return;

    const adapter = this.app.vault.adapter;
    const fullPath = adapter.getFullPath(file.path);
    const cachePath = path.join(this.cacheDir, file.path.replace(/\//g, "_"));

    if (!fs.existsSync(cachePath)) return;

    const cachedContent = fs.readFileSync(cachePath, "utf8");
    const diskContent = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : "";

    if (cachedContent !== diskContent) {
      this.statusEl.setText("Saving...");
      this.statusEl.style.color = "var(--text-warning)";

      try {
        fs.writeFileSync(fullPath, cachedContent, "utf8");
        console.log(`[SmartSaveGuard] Flushed ${file.path}`);
        this.statusEl.setText("Saved ✓");
        this.statusEl.style.color = "var(--text-success)";
      } catch (e) {
        console.error(`[SmartSaveGuard] Error saving ${file.path}:`, e);
        this.statusEl.setText("Error");
        this.statusEl.style.color = "var(--text-error)";
      }

      setTimeout(() => {
        this.statusEl.setText("Idle");
        this.statusEl.style.color = "var(--text-muted)";
      }, 1500);
    }
  }
};
