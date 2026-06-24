# 祈燁 90 分鐘複習檢核｜Firebase/Firestore 同步設定

這個頁面預設可本機使用；若要讓手機、電腦、Telegram 內開啟都同步同一份勾選狀態，需要啟用 Firestore。

## 重要安全原則

- 不要放 service account JSON。
- 不要放 private key。
- 不要放 Google OAuth token。
- Firebase Web config 裡的 `apiKey` 不是私鑰，公開在前端是正常做法；真正的保護靠 Firestore Rules。
- 同步資料請只放：日期、科目、檢核項目、分鐘、簡短備註、週一～週日家長一句回報、第一週資料缺口巡檢的低敏勾選狀態、D0 理化＋數學啟動勾選、D+1 理化＋數學回測啟動與 D+3 gate。不要填完整姓名、班級座號、私人題本照片、私人 Drive URL、完整檔名、題號答案或敏感個資。

## Step 1：建立 Firebase 專案

1. 到 <https://console.firebase.google.com/>
2. 建立專案，例如 `qiyue-final-review`
3. 可關閉 Google Analytics。

## Step 2：建立 Web app

1. 專案首頁點 `</>` Web app。
2. 取名：`qiyue-final-review-web`
3. 複製 Firebase config。
4. 貼到 `firebase-config.js` 的 `config` 物件。
5. 將 `enabled` 改成 `true`。

## Step 3：建立 Firestore Database

1. 左側 Build → Firestore Database。
2. 建立資料庫。
3. 選 Production mode。
4. 地區可選 `asia-east1`。

## Step 4：發布 Firestore Rules

> 這版是「家庭共用匿名檢核」規則：知道 planId 的人可以同步同一份檢核。請用不含個資、不容易猜的 planId。若要更嚴格，下一版可以加 Firebase Auth。

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /qiyueFinalReviewPlans/{planId} {
      allow read: if isValidPlanId(planId);
      allow create, update: if isValidPlanId(planId) && isValidPayload(request.resource.data);
      allow delete: if false;

      function isValidPlanId(planId) {
        return planId is string && planId.size() >= 12 && planId.size() <= 80;
      }
      function isValidPayload(d) {
        return d.keys().hasOnly(['state', 'updatedAt', 'clientVersion'])
          && d.clientVersion == 'qiyue-final-90min-sync-v1.6'
          && d.state is map
          && d.state.keys().hasOnly(['checks', 'chunks', 'notes', 'selectedDate', 'updatedAt'])
          && d.state.checks is map
          && d.state.chunks is map
          && d.state.notes is map;
      }
    }
  }
}
```

## Step 5：使用同一個連結同步

一般可用：

```text
https://addielu-phy.github.io/ai-coding-tools-free-comparison/study/qiyue-final-90min-sync-tracker-2026-06/
```

若要指定同步房間，可加上：

```text
?plan=qiyue-family-review-2026-06-private-code
```

同一個 `plan` 參數就是同一份資料庫文件。手機、電腦、Telegram 內開啟同一 URL，就會同步。

## 如果還沒設定 Firebase

頁面會顯示「本機模式」與 `LocalStorageAdapter`。這時仍可勾選與規劃，但資料只存在該裝置瀏覽器，不會跨平台同步。

## Adapter 架構

- `LocalStorageAdapter`：預設啟用，不需要任何設定；資料只存在目前瀏覽器，也可先使用週一～週日家長一句回報模板、第一週資料缺口巡檢、D0 理化＋數學啟動勾選與 D+1 回測欄。
- `FirestoreAdapter`：當 `firebase-config.js` 的 `enabled: true` 且 `projectId` 等 Web config 已填入時自動啟用；同一個 `?plan=` 會同步同一份檢核、週回報模板、低敏資料缺口狀態、D0 啟動欄與 D+1 回測欄。
- 不需要也不可以放 service account、private key、OAuth token 或任何伺服器端憑證。
- `clientVersion` 仍為 `qiyue-final-90min-sync-v1.6`，若日後改版再同步更新 Firestore Rules。
