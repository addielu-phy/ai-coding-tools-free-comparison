/**
 * PhAI AI 物理教學資源館｜Google Form + Sheet 建立器 v2
 *
 * 使用方式：
 * 1. 開 https://script.google.com/home/projects/create
 * 2. 貼上本檔全部內容
 * 3. 按 Run / 執行 createPhaiSubmissionForm
 * 4. 授權後，到「執行紀錄 / Logs」複製：
 *    - publishedUrl：公開填寫連結（請貼給 Hermes，替換網站投稿按鈕）
 *    - editUrl：表單編輯連結
 *    - sheetUrl：收件 Sheet 連結
 */
function createPhaiSubmissionForm() {
  const formTitle = 'PhAI AI 物理教學資源館｜資源投稿表單';
  const sheetTitle = 'PhAI AI 物理教學資源館｜投稿收件表';
  const formDescription = [
    '歡迎投稿 AI × 物理教學相關資源。',
    '',
    '第一版不追求完美，能說清楚「這份資源可以幫老師做什麼、適合誰、是否可公開」即可。',
    '正式上架前，講師群會先做輕審核：連結是否可開、是否有個資/著作權疑慮、公開範圍是否清楚。',
    '',
    '提醒：若資源含學生作品、學生姓名、照片、聲音、個資或未授權教材，請先在表單中說明，暫勿直接公開。'
  ].join('\n');

  const form = FormApp.create(formTitle)
    .setDescription(formDescription)
    .setCollectEmail(false)
    .setAllowResponseEdits(true)
    .setShowLinkToRespondAgain(true)
    .setConfirmationMessage('謝謝您的投稿！講師群會先確認公開範圍、授權與連結可用性，再整理到 PhAI 資源館。');

  try { form.setRequireLogin(false); } catch (err) { Logger.log('setRequireLogin skipped: ' + err); }
  try { form.setLimitOneResponsePerUser(false); } catch (err) { Logger.log('setLimitOneResponsePerUser skipped: ' + err); }
  try { form.setAcceptingResponses(true); } catch (err) { Logger.log('setAcceptingResponses skipped: ' + err); }

  addRequiredFields_(form);
  addOptionalFields_(form);

  const sheet = SpreadsheetApp.create(sheetTitle);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  setupWorkbook_(sheet, form);

  const result = {
    editUrl: form.getEditUrl(),
    publishedUrl: form.getPublishedUrl(),
    sheetUrl: sheet.getUrl()
  };

  Logger.log('表單編輯連結 editUrl: ' + result.editUrl);
  Logger.log('公開填寫連結 publishedUrl: ' + result.publishedUrl);
  Logger.log('收件 Sheet 連結 sheetUrl: ' + result.sheetUrl);
  Logger.log('下一步：把 publishedUrl 貼給 Hermes，Hermes 會把資源館首頁「投稿資源」按鈕改成正式表單連結。');

  return result;
}

function addRequiredFields_(form) {
  form.addSectionHeaderItem()
    .setTitle('基本資料')
    .setHelpText('請用最少資料描述這份資源。第一版不要求完美，只要能讓其他老師判斷用途與公開範圍。');

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
}

function addOptionalFields_(form) {
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
}

function setupWorkbook_(sheet, form) {
  createAdminSheet_(sheet);
  createFieldMapSheet_(sheet);
  createWebsiteExportSheet_(sheet);
  createAnnouncementSheet_(sheet, form);
}

function createAdminSheet_(sheet) {
  const adminSheet = sheet.insertSheet('管理欄位說明');
  adminSheet.getRange(1, 1, 1, 4).setValues([['欄位', '用途', '建議值', '備註']]);
  adminSheet.getRange(2, 1, 2, 4).setValues([
    ['審核狀態', '管理者人工補入', '待整理 / 待補資料 / 可上架 / 已上架 / 限內部使用 / 暫不公開', '正式上架前請確認公開範圍'],
    ['審核備註', '管理者人工補入', '自由填寫', '記錄需補資料、授權提醒或分類調整']
  ]);
  adminSheet.setFrozenRows(1);
  adminSheet.autoResizeColumns(1, 4);
}

