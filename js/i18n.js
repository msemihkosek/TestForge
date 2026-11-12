/**
 * TestForge - Çoklu Dil Motoru (i18n System)
 * Türkçe (Varsayılan) ve İngilizce Destekler
 */

const TRANSLATIONS = {
  tr: {
    // Marka & Genel
    brand_name: "TestForge",
    app_title: "TestForge - Profesyonel Soru & Sınav Hazırlama Aracı",
    meta_description: "Kolayca soru ve cevaplar ekleyerek çoktan seçmeli, klasik veya doğru-yanlış testleri hazırlayın. PDF ve İnteraktif HTML olarak anında dışa aktarın.",
    brand_tooltip: "Ana Sayfaya Dön (Mod Seçimi)",
    theme_toggle_title: "Temayı Değiştir",

    // Üst Menü Aksiyon Butonları
    export_pdf: "PDF İndir",
    export_pdf_title: "A4 Sınav Kağıdını PDF olarak indir",
    export_html: "İnteraktif HTML İndir",
    export_html_title: "İnternetsiz de çalışan interaktif test dosyası",
    print_btn: "Yazdır",
    print_btn_title: "Doğrudan Yazdır (Ctrl+P)",

    // Karşılama Ekranı (Landing View)
    landing_badge: "TestForge Çalışma Alanı",
    landing_title: "Nasıl Bir Çalışma Yapmak İstiyorsunuz?",
    landing_subtitle: "İhtiyacınıza uygun çalışma formatını seçin. İstediğiniz an sol üstteki TestForge logosuna tıklayarak bu ekrana dönebilirsiniz.",
    
    card_test_badge: "İnteraktif & Dijital",
    card_test_title: "Test Oluştur",
    card_test_desc: "Okul ve sınav başlığı karmaşası olmadan, doğrudan sorularınızı ekleyin ve internetsiz de çalışan dijital bir test oluşturun.",
    card_test_feat1: "Sadeleştirilmiş, doğrudan soru ekleme alanı",
    card_test_feat2: "Tıklamada anında doğru / yanlış geri bildirimi",
    card_test_feat3: "Çözüm ve açıklama notları (İpuçları)",
    card_test_feat4: "Tarayıcıda doğrudan çalışan tek dosya HTML çıktısı",
    card_test_btn: "Test Oluştur",

    card_paper_badge: "A4 Baskı & PDF",
    card_paper_title: "Sınav Kağıdı Oluştur",
    card_paper_desc: "MEB ve okul formatında klasik yazılı sınav kağıdı hazırlayın. Boş bırakılan alanlar otomatik gizlenir.",
    card_paper_feat1: "1 veya 2 Sütunlu gerçek A4 sayfa düzeni",
    card_paper_feat2: "Akıllı kurum başlığı ve öğrenci bilgi kutucukları",
    card_paper_feat3: "Optik form ve otomatik cevap anahtarı",
    card_paper_feat4: "Vektörel PDF indirme ve doğrudan yazdırma",
    card_paper_btn: "Sınav Kağıdı Oluştur",

    // Sol Panel & Sekmeler
    tab_questions: "Sorular",
    tab_settings: "Sınav Ayarları & Başlık",
    tab_test_settings: "Test Ayarları",
    card_add_question: "Yeni Soru Ekle",
    type_multiple: "Çoktan Seçmeli",
    type_tf: "Doğru / Yanlış",
    type_classic: "Klasik",
    btn_bulk_import: "Metinden Toplu Soru Ekle (Akıllı Ayrıştırıcı)",
    total_questions_badge: "{count} Soru",

    // Sınav Ayarları Sekmesi
    settings_header_title: "Sınav Kağıdı Üst Bilgisi",
    settings_header_desc: "Boş bıraktığınız alanlar sınav kağıdında otomatik olarak gizlenir.",
    lbl_institution: "Kurum / Okul Adı",
    placeholder_institution: "Örn: ATATÜRK ANADOLU LİSESİ",
    lbl_title: "Sınav Başlığı",
    placeholder_title: "Örn: 1. DÖNEM 2. YAZILI SINAVI",
    lbl_course: "Ders Adı",
    placeholder_course: "Örn: Fen Bilimleri",
    lbl_grade: "Sınıf / Şube",
    placeholder_grade: "Örn: 10/A Sınıfı",
    lbl_duration: "Sınav Süresi",
    placeholder_duration: "Örn: 40 Dakika",
    lbl_date: "Sınav Tarihi",
    placeholder_date: "Örn: 21.10.2025",
    lbl_instructions: "Sınav Yönergesi",
    placeholder_instructions: "Sınav kuralları ve yönergesi...",
    settings_components_title: "Kağıt Bileşenleri & Görünüm",
    chk_student_info: "Öğrenci Bilgi Alanını Göster (Ad-Soyad, No vb.)",
    chk_score: "Öğrenci Puan Kutucuğunu Göster",
    chk_answer_key: "Kağıt Sonunda Cevap Anahtarını Göster",
    chk_optical: "Optik İşaretleme Formu Ekle",

    // Test Modu Ayarları
    test_settings_info_title: "Test Bilgileri & Süre",
    test_settings_info_desc: "Test adı, ders ve süre ayarları canlı önizlemeye ve indirilen HTML dosyasına doğrudan uygulanır.",
    lbl_test_title: "Test İsmi / Başlığı",
    placeholder_test_title: "Örn: 1. Ünite Değerlendirme Testi",
    lbl_test_course: "Ders İsmi",
    placeholder_test_course: "Örn: Fizik",
    lbl_test_duration_min: "Test Süresi (Dakika)",
    lbl_test_timed: "Süre sınırı ekle (İsteğe bağlı)",
    placeholder_test_duration_min: "Örn: 30",
    test_duration_hint: "İşaretli değilse test süresiz olur. Süre eklendiğinde HTML dosyasında \"Sınava Başla\" butonuna basınca geri sayım başlar ve süre bitince sınav otomatik tamamlanır.",
    test_settings_behavior_title: "Cevaplama & Geri Bildirim Modu",
    test_behavior_lock_title: "İşaretlenen Şık Değiştirilemesin (Anında Doğru/Yanlış)",
    test_behavior_lock_desc: "Bir şık seçildikten sonra değiştirilemez; doğru veya yanlış olduğu ve açıklaması anında gösterilir.",
    test_behavior_change_title: "İşaretlenen Şık Değiştirilebilsin (Sonuçlar Bitimde)",
    test_behavior_change_desc: "Testi çözen kişi şıkları değiştirebilir; doğru/yanlış durumu test bitene kadar gösterilmez.",
    test_untimed: "Süresiz",
    test_minutes_short: "Dk",
    test_prefields_title: "Test Önü Bilgi Alanları",
    test_prefields_add: "Alan Ekle",
    test_prefields_desc: "Test başlamadan önce katılımcıdan istemek istediğiniz bilgileri (örn: Ad, Departman, Katılımcı Kodu) + butonuyla serbestçe ekleyin. Boş bırakırsanız test doğrudan başlar.",
    test_prefields_empty: "Henüz bilgi alanı eklenmedi. İhtiyaç varsa + Alan Ekle butonuna tıklayın.",
    test_prefields_placeholder: "Alan adı (Örn: Ad, Birim, Kod...)",
    test_prefields_required: "Zorunlu",
    test_prefields_remove: "Alanı Kaldır",
    test_sharing_title: "Test Sonucu İletme & Paylaşım",
    test_sharing_enable: "Test bitiminde sonuç iletme / paylaşma seçeneklerini göster",
    test_sharing_desc: "Aktif edildiğinde, dışa aktarılan HTML testi tamamlandığında sonuçları e-posta olarak gönderme, panoya kopyalama veya metin belgesi indirme seçenekleri sunulur.",
    lbl_share_email: "Alıcı E-posta Adresi (İsteğe Bağlı)",
    placeholder_share_email: "Örn: sonuc@kurum.com",
    lbl_share_email_btn: "E-posta Buton Yazısı (İsteğe Bağlı)",
    placeholder_share_email_btn: "Varsayılan: Sonucu E-posta ile Gönder",
    chk_share_email: "E-posta ile Gönder butonu (Alıcı e-posta girildiğinde görünür)",
    chk_share_copy: "Sonuç Özetini Kopyala butonu",
    chk_share_download: "Sonuç Belgesini İndir (.txt) butonu",

    // Canlı Önizleme Üst Çubuğu
    preview_title_paper: "Canlı Sınav Kağıdı",
    preview_title_test: "İnteraktif Dijital Test",
    btn_2_cols: "2 Sütun",
    btn_1_col: "1 Sütun",
    btn_restart_test: "Yeniden Başlat",
    zoom_out: "Uzaklaştır",
    zoom_in: "Yakınlaştır",
    zoom_reset: "Varsayılan Boyut (%100)",
    fullscreen_preview: "Tam Ekran Önizleme",

    // Başlangıç Şablonu Modalı
    template_modal_title: "Nasıl Başlamak İstiyorsunuz?",
    template_sub_paper: "Sınav Kağıdı Modu için başlangıç yöntemini seçin:",
    template_sub_test: "İnteraktif Test Modu için başlangıç yöntemini seçin:",
    template_empty_badge: "Sıfırdan Başla",
    template_empty_title: "Boş Kağıttan Başla",
    template_empty_desc: "Tertemiz, boş bir sayfa açılır. Başlık bilgilerini ve kendi sorularınızı sıfırdan tek tek eklersiniz.",
    template_empty_btn: "Boş Sayfayı Aç",
    template_sample_badge: "Hazır Şablon",
    template_sample_title: "Örnek Sınavı Düzenle",
    template_sample_desc: "Örnek sorular, hazır başlık ve kurum bilgileri yüklenir. Mevcut sorular üzerinde hemen düzenleme yapabilirsiniz.",
    template_sample_btn: "Örnek Sınavı Yükle",

    // Metinden Toplu Soru Ekleme Modalı
    bulk_modal_title: "Metinden Toplu Soru Ekle",
    bulk_modal_badge: "AKILLI AYRIŞTIRICI PRO",
    bulk_modal_desc: "Word, PDF, web veya yapay zekadan aldığınız soruları serbestçe yapıştırın. Sistem otomatik ayıklar.",
    bulk_sample_formats: "Örnek Formatlar:",
    bulk_fmt_standard: "Standart Çoktan Seçmeli",
    bulk_fmt_inline: "Yan Yana Şıklar",
    bulk_fmt_answerkey: "Altta Cevap Anahtarlı",
    bulk_fmt_mixed: "Karışık Format",
    btn_copy_ai_prompt: "AI İstemi Kopyala",
    btn_clear: "Temizle",
    bulk_paste_label: "Soru Metinlerini Yapıştırın:",
    bulk_char_count: "{count} karakter",
    bulk_placeholder: `Sorularınızı buraya yapıştırın...

Örnek Formatlar:
1. Türkiye'nin başkenti neresidir?
A) İstanbul   B) Ankara   C) İzmir   D) Bursa
Cevap: B

2. Işık sesten hızlı yayılır.
A) Doğru   B) Yanlış
Cevap: A

Soru 3: Maddenin 4. hali nedir?
*A) Plazma
B) Katı
C) Sıvı
D) Gaz`,
    chip_inline: "Yan yana şıklar (A B C D)",
    chip_flexible: "Esnek Soru No (Soru 1, 1-, [1])",
    chip_star: "Yıldızlı Şık (*A)",
    chip_key: "Sondaki Cevap Anahtarı",
    bulk_preview_title: "Canlı Algılama & Önizleme",
    bulk_empty_title: "Henüz soru algılanmadı",
    bulk_empty_desc: "Sol tarafa sorularınızı yapıştırın veya yukarıdaki Örnek Format butonlarına tıklayarak nasıl çalıştığını test edin.",
    bulk_footer_info_empty: "Soru eklemek için metin yapıştırın.",
    bulk_footer_info_ready: "{count} adet soru eklenecek.",
    btn_cancel: "Vazgeç",
    btn_execute_bulk: "Soruları Ekle ({count} Soru)",

    // Soru Editör Kartları (app.js)
    q_card_num: "Soru {num}",
    q_points: "Puan",
    q_points_short: "P",
    q_text_placeholder: "Soru kökünü ve metnini buraya yazın...",
    q_image_label: "Soru Görseli (İsteğe Bağlı):",
    q_image_upload_btn: "Görsel Yükle",
    q_image_remove_btn: "Görseli Kaldır",
    q_options_label: "Seçenekler ve Doğru Cevap:",
    q_add_option_btn: "Yeni Şık Ekle",
    q_lines_count_label: "Satır Sayısı (Cevap Boşluğu):",
    q_correct_answer_label: "Doğru Cevap:",
    q_classic_answer_label: "Örnek Çözüm / Beklenen Cevap:",
    q_explanation_label: "Çözüm Açıklaması / İpucu (İsteğe Bağlı):",
    btn_delete_tooltip: "Soruyu Sil",
    btn_duplicate_tooltip: "Soruyu Çoğalt",
    btn_up_tooltip: "Yukarı Taşı",
    btn_down_tooltip: "Aşağı Taşı",
    btn_collapse_tooltip: "Genişlet / Daralt",

    // Canlı A4 Sınav Kağıdı Render (app.js)
    paper_student_name: "Adı Soyadı:",
    paper_student_grade: "Sınıf / Şube:",
    paper_student_number: "No:",
    paper_date: "Tarih:",
    paper_score_label: "Aldığı Not:",
    paper_answer_key_title: "CEVAP ANAHTARI",
    paper_optical_title: "OPTİK CEVAP FORMU",
    paper_watermark: "TestForge ile hazırlandı",
    opt_true: "Doğru",
    opt_false: "Yanlış",

    // Dijital Test Render (app.js)
    test_progress: "Soru {current} / {total}",
    test_btn_prev: "Önceki",
    test_btn_next: "Sonraki",
    test_btn_finish: "Testi Bitir",
    test_btn_reveal: "Çözümü Göster",
    test_btn_hide: "Çözümü Gizle",
    test_summary_title: "Tebrikler! Testi Tamamladınız 🎉",
    test_summary_score: "Başarı Skoru",
    test_stat_total: "Toplam Soru",
    test_stat_correct: "Doğru",
    test_stat_wrong: "Yanlış",
    test_stat_empty: "Boş",
    test_btn_restart: "Yeniden Başlat",
    test_btn_review: "Cevapları İncele",
    test_your_ans: "Sizin Cevabınız:",
    test_correct_ans: "Doğru Cevap:",

    // Toast Bildirimleri
    toast_added: "Soru başarıyla eklendi.",
    toast_deleted: "Soru silindi.",
    toast_duplicated: "Soru çoğaltıldı.",
    toast_bulk_success: "🎉 {count} adet soru başarıyla eklendi!",
    toast_bulk_empty: "Lütfen soru metinlerini giriniz.",
    toast_bulk_none: "Uygun formatta soru algılanamadı. Lütfen örnek şablonları deneyin.",
    toast_prompt_copied: "AI formatlama istemi panoya kopyalandı!",
    toast_pdf_generating: "PDF hazırlanıyor, lütfen bekleyin...",
    toast_html_exported: "İnteraktif test HTML dosyası başarıyla indirildi!"
  },

  en: {
    // Brand & General
    brand_name: "TestForge",
    app_title: "TestForge - Professional Exam & Quiz Maker",
    meta_description: "Easily create multiple choice, open-ended or true/false exams. Export instantly as PDF and Interactive HTML.",
    brand_tooltip: "Return to Home (Mode Selection)",
    theme_toggle_title: "Toggle Theme",

    // Header Actions
    export_pdf: "Download PDF",
    export_pdf_title: "Download A4 exam paper as PDF",
    export_html: "Download Interactive HTML",
    export_html_title: "Interactive test file that works completely offline",
    print_btn: "Print",
    print_btn_title: "Print Directly (Ctrl+P)",

    // Landing View
    landing_badge: "TestForge Workspace",
    landing_title: "What would you like to create?",
    landing_subtitle: "Choose the format suited for your needs. You can return to this screen anytime by clicking the TestForge logo.",
    
    card_test_badge: "Interactive & Digital",
    card_test_title: "Create Digital Quiz",
    card_test_desc: "Directly add your questions without header clutter, and generate an interactive digital quiz that works offline.",
    card_test_feat1: "Streamlined, direct question editor",
    card_test_feat2: "Instant correct / wrong answer feedback on click",
    card_test_feat3: "Detailed solution notes and hints",
    card_test_feat4: "Single-file HTML output runnable directly in any browser",
    card_test_btn: "Create Digital Quiz",

    card_paper_badge: "A4 Print & PDF",
    card_paper_title: "Create Exam Paper",
    card_paper_desc: "Prepare professional school and exam format papers. Empty fields are hidden automatically.",
    card_paper_feat1: "1 or 2 Column real A4 page layout",
    card_paper_feat2: "Smart institution header & student info boxes",
    card_paper_feat3: "Optical mark answer sheet and automated answer key",
    card_paper_feat4: "Vector PDF export and instant printing",
    card_paper_btn: "Create Exam Paper",

    // Editor Panel & Tabs
    tab_questions: "Questions",
    tab_settings: "Exam Settings & Header",
    tab_test_settings: "Quiz Settings",
    card_add_question: "Add New Question",
    type_multiple: "Multiple Choice",
    type_tf: "True / False",
    type_classic: "Open-Ended",
    btn_bulk_import: "Bulk Add from Text (Smart Parser)",
    total_questions_badge: "{count} Questions",

    // Settings Tab
    settings_header_title: "Exam Paper Header Info",
    settings_header_desc: "Fields left blank will automatically be hidden on the exam paper.",
    lbl_institution: "Institution / School Name",
    placeholder_institution: "e.g.: OXFORD HIGH SCHOOL",
    lbl_title: "Exam Title",
    placeholder_title: "e.g.: MIDTERM EXAMINATION",
    lbl_course: "Course / Subject",
    placeholder_course: "e.g.: Science & Physics",
    lbl_grade: "Grade / Class",
    placeholder_grade: "e.g.: Grade 10-A",
    lbl_duration: "Exam Duration",
    placeholder_duration: "e.g.: 40 Minutes",
    lbl_date: "Exam Date",
    placeholder_date: "e.g.: 21.10.2025",
    lbl_instructions: "Exam Instructions",
    placeholder_instructions: "Exam rules and instructions...",
    settings_components_title: "Paper Components & Layout",
    chk_student_info: "Show Student Info (Name, ID, etc.)",
    chk_score: "Show Student Score Box",
    chk_answer_key: "Show Answer Key at End of Paper",
    chk_optical: "Add Optical Answer Sheet",

    // Quiz Mode Settings
    test_settings_info_title: "Quiz Info & Timer",
    test_settings_info_desc: "Quiz title, subject, and time limit apply directly to the live preview and exported HTML quiz.",
    lbl_test_title: "Quiz Name / Title",
    placeholder_test_title: "e.g.: Unit 1 Assessment Quiz",
    lbl_test_course: "Subject / Course Name",
    placeholder_test_course: "e.g.: Physics",
    lbl_test_duration_min: "Time Limit (Minutes)",
    lbl_test_timed: "Add time limit (Optional)",
    placeholder_test_duration_min: "e.g.: 30",
    test_duration_hint: "Leave unchecked for an untimed quiz. When enabled, countdown starts on \"Start Exam\" in HTML and auto-submits when time expires.",
    test_settings_behavior_title: "Answering & Feedback Mode",
    test_behavior_lock_title: "Lock Answer After Selection (Instant Feedback)",
    test_behavior_lock_desc: "Once an option is selected it cannot be changed; right/wrong feedback and explanation appear immediately.",
    test_behavior_change_title: "Allow Changing Answers (Reveal at End)",
    test_behavior_change_desc: "Test-takers can freely change options; right/wrong status stays hidden until the quiz ends.",
    test_untimed: "Untimed",
    test_minutes_short: "Min",
    test_prefields_title: "Pre-Test Information Fields",
    test_prefields_add: "Add Field",
    test_prefields_desc: "Freely add any fields you want test-takers to fill before starting (e.g., Name, Department, Code) via +. Leave empty to start the quiz directly.",
    test_prefields_empty: "No information fields added yet. Click + Add Field if needed.",
    test_prefields_placeholder: "Field name (e.g., Name, Team, ID...)",
    test_prefields_required: "Required",
    test_prefields_remove: "Remove Field",
    test_sharing_title: "Result Submission & Sharing",
    test_sharing_enable: "Show result sharing / submission options on completion",
    test_sharing_desc: "When enabled, the exported HTML quiz offers options to send results via email, copy summary text, or download a text report.",
    lbl_share_email: "Recipient Email Address (Optional)",
    placeholder_share_email: "e.g.: results@organization.com",
    lbl_share_email_btn: "Email Button Label (Optional)",
    placeholder_share_email_btn: "Default: Send Results via Email",
    chk_share_email: "Send via Email button (shown when recipient email is provided)",
    chk_share_copy: "Copy Result Summary button",
    chk_share_download: "Download Result Report (.txt) button",

    // Preview Toolbar
    preview_title_paper: "Live Exam Paper",
    preview_title_test: "Interactive Digital Quiz",
    btn_2_cols: "2 Columns",
    btn_1_col: "1 Column",
    btn_restart_test: "Restart Quiz",
    zoom_out: "Zoom Out",
    zoom_in: "Zoom In",
    zoom_reset: "Default Size (100%)",
    fullscreen_preview: "Fullscreen Preview",

    // Template Choice Modal
    template_modal_title: "How would you like to start?",
    template_sub_paper: "Choose a starting method for Exam Paper Mode:",
    template_sub_test: "Choose a starting method for Interactive Quiz Mode:",
    template_empty_badge: "Start Fresh",
    template_empty_title: "Start with Blank Page",
    template_empty_desc: "Opens a clean blank page. Add your own header info and questions from scratch.",
    template_empty_btn: "Open Blank Page",
    template_sample_badge: "Ready Template",
    template_sample_title: "Edit Sample Exam",
    template_sample_desc: "Loads sample questions, preset headers and institution info. Edit immediately.",
    template_sample_btn: "Load Sample Exam",

    // Bulk Import Modal
    bulk_modal_title: "Bulk Add Questions from Text",
    bulk_modal_badge: "SMART PARSER PRO",
    bulk_modal_desc: "Freely paste questions copied from Word, PDF, web or AI. System parses automatically.",
    bulk_sample_formats: "Sample Formats:",
    bulk_fmt_standard: "Standard Multiple Choice",
    bulk_fmt_inline: "Inline Options",
    bulk_fmt_answerkey: "Bottom Answer Key",
    bulk_fmt_mixed: "Mixed Format",
    btn_copy_ai_prompt: "Copy AI Prompt",
    btn_clear: "Clear",
    bulk_paste_label: "Paste Question Texts:",
    bulk_char_count: "{count} chars",
    bulk_placeholder: `Paste your questions here...

Sample Formats:
1. What is the closest planet to the Sun?
A) Venus   B) Mercury   C) Mars   D) Earth
Answer: B

2. Light travels faster than sound in a vacuum.
A) True   B) False
Answer: A

Question 3: What is the 4th state of matter?
*A) Plasma
B) Solid
C) Liquid
D) Gas`,
    chip_inline: "Inline options (A B C D)",
    chip_flexible: "Flexible numbering (Q1, 1-, [1])",
    chip_star: "Starred Option (*A)",
    chip_key: "Bottom Answer Key",
    bulk_preview_title: "Live Detection & Preview",
    bulk_empty_title: "No questions detected yet",
    bulk_empty_desc: "Paste questions on the left or click sample format buttons above to test.",
    bulk_footer_info_empty: "Paste text to add questions.",
    bulk_footer_info_ready: "{count} questions ready to add.",
    btn_cancel: "Cancel",
    btn_execute_bulk: "Add Questions ({count} Questions)",

    // Question Editor Cards (app.js)
    q_card_num: "Question {num}",
    q_points: "Points",
    q_points_short: "Pts",
    q_text_placeholder: "Type the question text here...",
    q_image_label: "Question Image (Optional):",
    q_image_upload_btn: "Upload Image",
    q_image_remove_btn: "Remove Image",
    q_options_label: "Options and Correct Answer:",
    q_add_option_btn: "Add Option",
    q_lines_count_label: "Line Count (Answer Space):",
    q_correct_answer_label: "Correct Answer:",
    q_classic_answer_label: "Sample Solution / Expected Answer:",
    q_explanation_label: "Solution Explanation / Hint (Optional):",
    btn_delete_tooltip: "Delete Question",
    btn_duplicate_tooltip: "Duplicate Question",
    btn_up_tooltip: "Move Up",
    btn_down_tooltip: "Move Down",
    btn_collapse_tooltip: "Expand / Collapse",

    // Live Paper Renderer (app.js)
    paper_student_name: "Student Name:",
    paper_student_grade: "Grade / Class:",
    paper_student_number: "ID:",
    paper_date: "Date:",
    paper_score_label: "Score / Grade:",
    paper_answer_key_title: "ANSWER KEY",
    paper_optical_title: "OPTICAL ANSWER SHEET",
    paper_watermark: "Powered by TestForge",
    opt_true: "True",
    opt_false: "False",

    // Digital Test Renderer (app.js)
    test_progress: "Question {current} / {total}",
    test_btn_prev: "Previous",
    test_btn_next: "Next",
    test_btn_finish: "Finish Quiz",
    test_btn_reveal: "Show Solution",
    test_btn_hide: "Hide Solution",
    test_summary_title: "Congratulations! Quiz Completed 🎉",
    test_summary_score: "Success Score",
    test_stat_total: "Total Questions",
    test_stat_correct: "Correct",
    test_stat_wrong: "Wrong",
    test_stat_empty: "Unanswered",
    test_btn_restart: "Restart Quiz",
    test_btn_review: "Review Answers",
    test_your_ans: "Your Answer:",
    test_correct_ans: "Correct Answer:",

    // Toast Notifications
    toast_added: "Question added successfully.",
    toast_deleted: "Question deleted.",
    toast_duplicated: "Question duplicated.",
    toast_bulk_success: "🎉 {count} questions added successfully!",
    toast_bulk_empty: "Please enter question texts.",
    toast_bulk_none: "No valid questions detected. Please try sample formats.",
    toast_prompt_copied: "AI prompt copied to clipboard!",
    toast_pdf_generating: "Generating PDF, please wait...",
    toast_html_exported: "Interactive quiz HTML file downloaded successfully!"
  }
};

