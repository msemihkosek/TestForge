/**
 * TestForge - Ana Uygulama Mantığı (App State & Controller)
 * Gelişmiş Test ve Sınav Kağıdı Hazırlama Sistemi
 */

let examData = null;
let currentZoom = 1;
let activeTab = 'questions'; // 'questions' or 'settings'
let appMode = 'paper'; // 'paper' or 'test'
let currentView = 'landing'; // 'landing' or 'workspace'
let expandedQuestionId = null; // Aktif açık olan soru kartı

// NotebookLM tarzı interaktif dijital test durumu
let digitalTestState = {
  activeIdx: 0,
  userAnswers: {},
  revealed: {}, // questionId -> boolean
  isFinished: false
};

// ==========================================
// Başlangıç (Initialization)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  if (typeof initLanguage === 'function') initLanguage();
  loadInitialData();
  setupTheme();
  setupEventListeners();
  setupLanguageListener();
  goToHome(); // İlk girişte temiz anasayfa mod seçim ekranı gösterilir
  lucide.createIcons();
});

function setupLanguageListener() {
  window.addEventListener('testforge_lang_change', () => {
    // Üst toolbar başlık ve butonlarını güncelle
    const modeTitle = document.getElementById('preview-mode-title');
    if (modeTitle) {
      if (appMode === 'paper') {
        modeTitle.innerHTML = '<i data-lucide="file-text" style="color:var(--primary);"></i> ' + t('preview_title_paper');
      } else {
        modeTitle.innerHTML = '<i data-lucide="sparkles" style="color:#db2777;"></i> ' + t('preview_title_test');
      }
    }
    updateLayoutToggleBtn();

    const subEl = document.getElementById('template-modal-subtitle');
    if (subEl) {
      subEl.textContent = (pendingSelectedMode === 'paper') ? t('template_sub_paper') : t('template_sub_test');
    }

    renderQuestionsList();
    updateSettingsModeUI();
    populateSettingsInputs();
    if (currentView === 'workspace') {
      if (appMode === 'paper') {
        renderPaper();
      } else {
        renderDigitalTest();
      }
    }
    updateBulkPreview();
    lucide.createIcons();
  });
}

function parseDurationMinutesFromText(durationText) {
  if (durationText === null || durationText === undefined) return 0;
  const raw = String(durationText).trim();
  if (!raw || /süresiz|untimed|yok|none/i.test(raw)) return 0;
  const m = raw.match(/(\d+)/);
  if (!m) return 0;
  const val = parseInt(m[1], 10);
  return Number.isFinite(val) && val > 0 ? Math.min(val, 600) : 0;
}

function ensureMetaDefaults() {
  if (!examData) return;
  if (!examData.meta) examData.meta = {};
  const meta = examData.meta;
  if (meta.durationMinutes === undefined || meta.durationMinutes === null || Number.isNaN(Number(meta.durationMinutes))) {
    meta.durationMinutes = parseDurationMinutesFromText(meta.duration);
  } else {
    meta.durationMinutes = Math.max(0, Math.min(600, Math.floor(Number(meta.durationMinutes))));
  }
  if (!meta.testModeBehavior || !['lock_reveal', 'allow_change'].includes(meta.testModeBehavior)) {
    meta.testModeBehavior = 'lock_reveal';
  }
  if (!Array.isArray(meta.participantFields)) {
    meta.participantFields = [];
  } else {
    meta.participantFields = meta.participantFields
      .filter(f => f && typeof f === 'object')
      .map((f, idx) => ({
        id: f.id ? String(f.id) : `pf-${idx + 1}`,
        label: f.label !== undefined && f.label !== null ? String(f.label) : '',
        required: !!f.required
      }));
  }
  if (!meta.resultSharing || typeof meta.resultSharing !== 'object') {
    meta.resultSharing = {
      enabled: false,
      email: "",
      emailButtonLabel: "",
      allowEmail: true,
      allowCopy: true,
      allowDownloadTxt: true
    };
  } else {
    meta.resultSharing = {
      enabled: !!meta.resultSharing.enabled,
      email: meta.resultSharing.email ? String(meta.resultSharing.email) : "",
      emailButtonLabel: meta.resultSharing.emailButtonLabel ? String(meta.resultSharing.emailButtonLabel) : "",
      allowEmail: meta.resultSharing.allowEmail !== undefined ? !!meta.resultSharing.allowEmail : true,
      allowCopy: meta.resultSharing.allowCopy !== undefined ? !!meta.resultSharing.allowCopy : true,
      allowDownloadTxt: meta.resultSharing.allowDownloadTxt !== undefined ? !!meta.resultSharing.allowDownloadTxt : true
    };
  }
}

function loadInitialData() {
  const saved = localStorage.getItem('testforge_exam_data') || localStorage.getItem('testolustur_exam_data');
  if (saved) {
    try {
      examData = JSON.parse(saved);
    } catch (e) {
      examData = JSON.parse(JSON.stringify(SAMPLE_EXAM_DATA));
    }
  } else {
    examData = JSON.parse(JSON.stringify(SAMPLE_EXAM_DATA));
  }
  ensureMetaDefaults();
}

function saveData() {
  localStorage.setItem('testforge_exam_data', JSON.stringify(examData));
  if (currentView === 'workspace') {
    if (appMode === 'paper') {
      renderPaper();
    } else {
      renderDigitalTest();
    }
  }
}

// ==========================================
// Sayfa / Mod Geçişleri (Navigation)
// ==========================================

/**
 * Anasayfaya / Karşılama ve Mod Seçim Ekranına Dönüş
 */
function goToHome() {
  currentView = 'landing';

  const landingEl = document.getElementById('landing-view');
  const workspaceEl = document.getElementById('workspace-view');
  if (landingEl) landingEl.style.display = 'flex';
  if (workspaceEl) workspaceEl.style.display = 'none';

  // Üst menü eylem butonlarını anasayfada gizle
  const btnPdf = document.getElementById('btn-export-pdf');
  const btnHtml = document.getElementById('btn-export-html');
  const btnPrint = document.getElementById('btn-print');
  if (btnPdf) btnPdf.style.display = 'none';
  if (btnHtml) btnHtml.style.display = 'none';
  if (btnPrint) btnPrint.style.display = 'none';

  lucide.createIcons();
}

let pendingSelectedMode = 'paper';

/**
 * Başlangıç Şablonu Seçim Modalı (Boş Sayfa vs Örnek Sınav)
 */
function openTemplateChoiceModal(mode) {
  pendingSelectedMode = mode;
  const modal = document.getElementById('template-choice-modal');
  const subEl = document.getElementById('template-modal-subtitle');
  if (subEl) {
    subEl.textContent = (mode === 'paper') ? t('template_sub_paper') : t('template_sub_test');
  }
  if (modal) {
    modal.classList.add('active');
    lucide.createIcons();
  }
}

function closeTemplateChoiceModal() {
  const modal = document.getElementById('template-choice-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

/**
 * 1. Seçenek: Boş Sayfa / Sıfırdan Başla
 */
function startWithEmptyTemplate() {
  const isEn = (getLanguage() === 'en');
  examData = {
    meta: {
      institution: "",
      title: (pendingSelectedMode === 'paper') 
        ? (isEn ? "EXAMINATION PAPER" : "YAZILI DEĞERLENDİRME SINAVI") 
        : "",
      course: "",
      classGrade: "",
      duration: isEn ? "40 Minutes" : "40 Dakika",
      durationMinutes: 40,
      testModeBehavior: "lock_reveal",
      participantFields: [],
      resultSharing: {
        enabled: false,
        email: "",
        emailButtonLabel: "",
        allowEmail: true,
        allowCopy: true,
        allowDownloadTxt: true
      },
      examDate: new Date().toLocaleDateString(isEn ? 'en-US' : 'tr-TR'),
      instructions: "",
      showScoreBox: true,
      showStudentInfo: true,
      layoutColumns: 2,
      showAnswerKey: true,
      showOpticalForm: true
    },
    questions: []
  };
  expandedQuestionId = null;
  digitalTestState = { activeIdx: 0, userAnswers: {}, revealed: {}, isFinished: false };
  saveData();
  closeTemplateChoiceModal();
  selectAppMode(pendingSelectedMode);
  showToast(isEn ? 'Blank workspace created. Start by adding questions.' : 'Boş çalışma sayfası oluşturuldu. Soru ekleyerek başlayabilirsiniz.', 'info');
}

/**
 * 2. Seçenek: Örnek Sınav Kağıdı Üzerinden Düzenle
 */
function startWithSampleTemplate() {
  const isEn = (getLanguage() === 'en');
  examData = JSON.parse(JSON.stringify(SAMPLE_EXAM_DATA));
  ensureMetaDefaults();
  expandedQuestionId = (examData.questions && examData.questions.length > 0) ? examData.questions[0].id : null;
  digitalTestState = { activeIdx: 0, userAnswers: {}, revealed: {}, isFinished: false };
  saveData();
  closeTemplateChoiceModal();
  selectAppMode(pendingSelectedMode);
  showToast(isEn ? 'Sample exam loaded. Edit as you wish.' : 'Örnek sınav yüklendi. İstediğiniz gibi düzenleyebilirsiniz.', 'success');
}

function updateSettingsModeUI() {
  const paperSections = document.getElementById('paper-settings-sections');
  const testSections = document.getElementById('test-settings-sections');
  const settingsTabLabel = document.getElementById('tab-settings-label');
  const isPaper = (appMode === 'paper');

  if (paperSections) paperSections.style.display = isPaper ? 'flex' : 'none';
  if (testSections) testSections.style.display = isPaper ? 'none' : 'flex';
  if (settingsTabLabel) {
    settingsTabLabel.textContent = isPaper ? t('tab_settings') : t('tab_test_settings');
  }
}

/**
 * Mod Seçimi (Test Oluştur veya Sınav Kağıdı Oluştur)
 */
function selectAppMode(mode) {
  appMode = mode;
  currentView = 'workspace';
  ensureMetaDefaults();

  const landingEl = document.getElementById('landing-view');
  const workspaceEl = document.getElementById('workspace-view');
  if (landingEl) landingEl.style.display = 'none';
  if (workspaceEl) workspaceEl.style.display = 'grid';

  const btnPdf = document.getElementById('btn-export-pdf');
  const btnHtml = document.getElementById('btn-export-html');
  const btnPrint = document.getElementById('btn-print');

  const paperEl = document.getElementById('exam-paper-page');
  const digitalEl = document.getElementById('digital-test-view');
  const modeTitle = document.getElementById('preview-mode-title');
  const colBtn = document.getElementById('toggle-columns-btn');
  const zoomControls = document.getElementById('paper-zoom-controls');
  const restartBtn = document.getElementById('btn-restart-digital-test');
  const tabsBar = document.getElementById('editor-tabs-bar');
  const isEn = (getLanguage() === 'en');

  if (tabsBar) tabsBar.style.display = 'flex';
  updateSettingsModeUI();
  populateSettingsInputs();

  if (mode === 'paper') {
    // Sınav Kağıdı Modu
    if (btnPdf) btnPdf.style.display = 'inline-flex';
    if (btnPrint) btnPrint.style.display = 'inline-flex';
    if (btnHtml) btnHtml.style.display = 'none';

    if (paperEl) paperEl.style.display = 'flex';
    if (digitalEl) digitalEl.style.display = 'none';

    if (modeTitle) {
      modeTitle.innerHTML = '<i data-lucide="file-text" style="color:var(--primary);"></i> ' + t('preview_title_paper');
    }
    if (colBtn) colBtn.style.display = 'inline-flex';
    if (zoomControls) zoomControls.style.display = 'flex';
    if (restartBtn) restartBtn.style.display = 'none';

    switchTab('questions');
    updateLayoutToggleBtn();
    renderPaper();
    showToast(isEn ? 'Exam Paper mode opened.' : 'Sınav Kağıdı hazırlama modu açıldı.', 'success');
  } else {
    // İnteraktif Test Modu
    if (btnPdf) btnPdf.style.display = 'none';
    if (btnPrint) btnPrint.style.display = 'none';
    if (btnHtml) btnHtml.style.display = 'inline-flex';

    switchTab('questions');

    if (paperEl) paperEl.style.display = 'none';
    if (digitalEl) digitalEl.style.display = 'flex';

    if (modeTitle) {
      modeTitle.innerHTML = '<i data-lucide="sparkles" style="color:#db2777;"></i> ' + t('preview_title_test');
    }
    if (colBtn) colBtn.style.display = 'none';
    if (zoomControls) zoomControls.style.display = 'none';
    if (restartBtn) restartBtn.style.display = 'inline-flex';

    renderDigitalTest();
    showToast(isEn ? 'Interactive Quiz mode opened.' : 'Test hazırlama modu açıldı.', 'success');
  }

  renderQuestionsList();
  lucide.createIcons();
}

// ==========================================
// Tema Yönetimi (Dark / Light Theme)
// ==========================================
function setupTheme() {
  const savedTheme = localStorage.getItem('testolustur_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('testolustur_theme', next);
  updateThemeIcon(next);
  showToast(`Tema değiştirildi: ${next === 'dark' ? 'Koyu' : 'Açık'} Mod`, 'info');
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    btn.innerHTML = theme === 'dark' 
      ? '<i data-lucide="sun"></i>' 
      : '<i data-lucide="moon"></i>';
    lucide.createIcons();
  }
}

// ==========================================
// Event Listeners Kurulumu (Güvenli Bağlama)
// ==========================================
function safeAddListener(id, event, handler) {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener(event, handler);
  }
  return el;
}

function setupEventListeners() {
  // Sol üst logoya tıklayınca anasayfaya dönüş
  safeAddListener('btn-nav-brand', 'click', goToHome);

  // Tema Değiştirme
  safeAddListener('theme-toggle-btn', 'click', toggleTheme);

  // Tab Geçişleri (Sorular / Genel Ayarlar)
  safeAddListener('tab-questions-btn', 'click', () => switchTab('questions'));
  safeAddListener('tab-settings-btn', 'click', () => switchTab('settings'));

  // Dijital Testi Yeniden Başlat Butonu
  safeAddListener('btn-restart-digital-test', 'click', () => {
    digitalTestState.activeIdx = 0;
    digitalTestState.userAnswers = {};
    digitalTestState.revealed = {};
    digitalTestState.isFinished = false;
    renderDigitalTest();
    showToast(getLanguage() === 'en' ? 'Quiz reset.' : 'Test sıfırlandı.', 'info');
  });

  // Yeni Soru Ekleme Butonları
  safeAddListener('btn-add-multiple', 'click', () => addQuestion('multiple'));
  safeAddListener('btn-add-tf', 'click', () => addQuestion('true_false'));
  safeAddListener('btn-add-classic', 'click', () => addQuestion('classic'));

  // Hızlı Metin Aktarma Modalı
  safeAddListener('btn-bulk-import-modal', 'click', openBulkModal);
  safeAddListener('btn-close-bulk-modal', 'click', closeBulkModal);
  safeAddListener('btn-execute-bulk', 'click', executeBulkImport);
  safeAddListener('btn-copy-ai-prompt', 'click', copyAiPrompt);
  safeAddListener('btn-clear-bulk', 'click', clearBulkText);
  safeAddListener('bulk-import-textarea', 'input', updateBulkPreview);

  document.querySelectorAll('.btn-sample-format').forEach(btn => {
    btn.addEventListener('click', () => loadBulkSample(btn.dataset.sample));
  });

  safeAddListener('bulk-modal-overlay', 'click', (e) => {
    if (e.target && e.target.id === 'bulk-modal-overlay') {
      closeBulkModal();
    }
  });

  // Dışa Aktarma Butonları
  safeAddListener('btn-export-pdf', 'click', () => {
    showToast(t('toast_pdf_generating'), 'info');
    Exporter.exportPDF('exam-paper-page', examData.meta.title || 'Exam_Paper');
  });

  safeAddListener('btn-export-html', 'click', () => {
    Exporter.exportInteractiveHTML(examData, getLanguage());
    showToast(t('toast_html_exported'), 'success');
  });

  safeAddListener('btn-print', 'click', () => {
    Exporter.printExam();
  });

  // Canlı Önizleme Zoom Kontrolleri
  safeAddListener('btn-zoom-in', 'click', () => setZoom(currentZoom + 0.1));
  safeAddListener('btn-zoom-out', 'click', () => setZoom(currentZoom - 0.1));
  safeAddListener('btn-zoom-reset', 'click', () => setZoom(1));

  // Tam Ekran Önizleme Butonu
  safeAddListener('btn-fullscreen', 'click', toggleFullscreen);
  document.addEventListener('fullscreenchange', updateFullscreenIcon);
  document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);

  // Sayfa Düzeni (1 veya 2 Sütun)
  safeAddListener('toggle-columns-btn', 'click', () => {
    examData.meta.layoutColumns = (examData.meta.layoutColumns === 2) ? 1 : 2;
    saveData();
    updateLayoutToggleBtn();
    renderPaper();
    showToast((getLanguage() === 'en' ? 'Layout: ' : 'Düzen: ') + examData.meta.layoutColumns + (getLanguage() === 'en' ? ' Column(s)' : ' Sütun'), 'info');
  });

  // Şablon Seçim Modalı Dışına Tıklama ile Kapatma
  safeAddListener('template-choice-modal', 'click', (e) => {
    if (e.target && e.target.id === 'template-choice-modal') {
      closeTemplateChoiceModal();
    }
  });

  // ESC Tuşu ile Açık Modalları Kapatma
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeTemplateChoiceModal();
      closeBulkModal();
    }
  });

  // Sınav Ayarları Değişiklikleri Dinleme
  bindSettingsInputs();
}

