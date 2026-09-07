# Fully Offline Edition

This directory contains the source template and builder for the fully offline Markdown Print Viewer v1.0.0.

Run `BUILD_OFFLINE.cmd` on Windows while connected to the Internet once. It downloads the pinned renderer/sanitizer libraries and their license texts, then writes a self-contained `index.html` in this directory.

After generation, `offline/index.html` requires no runtime network connection for the viewer itself. External resources explicitly referenced by a Markdown document (for example, `https://...` images) still require network access.

The generated file is intended to be committed/distributed alongside the repository-root standard `index.html`.
