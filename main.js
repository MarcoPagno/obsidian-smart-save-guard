const { Plugin } = require("obsidian");

module.exports = class SmartSaveGuardPlugin extends Plugin {
  async onload() {
    console.log("Smart Save Guard loaded");

    this.statusEl = this.addStatusBarItem();
    this.statusEl.setText("Idle");
    this.statusEl.style.fontWeight = "500";
    this.statusEl.style.marginLeft = "8px";
    this.statusEl.style.color = "var(--text-muted)";
    this.statusEl.style.transition = "color 0.2s ease";

    this.cache = {};
    this.lastSaved = {};
    this.saveDelay = 2000;
    this.flushInterval = 8000;
    this.lastEditTime = 0;

    this.registerEvent(
      this.app.workspace.on("editor-change", (editor) => {
        const file = this.app.workspace.getActiveFile();
        if (!file) return;

        const content = editor.getValue();
        this.cache[file.path] = content;
        this.lastEditTime = Date.now();
        this.statusEl.setText("Editing…");
        this.statusEl.style.color = "var(--text-accent)";

        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => this.tryFlush(file), this.saveDelay);
      })
    );

    this.flushTimer = setInterval(() => this.flushAll(), this.flushInterval);
    this.registerInterval(this.flushTimer);
  }

  async tryFlush(file) {
    const now = Date.now();
    if (now - this.lastEditTime < this.saveDelay) return;

    const content = this.cache[file.path];
    if (!content) return;

    try {
      const current = await this.app.vault.read(file);
      if (current.trim() !== content.trim()) {
        await this.app.vault.modify(file, content);
        this.lastSaved[file.path] = Date.now();
        console.log(`[SmartSaveGuard] Saved ${file.path} at ${new Date().toLocaleTimeString()}`);
        this.showSaved();
      } else {
        console.log(`[SmartSaveGuard] Skipped save (no changes detected): ${file.path}`);
      }
    } catch (e) {
      console.error(`[SmartSaveGuard] Save error:`, e);
      this.showError();
    }
  }

  async flushAll() {
    const file = this.app.workspace.getActiveFile();
    if (!file || !this.cache[file.path]) return;
    await this.tryFlush(file);
  }

  showSaved() {
    this.statusEl.setText("Saved ✓");
    this.statusEl.style.color = "var(--text-success, #4caf50)";
    setTimeout(() => {
      this.statusEl.setText("Idle");
      this.statusEl.style.color = "var(--text-muted)";
    }, 1500);
  }

  showError() {
    this.statusEl.setText("Error saving");
    this.statusEl.style.color = "var(--text-error, #e53935)";
    setTimeout(() => {
      this.statusEl.setText("Idle");
      this.statusEl.style.color = "var(--text-muted)";
    }, 2000);
  }

  onunload() {
    clearInterval(this.flushTimer);
  }
};
