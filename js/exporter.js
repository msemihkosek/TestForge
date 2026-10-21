/**
 * TestForge - Dışa Aktarma Motoru (Exporter Engine)
 * HTML (İnteraktif Test), PDF, JSON ve Yazdırma Fonksiyonları
 */

const TESTFORGE_LOGO_BASE64 = "data:image/png;base64,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";

const Exporter = {
  /**
   * Tamamen bağımsız, internet bağlantısına ihtiyaç duymayan,
   * tarayıcıda doğrudan çalışan İnteraktif Test HTML dosyası üretir ve indirir.
   */
  exportInteractiveHTML(examData, lang = 'tr') {
    const isEn = (lang === 'en');
    const jsonExam = JSON.stringify(examData).replace(/<\/script>/g, '<\\/script>');
    const ui = isEn ? {
      lang: 'en',
      defaultTitle: 'Interactive Quiz',
      courseLabel: 'Subject',
      generalCourse: 'General',
      totalLabel: 'Total Questions',
      durationLabel: 'Duration',
      notSpecified: 'Not specified',
      prevBtn: '‹ Previous Question',
      finishBtn: 'Finish Exam ✓',
      nextBtn: 'Next Question ›',
      classicPlaceholder: 'Type your answer here...',
      questionWord: 'QUESTION',
      pointsWord: 'Points',
      insightHeading: 'Why Correct? / Explanation',
      whyCorrect: '💡 <strong>Why Correct? / Explanation:</strong> ',
      congratsTitle: 'Congratulations! Exam Completed 🎉',
      scoreLabel: 'FINAL SCORE',
      correctLabel: 'Correct',
      wrongLabel: 'Wrong',
      emptyLabel: 'Unanswered',
      restartBtn: 'Restart Exam',
      reviewHeading: 'Question Review & Notes',
      yourAnswer: 'Your Answer:',
      leftBlank: 'Left Blank',
      correctTag: '✓ Correct',
      wrongTag: '✗ Wrong',
      solutionTag: '💡 Solution / Explanation:',
      filenameSuffix: '_interactive_quiz.html'
    } : {
      lang: 'tr',
      defaultTitle: 'İnteraktif Test',
      courseLabel: 'Ders',
      generalCourse: 'Genel',
      totalLabel: 'Toplam Soru',
      durationLabel: 'Süre',
      notSpecified: 'Belirtilmedi',
      prevBtn: '‹ Önceki Soru',
      finishBtn: 'Sınavı Bitir ✓',
      nextBtn: 'Sonraki Soru ›',
      classicPlaceholder: 'Cevabınızı buraya yazınız...',
      questionWord: 'SORU',
      pointsWord: 'Puan',
      insightHeading: 'NEDEN DOĞRU? / ÇÖZÜM AÇIKLAMASI',
      whyCorrect: '💡 <strong>Neden Doğru? / Açıklama:</strong> ',
      congratsTitle: 'Tebrikler! Sınav Tamamlandı 🎉',
      scoreLabel: 'BAŞARI PUANI',
      correctLabel: 'Doğru',
      wrongLabel: 'Yanlış',
      emptyLabel: 'Boş',
      restartBtn: 'Sınavı Tekrar Çöz',
      reviewHeading: 'Soru İncelemesi & Öğrenme Notları',
      yourAnswer: 'Verdiğiniz Cevap:',
      leftBlank: 'Boş Bırakıldı',
      correctTag: '✓ Doğru',
      wrongTag: '✗ Yanlış',
      solutionTag: '💡 Çözüm/Açıklama:',
      filenameSuffix: '_interaktif_test.html'
    };
    
    const htmlTemplate = `<!DOCTYPE html>
<html lang="${ui.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${examData.meta.title || ui.defaultTitle}</title>
  <link rel="icon" type="image/png" href="${TESTFORGE_LOGO_BASE64}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <style>
    :root {
      --primary: #4f46e5;
      --primary-hover: #4338ca;
      --primary-light: #e0e7ff;
      --success: #10b981;
      --success-light: #d1fae5;
      --danger: #ef4444;
      --danger-light: #fee2e2;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --radius: 16px;
      --shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #0b0f19;
        --card-bg: #131b2e;
        --text: #f8fafc;
        --text-muted: #94a3b8;
        --border: #1e293b;
        --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
      }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2.5rem 1.5rem;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      width: 100%;
      max-width: 980px;
      margin: 0 auto;
    }
    .test-header {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 2rem 2.25rem;
      margin-bottom: 1.75rem;
      box-shadow: var(--shadow);
      text-align: center;
    }
    .institution-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 1.2px;
      margin-bottom: 6px;
    }
    .test-title {
      font-size: 1.85rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 12px;
      color: var(--text);
      line-height: 1.3;
    }
    .test-meta-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
      margin-top: 14px;
    }
    .pill {
      font-size: 0.9rem;
      padding: 6px 16px;
      border-radius: 999px;
      background: var(--border);
      font-weight: 600;
      color: var(--text);
    }
    .timer-pill {
      background: var(--primary);
      color: #fff;
      font-weight: 700;
    }
    .progress-bar-container {
      background: var(--border);
      height: 10px;
      border-radius: 999px;
      overflow: hidden;
      margin: 1.5rem 0 1.25rem;
    }
    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary), #06b6d4);
      width: 0%;
      transition: width 0.35s ease;
    }
    .nav-tabs {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 8px;
      margin-bottom: 0.5rem;
      scrollbar-width: thin;
      -webkit-overflow-scrolling: touch;
    }
    .q-nav-btn {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      border: 1.5px solid var(--border);
      background: var(--card-bg);
      color: var(--text);
      font-weight: 700;
      font-size: 0.98rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .q-nav-btn:hover {
      border-color: var(--primary);
      transform: translateY(-2px);
    }
    .q-nav-btn.active {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
      transform: scale(1.08);
    }
    .q-nav-btn.answered {
      border-color: var(--success);
      color: var(--success);
    }
    .q-nav-btn.active.answered {
      background: var(--primary);
      color: #fff;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 2.25rem 2.5rem;
      box-shadow: var(--shadow);
      margin-bottom: 1.75rem;
    }
    .q-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.92rem;
      font-weight: 700;
      color: var(--primary);
      background: var(--primary-light);
      padding: 5px 16px;
      border-radius: 999px;
      margin-bottom: 1.25rem;
    }
    @media (prefers-color-scheme: dark) {
      .q-badge {
        background: rgba(79, 70, 229, 0.25);
        color: #a5b4fc;
      }
    }
    .q-text {
      font-size: 1.38rem;
      font-weight: 700;
      line-height: 1.55;
      margin-bottom: 1.75rem;
      color: var(--text);
    }
    .q-image {
      max-width: 100%;
      max-height: 380px;
      object-fit: contain;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      display: block;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }
    .options-grid {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .option-btn {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 22px;
      min-height: 60px;
      border: 2px solid var(--border);
      border-radius: 14px;
      background: var(--card-bg);
      color: var(--text);
      font-size: 1.12rem;
      font-weight: 600;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      user-select: none;
    }
    .option-btn:hover {
      border-color: var(--primary);
      background: rgba(79, 70, 229, 0.03);
      transform: translateX(4px);
    }
    .option-btn:active {
      transform: scale(0.99);
    }
    .option-btn.selected {
      border-color: var(--primary);
      background: var(--primary-light);
      color: var(--primary);
      font-weight: 700;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.15);
    }
    .option-btn.is-correct {
      border-color: var(--success) !important;
      background: rgba(16, 185, 129, 0.14) !important;
      color: #065f46 !important;
    }
    .option-btn.is-wrong {
      border-color: var(--danger) !important;
      background: rgba(239, 68, 68, 0.12) !important;
      color: #991b1b !important;
    }
    .opt-key {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
      font-weight: 800;
      flex-shrink: 0;
      transition: all 0.2s;
    }
    .option-btn.selected .opt-key {
      background: var(--primary);
      color: #fff;
    }
    .option-btn.is-correct .opt-key {
      background: var(--success);
      color: #fff;
    }
    .option-btn.is-wrong .opt-key {
      background: var(--danger);
      color: #fff;
    }
    .classic-answer-box {
      width: 100%;
      padding: 16px;
      border: 2px solid var(--border);
      border-radius: 12px;
      background: var(--bg);
      color: var(--text);
      font-family: inherit;
      font-size: 1.1rem;
      line-height: 1.5;
      resize: vertical;
      min-height: 120px;
      box-sizing: border-box;
    }
    .classic-answer-box:focus {
      outline: none;
      border-color: var(--primary);
    }
    .bottom-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-top: 1.5rem;
    }
    .btn {
      padding: 14px 26px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1.05rem;
      cursor: pointer;
      border: none;
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      user-select: none;
    }
    .btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .btn:not(:disabled):hover {
      transform: translateY(-2px);
    }
    .btn-primary {
      background: var(--primary);
      color: #fff;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
    }
    .btn-primary:not(:disabled):hover { background: var(--primary-hover); }
    .btn-secondary { background: var(--border); color: var(--text); }
    .btn-success {
      background: var(--success);
      color: #fff;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
    }
    .result-view { text-align: center; padding: 3rem 2rem; }
    .score-circle {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), #06b6d4);
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.75rem;
      box-shadow: 0 12px 30px rgba(79, 70, 229, 0.4);
    }
    .score-num { font-size: 3.2rem; font-weight: 800; line-height: 1; }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin: 2rem 0;
    }
    .stat-item {
      padding: 1.25rem 1rem;
      background: var(--bg);
      border-radius: 14px;
      border: 1px solid var(--border);
    }
    .review-item {
      margin-top: 1.5rem;
      text-align: left;
      border-top: 1px solid var(--border);
      padding-top: 1.25rem;
    }
    .review-correct { color: var(--success); font-weight: 700; }
    .review-wrong { color: var(--danger); font-weight: 700; }
    .explanation-box {
      margin-top: 1.5rem;
      padding: 16px 20px;
      background: rgba(79, 70, 229, 0.08);
      border-radius: 12px;
      border-left: 4px solid var(--primary);
      font-size: 1.05rem;
      line-height: 1.6;
      color: var(--text);
    }

    /* ==========================================================================
       RESPONSIVE MOBİL CİHAZ OPTİMİZASYONU (TELEFON & TABLET)
       ========================================================================== */
    @media (max-width: 768px) {
      body {
        padding: 12px 8px;
      }
      .container {
        max-width: 100%;
      }
      .test-header {
        padding: 1.25rem 1rem;
        margin-bottom: 1rem;
        border-radius: 14px;
      }
      .institution-name {
        font-size: 0.82rem;
      }
      .test-title {
        font-size: 1.4rem;
        margin-bottom: 8px;
      }
      .test-meta-pills {
        gap: 6px;
        margin-top: 10px;
      }
      .pill {
        font-size: 0.82rem;
        padding: 4px 12px;
      }
      .nav-tabs {
        gap: 6px;
        padding-bottom: 6px;
        margin-bottom: 0.25rem;
      }
      .q-nav-btn {
        width: 40px;
        height: 40px;
        font-size: 0.92rem;
        border-radius: 8px;
      }
      .card {
        padding: 1.35rem 1.15rem;
        margin-bottom: 1rem;
        border-radius: 14px;
      }
      .q-badge {
        font-size: 0.85rem;
        padding: 4px 12px;
        margin-bottom: 1rem;
      }
      .q-text {
        font-size: 1.22rem;
        line-height: 1.5;
        margin-bottom: 1.35rem;
      }
      .q-image {
        max-height: 240px;
      }
      .options-grid {
        gap: 10px;
      }
      .option-btn {
        padding: 14px 16px;
        min-height: 54px;
        font-size: 1.02rem;
        gap: 12px;
        border-radius: 12px;
      }
      .option-btn:hover {
        transform: none;
      }
      .option-btn:active {
        transform: scale(0.97);
      }
      .opt-key {
        width: 32px;
        height: 32px;
        font-size: 0.9rem;
      }
      .classic-answer-box {
        font-size: 1rem;
        padding: 12px;
      }
      .explanation-box {
        font-size: 0.96rem;
        padding: 12px 14px;
        margin-top: 1.1rem;
      }
      .bottom-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-top: 1.15rem;
      }
      .bottom-actions #btn-prev {
        grid-column: 1 / 2;
        width: 100%;
      }
      .bottom-actions #btn-next {
        grid-column: 2 / 3;
        width: 100%;
      }
      .bottom-actions #btn-finish {
        grid-column: 1 / -1;
        width: 100%;
        order: 3;
      }
      .btn {
        padding: 13px 16px;
        font-size: 0.98rem;
        border-radius: 10px;
      }
      .result-view {
        padding: 2rem 1.25rem;
      }
      .score-circle {
        width: 130px;
        height: 130px;
        margin-bottom: 1.25rem;
      }
      .score-num {
        font-size: 2.7rem;
      }
      .stats-row {
        gap: 8px;
        margin: 1.5rem 0;
      }
      .stat-item {
        padding: 1rem 0.5rem;
      }
    }

    @media (max-width: 480px) {
      body {
        padding: 8px 4px;
      }
      .card {
        padding: 1.2rem 0.95rem;
      }
      .q-text {
        font-size: 1.18rem;
      }
      .option-btn {
        padding: 12px 14px;
        font-size: 0.98rem;
      }
      .opt-key {
        width: 30px;
        height: 30px;
      }
    }
  </style>
</head>
<body>
  <div class="container" id="app">
    <header class="test-header">
      <div style="display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom:10px;">
        <img src="${TESTFORGE_LOGO_BASE64}" style="width:26px; height:26px; border-radius:6px; box-shadow:0 2px 8px rgba(0,0,0,0.12);" alt="TestForge">
        <span style="font-size:0.85rem; font-weight:700; color:var(--primary); letter-spacing:0.8px; text-transform:uppercase;">TestForge</span>
      </div>
      <div class="institution-name">${examData.meta.institution || ''}</div>
      <h1 class="test-title">${examData.meta.title || ui.defaultTitle}</h1>
      <div class="test-meta-pills">
        <span class="pill">${ui.courseLabel}: ${examData.meta.course || ui.generalCourse}</span>
        <span class="pill">${ui.totalLabel}: ${examData.questions.length}</span>
        <span class="pill timer-pill" id="timer-display">${ui.durationLabel}: ${examData.meta.duration || ui.notSpecified}</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-fill" id="progress-bar"></div>
      </div>
      <div class="nav-tabs" id="nav-tabs"></div>
    </header>

    <main id="quiz-container">
      <div class="card" id="question-card">
        <!-- Aktif soru JS ile render edilir -->
      </div>
      <div class="bottom-actions">
        <button class="btn btn-secondary" id="btn-prev" onclick="prevQuestion()">${ui.prevBtn}</button>
        <button class="btn btn-success" id="btn-finish" onclick="finishExam()">${ui.finishBtn}</button>
        <button class="btn btn-primary" id="btn-next" onclick="nextQuestion()">${ui.nextBtn}</button>
      </div>
    </main>

    <div id="result-container" class="card result-view" style="display: none;"></div>
    <footer style="text-align:center; margin:2.2rem 0 1rem; color:var(--text-light); font-size:0.85rem; display:flex; align-items:center; justify-content:center; gap:6px;">
      <img src="${TESTFORGE_LOGO_BASE64}" style="width:16px; height:16px; border-radius:4px;" alt="TestForge">
      <span>Powered by <strong>TestForge</strong></span>
    </footer>
  </div>

  <script>
    const exam = ${jsonExam};
    const ui = ${JSON.stringify(ui)};
    let currentIndex = 0;
    const userAnswers = {};
    const revealed = {};
    let isFinished = false;

    function init() {
      renderNavTabs();
      showQuestion(0);
    }

    function renderNavTabs() {
      const container = document.getElementById('nav-tabs');
      container.innerHTML = '';
      exam.questions.forEach((q, idx) => {
        const btn = document.createElement('button');
        btn.className = 'q-nav-btn' + (idx === currentIndex ? ' active' : '') + (userAnswers[q.id] ? ' answered' : '');
        btn.textContent = (idx + 1);
        btn.onclick = () => showQuestion(idx);
        container.appendChild(btn);
      });
      updateProgressBar();
    }

    function updateProgressBar() {
      const answeredCount = Object.keys(userAnswers).length;
      const pct = (answeredCount / exam.questions.length) * 100;
      document.getElementById('progress-bar').style.width = pct + '%';
    }

    function showQuestion(idx) {
      if (idx < 0 || idx >= exam.questions.length) return;
      currentIndex = idx;
      const q = exam.questions[idx];
      const card = document.getElementById('question-card');
      const isRevealed = !!revealed[q.id];

      let optionsHtml = '';
      if (q.type === 'multiple' || q.type === 'true_false') {
        optionsHtml = '<div class="options-grid">' + q.options.map(opt => {
          const isSelected = userAnswers[q.id] === opt.letter;
          let extraClass = '';
          if (isRevealed) {
            if (opt.letter === q.correctAnswer) extraClass = 'is-correct';
            else if (isSelected) extraClass = 'is-wrong';
          }
          return \`
            <div class="option-btn \${extraClass} \${isSelected ? 'selected' : ''}" onclick="selectAnswer('\${q.id}', '\${opt.letter}')">
              <span class="opt-key">\${opt.letter}</span>
              <span style="flex:1;">\${opt.text}</span>
              \${isRevealed && opt.letter === q.correctAnswer ? '<span style="color:var(--success); font-weight:bold;">✓</span>' : ''}
              \${isRevealed && isSelected && opt.letter !== q.correctAnswer ? '<span style="color:var(--danger); font-weight:bold;">✗</span>' : ''}
            </div>
          \`;
        }).join('') + '</div>';
      } else {
        const currentText = userAnswers[q.id] || '';
        optionsHtml = \`
          <textarea class="classic-answer-box" placeholder="Cevabınızı buraya yazınız..." oninput="recordClassicAnswer('\${q.id}', this.value)">\${currentText}</textarea>
        \`;
      }

      const insightBlock = (isRevealed && q.explanation) ? \`
        <div class="explanation-box">
          \${ui.whyCorrect} \${q.explanation}
        </div>
      \` : '';

      card.innerHTML = \`
        <div class="q-badge">\${ui.questionWord} \${idx + 1} / \${exam.questions.length} (\${q.points || 10} \${ui.pointsWord})</div>
        <div class="q-text">\${q.text}</div>
        \${q.image ? \`<img src="\${q.image}" class="q-image" alt="Question Image">\` : ''}
        \${optionsHtml}
        \${insightBlock}
      \`;

      document.getElementById('btn-prev').disabled = (idx === 0);
      document.getElementById('btn-next').disabled = (idx === exam.questions.length - 1);
      renderNavTabs();
    }

    function selectAnswer(qId, letter) {
      userAnswers[qId] = letter;
      revealed[qId] = true;
      showQuestion(currentIndex);
    }

    function recordClassicAnswer(qId, text) {
      userAnswers[qId] = text;
      renderNavTabs();
    }

    function prevQuestion() {
      if (currentIndex > 0) showQuestion(currentIndex - 1);
    }

    function nextQuestion() {
      if (currentIndex < exam.questions.length - 1) showQuestion(currentIndex + 1);
    }

    function finishExam() {
      const unanswered = exam.questions.length - Object.keys(userAnswers).length;
      if (unanswered > 0) {
        if (!confirm(\`Henüz cevaplamadığınız \${unanswered} soru var. Sınavı yine de bitirmek istiyor musunuz?\`)) {
          return;
        }
      } else {
        if (!confirm('Sınavı tamamlayıp sonuçlarınızı görmek istiyor musunuz?')) return;
      }

      isFinished = true;
      document.getElementById('quiz-container').style.display = 'none';
      document.getElementById('nav-tabs').style.display = 'none';

      let correctCount = 0;
      let wrongCount = 0;
      let emptyCount = 0;
      let totalEarnedPoints = 0;
      let maxTotalPoints = 0;

      exam.questions.forEach(q => {
        const points = Number(q.points) || 10;
        maxTotalPoints += points;
        const studentAns = userAnswers[q.id];

        if (!studentAns) {
          emptyCount++;
        } else if (q.type === 'multiple' || q.type === 'true_false') {
          if (studentAns === q.correctAnswer) {
            correctCount++;
            totalEarnedPoints += points;
          } else {
            wrongCount++;
          }
        } else {
          // Klasik soru
          correctCount++;
          totalEarnedPoints += points;
        }
      });

      const scorePct = maxTotalPoints > 0 ? Math.round((totalEarnedPoints / maxTotalPoints) * 100) : 0;
      if (scorePct >= 70 && typeof confetti === 'function') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }

      const resDiv = document.getElementById('result-container');
      resDiv.style.display = 'block';
      resDiv.innerHTML = \`
        <div class="score-circle">
          <div class="score-num">\${scorePct}</div>
          <div style="font-size: 0.8rem; font-weight:600;">\${ui.scoreLabel}</div>
        </div>
        <h2>\${ui.congratsTitle}</h2>
        <div class="stats-row">
          <div class="stat-item"><div style="color:var(--success); font-size:1.5rem; font-weight:800;">\${correctCount}</div><div>\${ui.correctLabel}</div></div>
          <div class="stat-item"><div style="color:var(--danger); font-size:1.5rem; font-weight:800;">\${wrongCount}</div><div>\${ui.wrongLabel}</div></div>
          <div class="stat-item"><div style="color:var(--text-muted); font-size:1.5rem; font-weight:800;">\${emptyCount}</div><div>\${ui.emptyLabel}</div></div>
        </div>
        <h3 style="text-align:left; margin-top:2rem; margin-bottom:1rem;">\${ui.reviewHeading}</h3>
        \${exam.questions.map((q, idx) => {
          const userAns = userAnswers[q.id];
          const isCorrect = userAns === q.correctAnswer;
          return \`
              <div class="review-item">
                <div style="font-weight:700; margin-bottom:4px;">\${idx + 1}. \${q.text}</div>
                <div style="font-size:0.9rem;">
                  \${ui.yourAnswer} <strong>\${userAns || ui.leftBlank}</strong> 
                  \${q.type !== 'classic' ? (isCorrect ? '<span class="review-correct">' + ui.correctTag + '</span>' : '<span class="review-wrong">' + ui.wrongTag + ' (' + ui.correctLabel + ': ' + q.correctAnswer + ')</span>') : ''}
                </div>
                \${q.explanation ? \`<div class="explanation-box">\${ui.solutionTag} \${q.explanation}</div>\` : ''}
              </div>
          \`;
        }).join('')}
      \`;
    }

    window.onload = init;
  </script>
</body>
</html>`;

    const blob = new Blob([htmlTemplate], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanTitle = (examData.meta.title || 'test').toLowerCase().replace(/[^a-z0-9]/gi, '_');
    a.download = `${cleanTitle}${ui.filenameSuffix}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Sınav Kağıdını doğrudan profesyonel A4 PDF formatında indirir.
   */
  exportPDF(elementId, examTitle) {
    const element = document.getElementById(elementId);
    if (!element) {
      alert("Sınav kağıdı elementi bulunamadı!");
      return;
    }

    const cleanTitle = (examTitle || 'sinav').toLowerCase().replace(/[^a-z0-9]/gi, '_');

    // Eğer html2pdf yüklüyse
    if (window.html2pdf) {
      const opt = {
        margin: [8, 10, 8, 10], // mm
        filename: `${cleanTitle}_sinav_kagidi.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      html2pdf().set(opt).from(element).save();
    } else {
      // html2pdf henüz yüklenmediyse doğrudan yazdırma penceresini aç
      window.print();
    }
  },

  /**
   * JSON olarak projeyi kaydeder.
   */
  exportJSON(examData) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(examData, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    const cleanTitle = (examData.meta.title || 'sinav_projesi').toLowerCase().replace(/[^a-z0-9]/gi, '_');
    a.download = `${cleanTitle}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },

  /**
   * Tarayıcı yazdırma modunu tetikler (@media print devreye girer).
   */
  printExam() {
    window.print();
  }
};
