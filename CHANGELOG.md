# Changelog

## 1.6.0 - 2026-09-11

- Added an in-app **Install app / アプリとしてインストール** button to the initial empty pane.
- The install button appears only when the browser emits `beforeinstallprompt`; it stays hidden on `file://`, unsupported browsers, and installed standalone PWA sessions.
- Installation is handed off to the browser/OS native prompt, and `appinstalled` clears the CTA after successful installation.
- Added a visible `v1.6.0` badge beside the application title, including the collapsed mobile reading header.
- Updated installation documentation to use the in-app button as the preferred path and browser menus as fallback.
- Bumped the Service Worker cache version to v1.6.0.

## 1.5.1 - 2026-09-11

- Documentation-only maintenance release; application behavior is unchanged from v1.5.0.
- Added `INSTALL_GUIDE.md` and `INSTALL_GUIDE_EN.md` with explicit installation and uninstallation procedures.
- Added separate instructions for Windows Edge, Windows Chrome, and Android Chrome.
- Clarified Windows `.md` file association, PWA removal, optional app/site-data deletion, and the difference between PWA installation and the standalone offline HTML edition.
- Expanded the root README installation section and linked it to the detailed guides.

## 1.5.0 - 2026-09-10

- Added a persistent three-level line-spacing control: Narrow / Standard / Wide (狭い / 標準 / 広い).
- Kept the previous screen/print line spacing as the Standard preset.
- Applied the selected line-spacing preset to both on-screen document rendering and browser printing.
- Removed the light-theme toggle and standardized the application UI on the dark theme.
- Reduced the width of the Weight select to free toolbar space.
- Bumped the PWA cache version so installed apps refresh to the new UI cleanly.

## 1.4.0 - 2026-09-10

- GitHub Pages版をインストール可能なPWAに対応。
- Web App Manifestの `file_handlers` を追加し、Windows上で `.md` / `.markdown` / `.mdown` / `.mkd` をMarkdown Print Viewerへ関連付け可能にした。
- `launchQueue` でWindows Explorerから渡されたMarkdownを既存の読込処理へ直接渡すようにした。
- 対応ブラウザでは既存PWAウィンドウを再利用する `launch_handler: focus-existing` を追加。
- Service Workerでアプリ本体と固定バージョンのランタイム依存をキャッシュし、インストール後のオフライン起動に対応。
- 192px / 512pxのPWAアイコンを追加。
- `file://` での従来利用と完全オフライン単一HTML版は維持。

## v1.3.0 - 2026-09-09

- Added a collapsible reading mode for the top controls.
- Tap/click the Markdown Print Viewer brand area (including the M↓ icon) to hide all operation controls and the status bar, leaving only the title/current filename row.
- Tap/click the brand area again to restore the controls.
- The same toggle is keyboard-accessible with Enter or Space.

## [1.2.1] - 2026-09-08

### Fixed

- Fixed Japanese compatibility handling for adjacent bold spans such as `**特権（privilege）**と**権威（authority）**`, which could previously render only the conjunction as bold.
- Moved the first Japanese compatibility repair from post-render DOM matching to a pre-render delimiter compatibility layer, preventing cross-pairing between neighboring `**...**` / `__...__` spans.
- Excluded fenced code and inline code from this compatibility preprocessing.

## [1.2.0] - 2026-09-08

### Added

- Optional **Japanese compatibility** checkbox with persistent `localStorage` state.
- Extensible Japanese/CJK compatibility pipeline kept separate from the core markdown-it parser.
- Initial compatibility fix for bold spans such as `**因果的な根拠づけ（grounding）**です`, where closing punctuation adjacent to following text can leave the Markdown strong markers literal.
- The compatibility result is shared by viewer rendering, printing, and Word export; source Markdown is never modified.

### Notes

- Japanese compatibility is OFF by default to preserve standard CommonMark/GFM behavior unless explicitly enabled.
- Code and preformatted elements are excluded from compatibility rewriting.

All notable changes to Markdown Print Viewer are documented here.

## [1.1.0] - 2026-09-08

### Added

- One-click browser-side export of the current Markdown document to editable Microsoft Word `.docx`.
- Native Word structures for headings, paragraphs, ordered/unordered lists, blockquotes, tables, code, links, and horizontal rules.
- Embedding of locally resolved images into DOCX output; unresolved images fall back to alt text.
- Word output uses the currently selected document font and font size where practical.
- `docx` 9.7.1 as a pinned browser dependency in both the standard and fully offline editions.

### Notes

- Word export is intentionally one-way; DOCX-to-Markdown round-tripping is not implemented.
- Footnotes remain rendered references plus a rendered footnote list rather than native Word footnote objects.
- The viewer, printing, local-folder handling, and typography behavior remain based on the v1.0.0 / v0.5.1 baseline.

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
