# Third-party notices / 第三者ソフトウェアについて

Markdown Print Viewer v1.7.0の独自コードは、引き続き[MIT License](LICENSE)です。第三者のコードには、それぞれのライセンスが適用されます。

The application's original code remains MIT licensed. Third-party components retain their respective licenses.

## 同梱する表記 / Included notices

- [ライセンス閲覧ページ / Readable license page](licenses.html): 著作権表示、ライセンス原文、ソースへのリンク。アプリの「ライセンス / Licenses」からも開けます。
- [ライセンス原文集 / Complete license texts](THIRD_PARTY_LICENSES.txt): バンドル内の依存部品、ELKのJava依存部品を含む原文。
- [ソースの入手先 / Corresponding sources](THIRD_PARTY_SOURCES.md): 固定バージョン・コミットに対応するソースとダウンロード先。
- [配布物の構成記録 / Dependency manifest](licenses/dependencies.json): 使用バージョン、取得元、SHA-256、調査根拠。

## 直接使用するライブラリ / Direct dependencies

| Component | Version | License selected for this distribution |
|---|---|---|
| Mermaid | 12.3.0 | MIT; its bundled dependencies retain their own licenses |
| markdown-it | 15.0.1 | MIT |
| markdown-it-task-lists | 2.1.1 | ISC |
| markdown-it-footnote | 4.0.0 | MIT |
| DOMPurify | 3.4.17 | Apache-2.0 (chosen from Apache-2.0 OR MPL-2.0) |
| docx | 9.7.1 | MIT |

Mermaid内部のelkjs / Eclipse Layout Kernel 0.12.0にはEPL-2.0を選択して適用します。Javaから組み込まれるEMF GWT部品にはEPL-1.0等が適用されます。docx内のJSZipにはMITを選択します。入手した原文には代替ライセンスの説明も残していますが、それがアプリ本体のライセンスを変更するものではありません。

For elkjs / Eclipse Layout Kernel 0.12.0 inside Mermaid, this distribution selects EPL-2.0. Its EMF GWT portions include EPL-1.0 code. JSZip inside docx is distributed under its MIT option. Alternative upstream license texts are preserved without changing the application's license.

## EPL対象コードの入手方法 / EPL source availability

EPL対象のソースは、[THIRD_PARTY_SOURCES.md](THIRD_PARTY_SOURCES.md)に記載したバージョン別の公開URLから無償で入手でき、該当するEPLの条件で提供されます。ELKの元のJavaソース、elkjs側のJava変更・JavaScriptラッパー・ビルド手順、およびJava依存部品のソースJARも案内しています。

The corresponding EPL-covered source is available free of charge under the applicable EPL terms at the version-specific links in [THIRD_PARTY_SOURCES.md](THIRD_PARTY_SOURCES.md). These include the original ELK Java sources, elkjs adaptations and build instructions, and Java dependency source JARs.

このアプリは固定した上流配布ファイルを使用し、その処理ロジックに独自の変更を加えていません。Mermaid上流がfastdom / roughjsに適用したパッチは、対応するMermaidのソースツリーから取得できます。完全オフライン化に伴うHTMLのscript終端のエスケープは、JavaScriptの値を変更しません。

The app consumes pinned upstream browser files without application-specific logic changes. Upstream Mermaid patches for fastdom / roughjs are in its corresponding source tree. Offline HTML escaping preserves JavaScript values.

## 再配布 / Redistribution

通常版は、`LICENSE`、このファイル、`THIRD_PARTY_LICENSES.txt`、`THIRD_PARTY_SOURCES.md`、`licenses.html`、`licenses/dependencies.json`を同梱して配布してください。生成済みの完全オフライン版は、同じライセンス原文とソース入手先をHTML自体にも埋め込んでいるため、HTML単体でも表記を保持できます。ZIPには読める外部文書も同梱します。

Keep the license and source-notice files with the standard edition. The generated offline HTML embeds the complete readable notices and source links and may be distributed as a standalone file with those embedded notices intact. The offline ZIP also includes separate readable documents.

通常版は固定バージョンのライブラリをjsDelivrから取得し、PWAではキャッシュします。完全オフライン版は同じファイルを内包し、使用時のネット接続は不要です。ソースを外部からダウンロードする場合だけ接続が必要です。

The standard edition fetches pinned dependencies from jsDelivr and caches them for PWA use. The offline edition embeds the same files and needs no runtime connection. Following external source-download links requires a connection.

第三者コードは各ライセンスに従い無保証で提供されます。完全な保証否認・責任制限は[原文集](THIRD_PARTY_LICENSES.txt)を参照してください。原文の権利を制限する追加条件は設けません。

Third-party code is provided AS IS under the applicable warranty disclaimers and limitations in the [complete texts](THIRD_PARTY_LICENSES.txt). These notices impose no additional restriction on recipients' rights.
