/**
 * TestForge - Varsayılan Örnek Sınav Verisi
 */

const SAMPLE_EXAM_DATA = {
  meta: {
    institution: "ATATÜRK ANADOLU LİSESİ",
    title: "2025-2026 EĞİTİM ÖĞRETİM YILI 1. DÖNEM 2. GENEL DEĞERLENDİRME SINAVI",
    course: "FEN BİLİMLERİ & GENEL KÜLTÜR",
    classGrade: "10. Sınıf",
    duration: "40 Dakika",
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
    examDate: "21.10.2025",
    instructions: "Sınav süresi 40 dakikadır. Çoktan seçmeli sorularda yalnızca bir doğru seçenek vardır. Yanlış cevaplar doğruları götürmez. Başarılar dileriz.",
    showScoreBox: true,
    showStudentInfo: true,
    layoutColumns: 2, // 1 or 2 columns
    showAnswerKey: true,
    showOpticalForm: true
  },
  questions: [
    {
      id: "q-1",
      type: "multiple",
      text: "Güneş Sistemi'nde Güneş'e en yakın gezegen aşağıdakilerden hangisidir?",
      image: "",
      points: 20,
      options: [
        { letter: "A", text: "Venüs" },
        { letter: "B", text: "Merkür" },
        { letter: "C", text: "Mars" },
        { letter: "D", text: "Dünya" }
      ],
      correctAnswer: "B",
      explanation: "Merkür, Güneş'e yaklaşık 57.9 milyon km mesafe ile en yakın gezegendir."
    },
    {
      id: "q-2",
      type: "multiple",
      text: "Maddenin katı halden doğrudan gaz haline geçmesi olayına ne ad verilir?",
      image: "",
      points: 20,
      options: [
        { letter: "A", text: "Yoğuşma" },
        { letter: "B", text: "Buharlaşma" },
        { letter: "C", text: "Süblimleşme" },
        { letter: "D", text: "Kırağılaşma" },
        { letter: "E", text: "Erime" }
      ],
      correctAnswer: "C",
      explanation: "Katı bir maddenin sıvılaşmadan doğrudan gaz fazına geçişine süblimleşme denir. Örnek: Naftalin."
    },
    {
      id: "q-3",
      type: "true_false",
      text: "Işık boşlukta sesten daha yavaş yayılır.",
      image: "",
      points: 20,
      options: [
        { letter: "D", text: "Doğru" },
        { letter: "Y", text: "Yanlış" }
      ],
      correctAnswer: "Y",
      explanation: "Işık boşlukta yaklaşık 300.000 km/s hızla yayılırken, ses mekanik bir dalga olduğu için boşlukta hiç yayılamaz."
    },
    {
      id: "q-4",
      type: "multiple",
      text: "İnsan vücudunda oksijenin hücrelere taşınmasını sağlayan kırmızı kan hücresi proteini hangisidir?",
      image: "",
      points: 20,
      options: [
        { letter: "A", text: "Miyozin" },
        { letter: "B", text: "Keratin" },
        { letter: "C", text: "Hemoglobin" },
        { letter: "D", text: "Kollajen" }
      ],
      correctAnswer: "C",
      explanation: "Hemoglobin, alyuvarlarda bulunan ve oksijen ile karbondioksit taşınmasında görevli demir içeren bir proteindir."
    },
    {
      id: "q-5",
      type: "classic",
      text: "Fotosentez olayının genel kimyasal denklemini veya temel bileşenlerini kısaca yazınız.",
      image: "",
      points: 20,
      linesCount: 4,
      correctAnswer: "6CO₂ + 6H₂O + Işık Enerjisi -> C₆H₁₂O₆ + 6O₂ (Karbondioksit + Su + Işık -> Glikoz + Oksijen)",
      explanation: "Klorofilli canlılar ışık enerjisini kullanarak inorganik maddelerden organik besin üretir."
    }
  ]
};
