# 教師端雲端資料庫設定｜近五年分科/指考物理主題式評量

學生端網址：`index.html`  
教師端網址：`teacher.html`

目前網站已經具備 Firebase/Firestore 介面。**尚未設定前，學生端仍可正常練習，資料只存在學生自己的瀏覽器。**設定完成後，學生每題作答會新增一筆到 Firestore `results` 集合，老師端登入後即可看到全班統計。

---

## 1. 建立 Firebase 專案

1. 到 <https://console.firebase.google.com/>。
2. 新增專案，例如：`dsat-physics-five-year-topical`。
3. Google Analytics 可關閉。

## 2. 新增 Web App 並取得 config

1. 專案首頁點 `</>` Web App。
2. 註冊 app。
3. 複製 `firebaseConfig = { ... }` 內容，稍後填入 `firebase-config.js`。

## 3. 建立 Firestore Database

1. Build → Firestore Database → 建立資料庫。
2. 選 Production mode。
3. 地區建議選 `asia-east1`。

## 4. 開啟老師登入

1. Build → Authentication → Sign-in method。
2. 啟用 Email/Password。
3. Users → Add user，建立老師 Email 與密碼。

學生不需要帳號。

## 5. Firestore 安全規則

把 `teacher@example.com` 換成老師 Email 後發布：

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /results/{id} {
      allow create: if isValidResult(request.resource.data);
      allow read: if request.auth != null
        && request.auth.token.email == "teacher@example.com";
      allow update, delete: if false;

      function isValidResult(d) {
        return d.quizId == "dsat-physics-five-year-topical"
          && d.name is string && d.name.size() > 0 && d.name.size() <= 40
          && d.questionId is string && d.questionId.size() > 0 && d.questionId.size() <= 16
          && d.year is int
          && d.q is int
          && d.domain is string && d.domain.size() <= 20
          && d.subdomain is string && d.subdomain.size() <= 30
          && d.topic is string && d.topic.size() <= 80
          && d.type is string && d.type.size() <= 12
          && d.answerText is string && d.answerText.size() <= 500
          && d.correctAnswer is string && d.correctAnswer.size() <= 40
          && d.correct is bool
          && d.score is int && d.score >= 0 && d.score <= 1
          && d.correctCount is int && d.correctCount >= 0 && d.correctCount <= 1
          && d.total is int && d.total == 1
          && d.ts == request.time;
      }
    }
  }
}
```

## 6. 填入 firebase-config.js

打開 `firebase-config.js`，改成：

```js
window.CLOUD = {
  enabled: true,
  teacherEmail: "teacher@example.com",
  config: {
    apiKey: "...",
    authDomain: "...firebaseapp.com",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
  }
};
```

## 7. 上線

```bash
git add physics/dsat-physics-five-year-topical/firebase-config.js
git commit -m "Enable Firebase for DSAT physics teacher dashboard"
git push
```

GitHub Pages 更新後：

- 學生端：`https://addielu-phy.github.io/ai-coding-tools-free-comparison/physics/dsat-physics-five-year-topical/`
- 教師端：`https://addielu-phy.github.io/ai-coding-tools-free-comparison/physics/dsat-physics-five-year-topical/teacher.html`

## 資料 schema

Firestore collection：`results`

每筆紀錄約如下：

```json
{
  "schemaVersion": 2,
  "quizId": "dsat-physics-five-year-topical",
  "name": "203-12 王小明",
  "mode": "practice",
  "questionId": "114-07",
  "year": 114,
  "q": 7,
  "domain": "力學",
  "subdomain": "能量",
  "topic": "功率、能量與電池電流",
  "type": "single",
  "answerText": "D",
  "correctAnswer": "D",
  "correct": true,
  "score": 1,
  "correctCount": 1,
  "total": 1,
  "wrongIds": [],
  "ids": ["114-07"],
  "clientTime": "2026-06-16T...",
  "ts": "serverTimestamp"
}
```

## 常見問題

- 老師端顯示「尚未啟用 Firebase」：`firebase-config.js` 的 `enabled` 仍是 `false` 或 config 未填。
- 老師登入後讀取失敗 `permission-denied`：Firestore Rules 的老師 Email 與登入帳號不一致。
- 學生端顯示待補傳：當下網路或 Firestore 寫入失敗，之後按「補傳暫存紀錄」即可重試。
- 想保護隱私：學生代號可只填座號或暱稱，不必填全名。