function switchTab(tab) {
  activeTab = tab;
  const tabQBtn = document.getElementById('tab-questions-btn');
  const tabSBtn = document.getElementById('tab-settings-btn');
  const viewQ = document.getElementById('view-questions-tab');
  const viewS = document.getElementById('view-settings-tab');

  if (tabQBtn) tabQBtn.classList.toggle('active', tab === 'questions');
  if (tabSBtn) tabSBtn.classList.toggle('active', tab === 'settings');

  if (viewQ) {
    viewQ.style.display = (tab === 'questions') ? 'block' : 'none';
    if (tab === 'questions') autoResizeAllTextareas(viewQ);
  }
  if (viewS) viewS.style.display = (tab === 'settings') ? 'block' : 'none';
}

// ==========================================
// Zoom & Tam Ekran Yönetimi
// ==========================================
function setZoom(val) {
  currentZoom = Math.min(Math.max(val, 0.5), 1.5);
  const paper = document.getElementById('exam-paper-page');
  if (paper) {
    paper.style.transform = `scale(${currentZoom})`;
  }
  const zoomText = document.getElementById('zoom-val-text');
  if (zoomText) {
    zoomText.textContent = `${Math.round(currentZoom * 100)}%`;
  }
}

function toggleFullscreen() {
  const panel = document.querySelector('.preview-viewport');
  if (!panel) return;

  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    if (panel.requestFullscreen) {
      panel.requestFullscreen();
    } else if (panel.webkitRequestFullscreen) {
      panel.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

function updateFullscreenIcon() {
  const btn = document.getElementById('btn-fullscreen');
  if (!btn) return;
  const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
  btn.innerHTML = isFs 
    ? '<i data-lucide="minimize-2"></i>' 
    : '<i data-lucide="maximize-2"></i>';
  btn.title = isFs ? (getLanguage() === 'en' ? 'Exit Fullscreen' : 'Tam Ekrandan Çık') : t('fullscreen_preview');
  lucide.createIcons();
}

function updateLayoutToggleBtn() {
  const btn = document.getElementById('toggle-columns-btn');
  if (btn) {
    btn.innerHTML = (examData.meta.layoutColumns === 2) 
      ? '<i data-lucide="columns-2"></i> ' + t('btn_2_cols') 
      : '<i data-lucide="rectangle-vertical"></i> ' + t('btn_1_col');
    lucide.createIcons();
  }
}

// ==========================================
// Ayarlar Formu Bağlama (Settings Bindings)
// ==========================================
function populateSettingsInputs() {
  if (!examData) return;
  ensureMetaDefaults();
  const meta = examData.meta || {};

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val !== undefined && val !== null ? val : '';
  };
  const setChk = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.checked = !!val;
  };

  setVal('setting-institution', meta.institution || '');
  setVal('setting-title', meta.title || '');
  setVal('setting-test-title', meta.title || '');
  setVal('setting-course', meta.course || '');
  setVal('setting-test-course', meta.course || '');
  setVal('setting-grade', meta.classGrade || '');
  setVal('setting-duration', meta.duration || '');
  setVal('setting-test-duration-minutes', meta.durationMinutes || 0);
  setVal('setting-date', meta.examDate || '');
  setVal('setting-instructions', meta.instructions || '');

  setChk('setting-show-score', meta.showScoreBox);
  setChk('setting-show-student-info', meta.showStudentInfo);
  setChk('setting-show-answer-key', meta.showAnswerKey);
  setChk('setting-show-optical', meta.showOpticalForm);

  const behavior = meta.testModeBehavior || 'lock_reveal';
  document.querySelectorAll('input[name="test-mode-behavior"]').forEach(radio => {
    radio.checked = (radio.value === behavior);
  });

  const sharing = meta.resultSharing || {};
  setChk('setting-share-enabled', sharing.enabled);
  setVal('setting-share-email', sharing.email || '');
  setVal('setting-share-email-label', sharing.emailButtonLabel || '');
  setChk('setting-share-allow-email', sharing.allowEmail !== false);
  setChk('setting-share-allow-copy', sharing.allowCopy !== false);
  setChk('setting-share-allow-download', sharing.allowDownloadTxt !== false);
  updateResultSharingPanelUI();
  renderParticipantFieldsEditor();
}

function updateResultSharingPanelUI() {
  const panel = document.getElementById('result-sharing-options');
  const chk = document.getElementById('setting-share-enabled');
  if (panel && chk) {
    panel.classList.toggle('is-disabled', !chk.checked);
  }
}

function renderParticipantFieldsEditor() {
  const container = document.getElementById('participant-fields-list');
  if (!container || !examData) return;
  ensureMetaDefaults();
  const fields = examData.meta.participantFields || [];

  if (fields.length === 0) {
    container.innerHTML = `<div class="participant-fields-empty">${escapeHTML(t('test_prefields_empty'))}</div>`;
    return;
  }

  container.innerHTML = fields.map((field, idx) => `
    <div class="participant-field-row" data-pf-idx="${idx}">
      <input type="text" class="form-input" value="${escapeHTML(field.label || '')}" placeholder="${escapeHTML(t('test_prefields_placeholder'))}" oninput="updateParticipantFieldLabel(${idx}, this.value)">
      <label class="participant-field-req">
        <input type="checkbox" ${field.required ? 'checked' : ''} onchange="toggleParticipantFieldRequired(${idx}, this.checked)">
        <span>${escapeHTML(t('test_prefields_required'))}</span>
      </label>
      <button type="button" class="participant-field-remove" title="${escapeHTML(t('test_prefields_remove'))}" onclick="removeParticipantField(${idx})">
        <i data-lucide="x" style="width:15px; height:15px;"></i>
      </button>
    </div>
  `).join('');

  lucide.createIcons();
}

function addParticipantField() {
  if (!examData) return;
  ensureMetaDefaults();
  const newField = {
    id: 'pf-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    label: '',
    required: true
  };
  examData.meta.participantFields.push(newField);
  saveData();
  renderParticipantFieldsEditor();
  const inputs = document.querySelectorAll('#participant-fields-list .participant-field-row .form-input');
  if (inputs && inputs.length > 0) {
    inputs[inputs.length - 1].focus();
  }
}

function updateParticipantFieldLabel(idx, value) {
  if (!examData || !examData.meta || !Array.isArray(examData.meta.participantFields)) return;
  if (!examData.meta.participantFields[idx]) return;
  examData.meta.participantFields[idx].label = value;
  saveData();
}

function toggleParticipantFieldRequired(idx, checked) {
  if (!examData || !examData.meta || !Array.isArray(examData.meta.participantFields)) return;
  if (!examData.meta.participantFields[idx]) return;
  examData.meta.participantFields[idx].required = !!checked;
  saveData();
}

function removeParticipantField(idx) {
  if (!examData || !examData.meta || !Array.isArray(examData.meta.participantFields)) return;
  examData.meta.participantFields.splice(idx, 1);
  saveData();
  renderParticipantFieldsEditor();
}

function bindSettingsInputs() {
  const bindText = (id, prop, mirrorId = null) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', (e) => {
      examData.meta[prop] = e.target.value;
      if (mirrorId) {
        const mirror = document.getElementById(mirrorId);
        if (mirror && mirror.value !== e.target.value) {
          mirror.value = e.target.value;
        }
      }
      saveData();
    });
  };

  const bindCheck = (id, prop) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', (e) => {
      examData.meta[prop] = e.target.checked;
      saveData();
    });
  };

  bindText('setting-institution', 'institution');
  bindText('setting-title', 'title', 'setting-test-title');
  bindText('setting-test-title', 'title', 'setting-title');
  bindText('setting-course', 'course', 'setting-test-course');
  bindText('setting-test-course', 'course', 'setting-course');
  bindText('setting-grade', 'classGrade');
  bindText('setting-date', 'examDate');
  bindText('setting-instructions', 'instructions');

  const paperDurationEl = document.getElementById('setting-duration');
  if (paperDurationEl) {
    paperDurationEl.addEventListener('input', (e) => {
      examData.meta.duration = e.target.value;
      const mins = parseDurationMinutesFromText(e.target.value);
      examData.meta.durationMinutes = mins;
      const testDurEl = document.getElementById('setting-test-duration-minutes');
      if (testDurEl) testDurEl.value = mins;
      saveData();
    });
  }

  const testDurationEl = document.getElementById('setting-test-duration-minutes');
  if (testDurationEl) {
    testDurationEl.addEventListener('input', (e) => {
      const raw = parseInt(e.target.value, 10);
      const mins = (Number.isFinite(raw) && raw > 0) ? Math.min(raw, 600) : 0;
      examData.meta.durationMinutes = mins;
      const isEn = (getLanguage() === 'en');
      examData.meta.duration = mins > 0
        ? `${mins} ${isEn ? 'Minutes' : 'Dakika'}`
        : (isEn ? 'Untimed' : 'Süresiz');
      if (paperDurationEl) paperDurationEl.value = examData.meta.duration;
      saveData();
    });
  }

  document.querySelectorAll('input[name="test-mode-behavior"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (!e.target.checked) return;
      examData.meta.testModeBehavior = e.target.value;
      digitalTestState.userAnswers = {};
      digitalTestState.revealed = {};
      digitalTestState.isFinished = false;
      saveData();
    });
  });

  bindCheck('setting-show-score', 'showScoreBox');
  bindCheck('setting-show-student-info', 'showStudentInfo');
  bindCheck('setting-show-answer-key', 'showAnswerKey');
  bindCheck('setting-show-optical', 'showOpticalForm');

  const addPfBtn = document.getElementById('btn-add-participant-field');
  if (addPfBtn) {
    addPfBtn.addEventListener('click', addParticipantField);
  }

  const shareEnabledEl = document.getElementById('setting-share-enabled');
  if (shareEnabledEl) {
    shareEnabledEl.addEventListener('change', (e) => {
      ensureMetaDefaults();
      examData.meta.resultSharing.enabled = e.target.checked;
      updateResultSharingPanelUI();
      saveData();
    });
  }

  const shareEmailEl = document.getElementById('setting-share-email');
  if (shareEmailEl) {
    shareEmailEl.addEventListener('input', (e) => {
      ensureMetaDefaults();
      examData.meta.resultSharing.email = e.target.value;
      saveData();
    });
  }

  const shareEmailLabelEl = document.getElementById('setting-share-email-label');
  if (shareEmailLabelEl) {
    shareEmailLabelEl.addEventListener('input', (e) => {
      ensureMetaDefaults();
      examData.meta.resultSharing.emailButtonLabel = e.target.value;
      saveData();
    });
  }

  const bindShareChk = (id, key) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', (e) => {
      ensureMetaDefaults();
      examData.meta.resultSharing[key] = e.target.checked;
      saveData();
    });
  };
  bindShareChk('setting-share-allow-email', 'allowEmail');
  bindShareChk('setting-share-allow-copy', 'allowCopy');
  bindShareChk('setting-share-allow-download', 'allowDownloadTxt');

  populateSettingsInputs();
}

