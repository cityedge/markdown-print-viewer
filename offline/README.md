# Fully Offline Edition

This directory contains the source template and builder for the fully offline Markdown Print Viewer v1.6.0.

Run `BUILD_OFFLINE.cmd` on Windows while connected to the Internet once. It downloads the pinned Markdown renderer, sanitizer, and Word-generation libraries plus their license texts, then writes a self-contained `index.html` in this directory.

After generation, `offline/index.html` requires no runtime network connection for Markdown rendering, printing, or Word (`.docx`) export. External resources explicitly referenced by a Markdown document (for example, `https://...` images) still require network access.

The generated file is intended to be committed/distributed alongside the repository-root standard `index.html`.
This standalone offline edition is not the PWA/file-association target. For Windows `.md` double-click handling, install the GitHub Pages root edition as a PWA. See `../INSTALL_GUIDE_EN.md` (or `../INSTALL_GUIDE.md` in Japanese).

