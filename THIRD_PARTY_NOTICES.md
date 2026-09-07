# Third-Party Notices

Markdown Print Viewer v1.0.0 uses the following open-source libraries.

| Component | Version | License | Runtime source in standard edition |
|---|---:|---|---|
| markdown-it | 15.0.1 | MIT | `https://cdn.jsdelivr.net/npm/markdown-it@15.0.1/dist/browser/markdown-it.umd.min.js` |
| markdown-it-task-lists | 2.1.1 | MIT | `https://cdn.jsdelivr.net/npm/markdown-it-task-lists@2.1.1/dist/markdown-it-task-lists.min.js` |
| markdown-it-footnote | 4.0.0 | MIT | `https://cdn.jsdelivr.net/npm/markdown-it-footnote@4.0.0/dist/markdown-it-footnote.min.js` |
| DOMPurify | 3.4.14 | Apache-2.0 OR MPL-2.0 | `https://cdn.jsdelivr.net/npm/dompurify@3.4.14/dist/purify.min.js` |

The standard edition references these pinned files from jsDelivr and does not vendor their source code in the repository-root `index.html`.

The offline builder downloads the same pinned files and embeds them into `offline/index.html`. During that build, it also downloads and embeds the corresponding license texts into the generated HTML in a non-executable `<script type="text/plain" id="third-party-licenses">` block.

The project's own license is in the repository-root [LICENSE](LICENSE) file. Third-party components remain governed by their respective licenses.
