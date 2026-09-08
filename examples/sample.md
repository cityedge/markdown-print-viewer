# Markdown Print Viewer — Sample

This file exercises the main Markdown elements supported by the viewer.

## Text

Normal text, **bold text**, *italic text*, ~~strikethrough~~, and `inline code`.

Japanese compatibility test (enable the **日本語互換性 / Japanese compatibility** checkbox):

第二は**因果的な根拠づけ（grounding）**です。

**特権（privilege）**と**権威（authority）**

> Blockquote: Markdown remains plain text while the viewer provides document-oriented typography.

## Lists

- First item
- Second item
  - Nested item

1. Ordered item
2. Another item

- [x] Completed task
- [ ] Open task

## Table

| Feature | Status |
|---|---|
| Markdown rendering | OK |
| Browser printing | OK |
| Word (.docx) export | OK |
| Relative local image | See below |

## Code

```javascript
function hello() {
  console.log('Markdown Print Viewer v1.2.1');
}
```

## Relative image

![Sample relative image](assets/sample.svg)

## Footnote

Footnotes are supported.[^1]

[^1]: This is a sample footnote.
