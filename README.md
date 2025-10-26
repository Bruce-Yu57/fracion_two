# 分數練習達人 (Fraction Practice Pro)

一個互動式的分數運算練習網頁應用程式，專為國小到國中學生設計。提供多個難度等級、動態生成的題目、整合的草稿區和即時答案驗證功能。

## 功能特色

- 🎯 **六個難度等級**：從等值分數到四則混合運算
- 🔢 **動態題目生成**：每次練習都有不同的題目
- ✏️ **草稿區功能**：內建繪圖工具協助計算
- ✅ **即時答案驗證**：立即知道答案正確與否
- 📱 **響應式設計**：支援各種裝置尺寸
- 🎨 **現代化介面**：使用 Tailwind CSS 和 MathJax

## 本地開發

**前置需求：** Node.js 18+

1. 安裝依賴套件：
   ```bash
   npm install
   ```

2. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

3. 開啟瀏覽器訪問 `http://localhost:5173`

## 部署到 GitHub Pages

1. 將程式碼推送到 GitHub repository
2. 在 GitHub repository 設定中啟用 GitHub Pages
3. 選擇 "GitHub Actions" 作為來源
4. 每次推送到 `main` 分支時會自動部署

## 建置

```bash
npm run build
```

建置檔案會產生在 `dist/` 目錄中。

## 技術堆疊

- **前端框架**：React 18 + TypeScript
- **建置工具**：Vite
- **樣式**：Tailwind CSS
- **數學渲染**：MathJax
- **部署**：GitHub Pages + GitHub Actions
