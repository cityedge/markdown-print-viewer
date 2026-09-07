# Changelog

All notable changes to Markdown Print Viewer are documented here.

## [1.0.0] - 2026-09-07

Initial public release.

### Added

- Read-only Markdown document viewer with drag-and-drop file opening.
- CommonMark / GFM-oriented rendering using markdown-it.
- Task list and footnote support.
- Sanitized embedded HTML via DOMPurify.
- Browser-native printing with A4-oriented print styles.
- Japanese and English UI.
- Dark and light display themes.
- Adjustable document font, font size, and font weight with persistent settings.
- Optional folder selection for resolving relative local image paths.
- Automatic opening of the only Markdown file at a selected folder root when no document is already open.
- Standard CDN edition and a buildable fully offline single-file edition.

### Release baseline

Version 1.0.0 is based on the stabilized v0.5.1 behavior. The experimental `showDirectoryPicker()` / localhost approach from later prototypes is not included.
