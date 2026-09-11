# v1.6.0 GitHub Upload Checklist

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
11. Create/tag the release as `v1.6.0` if desired.

The root `index.html` is the standard CDN edition. `offline/index.html` is the fully self-contained edition generated from the same v1.6.0 application source.
## v1.6.0 UI check

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
- Confirm `v1.6.0` is visible beside “Markdown Print Viewer” in both expanded and collapsed toolbar states.
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

