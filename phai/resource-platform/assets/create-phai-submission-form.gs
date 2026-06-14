/**
 * PhAI AI 物理教學資源館｜Google Form + Sheet 建立器
 * 使用方式：
 * 1. 開 https://script.google.com/home/projects/create
 * 2. 貼上本檔全部內容
 * 3. 按 Run / 執行 createPhaiSubmissionForm
 * 4. 授權後，到「執行紀錄 / Logs」複製 Form 編輯連結、公開填寫連結、Sheet 連結
 */
function createPhaiSubmissionForm() {
  const formTitle = 'PhAI AI 物理教學資源館｜資源投稿表單';
  const formDescription = [
    '歡迎投稿 AI × 物理教學相關資源。',
    '',
    '第一版不追求完美，能說清楚「這份資源可以幫老師做什麼、適合誰、是否可公開」即可。',
    '正式上架前，講師群會先做輕審核：連結是否可開、是否有個資/著作權疑慮、公開範圍是否清楚。'
  ].join('\n');

  const form = FormApp.create(formTitle);
  form.setDescription(formDescription);
  form.setCollectEmail(false);
  form.setAllowResponseEdits(true);
  form.setShowLinkToRespondAgain(true);
  form.setConfirmationMessage('謝謝您的投稿！講師群會先確認公開範圍、授權與連結可用性，再整理到 PhAI 資源館。');

  form.addTextItem()
    .setTitle('投稿者顯示名稱')
    .setHelpText('可填真名、暱稱或學校稱呼。')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('是否可公開投稿者名稱')
    .setChoiceValues(['可公開', '僅限講師群內部', '匿名呈現'])
    .setRequired(true);

  form.addTextItem()
    .setTitle('資源名稱')
    .setHelpText('建議 20 字內，但不強制。')
    .setRequired(true);

  form.addTextItem()
    .setTitle('一句話介紹')
    .setHelpText('讓其他老師一眼知道這份資源能做什麼。')
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('資源類型')
    .setChoiceValues(['探究題', '素養題', '模擬／互動教材', 'Prompt / YAML / Skill', 'Agent 工作流', '教材／講義／簡報', '錄影／教學示範', '其他'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('適用對象')
    .setChoiceValues(['國中', '高中', '大學基礎', '教師備課', '社群共學'])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('物理主題')
    .setChoiceValues(['力學', '波動', '光學', '電磁', '熱學', '近代物理', '探究與實作', '跨領域', 'AI 教學工作流'])
    .setRequired(true);

  form.addTextItem()
    .setTitle('使用 AI 工具')
    .setHelpText('選填。例如 NotebookLM / Claude / Codex / Gemini / 自製工具。')
    .setRequired(false);

  form.addTextItem()
    .setTitle('資源連結')
    .setHelpText('Google Drive、GitHub Pages、YouTube、GitHub repo 或其他公開連結。')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('是否允許公開展示在 PhAI 資源平台')
    .setChoiceValues(['允許公開', '僅限講師群內部', '需先討論後再公開'])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('授權 / 使用限制')
    .setHelpText('例如：可教學使用、需標註作者、不可再散布、待確認。')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('是否願意未來分享 5–10 分鐘使用心得')
    .setChoiceValues(['願意', '可以再討論', '暫時不方便'])
    .setRequired(true);

  form.addPageBreakItem().setTitle('選填補充資料');

  form.addParagraphTextItem()
    .setTitle('教學使用情境')
    .setHelpText('課堂、作業、備課、社群共學等。')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('學生反應或使用結果')
    .setHelpText('若涉及學生資料，請先匿名。')
    .setRequired(false);

  form.addTextItem()
    .setTitle('建議搭配的課程單元')
    .setHelpText('例如：高一力學、電磁感應、探究與實作。')
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('是否有範例圖片')
    .setChoiceValues(['有且可公開', '有但需遮蔽', '沒有'])
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('是否有學生作品或個資需要隱去')
    .setHelpText('公開前輕審核重點。')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('希望講師群協助改進的地方')
    .setHelpText('例如分類、題目潤飾、互動化、授權判斷等。')
    .setRequired(false);

  const sheet = SpreadsheetApp.create('PhAI AI 物理教學資源館｜投稿收件表');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  const adminSheet = sheet.insertSheet('管理欄位說明');
  adminSheet.getRange(1, 1, 1, 4).setValues([['欄位', '用途', '建議值', '備註']]);
  adminSheet.getRange(2, 1, 2, 4).setValues([
    ['審核狀態', '管理者人工補入', '待整理 / 待補資料 / 可上架 / 已上架 / 限內部使用 / 暫不公開', '正式上架前請確認公開範圍'],
    ['審核備註', '管理者人工補入', '自由填寫', '記錄需補資料、授權提醒或分類調整']
  ]);
  adminSheet.autoResizeColumns(1, 4);

  Logger.log('表單編輯連結 editUrl: ' + form.getEditUrl());
  Logger.log('公開填寫連結 publishedUrl: ' + form.getPublishedUrl());
  Logger.log('收件 Sheet 連結 sheetUrl: ' + sheet.getUrl());

  return {
    editUrl: form.getEditUrl(),
    publishedUrl: form.getPublishedUrl(),
    sheetUrl: sheet.getUrl()
  };
}
