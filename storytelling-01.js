document.addEventListener('DOMContentLoaded', () => {
    // === DOM ELEMENTS ===
    const phaseIntro = document.getElementById('phase-intro');
    const phaseMain = document.getElementById('phase-main');
    const globalBgImage = document.getElementById('global-bg-image');
    const btnExplore = document.getElementById('btn-explore');

    // Story Modal Elements
    const storyCards = document.querySelectorAll('.story-card');
    const storyModal = document.getElementById('story-modal');
    const btnModalBack = document.getElementById('btn-modal-back');
    const modalMiniTitle = document.getElementById('modal-mini-title');
    const modalChapterTitle = document.getElementById('modal-chapter-title');
    const modalChapterBody = document.getElementById('modal-chapter-body');
    const btnNextChapter = document.getElementById('btn-next-chapter');
    
    // Progress Bar Elements
    const progressFill = document.getElementById('progress-fill');
    const progressPercentText = document.getElementById('progress-percent-text');
    const nodes = [
        document.getElementById('node-1'),
        document.getElementById('node-2'),
        document.getElementById('node-3')
    ];

    // Default Static Background Image
    const defaultBgUrl = 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?q=80&w=1200&auto=format&fit=crop';
    globalBgImage.style.backgroundImage = `url('${defaultBgUrl}')`;

    /* FLOATING EMBERS PARTICLE SYSTEM */
    const canvas = document.getElementById('embers-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Ember {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 20;
            this.size = Math.random() * 3 + 1;
            this.speedY = Math.random() * 1.2 + 0.4;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.opacity = Math.random() * 0.7 + 0.3;
            this.color = Math.random() > 0.4 ? '#FFB432' : '#D4AF37';
        }
        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.opacity -= 0.003;
            if (this.y < -10 || this.opacity <= 0) {
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < 40; i++) {
        particles.push(new Ember());
    }

    function animateEmbers() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateEmbers);
    }
    animateEmbers();

    /* PHASE TRANSITION: INTRO -> MAIN */
    btnExplore.addEventListener('click', () => {
        phaseIntro.style.opacity = '0';
        setTimeout(() => {
            phaseIntro.classList.add('hidden');
            phaseMain.classList.remove('hidden');
            phaseMain.style.opacity = '0';
            setTimeout(() => phaseMain.style.opacity = '1', 50);
        }, 800);
    });

    /* STORY DATA */
    const storyDatabase = {
        1: {
            title: "TIGA PANGERAN, SATU ISTANA YANG RETAK",
            content: `
                <p>Tahun 1857. Sultan Adam Al-Watsiqu Billah wafat. Istana Banjarmassin yang anggun seketika retak oleh intrik kekuasaan. Awan gelap menyelimuti bumi Banjar, menandakan awal bencana perang yang dahsyat.</p>
                <p>Tiga pangeran terperangkap dalam perebutan tahta warisan leluhur:</p>
                <ul>
                    <li><strong>Pangeran Tamjidillah II</strong> — Cucu Sultan Adam yang sangat disukai pihak kolonial Belanda. Ia diangkat secara sepihak oleh Belanda pada tahun 1852, namun dibenci oleh rakyat Banjar.</li>
                    <li><strong>Pangeran Prabu Anom</strong> — Putra Sultan Adam yang dikenal bertindak sewenang-wenang sehingga kurang mendapat dukungan rakyat.</li>
                    <li><strong>Pangeran Hidayatullah II</strong> — Mangkubumi Kerajaan yang amat dicintai rakyat dan ulama, merupakan calon pengganti sah sesuai wasiat Sultan.</li>
                </ul>
                <p>Pemerintah Kolonial Belanda dengan licik memanipulasi perselisihan ini untuk menancapkan kuku kekuasaannya. Namun rakyat tidak tinggal diam, mereka menanti waktu untuk bangkit...</p>
            `
        },
        2: {
            title: "API PERANG MELETUS DI TAHUN 1859",
            content: `
                <p>Di tengah kezaliman yang memuncak, api perlawanan akhirnya menyala. Pada tanggal 28 April 1859, benteng dan tambang batu bara milik Belanda di Pengaron diserang secara mendadak!</p>
                <p><strong>Pangeran Antasari</strong> bersama dengan para panglima terkemuka seperti Kyai Demang Leman, Tumenggung Surapati, dan Nyai Inanta memimpin pasukan rakyat Banjar.</p>
                <p>Belanda terkejut dan mencoba meredam gejolak perang:</p>
                <ul>
                    <li>Menurunkan Pangeran Tamjidillah II yang dibenci dari tahta.</li>
                    <li>Menawarkan tahta Kesultanan kepada Pangeran Hidayatullah II.</li>
                </ul>
                <p>Namun Pangeran Hidayatullah dengan tegas <strong>menolak</strong> menjadi raja boneka! Beliau memilih turun ke medan perang bergerilya bersama Pangeran Antasari. Belanda yang murka kemudian menghapuskan Kesultanan Banjar secara sepihak pada tahun 1860.</p>
            `
        },
        3: {
            title: "PANGERAN ANTASARI: SULTAN RAKYAT, PAHLAWAN ABADI",
            content: `
                <p>Rakyat Banjar tidak membutuhkan pengakuan Belanda. Dalam musyawarah besar di hulu Sungai Teweh pada tanggal 14 Maret 1862, Pangeran Antasari diangkat oleh seluruh rakyat, ulama, dan panglima sebagai <em>Panembahan Amiruddin Khalifatul Mukminin</em> — Pemimpin Tertinggi Agama dan Kerajaan Banjar.</p>
                <p>Dengan semboyan legendaris yang menggetarkan bumi Kalimantan:</p>
                <p style="text-align: center; font-style: italic; font-weight: bold; color: var(--sasirangan-red); font-size: 1.25rem;">
                    "Haram Menyerah, Waja Sampai Ka Puting!"<br>
                    <span style="font-size: 0.9rem; font-weight: normal; color: var(--ink-faded);">(Baja hingga ke ujungnya — Berjuang hingga tetes darah terakhir!)</span>
                </p>
                <p>Perang berkobar hebat di seluruh penjuru Banjar dan Dayak. Meskipun Pangeran Antasari wafat pada Oktober 1862 karena wabah cacar, perlawanan rakyat terus menyala selama puluhan tahun berikutnya. Nama beliau diabadikan bukan karena tahta, melainkan karena keagungan jiwanya yang tak pernah tunduk!</p>
            `
        }
    };

    let currentUnlockedId = 1;
    let isAllRead = false; 
    let hasViewedChapter3 = false; 

    /* UPDATE VISUAL PROGRESS BAR & NODES */
    function updateProgressBar(currentStep) {
        const percent = ((currentStep - 1) / 2) * 100;
        progressFill.style.width = `${percent}%`;

        nodes.forEach((node, index) => {
            const stepNum = index + 1;
            node.classList.remove('active', 'completed');
            if (stepNum < currentStep) {
                node.classList.add('completed');
                node.innerHTML = '<i class="ph-bold ph-check"></i>';
            } else if (stepNum === currentStep) {
                node.classList.add('active');
                node.innerHTML = `${stepNum}`;
            } else {
                node.innerHTML = `${stepNum}`;
            }
        });

        modalMiniTitle.textContent = `Lembaran ${currentStep === 1 ? 'I' : currentStep === 2 ? 'II' : 'III'} — Bagian ${currentStep} dari 3`;
        progressPercentText.textContent = `Bagian ${currentStep} dari 3`;
    }

    /* OPEN STORY MODAL */
    function openStoryModal(id) {
        const story = storyDatabase[id];
        if (!story) return;

        if (id === 3) hasViewedChapter3 = true;

        modalChapterTitle.textContent = story.title;
        modalChapterBody.innerHTML = story.content;

        updateProgressBar(id);

        if (id < 3) {
            btnNextChapter.innerHTML = `<span>Lanjut ke Lembaran ${id === 1 ? 'II' : 'III'}</span> <i class="ph ph-arrow-right"></i>`;
            btnNextChapter.onclick = () => {
                unlockStoryCard(id + 1);
                openStoryModal(id + 1);
            };
        } else {
            btnNextChapter.innerHTML = `<span>Selesai & Tutup Arsip</span> <i class="ph ph-check-circle"></i>`;
            btnNextChapter.onclick = closeStoryModal; 
        }

        storyModal.classList.add('active');
    }

    /* CLOSE STORY MODAL */
    function closeStoryModal() {
        storyModal.classList.remove('active');
        
        if (hasViewedChapter3 && !isAllRead) {
            isAllRead = true;
            setTimeout(() => {
                const berjuangContainer = document.getElementById('berjuang-container');
                if(berjuangContainer) {
                    berjuangContainer.style.display = 'block';
                    setTimeout(() => {
                        berjuangContainer.classList.add('visible');
                        startButtonParticles(); 
                    }, 50);
                }
            }, 600);
        }
    }

    function unlockStoryCard(nextId) {
        if (nextId > currentUnlockedId) {
            currentUnlockedId = nextId;
            storyCards.forEach(card => {
                const cardId = parseInt(card.getAttribute('data-id'));
                if (cardId <= currentUnlockedId) {
                    card.classList.remove('locked');
                    card.classList.add('unlocked');
                    const status = card.querySelector('.card-status');
                    status.textContent = 'Terbuka';
                    const icon = card.querySelector('.card-icon');
                    if (cardId === 1) icon.className = 'ph-duotone ph-crown card-icon';
                    if (cardId === 2) icon.className = 'ph-duotone ph-flame card-icon';
                    if (cardId === 3) icon.className = 'ph-duotone ph-shield-checkered card-icon';
                }
            });
        }
    }

    storyCards.forEach(card => {
        card.addEventListener('click', () => {
            const cardId = parseInt(card.getAttribute('data-id'));
            if (cardId <= currentUnlockedId) {
                openStoryModal(cardId);
            } else {
                card.style.transform = 'translateX(-8px)';
                setTimeout(() => card.style.transform = 'translateX(8px)', 100);
                setTimeout(() => card.style.transform = 'translateX(-8px)', 200);
                setTimeout(() => card.style.transform = 'none', 300);
            }
        });
    });

    btnModalBack.addEventListener('click', closeStoryModal);

    // --- FUNGSI BARU UNTUK PARTIKEL TOMBOL "AYO BERJUANG" ---
    function startButtonParticles() {
        const particleContainer = document.getElementById('button-particles');
        if (!particleContainer) return;
        
        setInterval(() => {
            const particle = document.createElement('div');
            particle.classList.add('btn-particle');
            
            const leftPos = Math.random() * 100;
            particle.style.left = `${leftPos}%`;
            
            particle.style.top = `${Math.random() * 80 + 10}%`; 
            
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particle.style.setProperty('--dir-x', Math.random());
            
            const duration = Math.random() * 1 + 0.8;
            particle.style.animationDuration = `${duration}s`;
            
            particleContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, duration * 1000);
        }, 150);
    }
});