// ==========================================
// HTML Kaçış Yardımcısı (XSS Önleyici)
// ==========================================
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================
// Canlı A4 Sınav Kağıdı Render Edilmesi (Akıllı Başlık & Görünüm)
// ==========================================
function renderPaper() {
  const paper = document.getElementById('exam-paper-page');
  if (!paper) return;

  const meta = examData.meta || {};
  const isTwoCol = (meta.layoutColumns === 2);

  const institution = (meta.institution || '').trim();
  const title = (meta.title || '').trim();
  const course = (meta.course || '').trim();
  const classGrade = (meta.classGrade || '').trim();
  const duration = (meta.duration || '').trim();
  const examDate = (meta.examDate || '').trim();
  const instructions = (meta.instructions || '').trim();

  const showStudent = !!meta.showStudentInfo;
  const showScore = !!meta.showScoreBox;
  const showAnswerKey = !!meta.showAnswerKey && examData.questions.length > 0;
  const showOptical = !!meta.showOpticalForm && examData.questions.length > 0;

  // 1. Kurum / Okul Adı
  const schoolTitleHtml = institution ? `<div class="exam-school-title">${escapeHTML(institution)}</div>` : '';

  // 2. Sınav Başlığı
  const examTitleHtml = title ? `<div class="exam-sub-title">${escapeHTML(title)}</div>` : '';

  // 3. Öğrenci Bilgisi ve Puan Izgarası
  let metaGridHtml = '';
  const studentInfoFields = `
    <div class="meta-student-info">
      <div class="meta-item"><strong>${t('paper_student_name')}</strong> <span class="meta-line"></span></div>
      <div class="meta-item"><strong>${t('paper_student_grade')}</strong> <span class="meta-line">${classGrade ? escapeHTML(classGrade) : ''}</span></div>
      <div class="meta-item"><strong>${t('paper_student_number')}</strong> <span class="meta-line"></span></div>
      <div class="meta-item"><strong>${t('paper_date')}</strong> <span class="meta-line">${examDate ? escapeHTML(examDate) : ''}</span></div>
    </div>
  `;
  const scoreBoxHtml = `
    <div class="meta-score-box">
      <span class="score-title">${t('paper_score_label')}</span>
      <div class="score-value-box"></div>
    </div>
  `;

  if (showStudent && showScore) {
    metaGridHtml = `
      <div class="exam-meta-grid">
        ${studentInfoFields}
        ${scoreBoxHtml}
      </div>
    `;
  } else if (showStudent && !showScore) {
    metaGridHtml = `
      <div class="exam-meta-grid single-col">
        ${studentInfoFields}
      </div>
    `;
  } else if (!showStudent && showScore) {
    metaGridHtml = `
      <div class="exam-meta-grid score-only">
        ${scoreBoxHtml}
      </div>
    `;
  }

  // 4. Sınav Yönergesi ve Süresi
  let instructionsHtml = '';
  const hasInstr = instructions.length > 0;
  const hasDur = duration.length > 0;
  if (hasInstr || hasDur) {
    let parts = [];
    const instrLabel = (getLanguage() === 'en' ? 'Instructions:' : 'Yönerge:');
    const durLabel = (getLanguage() === 'en' ? 'Duration:' : 'Sınav Süresi:');
    if (hasInstr) parts.push(`<strong>${instrLabel}</strong> ${escapeHTML(instructions)}`);
    if (hasDur) parts.push(`<strong>${durLabel}</strong> ${escapeHTML(duration)}`);
    instructionsHtml = `<div class="exam-instructions">${parts.join(' &nbsp;|&nbsp; ')}</div>`;
  }

  // Üst Başlık Bütünleştirme
  let headerHtml = '';
  if (schoolTitleHtml || examTitleHtml || metaGridHtml || instructionsHtml) {
    headerHtml = `
      <header class="exam-header">
        ${schoolTitleHtml}
        ${examTitleHtml}
        ${metaGridHtml}
        ${instructionsHtml}
      </header>
    `;
  }

  // Sorular Listesi
  let questionsHtml = `
    <div class="exam-questions-container ${isTwoCol ? 'two-columns' : ''}">
      ${examData.questions.map((q, idx) => {
        let qBody = '';
        if (q.type === 'multiple' || q.type === 'true_false') {
          qBody = `
            <div class="paper-options">
              ${(q.options || []).map(opt => `
                <div class="paper-option">
                  <span class="paper-option-letter">${opt.letter})</span>
                  <span>${escapeHTML(opt.text || '')}</span>
                </div>
              `).join('')}
            </div>
          `;
        } else if (q.type === 'classic') {
          const lines = Array.from({ length: q.linesCount || 4 }).map(() => '<div class="paper-line"></div>').join('');
          qBody = `<div class="paper-classic-lines">${lines}</div>`;
        }

        return `
          <div class="paper-question">
            <div class="paper-q-header">
              <span class="paper-q-num">${idx + 1}.</span>
              <div class="paper-q-text"><span class="paper-q-text-body">${escapeHTML(q.text || '')}</span> <span class="paper-q-points">(${q.points || 10} ${t('q_points_short')})</span></div>
            </div>
            ${q.image ? `<img src="${q.image}" class="paper-q-image" alt="Question Image">` : ''}
            ${qBody}
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Cevap Anahtarı Kutusu (Alt Kısım)
  let answerKeyHtml = '';
  if (showAnswerKey) {
    answerKeyHtml = `
      <div class="paper-answer-key-box">
        <div class="paper-answer-key-title">${t('paper_answer_key_title')}</div>
        <div class="paper-answer-key-grid">
          ${examData.questions.map((q, idx) => `
            <div class="paper-key-item">
              <strong>${idx + 1}:</strong> ${q.correctAnswer || '-'}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Optik Form Kutusu (Alt Kısım)
  let opticalHtml = '';
  if (showOptical) {
    opticalHtml = `
      <div class="paper-optical-form">
        <div class="optical-title">${t('paper_optical_title')}</div>
        <div class="optical-bubbles-row">
          ${examData.questions.map((q, idx) => {
            const letters = (q.options && q.options.length > 0) ? q.options.map(o => o.letter) : ['A', 'B', 'C', 'D'];
            return `
              <div class="optical-q-item">
                <strong>${idx + 1}.</strong>
                ${letters.map(l => `<span class="bubble">${l}</span>`).join('')}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Footer
  const courseWord = (getLanguage() === 'en' ? 'Course:' : 'Ders:');
  const pageWord = (getLanguage() === 'en' ? 'Page 1 / 1' : 'Sayfa 1 / 1');
  const footerCourse = course ? `<span>${courseWord} ${escapeHTML(course)}</span>` : `<span></span>`;
  let footerHtml = `
    <footer class="exam-footer">
      ${footerCourse}
      <span>${t('paper_watermark')}</span>
      <span>${pageWord}</span>
    </footer>
  `;

  paper.innerHTML = headerHtml + questionsHtml + opticalHtml + answerKeyHtml + footerHtml;
}

function autoResizeTextarea(el, maxHeight = 360) {
  if (!el) return;
  el.style.height = 'auto';
  const nextHeight = Math.min(el.scrollHeight, maxHeight);
  el.style.height = nextHeight + 'px';
  el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
}

function autoResizeAllTextareas(root = document) {
  if (!root) return;
  root.querySelectorAll('textarea.auto-grow-textarea').forEach(ta => {
    const maxH = Number(ta.dataset.maxHeight) || 360;
    autoResizeTextarea(ta, maxH);
  });
}

// ==========================================
// Soruların Editörde Render Edilmesi
// ==========================================
function renderQuestionsList() {
  const listEl = document.getElementById('editor-questions-list');
  if (!listEl) return;
  listEl.innerHTML = '';

  const totalPoints = examData.questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
  const badgeEl = document.getElementById('total-questions-badge');
  const isEn = (getLanguage() === 'en');
  if (badgeEl) {
    badgeEl.textContent = isEn 
      ? `${examData.questions.length} Questions / ${totalPoints} Pts` 
      : `${examData.questions.length} Soru / ${totalPoints} Puan`;
  }

  examData.questions.forEach((q, idx) => {
    const isExpanded = expandedQuestionId ? (q.id === expandedQuestionId) : (idx === 0);
    const itemEl = document.createElement('div');
    itemEl.className = 'question-item' + (isExpanded ? ' expanded active' : '');
    itemEl.id = `q-card-${q.id}`;

    // Header bar
    const headerEl = document.createElement('div');
    headerEl.className = 'question-header';
    const previewTitleText = q.text || (isEn ? '(Question text empty)' : '(Soru metni boş)');
    headerEl.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; overflow:hidden; flex:1; min-width:0;">
        <span class="q-badge">${idx + 1}</span>
        <span class="q-preview-text" title="${escapeHTML(previewTitleText)}">${escapeHTML(previewTitleText)}</span>
      </div>
      <div class="q-actions" onclick="event.stopPropagation()">
        <button class="btn btn-icon btn-sm" title="${t('btn_up_tooltip')}" onclick="moveQuestion(${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>
          <i data-lucide="arrow-up"></i>
        </button>
        <button class="btn btn-icon btn-sm" title="${t('btn_down_tooltip')}" onclick="moveQuestion(${idx}, 1)" ${idx === examData.questions.length - 1 ? 'disabled' : ''}>
          <i data-lucide="arrow-down"></i>
        </button>
        <button class="btn btn-icon btn-sm" title="${t('btn_duplicate_tooltip')}" onclick="duplicateQuestion(${idx})">
          <i data-lucide="copy"></i>
        </button>
        <button class="btn btn-icon btn-sm btn-danger-outline" title="${t('btn_delete_tooltip')}" onclick="deleteQuestion(${idx})">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;

    headerEl.addEventListener('click', () => {
      const isCurrentlyExpanded = itemEl.classList.contains('expanded');
      document.querySelectorAll('.question-item').forEach(el => el.classList.remove('expanded', 'active'));
      if (!isCurrentlyExpanded) {
        itemEl.classList.add('expanded', 'active');
        expandedQuestionId = q.id;
        autoResizeAllTextareas(itemEl);
      } else {
        expandedQuestionId = null;
      }
    });

    // Body content
    const bodyEl = document.createElement('div');
    bodyEl.className = 'question-body';

    // Type Selector & Points
    bodyEl.innerHTML = `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">${isEn ? 'Question Type' : 'Soru Tipi'}</label>
          <select class="form-select q-type-select" onchange="changeQuestionType('${q.id}', this.value)">
            <option value="multiple" ${q.type === 'multiple' ? 'selected' : ''}>${isEn ? 'Multiple Choice (A, B, C, D, E)' : 'Çoktan Seçmeli (A, B, C, D, E)'}</option>
            <option value="true_false" ${q.type === 'true_false' ? 'selected' : ''}>${isEn ? 'True / False (T / F)' : 'Doğru / Yanlış (D / Y)'}</option>
            <option value="classic" ${q.type === 'classic' ? 'selected' : ''}>${isEn ? 'Open-Ended / Classic' : 'Klasik / Açık Uçlu'}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">${isEn ? 'Question Points' : 'Soru Puanı'}</label>
          <input type="number" class="form-input" value="${q.points || 10}" min="1" max="100" oninput="updateQuestionField('${q.id}', 'points', Number(this.value))">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">${isEn ? 'Question Text' : 'Soru Metni'}</label>
        <textarea class="form-textarea auto-grow-textarea" data-max-height="360" rows="3" placeholder="${t('q_text_placeholder')}" oninput="updateQuestionField('${q.id}', 'text', this.value); autoResizeTextarea(this, 360)">${escapeHTML(q.text || '')}</textarea>
      </div>

      <!-- Resim Ekleme Alanı -->
      <div class="form-group">
        <label class="form-label">${t('q_image_label')}</label>
        <div style="display:flex; gap:6px;">
          <input type="text" class="form-input" placeholder="${isEn ? 'Paste image URL or choose file...' : 'Görsel URL\'si yapıştırın veya dosya seçin...'}" value="${q.image || ''}" oninput="updateQuestionField('${q.id}', 'image', this.value)">
          <label class="btn btn-secondary btn-sm" style="cursor:pointer;" title="${t('q_image_upload_btn')}">
            <i data-lucide="image-plus"></i>
            <input type="file" accept="image/*" style="display:none;" onchange="handleImageUpload('${q.id}', event)">
          </label>
        </div>
        ${q.image ? `
          <div class="q-image-preview-container">
            <img src="${q.image}" class="q-image-preview" alt="Preview">
            <button class="q-image-remove" title="${t('q_image_remove_btn')}" onclick="removeQuestionImage('${q.id}')">✕</button>
          </div>
        ` : ''}
      </div>

      <!-- Şıklar veya Klasik Ayarları -->
      <div class="q-options-container" id="options-box-${q.id}">
        <!-- JS ile render edilir -->
      </div>

      <div class="form-group">
        <label class="form-label">${t('q_explanation_label')}</label>
        <textarea class="form-textarea auto-grow-textarea" data-max-height="180" rows="1" placeholder="${isEn ? 'Explanation or hint for this question...' : 'Bu sorunun açıklaması veya çözüm adımı...'}" oninput="updateQuestionField('${q.id}', 'explanation', this.value); autoResizeTextarea(this, 180)">${escapeHTML(q.explanation || '')}</textarea>
      </div>
    `;

    itemEl.appendChild(headerEl);
    itemEl.appendChild(bodyEl);
    listEl.appendChild(itemEl);

    renderQuestionOptionsEditor(q);
  });

  autoResizeAllTextareas(listEl);
  lucide.createIcons();
}

function renderQuestionOptionsEditor(q) {
  const container = document.getElementById(`options-box-${q.id}`);
  if (!container) return;
  const isEn = (getLanguage() === 'en');

  if (q.type === 'multiple' || q.type === 'true_false') {
    container.innerHTML = `
      <div class="form-group">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <label class="form-label" style="margin-bottom:0;">${isEn ? 'Options (Green indicates correct answer)' : 'Seçenekler (Yeşil olan doğru cevaptır)'}</label>
          ${q.type === 'multiple' ? `
            <button class="btn btn-outline btn-sm" onclick="addOptionToQuestion('${q.id}')">
              <i data-lucide="plus"></i> ${t('q_add_option_btn')}
            </button>
          ` : ''}
        </div>
        <div class="option-list">
          ${(q.options || []).map((opt, optIdx) => {
            const isCorrect = (q.correctAnswer === opt.letter);
            return `
              <div class="option-row">
                <button class="option-letter-btn ${isCorrect ? 'correct' : ''}" title="${isEn ? 'Mark as Correct Answer' : 'Doğru Cevap Olarak İşaretle'}" onclick="setCorrectOption('${q.id}', '${opt.letter}')">
                  ${opt.letter}
                </button>
                <textarea rows="1" class="form-input option-input auto-grow-textarea" data-max-height="160" placeholder="${isEn ? `Option ${opt.letter} text...` : `${opt.letter} seçeneği metni...`}" oninput="updateOptionText('${q.id}', ${optIdx}, this.value); autoResizeTextarea(this, 160)">${escapeHTML(opt.text || '')}</textarea>
                ${q.type === 'multiple' && q.options.length > 2 ? `
                  <button class="btn-icon option-remove-btn" title="${isEn ? 'Remove Option' : 'Şıkkı Kaldır'}" onclick="removeOptionFromQuestion('${q.id}', ${optIdx})">
                    <i data-lucide="x"></i>
                  </button>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } else if (q.type === 'classic') {
    container.innerHTML = `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">${t('q_lines_count_label')}</label>
          <input type="number" class="form-input" min="1" max="15" value="${q.linesCount || 4}" oninput="updateQuestionField('${q.id}', 'linesCount', Number(this.value))">
        </div>
        <div class="form-group">
          <label class="form-label">${t('q_classic_answer_label')}</label>
          <textarea rows="1" class="form-input auto-grow-textarea" data-max-height="160" placeholder="${isEn ? 'Text shown in answer key' : 'Cevap anahtarında görünecek metin'}" oninput="updateQuestionField('${q.id}', 'correctAnswer', this.value); autoResizeTextarea(this, 160)">${escapeHTML(q.correctAnswer || '')}</textarea>
        </div>
      </div>
    `;
  }

  autoResizeAllTextareas(container);
  lucide.createIcons();
}

// ==========================================
// Soru Düzenleme İşlemleri (CRUD)
// ==========================================
function addQuestion(type = 'multiple') {
  const newId = 'q-' + Date.now();
  let newQ = {
    id: newId,
    type: type,
    text: '',
    image: '',
    points: 10,
    explanation: ''
  };

  if (type === 'multiple') {
    newQ.options = [
      { letter: 'A', text: '' },
      { letter: 'B', text: '' },
      { letter: 'C', text: '' },
      { letter: 'D', text: '' }
    ];
    newQ.correctAnswer = 'A';
  } else if (type === 'true_false') {
    newQ.options = [
      { letter: 'D', text: 'Doğru' },
      { letter: 'Y', text: 'Yanlış' }
    ];
    newQ.correctAnswer = 'D';
  } else {
    newQ.linesCount = 4;
    newQ.correctAnswer = '';
  }

  examData.questions.push(newQ);
  expandedQuestionId = newId;
  saveData();
  renderQuestionsList();
  
  setTimeout(() => {
    const el = document.getElementById(`q-card-${newId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);

  showToast('Yeni soru eklendi.', 'success');
}

function updateQuestionField(qId, field, val) {
  const q = examData.questions.find(item => item.id === qId);
  if (q) {
    q[field] = val;
    saveData();
    const card = document.getElementById(`q-card-${qId}`);
    if (card && field === 'text') {
      const prevEl = card.querySelector('.q-preview-text');
      if (prevEl) {
        prevEl.textContent = val || '(Soru metni boş)';
        prevEl.title = val || '';
      }
    }
  }
}

function changeQuestionType(qId, newType) {
  const q = examData.questions.find(item => item.id === qId);
  if (!q) return;

  q.type = newType;
  if (newType === 'multiple') {
    q.options = [
      { letter: 'A', text: '' },
      { letter: 'B', text: '' },
      { letter: 'C', text: '' },
      { letter: 'D', text: '' }
    ];
    q.correctAnswer = 'A';
  } else if (newType === 'true_false') {
    q.options = [
      { letter: 'D', text: 'Doğru' },
      { letter: 'Y', text: 'Yanlış' }
    ];
    q.correctAnswer = 'D';
  } else if (newType === 'classic') {
    delete q.options;
    q.linesCount = 4;
  }

  saveData();
  renderQuestionOptionsEditor(q);
}

function updateOptionText(qId, optIdx, text) {
  const q = examData.questions.find(item => item.id === qId);
  if (q && q.options && q.options[optIdx]) {
    q.options[optIdx].text = text;
    saveData();
  }
}

function setCorrectOption(qId, letter) {
  const q = examData.questions.find(item => item.id === qId);
  if (q) {
    q.correctAnswer = letter;
    saveData();
    renderQuestionOptionsEditor(q);
  }
}

function addOptionToQuestion(qId) {
  const q = examData.questions.find(item => item.id === qId);
  if (!q || !q.options) return;

  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  if (q.options.length >= alphabet.length) {
    showToast('En fazla 7 seçenek eklenebilir.', 'error');
    return;
  }

  const nextLetter = alphabet[q.options.length];
  q.options.push({ letter: nextLetter, text: '' });
  saveData();
  renderQuestionOptionsEditor(q);
}

function removeOptionFromQuestion(qId, optIdx) {
  const q = examData.questions.find(item => item.id === qId);
  if (!q || !q.options || q.options.length <= 2) return;

  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  q.options.splice(optIdx, 1);
  q.options.forEach((opt, idx) => {
    opt.letter = alphabet[idx];
  });

  if (!q.options.some(opt => opt.letter === q.correctAnswer)) {
    q.correctAnswer = q.options[0].letter;
  }

  saveData();
  renderQuestionOptionsEditor(q);
}

function deleteQuestion(idx) {
  if (confirm(`${idx + 1}. soruyu silmek istediğinize emin misiniz?`)) {
    const deleted = examData.questions[idx];
    examData.questions.splice(idx, 1);
    if (expandedQuestionId === deleted.id) {
      expandedQuestionId = null;
    }
    if (digitalTestState.activeIdx >= examData.questions.length) {
      digitalTestState.activeIdx = Math.max(0, examData.questions.length - 1);
    }
    saveData();
    renderQuestionsList();
    showToast('Soru silindi.', 'info');
  }
}

function duplicateQuestion(idx) {
  const original = examData.questions[idx];
  const copy = JSON.parse(JSON.stringify(original));
  copy.id = 'q-' + Date.now();
  examData.questions.splice(idx + 1, 0, copy);
  expandedQuestionId = copy.id;
  saveData();
  renderQuestionsList();
  showToast('Soru kopyalandı.', 'success');
}

function moveQuestion(idx, direction) {
  const targetIdx = idx + direction;
  if (targetIdx < 0 || targetIdx >= examData.questions.length) return;

  const temp = examData.questions[idx];
  examData.questions[idx] = examData.questions[targetIdx];
  examData.questions[targetIdx] = temp;

  saveData();
  renderQuestionsList();
}

function handleImageUpload(qId, event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    updateQuestionField(qId, 'image', e.target.result);
    renderQuestionsList();
    showToast('Görsel başarıyla yüklendi.', 'success');
  };
  reader.readAsDataURL(file);
}

function removeQuestionImage(qId) {
  updateQuestionField(qId, 'image', '');
  renderQuestionsList();
}

// ==========================================
// NotebookLM Tarzı İnteraktif Dijital Test Render Motoru
// ==========================================
function renderDigitalTest() {
  const container = document.getElementById('digital-test-view');
  if (!container) return;

  const total = examData.questions.length;
  const isEn = (getLanguage() === 'en');

  if (total === 0) {
    container.innerHTML = `
      <div class="nlm-question-card" style="text-align:center; padding:3rem 1.5rem;">
        <i data-lucide="help-circle" style="width:48px; height:48px; color:var(--text-muted); margin-bottom:1rem;"></i>
        <h3 style="margin-bottom:0.5rem;">${isEn ? 'No Questions Added Yet' : 'Henüz Soru Eklenmedi'}</h3>
        <p style="color:var(--text-muted); font-size:0.9rem;">${isEn ? 'You can add questions from the left panel.' : 'Sol panelden yeni sorular ekleyebilirsiniz.'}</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  // Eğer test bitirilmişse Sonuç / Çalışma Özeti Ekranı göster
  if (digitalTestState.isFinished) {
    renderDigitalTestSummary(container);
    return;
  }

  if (digitalTestState.activeIdx >= total) digitalTestState.activeIdx = total - 1;
  if (digitalTestState.activeIdx < 0) digitalTestState.activeIdx = 0;

  const idx = digitalTestState.activeIdx;
  const q = examData.questions[idx];
  const progressPct = Math.round(((idx + 1) / total) * 100);
  const behavior = (examData.meta && examData.meta.testModeBehavior === 'allow_change') ? 'allow_change' : 'lock_reveal';
  const isLockedMode = (behavior === 'lock_reveal');
  const isRevealed = isLockedMode && !!digitalTestState.revealed[q.id];
  const userAns = digitalTestState.userAnswers[q.id];
  const durationMins = (examData.meta && Number(examData.meta.durationMinutes) > 0) ? Number(examData.meta.durationMinutes) : 0;
  const durationLabel = durationMins > 0 ? `${durationMins} ${t('test_minutes_short')}` : t('test_untimed');
  const behaviorBadgeLabel = isLockedMode
    ? (isEn ? 'Locked • Instant Feedback' : 'Kilitli • Anında Sonuç')
    : (isEn ? 'Editable • End Results' : 'Değiştirilebilir • Sonuç Bitimde');
  const testTitleText = (examData.meta && examData.meta.title && examData.meta.title.trim())
    ? examData.meta.title.trim()
    : (isEn ? 'Interactive Quiz' : 'İnteraktif Test');
  const courseText = (examData.meta && examData.meta.course && examData.meta.course.trim())
    ? examData.meta.course.trim()
    : (isEn ? 'General' : 'Genel');

  // Seçenekler HTML
  let optionsHtml = '';
  if (q.type === 'multiple' || q.type === 'true_false') {
    optionsHtml = `
      <div class="nlm-options-list">
        ${(q.options || []).map(opt => {
          const isSelected = userAns === opt.letter;
          let extraClass = '';
          if (isRevealed) {
            if (opt.letter === q.correctAnswer) {
              extraClass = 'is-correct is-locked';
            } else if (isSelected) {
              extraClass = 'is-wrong is-locked';
            } else {
              extraClass = 'is-locked';
            }
          } else if (isSelected) {
            extraClass = 'selected';
          }

          return `
            <button class="nlm-opt-btn ${extraClass}" ${isRevealed ? 'disabled' : ''} onclick="handleDigitalOptionClick('${q.id}', '${opt.letter}')">
              <span class="nlm-opt-pill">${opt.letter}</span>
              <span style="flex:1; min-width:0; white-space:pre-wrap; overflow-wrap:break-word; word-break:break-word;">${escapeHTML(opt.text || '')}</span>
              ${isRevealed && opt.letter === q.correctAnswer ? '<i data-lucide="check" style="color:var(--success); flex-shrink:0;"></i>' : ''}
              ${isRevealed && isSelected && opt.letter !== q.correctAnswer ? '<i data-lucide="x" style="color:var(--danger); flex-shrink:0;"></i>' : ''}
            </button>
          `;
        }).join('')}
      </div>
    `;
  } else {
    // Klasik soru
    optionsHtml = `
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        <textarea class="form-textarea" rows="4" placeholder="${isEn ? 'Type your answer here...' : 'Cevabınızı buraya yazınız...'}" oninput="handleDigitalClassicInput('${q.id}', this.value)">${escapeHTML(userAns || '')}</textarea>
        ${isLockedMode && !isRevealed ? `
          <button class="btn btn-secondary btn-sm" style="align-self:flex-start;" onclick="revealDigitalAnswer('${q.id}')">
            <i data-lucide="eye"></i> ${isEn ? 'Show Expected Answer' : 'Beklenen Cevabı Göster'}
          </button>
        ` : ''}
      </div>
    `;
  }

  // Açıklama / Neden Doğru? Kutusu (Yalnızca anında geri bildirim modunda)
  let insightHtml = '';
  if (isRevealed && (q.explanation || q.correctAnswer)) {
    insightHtml = `
      <div class="nlm-insight-box">
        <div class="nlm-insight-header">
          <i data-lucide="lightbulb"></i>
          <span>${isEn ? 'WHY CORRECT? / SOLUTION EXPLANATION' : 'NEDEN DOĞRU? / ÇÖZÜM AÇIKLAMASI'}</span>
        </div>
        <div class="nlm-insight-text">
          ${q.explanation ? escapeHTML(q.explanation) : (isEn ? `Correct answer: <strong>${escapeHTML(q.correctAnswer)}</strong>` : `Doğru cevap: <strong>${escapeHTML(q.correctAnswer)}</strong>`)}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <!-- Başlık ve İlerleme Kartı -->
    <div class="nlm-header-card">
      <div class="nlm-header-top">
        <div class="nlm-topic-badge">
          <i data-lucide="book-open"></i>
          <span>${escapeHTML(courseText)}</span>
        </div>
        <div class="nlm-q-counter">
          <span>${t('test_progress', { current: idx + 1, total })}</span>
          <span class="brand-badge" style="margin-left:6px;">${q.points || 10} ${t('q_points_short')}</span>
        </div>
      </div>
      <div class="nlm-header-meta-row">
        <div class="nlm-test-title">${escapeHTML(testTitleText)}</div>
        <div class="nlm-header-pills">
          <span class="nlm-mini-pill"><i data-lucide="clock" style="width:12px; height:12px;"></i> ${escapeHTML(durationLabel)}</span>
          <span class="nlm-mini-pill"><i data-lucide="${isLockedMode ? 'lock' : 'edit-3'}" style="width:12px; height:12px;"></i> ${escapeHTML(behaviorBadgeLabel)}</span>
          ${((examData.meta && Array.isArray(examData.meta.participantFields)) ? examData.meta.participantFields.filter(f => f && f.label && f.label.trim()).length : 0) > 0
            ? `<span class="nlm-mini-pill"><i data-lucide="user-check" style="width:12px; height:12px;"></i> ${examData.meta.participantFields.filter(f => f && f.label && f.label.trim()).length} ${isEn ? 'Pre-test field(s)' : 'Ön Bilgi Alanı'}</span>`
            : ''}
          ${(examData.meta && examData.meta.resultSharing && examData.meta.resultSharing.enabled)
            ? `<span class="nlm-mini-pill"><i data-lucide="send" style="width:12px; height:12px;"></i> ${isEn ? 'Sharing On' : 'Sonuç Paylaşımı'}</span>`
            : ''}
          <button type="button" class="nlm-settings-link-btn" onclick="switchTab('settings')">
            <i data-lucide="sliders" style="width:12px; height:12px;"></i> ${t('tab_test_settings')}
          </button>
        </div>
      </div>
      <div class="nlm-progress-track">
        <div class="nlm-progress-bar" style="width: ${progressPct}%;"></div>
      </div>
    </div>

    <!-- Soru Kartı -->
    <div class="nlm-question-card">
      <div class="nlm-q-text">${escapeHTML(q.text || (isEn ? '(No question text entered)' : '(Soru metni girilmedi)'))}</div>
      ${q.image ? `<img src="${q.image}" class="nlm-q-image" alt="Question Image">` : ''}
      ${optionsHtml}
      ${insightHtml}

      <!-- Navigasyon Çubuğu -->
      <div class="nlm-nav-bar">
        <button class="btn btn-secondary" onclick="prevDigitalQuestion()" ${idx === 0 ? 'disabled' : ''}>
          <i data-lucide="arrow-left"></i> ${t('test_btn_prev')}
        </button>

        ${idx === total - 1 ? `
          <button class="btn btn-success" onclick="finishDigitalTest()">
            ${t('test_btn_finish')} <i data-lucide="check-circle"></i>
          </button>
        ` : `
          <button class="btn btn-primary" onclick="nextDigitalQuestion()">
            ${t('test_btn_next')} <i data-lucide="arrow-right"></i>
          </button>
        `}
      </div>
    </div>
  `;

  lucide.createIcons();
}

function handleDigitalOptionClick(qId, letter) {
  const behavior = (examData.meta && examData.meta.testModeBehavior === 'allow_change') ? 'allow_change' : 'lock_reveal';
  if (behavior === 'lock_reveal') {
    if (digitalTestState.revealed[qId]) return;
    digitalTestState.userAnswers[qId] = letter;
    digitalTestState.revealed[qId] = true;
  } else {
    digitalTestState.userAnswers[qId] = letter;
  }
  renderDigitalTest();
}

function handleDigitalClassicInput(qId, val) {
  digitalTestState.userAnswers[qId] = val;
}

function revealDigitalAnswer(qId) {
  digitalTestState.revealed[qId] = true;
  renderDigitalTest();
}

function prevDigitalQuestion() {
  if (digitalTestState.activeIdx > 0) {
    digitalTestState.activeIdx--;
    renderDigitalTest();
  }
}

function nextDigitalQuestion() {
  if (digitalTestState.activeIdx < examData.questions.length - 1) {
    digitalTestState.activeIdx++;
    renderDigitalTest();
  }
}

function finishDigitalTest() {
  digitalTestState.isFinished = true;
  renderDigitalTest();
}

function restartDigitalTest() {
  digitalTestState.activeIdx = 0;
  digitalTestState.userAnswers = {};
  digitalTestState.revealed = {};
  digitalTestState.isFinished = false;
  renderDigitalTest();
}

function renderDigitalTestSummary(container) {
  let correct = 0;
  let wrong = 0;
  let empty = 0;
  let earnedPoints = 0;
  let maxPoints = 0;
  const isEn = (getLanguage() === 'en');

  examData.questions.forEach(q => {
    const pts = Number(q.points) || 10;
    maxPoints += pts;
    const ans = digitalTestState.userAnswers[q.id];

    if (!ans) {
      empty++;
    } else if (q.type === 'multiple' || q.type === 'true_false') {
      if (ans === q.correctAnswer) {
        correct++;
        earnedPoints += pts;
      } else {
        wrong++;
      }
    } else {
      correct++;
      earnedPoints += pts;
    }
  });

  const finalScore = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 0;

  if (finalScore >= 70 && typeof confetti === 'function') {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  }

  container.innerHTML = `
    <div class="nlm-summary-card">
      <div class="nlm-score-badge-circle">
        <span class="nlm-score-val">${finalScore}</span>
        <span class="nlm-score-lbl">${t('test_summary_score')}</span>
      </div>
      <h2 style="font-size:1.6rem; margin-bottom:0.35rem;">${t('test_summary_title')}</h2>
      <p style="color:var(--text-muted); font-size:0.92rem;">${isEn ? 'Below is your detailed performance analysis for this test.' : 'Aşağıda çözdüğünüz soruların detaylı çalışma analizini görebilirsiniz.'}</p>

      <div class="nlm-stats-row">
        <div class="nlm-stat-box">
          <div style="font-size:1.6rem; font-weight:800; color:var(--success);">${correct}</div>
          <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted);">${t('test_stat_correct')}</div>
        </div>
        <div class="nlm-stat-box">
          <div style="font-size:1.6rem; font-weight:800; color:var(--danger);">${wrong}</div>
          <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted);">${t('test_stat_wrong')}</div>
        </div>
        <div class="nlm-stat-box">
          <div style="font-size:1.6rem; font-weight:800; color:var(--text-muted);">${empty}</div>
          <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted);">${t('test_stat_empty')}</div>
        </div>
      </div>

      <div style="display:flex; justify-content:center; gap:0.75rem; margin-top:1.5rem;">
        <button class="btn btn-primary" onclick="restartDigitalTest()">
          <i data-lucide="rotate-ccw"></i> ${t('test_btn_restart')}
        </button>
        <button class="btn btn-secondary" onclick="selectAppMode('paper')">
          <i data-lucide="file-text"></i> ${isEn ? 'Switch to Exam Paper' : 'Sınav Kağıdına Çevir'}
        </button>
      </div>

      <div style="text-align:left; margin-top:2.5rem; border-top:1px solid var(--border-color); padding-top:1.5rem;">
        <h3 style="font-size:1.05rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="check-square" style="color:var(--primary);"></i> ${isEn ? 'Question Review & Study Notes' : 'Soru İncelemesi & Öğrenme Notları'}
        </h3>
        ${examData.questions.map((q, qIdx) => {
          const userAns = digitalTestState.userAnswers[q.id];
          const isClassic = (q.type === 'classic');
          const isCorrect = isClassic ? !!userAns : (userAns === q.correctAnswer);
          let statusTag = '';
          if (isClassic) {
            statusTag = q.correctAnswer
              ? `<span style="color:var(--primary); font-weight:600;">(${t('test_correct_ans')} ${escapeHTML(q.correctAnswer)})</span>`
              : '';
          } else if (!userAns) {
            statusTag = `<span style="color:var(--text-muted); font-weight:600;">(${t('test_correct_ans')} ${escapeHTML(q.correctAnswer)})</span>`;
          } else {
            statusTag = isCorrect
              ? `<span style="color:var(--success); font-weight:700;">✓ ${t('test_stat_correct')}</span>`
              : `<span style="color:var(--danger); font-weight:700;">✗ ${t('test_stat_wrong')} (${t('test_correct_ans')} ${escapeHTML(q.correctAnswer)})</span>`;
          }
          return `
            <div style="padding:1rem; background:var(--bg-input); border-radius:var(--radius-md); margin-bottom:0.75rem; border-left:4px solid ${isCorrect ? 'var(--success)' : (userAns ? 'var(--danger)' : 'var(--text-muted)')};">
              <div style="font-weight:700; font-size:0.95rem; margin-bottom:4px; white-space:pre-wrap; overflow-wrap:break-word;">${qIdx + 1}. ${escapeHTML(q.text || '')}</div>
              <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:4px; overflow-wrap:break-word;">
                ${t('test_your_ans')} <strong>${escapeHTML(userAns || (isEn ? 'Left Blank' : 'Boş Bırakıldı'))}</strong> ${statusTag}
              </div>
              ${q.explanation ? `<div style="font-size:0.85rem; color:var(--text-main); background:var(--bg-card); padding:8px 12px; border-radius:6px; margin-top:6px; white-space:pre-wrap; overflow-wrap:break-word;">💡 <strong>${isEn ? 'Explanation:' : 'Açıklama:'}</strong> ${escapeHTML(q.explanation)}</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  lucide.createIcons();
}

// ==========================================
// Toplu / Hızlı Metin Aktarma (Akıllı Bulk Parser)
// ==========================================
function openBulkModal() {
  const modal = document.getElementById('bulk-modal-overlay');
  if (modal) {
    modal.classList.add('active');
    updateBulkPreview();
    const textarea = document.getElementById('bulk-import-textarea');
    if (textarea) textarea.focus();
  }
  lucide.createIcons();
}

function closeBulkModal() {
  const modal = document.getElementById('bulk-modal-overlay');
  if (modal) modal.classList.remove('active');
}

function clearBulkText() {
  const textarea = document.getElementById('bulk-import-textarea');
  if (textarea) {
    textarea.value = '';
    updateBulkPreview();
    showToast(getLanguage() === 'en' ? 'Text area cleared.' : 'Metin alanı temizlendi.', 'info');
  }
}

function copyAiPrompt() {
  const isEn = (getLanguage() === 'en');
  const promptText = isEn ? `Please convert the questions below into this exact structure so that my exam tool can parse them automatically:

- Wrap the entire output inside a single plain text code block (\`\`\`text ... \`\`\`) so that question numbers can be copied as plain text.
- Each question starts with "1. Question text"
- Multiple choice options on separate lines: "A) ...", "B) ...", "C) ...", "D) ..."
- Correct answers placed below each question as "Answer: X"
- If any explanation exists, add it as "Explanation: ..."
- Do not include greetings or any extra text outside the code block, only output the questions inside the code block.

Questions to convert:
[Paste your questions here]` : `Aşağıda vereceğim soruları, sınav hazırlama aracımın otomatik algılayabilmesi için birebir şu formata dönüştür:

- Tüm çıktıyı tek bir düz metin kod bloğu (\`\`\`text ... \`\`\`) içine al ki soru numaraları düz yazı olarak kopyalanabilsin.
- Her soru numarası "1. Soru metni" şeklinde başlasın.
- Çoktan seçmeli sorularda şıklar alt alta "A) ...", "B) ...", "C) ...", "D) ..." şeklinde olsun.
- Doğru cevaplar her sorunun altında "Cevap: X" şeklinde belirtilsin.
- Varsa kısa açıklama "Açıklama: ..." şeklinde eklensin.
- Başka hiçbir selamlama veya fazladan metin yazma, sadece kod bloğu içindeki soruları ver.

Dönüştürülecek sorularım:
[Buraya sorularınızı yapıştırın]`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(promptText).then(() => {
      showToast(t('toast_prompt_copied'), 'success');
    }).catch(() => {
      fallbackCopyText(promptText);
    });
  } else {
    fallbackCopyText(promptText);
  }
}

function fallbackCopyText(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showToast(t('toast_prompt_copied'), 'success');
}

function loadBulkSample(sampleType) {
  const textarea = document.getElementById('bulk-import-textarea');
  if (!textarea) return;
  const isEn = (getLanguage() === 'en');

  const samplesTr = {
    standard: `1. Türkiye'nin başkenti neresidir?
A) İstanbul
B) Ankara
C) İzmir
D) Bursa
Cevap: B
Açıklama: Ankara 1923 yılında başkent olmuştur.

2. Maddenin gaz halden sıvı hale geçmesine ne denir?
A) Erime
B) Donma
C) Yoğuşma
D) Buharlaşma
Cevap: C
Açıklama: Yoğuşma sırasında çevreye ısı verilir.

3. Hangi organ insan vücudunda kanı temizlemekle görevlidir?
A) Kalp
B) Akciğer
C) Böbrek
D) Mide
Cevap: C`,

    inline: `1. Aşağıdakilerden hangisi bir açık kaynak işletim sistemidir?
A) Windows   B) macOS   C) Linux   D) iOS
Cevap: C

2. Hangisi bir asal sayıdır?
A) 4   B) 6   C) 7   D) 9
Cevap: C

3. Dünyanın en büyük okyanusu hangisidir?
A) Atlas   B) Büyük (Pasifik)   C) Hint   D) Arktik
Cevap: B

4. Işık boşlukta sesten daha hızlı yayılır.
A) Doğru   B) Yanlış
Cevap: A`,

    answerkey: `1. Güneş Sistemi'nde Güneş'e en yakın gezegen hangisidir?
A) Venüs   B) Merkür   C) Mars   D) Dünya

2. Fotosentez bitkilerde hangi hücresel organelde gerçekleşir?
A) Ribozom   B) Mitokondri   C) Kloroplast   D) Koful

3. DNA molekülünün yapısı nasıldır?
A) Tek zincirli   B) Çift sarmal   C) Dairesel   D) Üçlü sarmal

Cevap Anahtarı:
1-B, 2-C, 3-B`,

    mixed: `1. Dünya Güneş etrafındaki dönüşünü 365 gün 6 saatte tamamlar.
A) Doğru
B) Yanlış
Cevap: A

2. Suyun kaynama noktası deniz seviyesinde kaç santigrat derecedir?
A) 50   B) 90   C) 100   D) 120
Cevap: C

3. Küresel ısınmanın başlıca nedenlerini ve sonuçlarını kısaca yazınız.
Cevap: Fosil yakıt kullanımı, sera gazı salınımı ve buzulların erimesi.
Açıklama: Klasik açık uçlu değerlendirme sorusudur.`
  };

  const samplesEn = {
    standard: `1. What is the capital of France?
A) London
B) Paris
C) Berlin
D) Rome
Answer: B
Explanation: Paris has been the capital since 508 AD.

2. What is the process of a substance changing directly from solid to gas called?
A) Condensation
B) Evaporation
C) Sublimation
D) Melting
Answer: C
Explanation: Sublimation skips the liquid phase. Example: Dry ice.

3. Which organ is responsible for pumping blood throughout the human body?
A) Heart
B) Lungs
C) Kidney
D) Stomach
Answer: A`,

    inline: `1. Which of the following is an open-source operating system?
A) Windows   B) macOS   C) Linux   D) iOS
Answer: C

2. Which of the following is a prime number?
A) 4   B) 6   C) 7   D) 9
Answer: C

3. What is the largest ocean on Earth?
A) Atlantic   B) Pacific   C) Indian   D) Arctic
Answer: B

4. Light travels faster than sound in a vacuum.
A) True   B) False
Answer: A`,

    answerkey: `1. Which planet in the Solar System is closest to the Sun?
A) Venus   B) Mercury   C) Mars   D) Earth

2. In which cellular organelle does photosynthesis take place in plants?
A) Ribosome   B) Mitochondria   C) Chloroplast   D) Vacuole

3. What is the structure of the DNA molecule?
A) Single-stranded   B) Double helix   C) Circular   D) Triple helix

Answer Key:
1-B, 2-C, 3-B`,

    mixed: `1. Earth completes its revolution around the Sun in 365 days and 6 hours.
A) True
B) False
Answer: A

2. What is the boiling point of water at sea level in Celsius?
A) 50   B) 90   C) 100   D) 120
Answer: C

3. Briefly state the main causes and consequences of global warming.
Answer: Fossil fuel consumption, greenhouse gas emissions, and melting glaciers.
Explanation: Open-ended classic evaluation question.`
  };

  const currentDict = isEn ? samplesEn : samplesTr;
  textarea.value = currentDict[sampleType] || currentDict.standard;
  updateBulkPreview();
  showToast(isEn ? 'Sample format loaded.' : 'Örnek format yüklendi.', 'info');
}

function updateBulkPreview() {
  const textarea = document.getElementById('bulk-import-textarea');
  if (!textarea) return;
  const rawText = textarea.value;
  const isEn = (getLanguage() === 'en');
  const charCountEl = document.getElementById('bulk-char-count');
  if (charCountEl) {
    charCountEl.textContent = t('bulk_char_count', { count: rawText.length });
  }

  const parsed = parseBulkText(rawText);
  const badgeEl = document.getElementById('bulk-detected-badge');
  const typeBadgesEl = document.getElementById('bulk-type-badges');
  const listEl = document.getElementById('bulk-preview-list');
  const footerInfoEl = document.getElementById('bulk-footer-info');
  const execBtn = document.getElementById('btn-execute-bulk');
  const execBtnText = document.getElementById('btn-execute-bulk-text');

  if (badgeEl) {
    badgeEl.textContent = t('total_questions_badge', { count: parsed.length });
    badgeEl.style.color = parsed.length > 0 ? 'var(--primary)' : 'var(--text-muted)';
    badgeEl.style.fontWeight = parsed.length > 0 ? '700' : '500';
  }

  if (typeBadgesEl) {
    if (parsed.length === 0) {
      typeBadgesEl.innerHTML = '';
    } else {
      const counts = { multiple: 0, true_false: 0, classic: 0 };
      parsed.forEach(q => { if (counts[q.type] !== undefined) counts[q.type]++; });
      const parts = [];
      if (counts.multiple > 0) parts.push(`<span class="type-mini-badge">${counts.multiple} ${isEn ? 'MCQ' : 'Test'}</span>`);
      if (counts.true_false > 0) parts.push(`<span class="type-mini-badge">${counts.true_false} ${isEn ? 'T/F' : 'D/Y'}</span>`);
      if (counts.classic > 0) parts.push(`<span class="type-mini-badge">${counts.classic} ${isEn ? 'Classic' : 'Klasik'}</span>`);
      typeBadgesEl.innerHTML = parts.join('');
    }
  }

  if (execBtn) {
    execBtn.disabled = (parsed.length === 0);
  }
  if (execBtnText) {
    execBtnText.textContent = parsed.length > 0 
      ? t('btn_execute_bulk', { count: parsed.length }) 
      : t('btn_execute_bulk', { count: 0 });
  }

  if (footerInfoEl) {
    if (parsed.length === 0) {
      footerInfoEl.innerHTML = `<i data-lucide="info" style="width:16px; height:16px;"></i> ${t('bulk_footer_info_empty')}`;
    } else {
      footerInfoEl.innerHTML = `<i data-lucide="check-circle" style="width:16px; height:16px; color:var(--success);"></i> <strong>${parsed.length}</strong> ${isEn ? 'questions parsed successfully.' : 'adet soru başarıyla ayrıştırıldı.'}`;
    }
  }

  if (listEl) {
    if (parsed.length === 0) {
      listEl.innerHTML = `
        <div class="bulk-empty-state">
          <div class="bulk-empty-icon"><i data-lucide="file-search"></i></div>
          <div class="bulk-empty-title">${t('bulk_empty_title')}</div>
          <div class="bulk-empty-desc">${t('bulk_empty_desc')}</div>
        </div>
      `;
    } else {
      listEl.innerHTML = parsed.map((q, idx) => {
        let typeLabel = t('type_multiple');
        if (q.type === 'true_false') typeLabel = t('type_tf');
        if (q.type === 'classic') typeLabel = t('type_classic');

        let optionsHtml = '';
        if (q.options && q.options.length > 0) {
          optionsHtml = `
            <div class="bulk-options-chips">
              ${q.options.map(opt => {
                const isCorrect = (opt.letter === q.correctAnswer);
                return `
                  <span class="bulk-opt-chip ${isCorrect ? 'correct' : ''}">
                    <strong>${opt.letter})</strong> <span>${escapeHTML(opt.text || '')}${isCorrect ? ' ✓' : ''}</span>
                  </span>
                `;
              }).join('')}
            </div>
          `;
        } else if (q.type === 'classic' && q.correctAnswer) {
          optionsHtml = `
            <div class="bulk-card-explanation" style="color:var(--text-main); font-style:normal;">
              <strong>${isEn ? 'Expected Answer:' : 'Beklenen Cevap:'}</strong> <span>${escapeHTML(q.correctAnswer)}</span>
            </div>
          `;
        }

        let expHtml = '';
        if (q.explanation) {
          expHtml = `
            <div class="bulk-card-explanation">
              <i data-lucide="help-circle" style="width:12px; height:12px; flex-shrink:0; margin-top:2px;"></i> <span>${escapeHTML(q.explanation)}</span>
            </div>
          `;
        }

        return `
          <div class="bulk-preview-card">
            <div class="bulk-card-top">
              <span class="bulk-card-index">
                <span class="badge" style="background:var(--primary); color:#fff; font-size:0.7rem; padding:1px 6px; border-radius:10px;">${idx + 1}</span>
                ${isEn ? 'Question' : 'Soru'} ${idx + 1}
              </span>
              <span class="bulk-card-type-tag">${typeLabel}</span>
            </div>
            <div class="bulk-card-title">${escapeHTML(q.text || (isEn ? '(Empty question text)' : '(Soru metni boş)'))}</div>
            ${optionsHtml}
            ${expHtml}
          </div>
        `;
      }).join('');
    }
  }

  lucide.createIcons();
}

function preProcessCondensedText(raw) {
  if (!raw) return '';
  let text = String(raw).replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 1. Bitişik Soru Başlıklarını Ayır (Örn: "...alanına girer.Soru 2: AAA...")
  text = text.replace(/(?<=[^\n])(?=(?:(?:Soru|Question)\s*\d+[\s\.:\-_]|(?<![A-Za-zÇçĞğİıÖöŞşÜü])Q\s*\d+[\.:\-_]))/gi, '\n\n');

  // Aynı satırda cümle sonundan hemen sonra gelen numaralı soru başlıkları (Örn: "...ifade eder? 2. ...")
  // Küçük harfle devam eden sıra sayılarını ("20. yüzyılda", "2. katta") ve tarihsel/özel tamlamaları ("1. Dünya", "1. Murat") bölmez.
  text = text.replace(
    /(?<!(?:Soru|Question|Q)\s*)(?<=[.?!;:])[ \t]+(?=\d{1,3}[\.\)\:\-][ \t]+(?!(?:Dünya|Cihan|İnönü|Meşrutiyet|Murat|Mahmut|Selim|Bayezid|Mehmet|Ahmet|Mustafa|Süleyman|Abdülhamid|Orhan|Osman|Kılıçarslan|TBMM|Beş|Ordu|Kolordu|Kat|Derece|Bölüm|Kısım|Madde)\b)[A-ZÇĞİÖŞÜ0-9"“'(\[])/g,
    '\n\n'
  );

  // 2. Bitişik Doğru Cevap / Yanıt Satırını Ayır:
  // Örnek: "...ölçmekDoğru Cevap: B" -> "...ölçmek\nDoğru Cevap: B"
  text = text.replace(/(?<=[^\n])(?=(?:Doğru\s+)?(?:Cevap|Yanıt|Answer)\s*[:=])/gi, '\n');
  text = text.replace(/(?<=[^\n])(?=Key\s*[:=]\s*\(?[A-GDTYF]\)?(?:\s|$))/gi, '\n');

  // Doğru Cevabın hemen ardından gelen açıklamayı alt satıra al:
  // "Doğru Cevap: BA yanlıştır" veya "Cevap: B. Açıklama" gibi durumları ayırır;
  // "Cevap: Fosil yakıt..." veya "Cevap: Ankara" gibi tam kelime cevaplarını ASLA bölmez.
  text = text.replace(
    /^([ \t]*(?:Doğru\s+)?(?:Cevap|Yanıt|Answer|Key)\s*[:=]\s*\(?([A-GDTY1-5])\)?)(?:([.\-:]?[ \t]+)(?!(?:Açıklama|Çözüm|Explanation|Not)\s*[:=])([A-Za-zÇçĞğİıÖöŞşÜü"“(].*)|(?=[A-ZÇĞİÖŞÜ](?:[a-zçğıöşü]|[ \t]+))([A-ZÇĞİÖŞÜ].*))$/gm,
    (full, ansPart, ansTok, sep, spacedExp, gluedExp) => {
      if (spacedExp) {
        const isDigitToken = /^[1-5]$/.test(ansTok);
        const hasPunctSep = /^[.\-:]/.test(sep || '');
        const startsUpper = /^[A-ZÇĞİÖŞÜ"“(]/.test(spacedExp);
        if (isDigitToken && !hasPunctSep) return full;
        if (!hasPunctSep && !startsUpper) return full;
      }
      const exp = (spacedExp || gluedExp || '').trim();
      return exp ? `${ansPart}\nAçıklama: ${exp}` : full;
    }
  );

  // 3. Yapışık (boşluksuz) şıkları ayır:
  // Örnek: "...uyumunu doğrulamakB) Sistemin..." -> "...uyumunu doğrulamak\nB) Sistemin..."
  // Yalnızca "B)", "(B)", "[B]" gibi biçimlerde ve öncesi büyük harf/parantez/boşluk değilken çalışır;
  // "E-posta", "A.Ş.", "Amaç:", "D.T.C.F.", "veya (A)" ve satır başı "\n(A)" ifadelerini bölmez.
  text = text.replace(
    /(?<=[^\n\s])(?<![A-ZÇĞİÖŞÜ(\[\*\✓])(?=(?:[\*\✓][ \t]*)?(?:\([A-G]\)|\[[A-G]\]|[A-G]\))(?:\s+(?=[A-Za-zÇçĞğİıÖöŞşÜü0-9\$\("“'(\[])|(?=[A-Za-zÇçĞğİıÖöŞşÜü0-9\$\("“'])))/g,
    '\n'
  );

  return text;
}

const VALID_OPTION_SEQUENCES = {
  A: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  D: ['D', 'Y'],
  T: ['T', 'F']
};

function parseOptionLine(line) {
  if (!line) return null;
  // Yalnızca geçerli şık harfleri: A-G, D/Y, T/F (I, X, Ç vb. şık olarak algılanmaz!)
  // Nokta, iki nokta veya tire sonrası boşluk ya da satır sonu gerektirir ("A.Ş.", "E-posta", "e.g." elenir).
  const m = line.match(
    /^([\*\✓]|\([xX✓]\))?\s*(?:\(([A-Ga-gDYdyTFtf])\)|\[([A-Ga-gDYdyTFtf])\]|([A-Ga-gDYdyTFtf])(?:\)|[\.\:\-](?=\s|$)))(\*)?\s*(.*)$/
  );
  if (!m) return null;

  const letter = (m[2] || m[3] || m[4]).toUpperCase();
  const hasLeadingStar = !!(m[1] || m[5]);
  const text = (m[6] || '').trim();
  return { letter, hasLeadingStar, text };
}

function isValidOptionLetterChain(letters) {
  if (!letters || letters.length < 2) return false;
  const first = letters[0];
  const expected = VALID_OPTION_SEQUENCES[first];
  if (!expected || letters.length > expected.length) return false;
  for (let i = 0; i < letters.length; i++) {
    if (letters[i] !== expected[i]) return false;
  }
  return true;
}

function findValidOptionSequence(lines, startSearchIdx = 0) {
  const candidates = [];
  for (let i = startSearchIdx; i < lines.length; i++) {
    const parsed = parseOptionLine(lines[i]);
    if (parsed) {
      candidates.push({ lineIdx: i, ...parsed });
    }
  }
  if (candidates.length < 2) return null;

  // Sondan başa doğru en son geçerli ardışık şık dizisini bul (A, B, C... veya D, Y / T, F)
  // Böylece soru kökünde yer alan tekil "A. ...", "(A)", "A: ..." ifadeleri şık sanılmaz.
  for (let start = candidates.length - 2; start >= 0; start--) {
    if (!VALID_OPTION_SEQUENCES[candidates[start].letter]) continue;
    for (let end = candidates.length; end >= start + 2; end--) {
      const slice = candidates.slice(start, end);
      if (isValidOptionLetterChain(slice.map(c => c.letter))) {
        // Sondaki gerçek şık grubu olduğundan emin ol (ardında şık olmayan bir başka şık adayını bırakma)
        if (end === candidates.length) {
          return slice;
        }
      }
    }
  }

  // Eğer sonda tek bir sahte aday kaldıysa en uzun geçerli diziyi bul
  let best = null;
  for (let start = candidates.length - 2; start >= 0; start--) {
    if (!VALID_OPTION_SEQUENCES[candidates[start].letter]) continue;
    for (let end = candidates.length; end >= start + 2; end--) {
      const slice = candidates.slice(start, end);
      if (isValidOptionLetterChain(slice.map(c => c.letter))) {
        if (!best || slice.length > best.length) {
          best = slice;
        }
      }
    }
  }
  return best;
}

function expandInlineOptionsInBlockLines(rawLines) {
  const result = [];
  const candidateRe = /(?:(?<=^)|(?<=\S)[ \t]+|(?<=[^\n\sA-ZÇĞİÖŞÜ(\[\*\✓])(?=(?:[\*\✓][ \t]*)?(?:\([A-G]\)|\[[A-G]\]|[A-G]\))))([\*\✓]?[ \t]*(?:\(([A-Ga-gDYdyTFtf])\)|\[([A-Ga-gDYdyTFtf])\]|([A-Ga-gDYdyTFtf])(?:\)|[\.\:\-](?=[ \t]|$)))(\*?))/g;

  for (let idx = 0; idx < rawLines.length; idx++) {
    const line = rawLines[idx];
    const remainingHasChain = !!findValidOptionSequence(rawLines, idx + 1);
    const nextLineParsed = idx + 1 < rawLines.length ? parseOptionLine(rawLines[idx + 1]) : null;
    const nextLineStartsOption = !!nextLineParsed;

    // Eğer sonraki satırlarda zaten eksiksiz bir şık dizisi (A, B, C...) varsa
    // ve sonraki satır B/Y/F ile başlamıyorsa bu satırı gereksiz yere bölme.
    if (remainingHasChain && !(nextLineParsed && ['B', 'Y', 'F'].includes(nextLineParsed.letter))) {
      result.push(line);
      continue;
    }

    const matches = [];
    let m;
    candidateRe.lastIndex = 0;
    while ((m = candidateRe.exec(line)) !== null) {
      const letter = (m[2] || m[3] || m[4]).toUpperCase();
      // Küçük harf ise satır içi bölme için mutlaka boşlukla ayrılmış olmalı (kelime sonu parantezleri bozmaz)
      const rawLetter = m[2] || m[3] || m[4];
      const isLower = rawLetter !== rawLetter.toUpperCase();
      const charBefore = m.index > 0 ? line[m.index - 1] : '';
      if (isLower && m.index > 0 && !/[ \t]/.test(charBefore)) continue;

      matches.push({ index: m.index, letter });
    }

    if (matches.length === 0) {
      result.push(line);
      continue;
    }

    let splitIndices = null;

    // Durum 1: Aynı satırda geçerli ardışık şık dizisi (A) ... B) ... C) ... D) ...)
    for (let s = matches.length - 2; s >= 0; s--) {
      if (!VALID_OPTION_SEQUENCES[matches[s].letter]) continue;
      for (let e = matches.length; e >= s + 2; e--) {
        const slice = matches.slice(s, e);
        if (isValidOptionLetterChain(slice.map(x => x.letter)) && e === matches.length) {
          splitIndices = slice.map(x => x.index).filter(pos => pos > 0);
          break;
        }
      }
      if (splitIndices) break;
    }

    // Durum 2: Bu satırın sonunda tek A) / D) / T) var ve bir sonraki satır B) / Y) / F) ile devam ediyor
    if (!splitIndices && nextLineStartsOption) {
      const expectedFirst = nextLineParsed.letter === 'B' ? 'A'
        : nextLineParsed.letter === 'Y' ? 'D'
        : nextLineParsed.letter === 'F' ? 'T'
        : null;
      if (expectedFirst) {
        for (let k = matches.length - 1; k >= 0; k--) {
          if (matches[k].letter === expectedFirst && matches[k].index > 0) {
            splitIndices = [matches[k].index];
            break;
          }
        }
      }
    }

    if (!splitIndices || splitIndices.length === 0) {
      result.push(line);
      continue;
    }

    let prev = 0;
    splitIndices.forEach(pos => {
      const part = line.slice(prev, pos).trim();
      if (part) result.push(part);
      prev = pos;
    });
    const tail = line.slice(prev).trim();
    if (tail) result.push(tail);
  }

  return result;
}

function extractBottomAnswerKey(text) {
  const answerKeyMap = {};
  const lines = text.split('\n');
  const keyHeaderRe = /^\s*(?:Cevap\s*Anahtar[ıi]|Yan[ıi]t\s*Anahtar[ıi]|Cevaplar|Yan[ıi]tlar|Answers?|Answer\s*Key)\s*[:=]?\s*(.*)$/i;
  const pairRe = /(?:^|[\s,;\|]+)(\d{1,3})\s*(?:[\.\-\:\)\/]\s*|\s+)\(?([A-GDTYF])\)?(?=$|[\s,;\|.])/gi;

  for (let i = lines.length - 1; i >= 0; i--) {
    const m = lines[i].match(keyHeaderRe);
    if (!m) continue;

    const tailLines = lines.slice(i + 1).map(l => l.trim()).filter(Boolean);
    // Arkasında gerçek şıklı sorular devam ediyorsa metin ortasındaki başlığı kesme
    const looksLikeQuestionsFollow = tailLines.some(l => /^\s*[\*\✓]?\s*(?:\([A-G]\)|\[[A-G]\]|[A-G][\.\)\:])\s+\S/.test(l));
    if (looksLikeQuestionsFollow) continue;

    const tailText = [m[1] || '', ...lines.slice(i + 1)].join('\n').trim();
    if (!tailText) continue;

    const pairs = [...tailText.matchAll(pairRe)];
    if (pairs.length >= 1) {
      pairs.forEach(p => {
        const qNum = parseInt(p[1], 10);
        const ans = p[2].toUpperCase();
        answerKeyMap[qNum] = ans;
      });
      return {
        text: lines.slice(0, i).join('\n').trim(),
        answerKeyMap
      };
    }
  }

  return { text, answerKeyMap };
}

function chunkHasOptionsOrAnswer(rawLines) {
  const lines = expandInlineOptionsInBlockLines(rawLines.map(l => l.trim()).filter(Boolean));
  const hasAnswerLine = lines.some(l => /^(?:Doğru\s*)?(?:Cevap|Yan[ıi]t|Doğru\s*Seçenek|Answer|Key)\s*[:=]/i.test(l));
  if (hasAnswerLine) return true;
  return !!findValidOptionSequence(lines, 0);
}

function splitTextIntoQuestionBlocks(text) {
  const lines = text.split('\n');
  const explicitHeaderRe = /^\s*(?:Soru|Question|Q)[\s\.:\-_]*(\d+)(?:[\s\.:\-_]+(.*)|$)/i;
  const numericHeaderRe = /^\s*(?:(\d{1,3})[\.\)\:\/\-_]|\[(\d{1,3})\]|\((\d{1,3})\))\s*(.*)$/;

  // 1. Ham satır parçalarına (chunks) ayır
  const chunks = [];
  let curChunk = { kind: 'unnumbered', num: null, lines: [] };
  let prevOuterNumSeen = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Yatay ayırıcı çizgiler (---, ===) soruları net biçimde böler
    if (/^\s*[-=_]{3,}\s*$/.test(line)) {
      if (curChunk.lines.some(l => l.trim() !== '')) {
        chunks.push(curChunk);
        curChunk = { kind: 'unnumbered', num: null, lines: [] };
      }
      continue;
    }

    const expM = line.match(explicitHeaderRe);
    if (expM) {
      if (curChunk.lines.some(l => l.trim() !== '')) chunks.push(curChunk);
      const num = parseInt(expM[1], 10);
      prevOuterNumSeen = num;
      curChunk = { kind: 'explicit', num, lines: [line] };
      continue;
    }

    const numM = line.match(numericHeaderRe);
    if (numM) {
      const num = parseInt(numM[1] || numM[2] || numM[3], 10);
      const rest = (numM[4] || '').trim();
      const startsLower = /^[a-zçğıöşü]/.test(rest);
      const isJumpedProseOrdinal = startsLower && num !== 1 && num !== prevOuterNumSeen + 1;

      if (!isJumpedProseOrdinal) {
        if (curChunk.lines.some(l => l.trim() !== '')) chunks.push(curChunk);
        prevOuterNumSeen = Math.max(prevOuterNumSeen, num);
        curChunk = { kind: 'numeric', num, lines: [line] };
        continue;
      }
    }

    // Tamamlanmış bir sorudan sonra boş satır ve ardından yeni bir numarasız soru başlıyorsa ayır
    if (line.trim() === '' && curChunk.lines.some(l => l.trim() !== '') && chunkHasOptionsOrAnswer(curChunk.lines)) {
      let nextIdx = i + 1;
      while (nextIdx < lines.length && lines[nextIdx].trim() === '') nextIdx++;
      if (nextIdx < lines.length) {
        const nextTrim = lines[nextIdx].trim();
        const nextStartsHeader = explicitHeaderRe.test(nextTrim) || numericHeaderRe.test(nextTrim);
        const nextStartsMetaOrOpt = !!parseOptionLine(nextTrim) ||
          /^(?:Doğru\s*)?(?:Cevap|Yan[ıi]t|Doğru\s*Seçenek|Açıklama|Çözüm|Answer|Explanation|Not|Key)\s*[:=]/i.test(nextTrim);
        if (!nextStartsHeader && !nextStartsMetaOrOpt) {
          const paraLines = [];
          for (let k = nextIdx; k < lines.length; k++) {
            const kt = lines[k].trim();
            if (kt === '' || explicitHeaderRe.test(kt) || numericHeaderRe.test(kt)) break;
            paraLines.push(lines[k]);
          }
          const curHasExplanation = curChunk.lines.some(l => /^\s*(?:Açıklama|Çözüm|Explanation|Not)\s*[:=]/i.test(l));
          const nextParaHasOptsOrAns = chunkHasOptionsOrAnswer(paraLines);
          const nextParaEndsQuestion = paraLines.length > 0 && /\?\s*$/.test(paraLines[paraLines.length - 1].trim());
          if (!curHasExplanation || nextParaHasOptsOrAns || nextParaEndsQuestion) {
            chunks.push(curChunk);
            curChunk = { kind: 'unnumbered', num: null, lines: [] };
            i = nextIdx - 1;
            continue;
          }
        }
      }
    }

    curChunk.lines.push(line);
  }
  if (curChunk.lines.some(l => l.trim() !== '')) chunks.push(curChunk);

  // Eğer hiçbir numaralı soru başlığı yoksa boş satır / ayırıcı çizgi ile böl
  const hasNumberedChunk = chunks.some(c => c.kind !== 'unnumbered');
  if (!hasNumberedChunk) {
    const rawParts = text.split(/(?:\n\s*){2,}|(?:\n[-=_]{3,}(?:\n)?)/).map(p => p.trim()).filter(Boolean);
    const mergedParts = [];
    for (const part of rawParts) {
      const firstLine = part.split('\n')[0].trim();
      const startsWithOptOrAns = !!parseOptionLine(firstLine) ||
        /^(?:Doğru\s*)?(?:Cevap|Yan[ıi]t|Doğru\s*Seçenek|Açıklama|Çözüm|Answer|Explanation|Key)\s*[:=]/i.test(firstLine);
      if (startsWithOptOrAns && mergedParts.length > 0) {
        mergedParts[mergedParts.length - 1] += '\n' + part;
      } else {
        mergedParts.push(part);
      }
    }
    return mergedParts;
  }

  // 2. Soru içi 1., 2., 3. öncül bloklarını aktif soruya birleştir
  const grouped = [];
  for (let idx = 0; idx < chunks.length; idx++) {
    const c = chunks[idx];
    const cCompleted = chunkHasOptionsOrAnswer(c.lines);

    if (grouped.length === 0) {
      grouped.push({
        outerKind: c.kind,
        outerNum: c.num,
        hasCompletedBody: cCompleted,
        inPremiseMode: false,
        lastPremiseNum: 0,
        lines: [...c.lines]
      });
      continue;
    }

    const cur = grouped[grouped.length - 1];
    let shouldMerge = false;

    if (c.kind === 'numeric' && !cur.hasCompletedBody) {
      if (cur.inPremiseMode) {
        const isNextPremise = (c.num === cur.lastPremiseNum + 1);
        const looksLikeNextOuterQuestion = (cur.outerNum !== null && c.num === cur.outerNum + 1 && cur.lastPremiseNum >= cur.outerNum + 1);
        if (isNextPremise && !looksLikeNextOuterQuestion) {
          shouldMerge = true;
        }
      } else {
        const curLastNonEmpty = [...cur.lines].reverse().find(l => l.trim() !== '') || '';
        const curEndsWithColon = /:\s*$/.test(curLastNonEmpty);

        // İlerideki ardışık öncüller şıklara ulaşıyor mu?
        let chainReachesOptions = cCompleted;
        if (!chainReachesOptions) {
          let expectedNext = c.num + 1;
          for (let look = idx + 1; look < chunks.length; look++) {
            const nxt = chunks[look];
            if (nxt.kind !== 'numeric' || nxt.num !== expectedNext) break;
            if (chunkHasOptionsOrAnswer(nxt.lines)) {
              chainReachesOptions = true;
              break;
            }
            expectedNext++;
          }
        }

        if (cur.outerKind === 'explicit') {
          if (!cCompleted || curEndsWithColon) shouldMerge = true;
        } else if (cur.outerNum !== null && c.num <= cur.outerNum) {
          if (!cCompleted && (curEndsWithColon || chainReachesOptions || cur.outerNum === 1)) {
            shouldMerge = true;
          } else if (curEndsWithColon) {
            shouldMerge = true;
          }
        } else if (cur.outerKind === 'unnumbered' && c.num === 1 && !cCompleted && (curEndsWithColon || chainReachesOptions)) {
          shouldMerge = true;
        }
      }
    }

    if (shouldMerge) {
      cur.lines.push(...c.lines);
      cur.inPremiseMode = true;
      cur.lastPremiseNum = c.num;
      if (cCompleted) cur.hasCompletedBody = true;
    } else {
      grouped.push({
        outerKind: c.kind,
        outerNum: c.num,
        hasCompletedBody: cCompleted,
        inPremiseMode: false,
        lastPremiseNum: 0,
        lines: [...c.lines]
      });
    }
  }

  return grouped.map(g => g.lines.join('\n').trim()).filter(Boolean);
}

function parseBulkText(rawText) {
  if (!rawText || !rawText.trim()) return [];

  // Metin tek bir satırda yapışık geldiyse ön işlemden geçirerek satırlara böl
  let text = preProcessCondensedText(rawText.trim());

  // 1. Metin sonundaki Cevap Anahtarı Bloğunu Tespit Et ve Ayıkla
  const extractedKey = extractBottomAnswerKey(text);
  text = extractedKey.text;
  const answerKeyMap = extractedKey.answerKeyMap;

  // 2. Metni Soru Bloklarına Ayır (1., 2., 3. öncülleri koruyarak)
  const rawBlocks = splitTextIntoQuestionBlocks(text);

  const questions = [];

  rawBlocks.forEach((block, blockIdx) => {
    block = block.trim();
    if (!block) return;

    // 3. Cevap ve Açıklama satırlarını ayır
    let expandedBlock = block
      .replace(/(?<=\S)[ \t]+(?=(?:Doğru\s*)?(?:Cevap|Yan[ıi]t|Doğru\s*Seçenek|Açıklama|Çözüm|Answer|Explanation)\s*[:=])/gi, '\n')
      .replace(/(?<=\S)[ \t]+(?=Key\s*[:=]\s*\(?[A-GDTYF]\)?(?:\s|$))/gi, '\n');

    const rawLines = expandedBlock.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (rawLines.length === 0) return;

    // Yan yana şıkları yalnızca gerçek şık dizisi varsa ayrı satırlara genişlet
    const lines = expandInlineOptionsInBlockLines(rawLines);
    if (lines.length === 0) return;

    // 4. Soru Başlığı ve Numarası
    let qNumber = null;
    let firstLineStem = '';
    const firstLineMatch = lines[0].match(/^\s*(?:(?:Soru|Question|Q)[\s\.:\-_]*(\d+)|(\d+)[\.\)\:\/\-_]|\[(\d+)\]|\((\d+)\))\s*(.*)/i);
    if (firstLineMatch) {
      qNumber = parseInt(firstLineMatch[1] || firstLineMatch[2] || firstLineMatch[3] || firstLineMatch[4], 10);
      firstLineStem = firstLineMatch[5].trim();
    } else {
      firstLineStem = lines[0];
      qNumber = blockIdx + 1;
    }
    firstLineStem = firstLineStem.replace(/^[\s\.\:\-_/]+/, '').trim();

    // Alt kısımdaki Cevap ve Açıklama satırlarını topla
    const contentLines = [firstLineStem];
    let rawAnswerValue = null;
    let explanation = '';
    let metaMode = null;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const ansMatch = line.match(/^(?:Doğru\s*)?(?:Cevap|Yan[ıi]t|Doğru\s*Seçenek|Answer|Key)\s*[:=]\s*(.+)$/i);
      const expMatch = line.match(/^(?:Açıklama|Çözüm|Explanation|Not)\s*[:=]\s*(.*)$/i);

      if (ansMatch) {
        rawAnswerValue = ansMatch[1].trim();
        metaMode = 'answer';
      } else if (expMatch) {
        explanation = expMatch[1].trim();
        metaMode = 'explanation';
      } else if (metaMode === 'explanation') {
        explanation += (explanation ? '\n' : '') + line;
      } else if (metaMode === 'answer') {
        rawAnswerValue += '\n' + line;
      } else {
        contentLines.push(line);
      }
    }

    // Şık dizisini yalnızca bloğun altındaki ardışık geçerli seçeneklerden (A, B, ... veya D/Y, T/F) tespit et
    const optStartSearch = firstLineStem ? 1 : 0;
    let validSeq = findValidOptionSequence(contentLines, optStartSearch);

    // Eğer ilk satırdaki soru numarasından hemen sonra A) şıkkı geldiyse (örn: "1. A) ... \n B) ...")
    if (!validSeq && firstLineStem && parseOptionLine(firstLineStem)) {
      validSeq = findValidOptionSequence(contentLines, 0);
    }

    // Soru kökü içinde sadece (A) ve (B) ifadeleri geçip ardından soru cümlesi/klasik cevap geliyorsa şık sayma
    if (validSeq && validSeq.length === 2 && !/^(?:D|T)$/i.test(validSeq[0].letter)) {
      const lastOptLineIdx = validSeq[validSeq.length - 1].lineIdx;
      const trailingLines = contentLines.slice(lastOptLineIdx + 1).map(l => l.trim()).filter(Boolean);
      const trailingText = trailingLines.join(' ');
      const hasQuestionTail = trailingLines.length > 0 && (
        /\?\s*$/.test(trailingText) ||
        /\b(?:hangisi|hangileri|açıklayınız|yazınız|belirtiniz|yorumlayınız|karşılaştırınız|nedir|nelerdir)\b/i.test(trailingText)
      );
      const isTFWords = /^(?:doğru|true)$/i.test(validSeq[0].text.trim()) && /^(?:yanlış|false)$/i.test(validSeq[1].text.trim());
      const hasClassicNonChoiceAnswer = !!(!isTFWords && rawAnswerValue &&
        !/^\(?([A-GDTYF1-5])\)?[\.\)]?$/i.test(rawAnswerValue) &&
        !/^(?:Doğru|Yanlış|True|False)$/i.test(rawAnswerValue) &&
        !/^\(?([A-G])\)?[\)\.\-:]\s+\S/i.test(rawAnswerValue) &&
        !/^([A-GDTYF])(?:\b|[\.\)])/i.test(rawAnswerValue));
      if (hasQuestionTail || (hasClassicNonChoiceAnswer && (trailingLines.length > 0 || /\?\s*$/.test(validSeq[1].text)))) {
        validSeq = null;
      }
    }

    let qText = '';
    let options = [];
    let correctAnswer = null;

    if (validSeq && validSeq.length >= 2) {
      const firstOptLineIdx = validSeq[0].lineIdx;
      const stemParts = contentLines.slice(0, firstOptLineIdx).filter(Boolean);
      qText = stemParts.join('\n').trim();

      const seqLineSet = new Map(validSeq.map((item, sIdx) => [item.lineIdx, sIdx]));

      for (let i = firstOptLineIdx; i < contentLines.length; i++) {
        if (seqLineSet.has(i)) {
          const item = validSeq[seqLineSet.get(i)];
          let optText = item.text;
          if (/[\*\✓]$|\(Doğru\)|\(True\)|\[x\]$/i.test(optText)) {
            correctAnswer = item.letter;
            optText = optText.replace(/[\*\✓]$|\(Doğru\)|\(True\)|\[x\]$/i, '').trim();
          } else if (item.hasLeadingStar) {
            correctAnswer = item.letter;
          }
          options.push({
            letter: item.letter,
            text: optText
          });
        } else if (options.length > 0) {
          options[options.length - 1].text += (options[options.length - 1].text ? ' ' : '') + contentLines[i];
        }
      }
    } else {
      // Geçerli bir şık dizisi yoksa (ör. metin içinde tek bir A. veya E-posta geçtiyse)
      // metnin HİÇBİR kısmı atılmaz, tamamı soru kökünde kalır!
      qText = contentLines.filter(Boolean).join('\n').trim();
    }

    // Cevap satırını yorumla
    if (rawAnswerValue) {
      const singleToken = rawAnswerValue.match(/^\(?([A-GDTYF1-5])\)?[\.\)]?$/i);
      const prefixedOption = rawAnswerValue.match(/^\(?([A-G])\)?[\)\.\-:]\s+\S/i);
      if (singleToken) {
        const tok = singleToken[1].toUpperCase();
        const numToLetter = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', '5': 'E' };
        correctAnswer = numToLetter[tok] || tok;
      } else if (/^(?:Doğru|True)$/i.test(rawAnswerValue)) {
        correctAnswer = options.length === 2 ? 'D' : rawAnswerValue;
      } else if (/^(?:Yanlış|False)$/i.test(rawAnswerValue)) {
        correctAnswer = options.length === 2 ? 'Y' : rawAnswerValue;
      } else if (options.length >= 2 && prefixedOption) {
        correctAnswer = prefixedOption[1].toUpperCase();
      } else if (options.length >= 2) {
        // Seçenekli soruda tek harf dışındaki uzun cevap yazılmışsa ilk eşleşen harfi dene veya metni koru
        const letterPrefix = rawAnswerValue.match(/^([A-GDTYF])(?:\b|[\.\)])/i);
        correctAnswer = letterPrefix ? letterPrefix[1].toUpperCase() : rawAnswerValue;
      } else {
        // Klasik soruda cevabın TAMAMINI koru ("Fosil yakıt kullanımı...", "Ankara" vb.)
        correctAnswer = rawAnswerValue;
      }
    }

    // 5. Cevap Anahtarı Haritasından Tamamlama
    if (!correctAnswer && qNumber && answerKeyMap[qNumber]) {
      correctAnswer = answerKeyMap[qNumber];
    }

    // 6. Soru Tipini Belirleme
    let type = 'multiple';
    if (options.length >= 2) {
      // Doğru / Yanlış kontrolü
      const isTF = (options.length === 2) && (
        (options[0].text.toLowerCase().includes('doğru') && options[1].text.toLowerCase().includes('yanlış')) ||
        (options[0].letter === 'D' && options[1].letter === 'Y') ||
        (options[0].text.toLowerCase().includes('true') && options[1].text.toLowerCase().includes('false'))
      );

      if (isTF) {
        type = 'true_false';
        options = [
          { letter: 'D', text: 'Doğru' },
          { letter: 'Y', text: 'Yanlış' }
        ];
        if (correctAnswer === 'A' || correctAnswer === '1') correctAnswer = 'D';
        if (correctAnswer === 'B' || correctAnswer === '2') correctAnswer = 'Y';
        if (!['D', 'Y'].includes(correctAnswer)) correctAnswer = 'D';
      } else {
        type = 'multiple';
        if (!correctAnswer) correctAnswer = options[0].letter;
      }

      questions.push({
        id: 'q-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        type: type,
        text: qText || 'Soru metni girilmedi',
        image: '',
        points: 10,
        options: options,
        correctAnswer: correctAnswer,
        explanation: explanation
      });
    } else {
      // Şık yok -> Klasik / Açık Uçlu soru
      questions.push({
        id: 'q-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        type: 'classic',
        text: qText || 'Soru metni girilmedi',
        image: '',
        points: 10,
        linesCount: 4,
        correctAnswer: correctAnswer || '',
        explanation: explanation
      });
    }
  });

  return questions;
}

