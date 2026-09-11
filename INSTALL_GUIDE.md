# インストール・アンインストールガイド

Markdown Print Viewer は、通常のWebページとして使うだけならインストール不要です。GitHub Pages版をPWA（Progressive Web App）としてインストールすると、Windowsでは独立したアプリウィンドウで起動でき、`.md` ファイルの関連付け先として登録できます。Androidではホーム画面／アプリ一覧から起動できるWebアプリとして利用できます。

> このガイドの手順は、2026年9月時点の Google Chrome / Microsoft Edge の公式ヘルプを基準にしています。ブラウザ更新によりメニュー名や位置が変わる場合があります。

## 1. インストールしなくても使えます

GitHub Pages上のMarkdown Print Viewerをブラウザで開くだけで、Markdownの表示・印刷・Word出力を利用できます。ローカルの `index.html` や `offline/index.html` も、従来どおり直接開いて利用できます。

PWAとしてのインストールが必要なのは、主に次の場合です。

- WindowsでMarkdown Print Viewerを独立したアプリとして使いたい
- Windowsで `.md` をダブルクリックしてMarkdown Print Viewerで開きたい
- Androidでホーム画面／アプリ一覧から直接起動したい
- 一度読み込んだGitHub Pages版を、PWAとしてオフラインでも起動しやすくしたい

## 2. Windows: Microsoft Edgeでインストール

1. Microsoft EdgeでGitHub Pages版のMarkdown Print Viewerを開きます。
2. アプリがインストール可能と判定された場合、Markdown Print Viewerの初期画面に **「アプリとしてインストール」** ボタンが表示されます。表示されていれば押します。
3. Edge標準のインストール確認画面が開くので、インストールを確定します。
4. アプリ内のボタンが表示されない場合は、アドレスバー付近のインストールアイコン、またはEdge右上の `…` → **その他のツール** → **アプリ** → **このサイトをアプリとしてインストール** を利用します。
5. インストール後は、Windowsのスタートメニューや `edge://apps` からMarkdown Print Viewerを起動できます。

「アプリとしてインストール」ボタンは、対応ブラウザが実際にインストール可能と判定した場合だけ表示されます。ローカルの `file://` 版、非対応ブラウザ、すでにPWAとして起動している環境では表示されません。

### `.md` をダブルクリックで開くようにする

PWAをインストールした後に設定します。

1. エクスプローラーで任意の `.md` ファイルを右クリックします。
2. **プログラムから開く** → **別のアプリを選択** を選びます。
3. **Markdown Print Viewer** を選択します。
4. 常にこのアプリで開く設定を有効にします。

以後、`.md` をダブルクリックするとMarkdown Print Viewerが起動し、そのファイルを自動的に表示します。

`.md` の候補にMarkdown Print Viewerが現れない場合は、いったんPWAをアンインストールしてから再インストールすると、Chromium側のファイルハンドラー登録が更新されることがあります。

## 3. Windows: Google Chromeでインストール

1. Google ChromeでGitHub Pages版のMarkdown Print Viewerを開きます。
2. 初期画面に **「アプリとしてインストール」** ボタンが表示されていれば、それを押し、Chrome標準のインストール画面を進めます。
3. アプリ内のボタンが表示されない場合は、アドレスバー右側のインストールアイコン、またはChrome右上の `︙` → **キャスト、保存、共有** → **ページをアプリとしてインストール** を利用します。
4. 画面の案内に従ってインストールします。
5. インストール済みWebアプリは `chrome://apps` からも管理できます。

`.md` の関連付け方法はEdgeの場合と同じです。エクスプローラーで `.md` を右クリックし、**プログラムから開く** からMarkdown Print Viewerを選び、必要なら常に使う設定にします。

## 4. Windows: アンインストール

### Edgeからインストールした場合

1. Edgeで `edge://apps` を開きます。
2. Markdown Print Viewerのカードで **詳細** を開きます。
3. **アンインストール** を選びます。
4. 必要に応じて、アプリの履歴やデータも削除するオプションを選びます。

