# v1.2.1 GitHub Upload Checklist

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
11. Create/tag the release as `v1.2.1` if desired.

The root `index.html` is the standard CDN edition. `offline/index.html` is the fully self-contained edition generated from the same v1.2.1 application source.