function executeBulkImport() {
  const textarea = document.getElementById('bulk-import-textarea');
  const text = textarea ? textarea.value.trim() : '';
  if (!text) {
    showToast('Lütfen soru metinlerini giriniz.', 'error');
    return;
  }

  const parsedQuestions = parseBulkText(text);
  if (parsedQuestions.length === 0) {
    showToast('Uygun formatta soru algılanamadı. Lütfen örnek şablonları deneyin.', 'error');
    return;
  }

  parsedQuestions.forEach(q => examData.questions.push(q));
  saveData();
  renderQuestionsList();
  closeBulkModal();
  if (textarea) textarea.value = '';
  updateBulkPreview();

  if (typeof confetti === 'function') {
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch (e) {}
  }

  showToast(`🎉 ${parsedQuestions.length} adet soru başarıyla eklendi!`, 'success');
}

// ==========================================
// Toast Bildirim Sistemi
// ==========================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconName = 'info';
  if (type === 'success') iconName = 'check-circle';
  if (type === 'error') iconName = 'alert-triangle';

  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

// Global olarak erişilebilen fonksiyonlar (HTML inline onclick için)
window.goToHome = goToHome;
window.selectAppMode = selectAppMode;
window.openTemplateChoiceModal = openTemplateChoiceModal;
window.closeTemplateChoiceModal = closeTemplateChoiceModal;
window.startWithEmptyTemplate = startWithEmptyTemplate;
window.startWithSampleTemplate = startWithSampleTemplate;
window.switchTab = switchTab;
window.setZoom = setZoom;
window.toggleFullscreen = toggleFullscreen;
window.addQuestion = addQuestion;
window.deleteQuestion = deleteQuestion;
window.duplicateQuestion = duplicateQuestion;
window.moveQuestion = moveQuestion;
window.changeQuestionType = changeQuestionType;
window.updateQuestionField = updateQuestionField;
window.handleImageUpload = handleImageUpload;
window.removeQuestionImage = removeQuestionImage;
window.addOptionToQuestion = addOptionToQuestion;
window.removeOptionFromQuestion = removeOptionFromQuestion;
window.setCorrectOption = setCorrectOption;
window.updateOptionText = updateOptionText;
window.autoResizeTextarea = autoResizeTextarea;
window.openBulkModal = openBulkModal;
window.closeBulkModal = closeBulkModal;
window.executeBulkImport = executeBulkImport;
window.loadBulkSample = loadBulkSample;
window.copyAiPrompt = copyAiPrompt;
window.clearBulkText = clearBulkText;
window.updateBulkPreview = updateBulkPreview;
window.handleDigitalOptionClick = handleDigitalOptionClick;
window.handleDigitalClassicInput = handleDigitalClassicInput;
window.revealDigitalAnswer = revealDigitalAnswer;
window.prevDigitalQuestion = prevDigitalQuestion;
window.nextDigitalQuestion = nextDigitalQuestion;
window.finishDigitalTest = finishDigitalTest;
window.restartDigitalTest = restartDigitalTest;
window.addParticipantField = addParticipantField;
window.updateParticipantFieldLabel = updateParticipantFieldLabel;
window.toggleParticipantFieldRequired = toggleParticipantFieldRequired;
window.removeParticipantField = removeParticipantField;
