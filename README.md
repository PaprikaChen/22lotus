# 二十二莲境 · 22 Lotus Realms — 展示站 / Showcase site

《二十二莲境》的公开展示与开发日志网站，通过 GitHub Pages 发布。游戏源码在私有仓库中。

Public showcase and devlog for *22 Lotus Realms*, served by GitHub Pages. The game's source code lives in a private repository.

## 怎么更新 / How to update

**放视频 / Add the video** — 打开 `assets/site.js`，填写最上面的 `SITE`：

```js
const SITE = {
  bilibili: "BV1xxxxxxxxx", // 中文界面优先显示
  youtube: "xxxxxxxxxxx",   // 英文界面优先显示
};
```

只填一个也可以，两种语言都会显示它。 / Fill in either one; both languages fall back to it.

**写开发日志 / Write a devlog entry**

1. 在 `devlog/` 里新建 `<slug>.zh.md` 和 `<slug>.en.md`（只写一种语言也行，另一种会自动显示已有的那篇）。
   Create `devlog/<slug>.zh.md` and `<slug>.en.md` (one language is fine; the other falls back).
2. 在 `devlog/posts.json` 里加一条：
   Add an entry to `devlog/posts.json`:

```json
{
  "slug": "2026-12-01-my-update",
  "date": "2026-12-01",
  "title": { "zh": "中文标题", "en": "English title" },
  "summary": { "zh": "一句话摘要", "en": "One-line summary" }
}
```

日志里的图片放进 `assets/img/`，用 `![说明](assets/img/文件名.jpg)` 引用。
Put images in `assets/img/` and reference them as `![alt](assets/img/name.jpg)`.

## 本地预览 / Preview locally

```bash
python -m http.server 8000
```

然后打开 / then open http://localhost:8000 。直接双击 HTML 文件打开时日志无法加载，需要通过本地服务器访问。
Opening the HTML file directly won't load the devlog; use a local server.

---

© 2026 PaprikaChen. All rights reserved. 本站文字与图像未经许可不得转载。
The text and images on this site may not be reused without permission.
