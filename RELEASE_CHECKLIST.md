# v1.7.1 GitHub Upload Checklist

## Licenses and distribution

- Run `BUILD_RELEASE.cmd`; confirm the standard/offline ZIPs and `SHA256SUMS.txt` under `dist/`.
- Run `node tests/licenses.cjs` to verify notice hashes, component coverage, source links and offline embedding. Set `MPV_TEST_NODE_MODULES` and run `node tests/mermaid.cjs` for browser, license UI, print and Word checks. Set `MPV_TEST_LIVE_CDN=1` to include live CDN and offline PWA tests.
- Retain `LICENSE`, `THIRD_PARTY_NOTICES.md`, `THIRD_PARTY_LICENSES.txt`, `THIRD_PARTY_SOURCES.md`, `licenses.html`, and `licenses/dependencies.json` in both ZIPs.
- Confirm the Licenses dialog opens in Japanese and English; the offline HTML alone retains the full notices and clickable source links while disconnected.
- If dependencies change, re-audit the actual browser bundle, its source map/lockfile and ELK Java build inputs. Update full notices, exact source locations and hashes together; do not just change the version string.
- Only reviewed public application files are packaged; `tests/tmp/`, build caches and local audit downloads are excluded.

## Mermaid regression checks

- With diagrams open, switch Size from 12 pt to 9 pt: diagram text, boxes and arrows shrink together; ordinary Markdown images keep their size.
- Repeat with wide and tall diagrams, mobile, print and Word export. Smaller sizes must still affect diagrams that were already fitted to a page.
- Reload with 9 pt saved, then open a Markdown file: the diagrams start at the saved scale. Changing size during a slow render must apply the latest size.
- Run `node tests/mermaid-size.cjs` (using the same `MPV_TEST_NODE_MODULES` environment as the other browser tests).

- Open `examples/mermaid.md`: all six diagrams, Japanese labels, arrows, and captions must be visible.
- Print/save PDF with background graphics enabled: diagrams fit inside white pages.
- Export Word: all six diagrams are embedded images. Open the result in Microsoft Word for manual compatibility checking.
- A malformed Mermaid fence keeps its code and a Japanese/English error message; valid diagrams after it still render.
- While a diagram is rendering, Print/Word remain disabled; opening a new document must discard old results.
- Standard edition: Mermaid loads on the first diagram; a failed download leaves the rest of the Markdown usable.
- Fully offline edition: disconnect the network and repeat diagram rendering and Word export.
- PWA: after the Service Worker finishes caching Mermaid, disconnect and reopen a diagram.
- Keep the existing Japanese compatibility, relative-image, and white print-margin regressions passing.
- Automated browser checks: install `playwright` and `jszip` in a test environment, run `node tests/mermaid.cjs`. Alternatively set `MPV_TEST_NODE_MODULES` to an existing packages directory. Artifacts are written under `tests/tmp/<version>/mermaid/`; size checks use `tests/tmp/<version>/mermaid-size/`.

## Upload

1. Extract the package to a normal writable folder.
2. While connected to the Internet, run `BUILD_RELEASE.cmd` once.
3. Confirm that `offline/index.html` has been created.
4. Open the root `index.html` and test `examples/sample.md`.
5. Turn **日本語互換性 / Japanese compatibility** ON and confirm both Japanese regression cases render correctly: `**因果的な根拠づけ（grounding）**です` has only the intended phrase bold, and `**特権（privilege）**と**権威（authority）**` has both terms bold while `と` remains normal. Turn compatibility OFF and confirm standard parsing is restored.
6. Confirm **Print** opens the browser's normal print dialog.
7. Confirm **Word (.docx)** / **Word出力** downloads `sample.docx` and that it opens in Microsoft Word. With Japanese compatibility ON, confirm the repaired bold span is also bold in Word.
8. For the relative-image test, use **Open Folder**, select the `examples` folder, then export Word again and confirm the sample image is embedded.
9. Open `offline/index.html` with the network disconnected and repeat the render, print, and Word-export tests.
10. Upload the repository contents to GitHub, including the generated `offline/index.html`.
11. Create/tag the release as `v1.7.1` if desired.

The root `index.html` is the standard CDN edition. `offline/index.html` is the fully self-contained edition generated from the same v1.7.1 application source.
## v1.7.1 UI check

- On a narrow/mobile viewport, tap the Markdown Print Viewer title/icon area.
- Confirm all controls and the status bar disappear while the title/current filename row remains.
- Tap the title/icon area again and confirm the controls return.
- Confirm Enter/Space toggles the same state when the brand area has keyboard focus.

- Confirm the theme switch button is no longer present and the app stays in dark theme.
- Confirm **Line / 行間** offers Narrow / Standard / Wide (狭い / 標準 / 広い).
- Confirm Standard matches the previous layout, Narrow visibly tightens body lines, and Wide increases spacing.
- Open print preview for each preset and confirm the spacing changes there as well.
- Reload the app and confirm the selected line-spacing preset is restored.
- Confirm the Weight / 太さ select is narrower without clipping its options.


## PWA / Windows file handler

- GitHub PagesがHTTPSで公開されていることを確認。
- Chrome / Edgeでインストール可能と判定されることを確認。
- PWAをインストール後、Windowsの「プログラムから開く」にMarkdown Print Viewerが表示されることを確認。
- `.md` をダブルクリックしてPWAが起動し、そのファイルが自動表示されることを確認。
- PWA起動中に別の `.md` を開き、既存ウィンドウで新しい文書へ切り替わることを確認。
- 一度オンラインで正常起動した後、ネットワークを切ってPWAが起動し、ローカルMarkdownを表示できることを確認。
- Confirm `v1.7.1` is visible beside “Markdown Print Viewer” in both expanded and collapsed toolbar states.
- On GitHub Pages in an installable Chrome/Edge environment, confirm **アプリとしてインストール / Install app** appears in the initial pane.
- Confirm the install CTA is absent for local `file://` use and when the installed PWA is running in standalone mode.
- Confirm pressing the CTA opens the browser-native install prompt, and successful installation hides it.

## Documentation / install guide check

- Confirm `README.md` links to `INSTALL_GUIDE.md`.
- Confirm `README_EN.md` links to `INSTALL_GUIDE_EN.md`.
- Confirm the guides separately cover Windows Edge, Windows Chrome, and Android Chrome.
- Confirm uninstall instructions mention `edge://apps`, the Chrome app menu / `chrome://apps`, and Android Settings → Apps.
- Confirm the guide distinguishes app removal from optional site/app-data deletion and notes that deleting site data resets saved viewer settings.
- Confirm Windows `.md` association is described as a desktop PWA feature and Android is not presented as supporting the same file-association workflow.


## v1.7.1 Japanese compatibility regression

With **Japanese compatibility** enabled, confirm all three render correctly in the viewer and Word export:

- `**因果的な根拠づけ（grounding）**です。`
- `**特権（privilege）**と**権威（authority）**`
- `**171 emotion concepts ... 0%**を一次資料で確認しました。`

With Japanese compatibility disabled, standard CommonMark/GFM behavior must remain unchanged.

## v1.7.1 print background regression

- In Chrome/Edge, open a Markdown document and Print Preview.
- Turn **Background graphics** ON. Check **1 page per sheet**: page margins and header/footer areas remain white, and the document is black text on white.
- Repeat with **2** or **4 pages per sheet**; no black border should appear.
- Turn **Background graphics** OFF: no loss of document text or styles.
- Normal screen UI must remain dark.
