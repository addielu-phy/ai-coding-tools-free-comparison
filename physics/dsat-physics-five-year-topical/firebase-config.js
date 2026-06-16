/* ===========================================================
   雲端設定（Firebase）— 老師端集中收集全班成績用
   -----------------------------------------------------------
   預設 enabled:false：學生端照常運作（資料只存在本機），
   teacher.html 會顯示設定說明。

   完成 FIREBASE_SETUP.md 後：
   1. 把 enabled 改 true
   2. 填 teacherEmail
   3. 貼上 Firebase Web App config
   =========================================================== */
window.CLOUD = {
  enabled: false,
  teacherEmail: "",
  config: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  }
};
