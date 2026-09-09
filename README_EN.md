# Markdown Print Viewer

[日本語 README](README.md)

Markdown Print Viewer is a lightweight browser app for rendering Markdown as a document, printing it through the browser's native print dialog, and exporting it to an editable Microsoft Word `.docx` file. It deliberately does not include Markdown editing features.

**Version 1.3.0**

## Features

- Drag and drop a Markdown file to render it immediately
- CommonMark / GFM-oriented rendering with tables, task lists, footnotes, and embedded HTML
- Embedded HTML is sanitized with DOMPurify
- Browser-native printing for printers and PDF output
- A4-oriented print CSS
- One-click **Word (.docx)** export generated entirely in the browser
- Headings, paragraphs, lists, and tables are emitted as native Word document structures
- Japanese / English UI
- Collapse the top toolbar to the title/current-file row for a larger reading area on mobile
- Dark / light display theme
- Configurable document font, size, and weight
- Optional **Japanese compatibility** layer for Japanese/CJK Markdown delimiter edge cases
- Typography settings persist in localStorage
- Relative local images can be resolved with **Open Folder**
- No installation required

## Usage

### Standard edition

Open the repository-root `index.html` in Chrome or Edge.

1. Drag and drop a `.md` file, or select one with **Open Markdown**.
2. Adjust font, size, and weight if needed.
3. If the document contains relative local images, select the document root with **Open Folder**.
4. Click **Print** to use the browser's print dialog.
5. Click **Word (.docx)** to generate an editable Word file using the Markdown file's base name.

The standard edition loads pinned JavaScript dependencies from jsDelivr at runtime. Browser caching may reduce subsequent requests, but offline operation is not guaranteed.

### Fully offline edition

`offline/index.html` is a self-contained edition with all required JavaScript libraries embedded into the HTML file.

Before the first GitHub upload, or after dependency updates, run `BUILD_RELEASE.cmd` once on Windows. It downloads the pinned dependencies and their license texts and generates `offline/index.html`.

The generated `offline/index.html` contains no external JavaScript references and can render, print, and export Word files without a network connection. It is fine to commit the generated file to GitHub.

## Word (.docx) export

Word export does not invoke Pandoc or Microsoft Word. The app uses `docx.js` to generate OOXML `.docx` files directly in the browser. Markdown content and local images are not sent to a conversion service.

The main mappings are:

- `#` through `######` → Word Heading 1 through Heading 6
- normal text → native Word paragraphs
- bold, italics, and strikethrough
- ordered and unordered lists, including nesting
- blockquotes
- inline code and code blocks
- external hyperlinks
- horizontal rules
- Markdown tables → native Word tables
- task lists → list items containing `☒` / `☐`
- images → embedded PNG content when browser access permits it

The selected document font and size are also used for Word export. Word does not expose the same continuous font-weight model as CSS, so values such as `Medium (500)` may not match the on-screen rendering exactly.

### Word conversion limitations

The feature is intentionally one-way: Markdown → DOCX. DOCX → Markdown round-tripping is not a goal.

Footnotes are currently exported as the rendered footnote reference plus the rendered footnote list at the end, rather than as native Word footnote objects. Arbitrary embedded HTML, `details`, and nonstandard Markdown extensions may be flattened to the closest editable Word representation. Mermaid and custom math syntaxes are not converted into dedicated Word objects.

## Local images and folder access

A browser cannot automatically read neighboring local files merely because a Markdown file was dropped. To resolve a reference such as:

```markdown
![diagram](images/diagram.png)
```

use **Open Folder** and select the relevant document folder. The app then receives browser-local `File` references and creates Blob URLs only for images needed by the document. Resolved images are also embedded into the generated DOCX file.

Chrome / Edge may display wording similar to “Upload N files to this site?” when selecting a folder. This is generic browser wording for `<input webkitdirectory>`. Markdown Print Viewer contains no code that uploads the selected Markdown, images, or other folder files to a server.

Images referenced by an `https://...` URL naturally require network access. To embed a remote image into DOCX, the image server must also allow the browser to read the image data. If embedding fails, the generated Word document keeps an image placeholder/alt text instead.

## Network behavior

The standard edition's own network access is limited to loading its Markdown renderer, sanitizer, and Word-generation JavaScript dependencies from jsDelivr. The application contains no upload path for user-selected Markdown files, images, or folder contents.

The fully offline edition needs no network connection for the application itself, unless the Markdown document explicitly references external resources.

## Supported Markdown features

The renderer is based on `markdown-it` and supports, among other features:

- headings and paragraphs
- emphasis, strong emphasis, strikethrough
- ordered and unordered lists
- blockquotes
- inline code and fenced code blocks
- links and autolinks
- images
- tables
- task lists
- footnotes
- embedded HTML (after sanitization)

Markdown does not define page typography, so font choices, margins, line spacing, and heading spacing are Markdown Print Viewer's presentation rules rather than part of the Markdown specification.


## Japanese compatibility

The **Japanese compatibility** checkbox is an opt-in compatibility layer for Japanese/CJK-specific Markdown edge cases. It is OFF by default and the choice is stored in `localStorage`. The core markdown-it configuration remains unchanged.

Version 1.3.0 includes a compatibility fix for cases where a bold span ends in Japanese closing punctuation and text continues immediately without a space. For example:

```markdown
第二は**因果的な根拠づけ（grounding）**です。
```

It also correctly handles adjacent emphasis such as:

```markdown
**特権（privilege）**と**権威（authority）**
```

Instead of reinterpreting leftover text after rendering, the compatibility layer temporarily annotates the intended closing delimiter before markdown-it parses the document. This prevents adjacent `**...**` or `__...__` spans from being paired across the conjunction. Fenced code and inline code are excluded, and the original Markdown source is never modified. Word export uses the same rendered structure, so the correction is reflected in `.docx` output as well.

Future Japanese/CJK-specific fixes can be added to this compatibility layer without changing the core parser.

## Fonts

Available presets:

- Standard
- Meiryo
- Yu Gothic
- BIZ UDPGothic
- Yu Mincho
- BIZ UDPMincho

If a font is not installed on the OS, a fallback font is used. Word export sets ASCII and East Asian fonts according to the selected preset.

## Browser target

Google Chrome and Microsoft Edge on Windows are the primary targets. A Chromium-based browser is recommended because folder selection uses `webkitdirectory`.

## Repository layout

```text
.
├─ index.html                 Standard edition (CDN dependencies)
├─ offline/
│  ├─ index.html              Fully offline edition (generated by BUILD_RELEASE.cmd)
│  ├─ index.template.html     Offline source template
│  ├─ BUILD_OFFLINE.cmd
│  └─ build_offline.ps1
├─ examples/                  Test/sample document
├─ BUILD_RELEASE.cmd
├─ README.md
├─ README_EN.md
├─ CHANGELOG.md
├─ THIRD_PARTY_NOTICES.md
└─ LICENSE
```

## Dependencies

- markdown-it 15.0.1
- markdown-it-task-lists 2.1.1
- markdown-it-footnote 4.0.0
- DOMPurify 3.4.14
- docx 9.7.1

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## License

Markdown Print Viewer is released under the MIT License. See [LICENSE](LICENSE).

Third-party dependencies remain subject to their respective licenses. The offline build embeds the downloaded third-party license texts into the generated HTML file.
