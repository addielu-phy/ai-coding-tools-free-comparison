/* ===========================================================
   祈燁 90 分鐘期末複習檢核 — 雲端同步設定
   -----------------------------------------------------------
   預設 disabled：頁面仍可使用，但只存在本機瀏覽器。
   要讓手機、電腦、Telegram 內開啟都同步同一份勾選狀態：
   1. 依 FIREBASE_SETUP.md 建立 Firebase / Firestore。
   2. 貼上 Web app public config。
   3. 將 enabled 改成 true。

   注意：apiKey 等 Firebase Web config 不是私鑰；真正保護靠 Firestore Rules。
   不要在這裡放 service account、private key、Google token。
   =========================================================== */
window.CLOUD = {
  enabled: false,
  collection: "qiyueFinalReviewPlans",
  defaultPlanId: "qiyue-final-review-2026-06",
  config: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  }
};
