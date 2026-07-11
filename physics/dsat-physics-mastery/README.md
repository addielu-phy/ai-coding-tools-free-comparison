# 分科測驗物理自學平台

靜態、免登入、手機優先的分科測驗物理複習網站。公開路徑：`physics/dsat-physics-mastery/`。

## Release A

- 110–114 年共 132 題索引；逐題保留年度與題號。
- 114 年 26 題既有詳解；其餘題目明確標示「官方答案已核對／詳解建置中」。
- 快速診斷、19 模組地圖、錯題模式、A–F 錯因與 D+1／D+3／D+7 回測。
- 單選立即判分、多選確認判分、非選題自評、交卷前不揭露答案的模擬測驗。
- 進度只存於瀏覽器 `localStorage`，支援 JSON 匯出／匯入；沒有帳號、分析碼或遠端寫入。

## 資料 QA

`data/official-answer-keys.json` 登錄大考中心 110–114 年官方答案來源。匯入腳本會以該登錄檔產生題庫，並修正既有資料中 28 筆答案或題型不一致。Phase 0 稽核見 `docs/source-data-copyright-audit.md`。

官方公開資料不等於自由授權。本網站不主張擁有官方試題或題圖，並保留來源與再利用風險說明。

## 本機驗證

```bash
cd physics/dsat-physics-mastery
npm test
npm run validate
python -m http.server 8765 --bind 127.0.0.1
```

舊站路徑保持可用：

- `../dsat-114-physics-self-study/`
- `../dsat-physics-five-year-topical/`
