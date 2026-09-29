/**
 * PENJAGA LEMBARAN: UJIAN SEJARAH BANJAR
 * Update: Implementasi Vektor Ikon (FontAwesome 6)
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. SISTEM SUARA & BGM
     ========================================================================== */
  const BGM_CONFIG = {
    src: 'backsound.mp3',
    maxVolume: 0.35,
    fadeStep: 0.04,
    fadeInterval: 60,
  };

  let bgm = null;
  let soundEnabled = true;
  let bgmStarted = false;

  function initBgm() {
    if (!bgm) {
      bgm = new Audio(BGM_CONFIG.src);
      bgm.loop = true;
      bgm.volume = BGM_CONFIG.maxVolume;
    }
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    const muteBtn = document.getElementById('btn-mute-toggle');
    
    // Perubahan ikon vektor untuk Suara Aktif / Nonaktif
    if (soundEnabled) {
      muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Suara: AKTIF';
    } else {
      muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> Suara: NONAKTIF';
    }
    
    if (bgm) {
      if (soundEnabled) bgm.play().catch(()=>{});
      else bgm.pause();
    }
    audioEngine.muted = !soundEnabled;
    closeDropdown();
  }

  // Synthesizer Audio Khusus Efek Interaksi (Web Audio API)
  class AudioEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
    }
    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }
    playTone(freq, type, duration, vol) {
      if (this.muted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch(e) {}
    }
    playClick() { this.playTone(400, 'triangle', 0.1, 0.2); }
    playCorrect() { this.playTone(800, 'sine', 0.4, 0.3); setTimeout(()=>this.playTone(1000, 'sine', 0.5, 0.3), 100); }
    playWrong() { this.playTone(200, 'sawtooth', 0.4, 0.2); }
  }
  const audioEngine = new AudioEngine();

  /* ==========================================================================
     2. DATABASE PERTANYAAN & ARTEFAK
     ========================================================================== */
  const QUESTIONS_DATA = [
    {
      id: 1, category: 'Silsilah & Intrik Politik Istana',
      narrative: 'Tahun 1852 menjadi salah satu masa penting dalam sejarah Kesultanan Banjar. Persaingan kekuasaan dan campur tangan kolonial semakin menekan kedaulatan istana.',
      question: 'Siapakah pangeran yang diangkat secara sepihak oleh Belanda pada tahun 1852 dan dibenci oleh rakyat Banjar?',
      options: ['Pangeran Tamjidillah II', 'Pangeran Hidayatullah II', 'Sultan Adam', 'Pangeran Antasari'],
      correctAnswer: 'Pangeran Tamjidillah II',
      explanation: 'Belanda mengangkat Pangeran Tamjidillah II secara sepihak sebagai Sultan Banjar pada tahun 1852, mengabaikan dukungan rakyat terhadap Pangeran Hidayatullah II.',
      wrongHint: 'Jawaban yang kamu pilih adalah pahlawan rakyat. Tokoh yang diangkat paksa oleh Belanda adalah Pangeran Tamjidillah II.',
      artifactId: 'art_1'
    },
    {
      id: 2, category: 'Perjuangan & Sikap Tegas',
      narrative: '28 April 1859, Saat Perlawanan rakyat membakar tambang batu bara di Pengaron, Belanda Mencoba Meredam dengan Menawarkan Kekuasaan kepada pemimpin yang dicintai rakyat Banjar yaitu Pangeran Hidayatullah II setelah "melengserkan" Pangeran Tamjidillah II.',
      question: 'Apa tindakan tegas yang diambil oleh Pangeran Hidayatullah II ketika Belanda menawarkan tahta Kesultanan kepadanya?',
      options: ['Menolak dan memilih turun ke medan perang gerilya', 'Menerima tawaran demi kedamaian sementara', 'Meminta perlindungan ke Batavia', 'Menyerahkan takhta kepada putranya'],
      correctAnswer: 'Menolak dan memilih turun ke medan perang gerilya',
      explanation: 'Pangeran Hidayatullah II dengan tegas menolak mahkota pemberian Belanda dan lebih memilih berjuang di pedalaman bersama rakyat.',
      wrongHint: 'Pangeran Hidayatullah II pantang berkompromi dengan penjajah dan lebih memilih memimpin perang gerilya.',
      artifactId: 'art_2'
    },
    {
      id: 3, category: 'Kepemimpinan Perang Semesta',
      narrative: 'Ketika kekosongan kekuasaan terjadi, perlawanan rakyat memerlukan sosok pemimpin besar yang diakui oleh seluruh elemen pejuang dan ulama (Pangeran Antasari).',
      question: 'Kapan Pangeran Antasari secara resmi diangkat sebagai Panembahan Amiruddin Khalifatul Mukminin?',
      options: ['14 Maret 1862', '28 April 1859', '17 Agustus 1860', '10 November 1862'],
      correctAnswer: '14 Maret 1862',
      explanation: 'Setelah Pangeran Hidayatullah II tertawan, Pangeran Antasari diangkat oleh ulama dan panglima pada 14 Maret 1862 sebagai pemimpin tertinggi.',
      wrongHint: 'Penobatan tersebut terjadi pada masa-masa sulit pasca tertawannya Pangeran Hidayatullah II, yaitu pada 14 Maret 1862.',
      artifactId: 'art_3'
    },
    {
      id: 4, category: 'Meletusnya Perang Terbuka',
      narrative: 'Kemarahan rakyat Banjar sudah memuncak. Sebuah serangan fajar direncanakan dengan saksama untuk melumpuhkan tambang batu bara milik kolonial.',
      question: 'Peristiwa penyerangan tambang batu bara Oranje Nassau di Pengaron yang menandai meletusnya Perang Banjar terjadi pada tanggal...',
      options: ['28 April 1859', '14 Maret 1862', '1 Mei 1859', '30 September 1859'],
      correctAnswer: '28 April 1859',
      explanation: 'Pada subuh 28 April 1859, ratusan pejuang yang dipimpin langsung Pangeran Antasari menyerang tambang Oranje Nassau.',
      wrongHint: 'Serangan mendadak yang bersejarah di Pengaron itu terjadi pada 28 April 1859.',
      artifactId: 'art_4'
    },
    {
      id: 5, category: 'Falsafah & Semboyan Juang',
      narrative: 'Setiap perjuangan besar di Nusantara senantiasa dikawal oleh sumpah suci yang menggetarkan jiwa pejuang hingga garis akhir.',
      question: "Makna dari semboyan agung Pangeran Antasari 'Haram Manyerah, Waja Sampai Ka Puting' adalah...",
      options: ['Berjuang hingga tetes darah terakhir dan pantang menyerah', 'Mundur sementara untuk menyusun strategi', 'Melakukan diplomasi dengan kekuatan asing', 'Menjaga perbatasan kerajaan dari serangan laut'],
      correctAnswer: 'Berjuang hingga tetes darah terakhir dan pantang menyerah',
      explanation: 'Semboyan ini mengikrarkan bahwa haram bagi rakyat Banjar untuk menyerah, dengan tekad sekeras baja hingga akhir hayat.',
      wrongHint: 'Semboyan ini adalah nyala keberanian mutlak, bermakna pantang menyerah hingga tetes darah penghabisan.',
      artifactId: 'art_5'
    }
  ];

  // Menggunakan tag HTML FontAwesome (kelas) di properti icon
  const ARTIFACTS_DATA = {
    'art_1': { name: 'Dokumen Suksesi 1852', desc: 'Arsip bukti campur tangan kolonial dalam penentuan takhta kesultanan.', icon: '<i class="fa-solid fa-file-contract"></i>' },
    'art_2': { name: 'Stempel Hidayatullah', desc: 'Simbol kedaulatan sah yang diselamatkan ke pedalaman Meratus.', icon: '<i class="fa-solid fa-stamp"></i>' },
    'art_3': { name: 'Panji Amiruddin', desc: 'Panji kebesaran gelar Khalifatul Mukminin Pangeran Antasari.', icon: '<i class="fa-solid fa-flag"></i>' },
    'art_4': { name: 'Peta Oranje Nassau', desc: 'Peta denah tambang batu bara Belanda yang digempur pejuang.', icon: '<i class="fa-solid fa-map-location-dot"></i>' },
    'art_5': { name: 'Mandau Pusaka', desc: 'Senjata lambang keberanian \'Waja Sampai Ka Puting\'.', icon: '<i class="fa-solid fa-gavel"></i>' } // atau fa-khanda
  };

  /* ==========================================================================
     3. STATE MANAGEMENT
     ========================================================================== */
  const state = {
    currentQuestionIndex: 0,
    score: 0,
    attempts: Array(QUESTIONS_DATA.length).fill(0),
    isEvaluating: false,
    unlockedArtifacts: JSON.parse(localStorage.getItem('penjagaLembaranArtifacts')) || []
  };

  const LORA_SPRITES = {
    idle: './assets/lora_idle.png',
    happy: './assets/lora_happy.png',
    thinking: './assets/lora_thinking.png'
  };

  const introText = "Salam, Penjaga Lembaran. Namaku Lora. Di ruang arsip ini, tersimpan lembaran-lembaran sejarah perjuangan rakyat Banjar. Mari kita uji pemahamanmu. Siapa tahu ada kisah keberanian yang belum kamu ketahui.";

  /* ==========================================================================
     4. FUNGSI UTAMA (FLOW)
     ========================================================================== */
  function getElement(id) { return document.getElementById(id); }

  function initGame() {
    bindEvents();
    startCanvasParticles();
    showScreen('screen-intro');
    typeIntroText();
  }

  function bindEvents() {
    // Start Quiz
    getElement('btn-start-quiz').addEventListener('click', () => {
      audioEngine.init(); audioEngine.playClick(); showScreen('screen-quiz'); loadQuestion();
      if(!bgmStarted) { initBgm(); if(soundEnabled) bgm.play(); bgmStarted = true; }
    });
    
    // Hamburger Menu Logic
    const hamburgerBtn = getElement('btn-hamburger');
    const dropdownMenu = getElement('dropdown-menu');

    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = dropdownMenu.classList.contains('hidden');
      if (isHidden) {
        dropdownMenu.classList.remove('hidden');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
      } else {
        closeDropdown();
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdownMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        closeDropdown();
      }
    });

    getElement('btn-mute-toggle').addEventListener('click', toggleSound);
    
    // Tombol Beranda
    getElement('btn-home-modal').addEventListener('click', goToHome);

    // Tombol Lewati Intro
    getElement('btn-skip-intro').addEventListener('click', () => {
      audioEngine.init();
      showScreen('screen-quiz');
      loadQuestion();
      if(!bgmStarted) { initBgm(); if(soundEnabled) bgm.play(); bgmStarted = true; }
    });

    getElement('btn-next-action').addEventListener('click', handleNextAction);
    getElement('btn-restart-quiz').addEventListener('click', restartGame);
    
    // Gallery Modals
    const openGallery = () => {
      closeDropdown();
      audioEngine.playClick();
      renderArtifacts();
      getElement('modal-artifacts').classList.remove('hidden');
    };
    getElement('btn-gallery').addEventListener('click', openGallery);
    getElement('btn-view-artifacts-result').addEventListener('click', openGallery);
    getElement('btn-close-artifacts').addEventListener('click', () => {
      audioEngine.playClick();
      getElement('modal-artifacts').classList.add('hidden');
    });

    document.querySelector('.dialog-box').addEventListener('click', forceCompleteIntro);
  }

  function closeDropdown() {
    const dropdownMenu = getElement('dropdown-menu');
    const hamburgerBtn = getElement('btn-hamburger');
    if (dropdownMenu) dropdownMenu.classList.add('hidden');
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  function showScreen(id) {
    document.querySelectorAll('.screen-section').forEach(sec => sec.classList.add('hidden'));
    getElement(id).classList.remove('hidden');
    window.scrollTo(0, 0);

    // Kontrol Visibilitas Tombol "Lewati Intro"
    const skipBtn = getElement('btn-skip-intro');
    if (id === 'screen-intro') {
      skipBtn.classList.remove('hidden');
    } else {
      skipBtn.classList.add('hidden');
    }
  }

  function goToHome() {
    closeDropdown();
    audioEngine.playClick();
    
    // Reset state permainan
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.attempts = Array(QUESTIONS_DATA.length).fill(0);
    state.isEvaluating = false;

    showScreen('screen-intro');
    typeIntroText();
  }

  /* Intro Typewriter Logic */
  let typeTimer = null, typeIndex = 0;
  function typeIntroText() {
    const el = getElement('intro-dialog-text');
    el.textContent = ''; typeIndex = 0;
    getElement('btn-start-quiz').classList.add('hidden');
    
    clearInterval(typeTimer);
    typeTimer = setInterval(() => {
      if (typeIndex < introText.length) {
        el.textContent += introText.charAt(typeIndex);
        typeIndex++;
      } else {
        forceCompleteIntro();
      }
    }, 35);
  }

  function forceCompleteIntro() {
    clearInterval(typeTimer);
    getElement('intro-dialog-text').textContent = introText;
    getElement('btn-start-quiz').classList.remove('hidden');
    getElement('intro-dialog-hint').textContent = 'Klik tombol di bawah.';
  }

  /* Logika Kuis */
  function loadQuestion() {
    state.isEvaluating = false;
    const q = QUESTIONS_DATA[state.currentQuestionIndex];
    
    // Perbaikan indikator progres
    getElement('quiz-question-counter').textContent = `Soal ${state.currentQuestionIndex + 1} dari ${QUESTIONS_DATA.length}`;
    const progressPercent = ((state.currentQuestionIndex + 1) / QUESTIONS_DATA.length) * 100;
    getElement('progress-fill').style.width = `${progressPercent}%`;
    
    getElement('quiz-score-pill').textContent = `${state.score} Poin`;
    
    getElement('question-category').textContent = q.category;
    getElement('narrative-text').textContent = q.narrative;
    getElement('question-text').textContent = q.question;
    
    setLora('idle', 'Ketuk salah satu pilihan yang paling tepat menurut sejarah.');
    getElement('feedback-panel').classList.add('hidden');
    
    const optsContainer = getElement('options-container');
    optsContainer.innerHTML = '';
    
    // Acak urutan opsi jawaban
    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
    const labels = ['A', 'B', 'C', 'D'];
    
    shuffledOptions.forEach((optText, i) => {
      const card = document.createElement('button');
      card.className = 'option-card';
      card.innerHTML = `<span class="option-badge">${labels[i]}</span> <span>${optText}</span>`;
      card.addEventListener('click', () => submitAnswer(optText, card));
      optsContainer.appendChild(card);
    });
  }

  function submitAnswer(selected, cardEl) {
    if (state.isEvaluating) return;
    state.isEvaluating = true;
    audioEngine.init();
    
    const q = QUESTIONS_DATA[state.currentQuestionIndex];
    state.attempts[state.currentQuestionIndex]++;
    
    // Matikan semua interaksi
    document.querySelectorAll('.option-card').forEach(btn => btn.classList.add('disabled'));
    
    if (selected === q.correctAnswer) {
      audioEngine.playCorrect();
      cardEl.classList.add('correct');
      handleCorrectAnswer(q);
    } else {
      audioEngine.playWrong();
      cardEl.classList.add('wrong');
      handleWrongAnswer(q);
    }
  }

  function handleCorrectAnswer(q) {
    setLora('happy', 'Tepat sekali, Penjaga Lembaran! Pemahamanmu sangat tajam.');
    
    if (state.attempts[state.currentQuestionIndex] === 1) state.score += 100;
    else state.score += 50;
    
    getElement('quiz-score-pill').textContent = `${state.score} Poin`;
    
    const fPanel = getElement('feedback-panel');
    fPanel.className = 'feedback-panel correct-theme';
    getElement('feedback-title').textContent = 'JAWABAN BENAR';
    getElement('feedback-body').textContent = q.explanation;
    
    // Sistem Artefak
    const unlockBox = getElement('artifact-unlock');
    if (!state.unlockedArtifacts.includes(q.artifactId)) {
      state.unlockedArtifacts.push(q.artifactId);
      localStorage.setItem('penjagaLembaranArtifacts', JSON.stringify(state.unlockedArtifacts));
      unlockBox.classList.remove('hidden');
      getElement('artifact-name').textContent = ARTIFACTS_DATA[q.artifactId].name;
    } else {
      unlockBox.classList.add('hidden');
    }
    
    getElement('btn-next-action').innerHTML = 'LANJUT <i class="fa-solid fa-arrow-right"></i>';
    fPanel.classList.remove('hidden');
    fPanel.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  function handleWrongAnswer(q) {
    setLora('thinking', 'Pertimbangkan lagi sejarahnya, mari kita coba pahami fakta sebenarnya.');
    
    const fPanel = getElement('feedback-panel');
    fPanel.className = 'feedback-panel wrong-theme';
    getElement('feedback-title').textContent = 'KURANG TEPAT';
    getElement('feedback-body').textContent = q.wrongHint;
    getElement('artifact-unlock').classList.add('hidden');
    
    getElement('btn-next-action').innerHTML = '<i class="fa-solid fa-rotate-right"></i> COBA LAGI';
    fPanel.classList.remove('hidden');
    fPanel.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  function handleNextAction() {
    audioEngine.playClick();
    if (getElement('btn-next-action').textContent.includes('COBA LAGI')) {
      loadQuestion(); // Reload untuk mengacak ulang opsi
    } else {
      if (state.currentQuestionIndex < QUESTIONS_DATA.length - 1) {
        state.currentQuestionIndex++;
        loadQuestion();
      } else {
        showResults();
      }
    }
  }

  function setLora(mood, speech) {
    getElement('companion-lora-sprite').src = LORA_SPRITES[mood];
    getElement('companion-speech-text').textContent = speech;
  }

  /* Hasil & Artefak */
  function showResults() {
    showScreen('screen-results');
    getElement('result-score-number').textContent = state.score;
    
    const firstTryCount = state.attempts.filter(a => a === 1).length;
    getElement('result-first-try').textContent = `${firstTryCount} / ${QUESTIONS_DATA.length}`;
    
    const accuracy = Math.round((state.score / (QUESTIONS_DATA.length * 100)) * 100);
    getElement('result-accuracy').textContent = `${accuracy}%`;
    
    const naratifEl = getElement('result-narrative-text');
    if (accuracy >= 80) naratifEl.innerHTML = "Luar biasa! Engkau layak menyandang gelar <strong>Penjaga Lembaran Sejati</strong>. Sejarah perjuangan rakyat Banjar akan selalu abadi di tanganmu.";
    else if (accuracy >= 50) naratifEl.innerHTML = "Perjuanganmu patut diapresiasi. Engkau telah meresapi esensi perlawanan, teruslah belajar menggali hikmah keberanian.";
    else naratifEl.innerHTML = "Jalan sejarah masih panjang untuk dijelajahi. Jangan menyerah, baca kembali lembarannya dan cobalah ujian ini lagi.";
  }

  function restartGame() {
    audioEngine.playClick();
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.attempts = Array(QUESTIONS_DATA.length).fill(0);
    showScreen('screen-quiz');
    loadQuestion();
  }

  function renderArtifacts() {
    const grid = getElement('artifacts-grid');
    grid.innerHTML = '';
    
    Object.keys(ARTIFACTS_DATA).forEach(key => {
      const art = ARTIFACTS_DATA[key];
      const isUnlocked = state.unlockedArtifacts.includes(key);
      const card = document.createElement('div');
      card.className = `artifact-card ${isUnlocked ? 'unlocked' : 'locked'}`;
      
      card.innerHTML = `
        <span class="icon">${isUnlocked ? art.icon : '<i class="fa-solid fa-lock"></i>'}</span>
        <h4>${isUnlocked ? art.name : 'Artefak Misterius'}</h4>
        <p>${isUnlocked ? art.desc : 'Belum ditemukan. Jawab pertanyaan sejarah dengan benar untuk membuka.'}</p>
      `;
      grid.appendChild(card);
    });
  }

  /* ==========================================================================
     5. EFEK VISUAL: PARTIKEL CANVAS RINGAN
     ========================================================================== */
  function startCanvasParticles() {
    const canvas = getElement('ambient-particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: Math.random() * -0.5 - 0.1,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(198, 161, 91, ${p.alpha})`; // Antique Gold
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // Inisialisasi Aplikasi
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }

})();