// Aktif dil durumu (Varsayılan olarak Türkçe)
let currentLanguage = 'tr';

function initLanguage() {
  const savedLang = localStorage.getItem('testforge_lang');
  if (savedLang === 'en' || savedLang === 'tr') {
    currentLanguage = savedLang;
  } else {
    currentLanguage = 'tr'; // Varsayılan Türkçe
  }
  applyTranslations();
  updateLangSwitcherUI();
}

function getLanguage() {
  return currentLanguage;
}

function t(key, params = {}) {
  const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.tr;
  let text = dict[key] || TRANSLATIONS.tr[key] || key;
  
  // Parametreleri yerleştir: {count}, {num}, vb.
  if (typeof text === 'string') {
    Object.keys(params).forEach(k => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
    });
  }
  return text;
}

function setLanguage(lang) {
  if (lang !== 'tr' && lang !== 'en') return;
  currentLanguage = lang;
  localStorage.setItem('testforge_lang', lang);
  document.documentElement.lang = lang;
  
  applyTranslations();
  updateLangSwitcherUI();

  // Tüm uygulamaya dil değişimi olayını duyur
  window.dispatchEvent(new CustomEvent('testforge_lang_change', { detail: { lang } }));
}

function updateLangSwitcherUI() {
  const btns = document.querySelectorAll('.lang-btn');
  btns.forEach(btn => {
    const btnLang = btn.getAttribute('data-lang');
    if (btnLang === currentLanguage) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function applyTranslations() {
  // 1. TextContent içeren data-i18n elemanları
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = t(key);
    if (translated && translated !== key) {
      el.textContent = translated;
    }
  });

  // 2. HTML içeren data-i18n-html elemanları
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const translated = t(key);
    if (translated && translated !== key) {
      el.innerHTML = translated;
    }
  });

  // 3. Placeholder içeren elemanlar
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const translated = t(key);
    if (translated && translated !== key) {
      el.placeholder = translated;
    }
  });

  // 4. Title / Tooltip içeren elemanlar
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const translated = t(key);
    if (translated && translated !== key) {
      el.title = translated;
    }
  });

  // 5. Belge Başlığı
  document.title = t('app_title');
}

// Global erişim
window.t = t;
window.getLanguage = getLanguage;
window.setLanguage = setLanguage;
window.initLanguage = initLanguage;
window.applyTranslations = applyTranslations;
