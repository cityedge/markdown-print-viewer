# Markdown Print Viewer v1.7.0 — 完全オフライン版 / Fully offline edition

## 使い方

完全オフライン版ZIPを展開し、同じフォルダの `index.html` をChromeまたはEdgeで開いてください。Markdown表示、Mermaidの図、印刷、Word出力はネット接続なしで利用できます。ビルドやインストールは不要です。

HTML単体にも、本体のMITライセンス、第三者ライブラリの著作権表示・ライセンス原文、ソース入手先を収録しています。画面の「ライセンス」から確認できます。再配布時は埋め込まれた表記を保持してください。ZIPには別ファイルの表記も同梱しています。

ソースの外部ダウンロード先を開く場合と、Markdownに指定された外部画像等を読み込む場合にはネット接続が必要です。この単体版はPWAやWindowsのファイル関連付けの対象ではありません。それらは通常版をHTTPSで公開して利用します。

ソースリポジトリ上では、このファイルは `offline/README.md` にあります。そこで再ビルドする場合は `offline/BUILD_OFFLINE.cmd`、配布ZIPも作成する場合はルートの `BUILD_RELEASE.cmd` をネット接続中に実行します。固定ファイルのハッシュと同梱ライセンス文書を検証して生成します。

## Usage

Extract the offline ZIP and open its `index.html` in Chrome or Edge. Markdown, Mermaid diagrams, printing and Word export work without an Internet connection. No installation or build is required.

The standalone HTML includes the application's MIT license, complete third-party copyright/license notices and corresponding source links. Read them through **Licenses**. Keep the embedded notices intact when redistributing. Separate notice documents are also included in the ZIP.

External source downloads and remote images explicitly referenced by a document require a connection. This portable edition does not provide PWA installation or Windows file associations; use the HTTPS-hosted standard edition for those features.

In the source repository, this file lives at `offline/README.md`. Developers can rebuild with `offline/BUILD_OFFLINE.cmd`, or create both release ZIPs with the root `BUILD_RELEASE.cmd`, while connected. Both verify pinned dependency hashes and the supplied notice documents before generation.
