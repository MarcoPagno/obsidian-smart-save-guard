# Smart Save Guard

**Smart Save Guard** is an Obsidian plugin that enhances file saving reliability when using cloud-synced vaults (iCloud, OneDrive, Dropbox, Google Drive, etc.).  
It prevents data loss and file duplication by caching edits locally and only writing them to disk when typing stops.

---

## ✨ Features

- 🧠 Smart delayed saving (writes only after you stop typing)
- 💾 Local caching layer to avoid overwriting in sync conflicts
- 🔁 Periodic background flush for extra safety
- 🟢 Status bar indicator showing save status (`Editing…`, `Saved ✓`, `Error saving`)
- 🔒 100% local – no network usage or external sync service
- 🪶 Works seamlessly with any third-party cloud provider

---

## ⚙️ How It Works

1. While you type, your current note is cached locally in memory.
2. When you stop typing for 2 seconds, the plugin safely writes it to disk.
3. Every 8 seconds, a background “flush” runs to ensure no unsaved data remains.
4. Before writing, the plugin checks if the file has changed externally to prevent overwrites.

---

## 🧩 Installation (Manual)

1. Open your Obsidian vault folder.
2. Navigate to `.obsidian/plugins/`.
3. Create a new folder named `smart-save-guard`.
4. Copy these files into it:
   - `main.js`
   - `manifest.json`
   - `README.md`
5. Restart Obsidian.
6. Enable **Smart Save Guard** under *Settings → Community Plugins*.

---

## 🛠️ Configuration

No configuration needed — it runs automatically and safely in the background.  
You’ll see live feedback in the **status bar** at the bottom right.

---

## ⚠️ Notes

- This plugin **does not replace Obsidian Sync**; it only improves local save reliability.  
- Designed to reduce “file modified externally” errors when using iCloud or similar services.  
- Works entirely offline and does **not send or store data externally**.

---

## 🧑‍💻 Author

Developed by **Marco Pagno**  
GitHub: [https://github.com/MarcoPagno](https://github.com/MarcoPagno)

---

## 📜 License

Released under the **MIT License**.
