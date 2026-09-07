# Markdown Print Viewer

[English README](README_EN.md)

Markdownファイルを「文書」として表示し、そのままブラウザの印刷機能で印刷するための軽量ビューアです。編集機能は持たず、Markdownのレンダリング、読みやすい紙面表示、印刷に機能を絞っています。

**Version 1.0.0**

## 特徴

- Markdownファイルをドラッグ＆ドロップして即時表示
- CommonMark / GFMをベースに、テーブル、タスクリスト、脚注、HTML混在をサポート
- Markdown内のHTMLはDOMPurifyでサニタイズ
- ブラウザ標準の印刷ダイアログを使用（プリンタ／PDF保存）
- A4向けの印刷CSS
- 日本語／英語UI
- ダーク／ライト表示
- 本文フォント、サイズ、太さを変更可能
- 設定はブラウザのlocalStorageに保存
- 相対パス画像は、必要に応じて「フォルダを開く」で解決
- インストール不要

## 使い方

### 通常版

リポジトリ直下の `index.html` をChromeまたはEdgeで開きます。

1. `.md` ファイルを画面へドラッグ＆ドロップするか、「Markdownを開く」から選択します。
2. 必要に応じてフォント、サイズ、太さを調整します。
3. 相対パスで指定されたローカル画像がある場合は「フォルダを開く」でMarkdown文書のルートとなるフォルダを選択します。
4. 「印刷」を押してブラウザの印刷ダイアログから印刷またはPDF保存します。

通常版は起動時に固定バージョンのレンダリングライブラリをjsDelivrから読み込みます。ブラウザにキャッシュされる場合がありますが、ネットワークなしでの動作を保証するものではありません。

### 完全オフライン版

`offline/index.html` は、レンダリングライブラリをHTML内へ埋め込んだ単一ファイル版です。

GitHubへ初回アップロードする前、または依存ライブラリを更新したときに、Windowsでリポジトリ直下の `BUILD_RELEASE.cmd` を一度実行してください。固定バージョンの依存ライブラリとライセンス文を取得し、`offline/index.html` を生成します。

生成後の `offline/index.html` は、外部JavaScriptを参照せず、ネット接続なしで動作します。生成済みファイルをGitHubにコミットして構いません。

## ローカル画像

Markdownだけをドロップした場合、ブラウザのセキュリティ制約により、同じフォルダにある別ファイルを自動では読み取れません。たとえば次の画像参照を解決する場合です。

```markdown
![diagram](images/diagram.png)
```

「フォルダを開く」で対象フォルダを追加選択すると、アプリが選択されたフォルダ以下のファイルをブラウザ内で参照し、必要な画像をBlob URLとして表示します。

Chrome / Edgeではフォルダ選択時に「複数のファイルをこのサイトにアップロードしますか？」という趣旨の確認が表示されることがあります。これは `<input webkitdirectory>` に対するブラウザ標準の文言です。本アプリには、選択されたMarkdownやローカル画像を外部へ送信する処理はありません。

なお、Markdownに `https://...` の画像URLが書かれている場合、その画像取得には当然ネットワーク接続が必要です。

## 通信について

通常版が行う外部通信は、レンダリング用JavaScriptライブラリをjsDelivrから取得するためのものです。本アプリのコードには、ユーザーが選択したMarkdown、画像、フォルダ内ファイルをサーバーへ送信する処理はありません。

完全オフライン版では、Markdown自身が外部URLを参照しない限り、アプリ本体の動作にネットワーク接続は不要です。

## 対応Markdown

レンダリングエンジンは `markdown-it` を使用しています。

- 見出し
- 段落
- 強調、太字、取り消し線
- 箇条書き、番号付きリスト
- 引用
- インラインコード、コードブロック
- リンク、自動リンク
- 画像
- テーブル
- タスクリスト
- 脚注
- HTML混在（サニタイズ後に表示）

Markdownには紙面レイアウト自体の標準仕様はないため、フォント、余白、行間、見出し間隔などはMarkdown Print Viewer独自の印刷向けスタイルです。

## フォント

選択可能なプリセットは次のとおりです。

- Standard
- Meiryo
- Yu Gothic
- BIZ UDPGothic
- Yu Mincho
- BIZ UDPMincho

フォントがOSにインストールされていない場合は、CSSのフォールバックフォントが使用されます。

## ブラウザ

主にWindows上のGoogle Chrome / Microsoft Edgeを想定しています。フォルダ読み込みには `webkitdirectory` を使用しているため、Chromium系ブラウザを推奨します。

## リポジトリ構成

```text
.
├─ index.html                 通常版（CDNから依存ライブラリを読み込み）
├─ offline/
│  ├─ index.html              完全オフライン版（BUILD_RELEASE.cmd実行後に生成）
│  ├─ index.template.html     オフライン版のソーステンプレート
│  ├─ BUILD_OFFLINE.cmd
│  └─ build_offline.ps1
├─ examples/                  動作確認用サンプル
├─ BUILD_RELEASE.cmd          offline/index.html生成用
├─ README.md
├─ README_EN.md
├─ CHANGELOG.md
├─ THIRD_PARTY_NOTICES.md
└─ LICENSE
```

## 依存ライブラリ

- markdown-it 15.0.1
- markdown-it-task-lists 2.1.1
- markdown-it-footnote 4.0.0
- DOMPurify 3.4.14

詳細は [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) を参照してください。

## ライセンス

Markdown Print Viewer本体はMIT Licenseで公開します。詳細は [LICENSE](LICENSE) を参照してください。

第三者ライブラリにはそれぞれのライセンスが適用されます。完全オフライン版をビルドすると、取得した第三者ライセンス文も生成HTML内に埋め込まれます。