Windowsの **設定** → **アプリ** → **インストールされているアプリ** から削除できる場合もありますが、インストール元のEdgeから `edge://apps` を使う方法が分かりやすいです。

### Chromeからインストールした場合

方法1:

1. インストール済みMarkdown Print Viewerを開きます。
2. アプリウィンドウ右上のメニューから **Markdown Print Viewerをアンインストール** を選びます。
3. 削除を確定します。

方法2:

1. Chromeで `chrome://apps` を開きます。
2. Markdown Print Viewerを選んでアンインストールします。

Chromeでは、アンインストール時に **Chromeからもデータを削除する** オプションが表示される場合があります。

### アプリデータも削除すると何が消えるか

Markdown Print Viewerは、次のユーザー設定をブラウザの `localStorage` に保存します。

- フォント
- 文字サイズ
- 太さ
- 行間
- 日本語互換性のON/OFF
- UI言語など、ブラウザ側に保存される設定

アンインストール時にサイト／アプリデータも削除すると、これらの設定も初期化されます。また、Service Workerのキャッシュなど、PWAが保持していたサイトデータも削除対象になります。

アプリだけをアンインストールしてサイトデータを残した場合は、後で同じGitHub Pagesを開いたときに設定が残っている場合があります。

## 5. Android: Chromeでインストール

1. Android版ChromeでGitHub Pages版のMarkdown Print Viewerを開きます。
2. 初期画面に **「アプリとしてインストール」** ボタンが表示されていれば、それをタップしてChrome標準のインストール画面を進めます。
3. ボタンが表示されない場合はアドレスバー右側の `︙` をタップし、**インストールしてショートカットを作成** → **インストール** を選びます。
4. 画面の案内に従います。

インストール後は、通常のAndroidアプリと同様にホーム画面やアプリ一覧から起動できます。

### Androidでの `.md` 関連付けについて

このプロジェクトの `.md` ファイルハンドラー機能は、Windows上のデスクトップ版Chrome / Edgeを主対象としています。Androidでは、PWAのインストール自体は可能ですが、Windowsと同じ手順でファイルマネージャーの `.md` をMarkdown Print ViewerへOS関連付けすることは、このアプリのサポート対象としていません。

Androidでは、Markdown Print Viewerを起動して **Markdownを開く** からファイルを選択する方法を基本操作としてください。

## 6. Android: アンインストール

1. Androidの **設定** を開きます。
2. **アプリ** → **アプリをすべて表示** を開きます。
3. **Markdown Print Viewer** を選択します。
4. **アンインストール** をタップします。

端末やAndroidのバージョンによっては、ホーム画面のアプリアイコンを長押ししてアプリ情報を開き、そこからアンインストールすることもできます。

## 7. アップデートについて

GitHub Pages版のPWAは、通常はページを再読み込み／再起動することで新しいService Workerとアプリ内容へ更新されます。通常のバージョンアップごとにアンインストールする必要はありません。

ただし、`manifest.webmanifest` のファイル関連付け設定を変更した直後など、Windows側の `.md` 関連付けが更新されない場合は、一度アンインストールして再インストールすると改善することがあります。

## 8. 完全オフライン版との違い

`offline/index.html` は、依存ライブラリを埋め込んだ単一HTML版です。これはブラウザで直接開いて使うためのもので、PWAインストールやWindowsの `.md` ファイルハンドラー登録は対象外です。

Windowsで `.md` のダブルクリック起動を使いたい場合は、GitHub Pages上の通常版 `index.html` をPWAとしてインストールしてください。

## 公式ヘルプ

- Microsoft Edge: https://support.microsoft.com/en-us/edge/install-manage-or-uninstall-apps-in-microsoft-edge
- Google Chrome（PC）: https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DDesktop&hl=ja
- Google Chrome（Android）: https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&hl=ja
