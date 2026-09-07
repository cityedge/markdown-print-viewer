# v1.0.0 GitHub Upload Checklist

1. Extract the package to a normal writable folder.
2. While connected to the Internet, run `BUILD_RELEASE.cmd` once.
3. Confirm that `offline/index.html` has been created.
4. Open the root `index.html` and test `examples/sample.md`.
5. Open `offline/index.html` with the network disconnected and test the same sample.
6. For the relative-image test, use **Open Folder** and select the `examples` folder.
7. Upload the repository contents to GitHub, including the generated `offline/index.html`.
8. Create/tag the release as `v1.0.0` if desired.

The root `index.html` is the standard CDN edition. `offline/index.html` is the fully self-contained edition generated from the same v1.0.0 application source.
