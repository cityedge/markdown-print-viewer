# Mermaid — 図のある文書 / Diagrams in Markdown

コードブロックの言語に `mermaid` を指定すると図を表示します。図は印刷・PDF保存・Word出力にも含まれます。

Use a fenced code block with the language `mermaid`. Diagrams are included in print, PDF, and Word output.

## フローチャート / Flowchart

```mermaid
flowchart LR
  accTitle: 文書のワークフロー / Document workflow
  A[Markdownを開く] --> B{内容を確認}
  B --> C[印刷 / PDF]
  B --> D[Word出力]
```

## シーケンス図 / Sequence diagram

```mermaid
sequenceDiagram
  participant U as ユーザー
  participant V as ビューアー
  U->>V: Markdownを開く
  V->>V: 本文と図を描画
  V-->>U: 文書を表示
```

## 状態遷移図 / State diagram

```mermaid
stateDiagram-v2
  [*] --> Ready
  Ready --> Rendering: Open file
  Rendering --> Displayed: Complete
  Displayed --> Ready: Next document
```

## 円グラフ / Pie chart

```mermaid
pie title 制作時間 / Production time
  "執筆 / Writing" : 50
  "確認 / Review" : 30
  "仕上げ / Finishing" : 20
```

## クラス図 / Class diagram

```mermaid
classDiagram
  Document --> Diagram
  class Document {
    +String title
    +render()
    +exportWord()
  }
  class Diagram {
    +String source
    +render()
  }
```

## ER図 / Entity relationship diagram

```mermaid
erDiagram
  DOCUMENT ||--o{ DIAGRAM : contains
  DOCUMENT {
    string title
  }
  DIAGRAM {
    string source
  }
```