function createFieldMapSheet_(sheet) {
  const mapSheet = sheet.insertSheet('欄位對照');
  const rows = [
    ['field_key', 'Google Form 題目', '網站資源卡用途'],
    ['submitter_display_name', '投稿者顯示名稱', '作者 / 投稿者顯示'],
    ['submitter_visibility', '是否可公開投稿者名稱', '決定是否公開作者'],
    ['resource_title', '資源名稱', '資源卡標題'],
    ['one_sentence_summary', '一句話介紹', '資源卡摘要'],
    ['resource_type', '資源類型', '分類篩選'],
    ['audience', '適用對象', '對象篩選'],
    ['physics_topic', '物理主題', '主題標籤'],
    ['ai_tools', '使用 AI 工具', '工具標籤'],
    ['resource_url', '資源連結', '開啟資源按鈕'],
    ['public_permission', '是否允許公開展示在 PhAI 資源平台', '公開邊界'],
    ['license_scope', '授權 / 使用限制', '授權提醒'],
    ['willing_short_share', '是否願意未來分享 5–10 分鐘使用心得', '後續邀請'],
    ['teaching_context', '教學使用情境', '詳細描述'],
    ['student_response', '學生反應或使用結果', '成效備註'],
    ['course_unit', '建議搭配的課程單元', '課程標籤'],
    ['has_sample_image', '是否有範例圖片', '素材狀態'],
    ['privacy_risk', '是否有學生作品或個資需要隱去', '公開審核'],
    ['help_needed', '希望講師群協助改進的地方', '共編需求'],
    ['review_status', '審核狀態', '是否上架'],
    ['review_note', '審核備註', '管理備註']
  ];
  mapSheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  mapSheet.setFrozenRows(1);
  mapSheet.autoResizeColumns(1, 3);
}

function createWebsiteExportSheet_(sheet) {
  const exportSheet = sheet.insertSheet('網站上架資料格式');
  const headers = ['id', 'status', 'title', 'summary', 'description', 'author_display', 'author_visibility', 'resource_type', 'physics_topic', 'ai_tools', 'audience', 'url', 'license_scope', 'privacy_note', 'source_event', 'tags', 'review_note'];
  exportSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  exportSheet.getRange(2, 1, 1, headers.length).setValues([[
    'PHAI-NEW-0001', '待整理', '範例：資源名稱', '範例：一句話介紹', '範例：教學使用情境或描述', '投稿者顯示名稱', '依投稿者選項', '模擬／互動教材', '力學', 'Claude; Codex', '高中; 教師備課', 'https://example.com', '待確認', '若含學生資料請先匿名', 'Google Form 投稿', '範例; AI教學', '管理者審核備註'
  ]]);
  exportSheet.setFrozenRows(1);
  exportSheet.autoResizeColumns(1, headers.length);
}

function createAnnouncementSheet_(sheet, form) {
  const ann = sheet.insertSheet('講師群邀請文');
  const publishedUrl = form.getPublishedUrl();
  const text = [
    '各位老師好，PhAI AI 物理教學資源館先開一個輕量投稿表單，想先收大家已經做過或正在嘗試的 AI × 物理教學資源。',
    '',
    '投稿不需要很完整，只要能說清楚：這份資源可以幫老師做什麼、適合誰、是否可公開，就可以先填。',
    '',
    '投稿表單：' + publishedUrl,
    '',
    '第一階段會先做輕審核：確認連結可開、公開範圍、授權與個資邊界，再整理到 PhAI 資源館。也歡迎先填 1–2 份測試看看。'
  ].join('\n');
  ann.getRange(1, 1).setValue('可貼到講師群的邀請文');
  ann.getRange(2, 1).setValue(text);
  ann.autoResizeColumn(1);
}
