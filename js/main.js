/**
 * Game Developer Portfolio - Main Controller & Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize iPhone-grade momentum smooth scroll (Lenis)
  initSmoothScroll();

  // Initialize 1-scroll next section snap flow
  initSectionScrollSnap();

  // Initialize canvas background particles
  if (typeof CyberParticleCanvas !== 'undefined') {
    new CyberParticleCanvas('cyber-canvas');
  }

  // Initialize all interactive modules
  initAudioControls();
  initNavigation();
  initHeroVisualTilt();
  initAboutStats();
  initSkillsSection();
  initProjectsSection();
  initProjectModals();
  initVideoPlayerModal();
  initProcessWorkflow();
  initExperienceTimeline();
  initResumeSection();
  initContactForm();
  initHashRouter();
  initThemeSettings();
  initButtonAudioEffects();
  initRobotLogoCompanion();
});

/* ==========================================================================
   IPHONE-GRADE MOMENTUM FLOW & SMOOTH SCROLL (LENIS)
   ========================================================================== */
function initSmoothScroll() {
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple exponential deceleration
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: true, // Momentum inertial scrolling on touch/iPhone
    touchMultiplier: 1.5, // Fluid iOS swipe sensitivity
    wheelMultiplier: 0.95, // Buttery mouse wheel glide
    infinite: false,
  });

  window.lenisInstance = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Smooth cinematic anchor scrolling for all internal navigation & buttons
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || href.startsWith('#/')) return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        lenis.scrollTo(targetEl, {
          offset: -65,
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    });
  });
}

function lockBodyScroll() {
  document.body.style.overflow = 'hidden';
  if (window.lenisInstance && typeof window.lenisInstance.stop === 'function') {
    window.lenisInstance.stop();
  }
}

function unlockBodyScroll() {
  document.body.style.overflow = '';
  if (window.lenisInstance && typeof window.lenisInstance.start === 'function') {
    window.lenisInstance.start();
  }
}

/* ==========================================================================
   ONE-SCROLL SECTION SNAP CONTROLLER (APPLE FLOW / KEYNOTE DECK)
   ========================================================================== */
function initSectionScrollSnap() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  if (!sections.length) return;

  const navDots = document.querySelectorAll('.section-nav-dot');
  const navLinks = document.querySelectorAll('.nav-link');
  let isSnapping = false;
  let cooldownTimer = null;
  let touchStartY = 0;
  let touchStartX = 0;

  function getSnapStops() {
    const navHeight = 70;
    const windowH = window.innerHeight;
    const stops = [];

    sections.forEach((sec, idx) => {
      const top = Math.max(0, sec.offsetTop - (idx === 0 ? 0 : navHeight));
      const secH = sec.offsetHeight;

      // Section Start stop
      stops.push({
        y: top,
        id: sec.id,
        isSub: false
      });

      // If section is significantly taller than screen, add lower stop
      if (secH > windowH + 180) {
        const bottomStop = top + secH - windowH + 30;
        stops.push({
          y: bottomStop,
          id: sec.id,
          isSub: true
        });
      }
    });

    return stops;
  }

  function getCurrentStopIndex(stops) {
    const currentY = window.scrollY;
    let closestIndex = 0;
    let minDiff = Infinity;

    stops.forEach((stop, i) => {
      const diff = Math.abs(stop.y - currentY);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    });

    return closestIndex;
  }

  function scrollToStop(index, playSfx = true) {
    const stops = getSnapStops();
    const clampedIndex = Math.max(0, Math.min(index, stops.length - 1));
    const targetStop = stops[clampedIndex];
    if (!targetStop) return;

    isSnapping = true;
    clearTimeout(cooldownTimer);

    // Update active indicators
    updateActiveSection(targetStop.id);

    if (playSfx && window.gameAudio) {
      window.gameAudio.playHover();
    }

    if (window.lenisInstance) {
      window.lenisInstance.scrollTo(targetStop.y, {
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          cooldownTimer = setTimeout(() => {
            isSnapping = false;
          }, 180);
        }
      });
    } else {
      window.scrollTo({
        top: targetStop.y,
        behavior: 'smooth'
      });
      cooldownTimer = setTimeout(() => {
        isSnapping = false;
      }, 950);
    }
  }

  function updateActiveSection(sectionId) {
    // Update navbar links
    navLinks.forEach(link => {
      const isTarget = link.getAttribute('href') === `#${sectionId}`;
      link.classList.toggle('active', isTarget);
    });

    // Update side dots
    navDots.forEach(dot => {
      const isTarget = dot.getAttribute('data-target') === `#${sectionId}`;
      dot.classList.toggle('active', isTarget);
    });
  }

  // Wheel listener: 1 scroll gesture = 1 section jump
  let wheelDeltaSum = 0;
  let wheelDebounceTimer = null;

  window.addEventListener('wheel', (e) => {
    // If any modal is open, let inner modal scroll normally
    const activeModal = document.querySelector('.modal-backdrop.active, .video-modal-backdrop.active, .theme-modal-backdrop.active');
    if (activeModal) return;

    // Ignore tiny trackpad noise
    if (Math.abs(e.deltaY) < 4) return;

    e.preventDefault();

    if (isSnapping) return;

    wheelDeltaSum += e.deltaY;
    clearTimeout(wheelDebounceTimer);

    wheelDebounceTimer = setTimeout(() => {
      wheelDeltaSum = 0;
    }, 150);

    const THRESHOLD = 35;
    if (Math.abs(wheelDeltaSum) >= THRESHOLD) {
      const stops = getSnapStops();
      const currentIdx = getCurrentStopIndex(stops);
      const direction = wheelDeltaSum > 0 ? 1 : -1;
      wheelDeltaSum = 0;

      const nextIdx = currentIdx + direction;
      if (nextIdx >= 0 && nextIdx < stops.length) {
        scrollToStop(nextIdx, true);
      }
    }
  }, { passive: false });

  // Touch swipe support (iPhone & Mobile)
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const activeModal = document.querySelector('.modal-backdrop.active, .video-modal-backdrop.active, .theme-modal-backdrop.active');
    if (activeModal) return;

    if (isSnapping) return;

    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;

    const diffY = touchStartY - touchEndY;
    const diffX = touchStartX - touchEndX;

    // Only if vertical swipe dominates horizontal swipe
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 40) {
      const stops = getSnapStops();
      const currentIdx = getCurrentStopIndex(stops);
      const direction = diffY > 0 ? 1 : -1;

      const nextIdx = currentIdx + direction;
      if (nextIdx >= 0 && nextIdx < stops.length) {
        scrollToStop(nextIdx, true);
      }
    }
  }, { passive: true });

  // Keyboard navigation (ArrowDown, ArrowUp, PageDown, PageUp, Space)
  window.addEventListener('keydown', (e) => {
    const activeModal = document.querySelector('.modal-backdrop.active, .video-modal-backdrop.active, .theme-modal-backdrop.active');
    if (activeModal) return;

    // Don't intercept if user is typing in contact form input or textarea
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
      if (!isSnapping) {
        const stops = getSnapStops();
        const currentIdx = getCurrentStopIndex(stops);
        if (currentIdx < stops.length - 1) scrollToStop(currentIdx + 1, true);
      }
    } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      if (!isSnapping) {
        const stops = getSnapStops();
        const currentIdx = getCurrentStopIndex(stops);
        if (currentIdx > 0) scrollToStop(currentIdx - 1, true);
      }
    }
  });

  // Attach click listener to side dots
  navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetId = dot.getAttribute('data-target')?.replace('#', '');
      const stops = getSnapStops();
      const matchIdx = stops.findIndex(s => s.id === targetId && !s.isSub);
      if (matchIdx !== -1) {
        scrollToStop(matchIdx, true);
      }
    });
  });

  // Expose globally
  window.sectionScrollSnap = {
    scrollToStop,
    getSnapStops
  };
}

/* ==========================================================================
   THEME & BACKGROUND HUD SETTINGS (5 THEMES & 5 BACKGROUNDS)
   ========================================================================== */
function initThemeSettings() {
  const themeModal = document.getElementById('theme-modal');
  const themeBtn = document.getElementById('theme-settings-btn');
  const closeBtn = document.getElementById('theme-modal-close');
  const themeCards = document.querySelectorAll('#theme-options-list .theme-option-card');
  const bgCards = document.querySelectorAll('.bg-option-card');
  const tabBtns = document.querySelectorAll('.hud-tab-btn');
  const tabPanes = {
    'themes': document.getElementById('pane-themes'),
    'backgrounds': document.getElementById('pane-backgrounds')
  };

  // Tab switching logic (Color Themes vs Background Styles)
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabKey = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.toggle('active', b === btn));
      Object.entries(tabPanes).forEach(([key, pane]) => {
        if (pane) pane.classList.toggle('active', key === tabKey);
      });
      if (window.gameAudio) window.gameAudio.playClick();
    });
  });

  const THEMES_CONFIG = {
    'cyber-blue': {
      name: 'Cyber Blue',
      primaryRgb: '29, 114, 254',
      secondaryRgb: '0, 212, 255',
      shadowHex: '#1d72fe'
    },
    'cyber-cyan': {
      name: 'Cyber Cyan',
      primaryRgb: '0, 240, 255',
      secondaryRgb: '168, 85, 247',
      shadowHex: '#00f0ff'
    },
    'emerald-matrix': {
      name: 'Emerald Matrix',
      primaryRgb: '0, 255, 136',
      secondaryRgb: '16, 185, 129',
      shadowHex: '#00ff88'
    },
    'crimson-fury': {
      name: 'Crimson Fury',
      primaryRgb: '255, 42, 95',
      secondaryRgb: '255, 85, 0',
      shadowHex: '#ff2a5f'
    },
    'royal-void': {
      name: 'Royal Void',
      primaryRgb: '192, 66, 255',
      secondaryRgb: '0, 229, 255',
      shadowHex: '#c042ff'
    },
    'solar-amber': {
      name: 'Solar Amber',
      primaryRgb: '255, 183, 3',
      secondaryRgb: '251, 133, 0',
      shadowHex: '#ffb703'
    }
  };

  function applyTheme(themeKey, playSfx = false) {
    const config = THEMES_CONFIG[themeKey] || THEMES_CONFIG['cyber-blue'];
    document.documentElement.setAttribute('data-theme', themeKey);
    localStorage.setItem('gamedev_portfolio_theme', themeKey);

    // Update particle canvas colors
    if (window.cyberCanvasInstance && typeof window.cyberCanvasInstance.setThemeColors === 'function') {
      window.cyberCanvasInstance.setThemeColors(config.primaryRgb, config.secondaryRgb, config.shadowHex);
    }

    // Update active theme card indicator
    themeCards.forEach(card => {
      const isCurrent = card.getAttribute('data-theme-key') === themeKey;
      card.classList.toggle('active', isCurrent);
      const tag = card.querySelector('.theme-status-tag');
      if (tag) tag.textContent = isCurrent ? 'ACTIVE' : 'SELECT';
    });

    if (playSfx && window.gameAudio) {
      window.gameAudio.playClick();
    }
  }

  function applyBackground(bgKey, playSfx = false) {
    const validBgs = ['cyber-grid', 'deep-space', 'hex-shield', 'synth-scanlines', 'carbon-matrix'];
    const activeBg = validBgs.includes(bgKey) ? bgKey : 'cyber-grid';

    document.documentElement.setAttribute('data-bg', activeBg);
    document.body.setAttribute('data-bg', activeBg);
    localStorage.setItem('gamedev_portfolio_bg', activeBg);

    // Update particle canvas animation physics for the background mode
    if (window.cyberCanvasInstance && typeof window.cyberCanvasInstance.setBackgroundMode === 'function') {
      window.cyberCanvasInstance.setBackgroundMode(activeBg);
    }

    // Update active background card indicator
    bgCards.forEach(card => {
      const isCurrent = card.getAttribute('data-bg-key') === activeBg;
      card.classList.toggle('active', isCurrent);
      const tag = card.querySelector('.theme-status-tag');
      if (tag) tag.textContent = isCurrent ? 'ACTIVE' : 'SELECT';
    });

    if (playSfx && window.gameAudio) {
      window.gameAudio.playClick();
    }
  }

  // Load saved theme & background or defaults
  const savedTheme = localStorage.getItem('gamedev_portfolio_theme') || 'cyber-blue';
  applyTheme(savedTheme, false);

  const savedBg = localStorage.getItem('gamedev_portfolio_bg') || 'cyber-grid';
  applyBackground(savedBg, false);

  // Open modal
  if (themeBtn && themeModal) {
    themeBtn.addEventListener('click', () => {
      themeModal.classList.add('active');
      lockBodyScroll();
      if (window.gameAudio) window.gameAudio.playOpenModal();
    });
  }

  // Close modal
  function closeThemeModal() {
    if (themeModal) {
      themeModal.classList.remove('active');
      unlockBodyScroll();
      if (window.gameAudio) window.gameAudio.playCloseModal();
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeThemeModal);
  if (themeModal) {
    themeModal.addEventListener('click', (e) => {
      if (e.target === themeModal) closeThemeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && themeModal && themeModal.classList.contains('active')) {
      closeThemeModal();
    }
  });

  // Attach click listener to each theme card
  themeCards.forEach(card => {
    card.addEventListener('click', () => {
      const themeKey = card.getAttribute('data-theme-key');
      applyTheme(themeKey, true);
    });
  });

  // Attach click listener to each background card
  bgCards.forEach(card => {
    card.addEventListener('click', () => {
      const bgKey = card.getAttribute('data-bg-key');
      applyBackground(bgKey, true);
    });
  });
}

/* ==========================================================================
   AUDIO HUD CONTROLS
   ========================================================================== */
function initAudioControls() {
  const soundBtn = document.getElementById('sound-toggle');
  const soundLabel = document.getElementById('sound-status-text');

  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    if (window.gameAudio) {
      const isEnabled = window.gameAudio.toggleSound();
      if (isEnabled) {
        soundBtn.classList.remove('muted');
        if (soundLabel) soundLabel.textContent = 'SFX: ON';
        window.gameAudio.playClick();
      } else {
        soundBtn.classList.add('muted');
        if (soundLabel) soundLabel.textContent = 'SFX: OFF';
      }
    }
  });
}

function initButtonAudioEffects() {
  // Attach subtle audio hovers and clicks to buttons and interactive links
  const interactives = document.querySelectorAll('button, .btn, .nav-link, .nav-avatar-pill, .nav-menu-toggle, .menu-action-item, .dropdown-nav-link, .filter-btn, .skills-tab-btn, .social-btn, .process-step-card');
  
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (window.gameAudio) window.gameAudio.playHover();
    });
    el.addEventListener('click', () => {
      if (window.gameAudio) window.gameAudio.playClick();
    });
  });
}

/* ==========================================================================
   NAVIGATION & SCROLL SPY
   ========================================================================== */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const sections = document.querySelectorAll('section[id]');

  // Scroll listener for sticky navbar appearance
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy for active link
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-link, .dropdown-nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });

    const navDots = document.querySelectorAll('.section-nav-dot');
    navDots.forEach(dot => {
      dot.classList.toggle('active', dot.getAttribute('data-target') === `#${currentId}`);
    });
  });

  // 3-Line Menu & Dropdown (Desktop & Mobile)
  const menuToggle = document.querySelector('.nav-menu-toggle, .mobile-nav-toggle');
  const menuDropdown = document.getElementById('nav-menu-dropdown');

  if (menuToggle && menuDropdown) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menuDropdown.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (window.gameAudio) window.gameAudio.playClick();
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!menuDropdown.contains(e.target) && !menuToggle.contains(e.target)) {
        menuDropdown.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuDropdown.classList.contains('open')) {
        menuDropdown.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close dropdown when any navigation link inside is clicked
    menuDropdown.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuDropdown.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close dropdown when Theme Studio button is clicked (modal opens)
    const themeBtn = document.getElementById('theme-settings-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        menuDropdown.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    }
  }
}

/* ==========================================================================
   CYBER GEOMETRIC SHIELD 3D TILT & PARALLAX INTERACTION
   ========================================================================== */
function initHeroVisualTilt() {
  const card = document.querySelector('.hero-shield-card, #hero-visual-card');
  const wrapper = document.querySelector('.hero-shield-wrapper, #hero-visual-wrapper');
  if (!card || !wrapper) return;

  const floatChip = wrapper.querySelector('.hero-float-chip');

  wrapper.addEventListener('mouseenter', () => {
    card.style.animationPlayState = 'paused';
  });

  wrapper.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale(1.025)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.animationPlayState = 'running';
  });

  // Audio feedback on floating architecture chip
  if (floatChip) {
    floatChip.addEventListener('mouseenter', () => {
      if (window.gameAudio && typeof window.gameAudio.playHover === 'function') {
        window.gameAudio.playHover();
      }
    });
    floatChip.addEventListener('click', () => {
      if (window.gameAudio && typeof window.gameAudio.playClick === 'function') {
        window.gameAudio.playClick();
      }
    });
  }
}

/* ==========================================================================
   ABOUT STATS ANIMATION
   ========================================================================== */
function initAboutStats() {
  const statFills = document.querySelectorAll('.stat-fill');
  if (!statFills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statFills.forEach(fill => {
          const width = fill.getAttribute('data-level') || '85%';
          fill.style.width = width;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  const panel = document.querySelector('.about-stats-panel');
  if (panel) observer.observe(panel);
}

/* ==========================================================================
   SKILLS SECTION (CATEGORIZED TABS)
   ========================================================================== */
function initSkillsSection() {
  const skillsContainer = document.getElementById('skills-grid-container');
  const tabButtons = document.querySelectorAll('.skills-tab-btn');
  if (!skillsContainer || typeof RESUME_DATA === 'undefined') return;

  const skillsData = RESUME_DATA.skillsCategorized;

  function renderSkills(categoryKey) {
    let list = [];
    if (categoryKey === 'all') {
      list = [
        ...skillsData.engines,
        ...skillsData.programming,
        ...skillsData.gameplaySystems,
        ...skillsData.tools
      ];
    } else {
      list = skillsData[categoryKey] || [];
    }

    skillsContainer.innerHTML = list.map(skill => `
      <div class="skill-card">
        <div class="skill-card-top">
          <div class="skill-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <span class="skill-badge">${skill.badge || 'Expert'}</span>
        </div>
        <h4 class="skill-card-title">${skill.name}</h4>
        <div class="skill-card-exp">${skill.experience ? `Experience: ${skill.experience}` : 'Proficient in Production'}</div>
        <div class="skill-progress-bar">
          <div class="skill-progress-fill" style="width: ${skill.level}%"></div>
        </div>
      </div>
    `).join('');

    // Reattach sound effects
    initButtonAudioEffects();
  }

  // Initial render: Game Engines & Gameplay
  renderSkills('engines');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      renderSkills(cat);
    });
  });
}

/* ==========================================================================
   TECHNICAL BLUEPRINT & ENGINE SIMULATION GENERATOR (NO AI IMAGES)
   ========================================================================== */
function getProjectBlueprintSvg(projectId, isModal = false) {
  const vbW = isModal ? 800 : 480;
  const vbH = isModal ? 340 : 270;
  
  const defs = `
    <defs>
      <pattern id="bpGrid_${projectId}_${isModal ? 'm' : 'c'}" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(0, 240, 255, 0.09)" stroke-width="0.75" />
      </pattern>
      <filter id="bpGlow_${projectId}_${isModal ? 'm' : 'c'}">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  `;

  const glowRef = `url(#bpGlow_${projectId}_${isModal ? 'm' : 'c'})`;
  const gridRef = `url(#bpGrid_${projectId}_${isModal ? 'm' : 'c'})`;

  let content = '';

  if (projectId === 'battleships-multiplayer') {
    content = `
      <rect width="100%" height="100%" fill="#050b14" />
      <rect width="100%" height="100%" fill="${gridRef}" />
      <g transform="translate(240, 135)">
        <circle r="32" fill="none" stroke="rgba(0, 240, 255, 0.25)" stroke-width="1" />
        <circle r="65" fill="none" stroke="rgba(0, 240, 255, 0.3)" stroke-width="1" stroke-dasharray="4, 3" />
        <circle r="98" fill="none" stroke="rgba(0, 240, 255, 0.25)" stroke-width="1" />
        <circle r="125" fill="none" stroke="rgba(0, 240, 255, 0.45)" stroke-width="1.4" />
        <line x1="-135" y1="0" x2="135" y2="0" stroke="rgba(0, 240, 255, 0.3)" stroke-width="1" />
        <line x1="0" y1="-135" x2="0" y2="135" stroke="rgba(0, 240, 255, 0.3)" stroke-width="1" />
        <!-- Rotating Sonar Sweep Beam -->
        <g class="bp-sonar-sweep-rotor">
          <line x1="0" y1="0" x2="125" y2="0" stroke="#00f0ff" stroke-width="2.2" filter="${glowRef}" />
          <path d="M 0 0 L 125 0 A 125 125 0 0 0 102 -72 Z" fill="rgba(0, 240, 255, 0.14)" />
        </g>
        <!-- Allied Fleet Blip (Photon Synced) -->
        <g transform="translate(-60, 45)">
          <circle r="4.5" fill="#00f0ff" filter="${glowRef}" />
          <circle r="12" fill="none" stroke="#00f0ff" class="bp-pulse-ring" />
          <text x="10" y="4" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="700">P1: CRUISER [SYNC]</text>
        </g>
        <!-- Allied Support Carrier -->
        <g transform="translate(-85, -40)">
          <polygon points="0,-6 6,5 -6,5" fill="#38bdf8" />
          <text x="9" y="3" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8">P1: CARRIER</text>
        </g>
        <!-- Hostile Target Blip -->
        <g transform="translate(70, -60)">
          <rect x="-4.5" y="-4.5" width="9" height="9" fill="#f43f5e" filter="${glowRef}" />
          <circle r="14" fill="none" stroke="#f43f5e" stroke-dasharray="3, 3" />
          <text x="12" y="4" fill="#fda4af" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="700">HOSTILE [LOCK]</text>
        </g>
        <!-- Ballistic Artillery Missile Trajectory Curve -->
        <path d="M -60 45 Q 15 -90 70 -60" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6, 3" class="bp-ballistic-path" filter="${glowRef}" />
        <circle cx="12" cy="-48" r="3.5" fill="#f59e0b" filter="${glowRef}" />
      </g>
      <!-- Telemetry Status Line -->
      <text x="18" y="248" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="700" letter-spacing="0.08em">PHOTON PUN2 • SERVER-AUTHORITATIVE • 60Hz TICK</text>
      <text x="460" y="248" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8.5">RADAR: SECTOR B-7</text>
    `;
  } else if (projectId === 'tower-defense') {
    content = `
      <rect width="100%" height="100%" fill="#050e18" />
      <rect width="100%" height="100%" fill="${gridRef}" />
      <!-- Tactical Creep Corridor Path -->
      <path d="M 40 195 L 140 195 L 195 90 L 290 90 L 340 185 L 440 185" fill="none" stroke="rgba(0, 240, 255, 0.22)" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M 40 195 L 140 195 L 195 90 L 290 90 L 340 185 L 440 185" fill="none" stroke="#00f0ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="8, 6" class="bp-path-flow" filter="${glowRef}" />
      <!-- Tower 1: Tesla Coil Node -->
      <g transform="translate(145, 125)">
        <circle r="48" fill="rgba(168, 85, 247, 0.08)" stroke="#c084fc" stroke-width="1.2" stroke-dasharray="3, 3" />
        <polygon points="0,-18 10,12 -10,12" fill="none" stroke="#00f0ff" stroke-width="2" />
        <circle cy="-18" r="6" fill="#c084fc" filter="${glowRef}" />
        <line x1="0" y1="-18" x2="35" y2="-10" stroke="#a855f7" stroke-width="2.2" class="bp-laser-beam" filter="${glowRef}" />
        <text x="0" y="26" text-anchor="middle" fill="#c084fc" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="700">TESLA [LVL 3]</text>
      </g>
      <!-- Tower 2: Plasma Cannon -->
      <g transform="translate(265, 155)">
        <circle r="52" fill="rgba(0, 240, 255, 0.06)" stroke="#00f0ff" stroke-width="1.2" stroke-dasharray="4, 3" />
        <rect x="-10" y="-10" width="20" height="20" rx="3" fill="none" stroke="#38bdf8" stroke-width="2" />
        <line x1="0" y1="0" x2="48" y2="12" stroke="#00f0ff" stroke-width="2.2" class="bp-laser-beam" filter="${glowRef}" />
        <text x="0" y="26" text-anchor="middle" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="700">PLASMA [AOE]</text>
      </g>
      <!-- Advancing Creep Wave Nodes with Healthbars -->
      <g transform="translate(180, 115)">
        <polygon points="0,-6 6,0 0,6 -6,0" fill="#f43f5e" filter="${glowRef}" />
        <rect x="-8" y="-12" width="16" height="2.5" fill="rgba(255,255,255,0.2)" />
        <rect x="-8" y="-12" width="11" height="2.5" fill="#10b981" />
      </g>
      <g transform="translate(315, 168)">
        <polygon points="0,-6 6,0 0,6 -6,0" fill="#f43f5e" filter="${glowRef}" />
        <rect x="-8" y="-12" width="16" height="2.5" fill="rgba(255,255,255,0.2)" />
        <rect x="-8" y="-12" width="5" height="2.5" fill="#f43f5e" />
      </g>
      <text x="18" y="248" fill="#c084fc" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="700">OBJECT POOL: 120 CREEPS • HEURISTIC AI • 0KB GC</text>
      <text x="460" y="248" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8.5">SCRIPTABLE_OBJECT WAVES</text>
    `;
  } else if (projectId === 'first-person-shooter') {
    content = `
      <rect width="100%" height="100%" fill="#070c16" />
      <rect width="100%" height="100%" fill="${gridRef}" />
      <!-- Center Holographic Reticle -->
      <g transform="translate(240, 125)" class="bp-reticle-group">
        <circle r="48" fill="none" stroke="rgba(0, 240, 255, 0.35)" stroke-width="1.2" />
        <circle r="48" fill="none" stroke="#00f0ff" stroke-width="2" stroke-dasharray="16, 59" filter="${glowRef}" />
        <circle r="2.5" fill="#f43f5e" filter="${glowRef}" />
        <path d="M 0 -22 L 0 -10 M 0 22 L 0 10 M -22 0 L -10 0 M 22 0 L 10 0" stroke="#00f0ff" stroke-width="2" />
        <path d="M -30 -20 L -30 -30 L -20 -30 M 30 -20 L 30 -30 L 20 -30 M -30 20 L -30 30 L -20 30 M 30 20 L 30 30 L 20 30" stroke="rgba(255, 255, 255, 0.45)" stroke-width="1.2" fill="none" />
      </g>
      <!-- Procedural Recoil Spring Dampener Graph -->
      <g transform="translate(335, 35)">
        <rect x="0" y="0" width="125" height="62" fill="rgba(6, 12, 22, 0.88)" stroke="rgba(0, 240, 255, 0.3)" rx="4" />
        <path d="M 10 48 Q 25 12 40 40 T 70 36 T 95 37 T 120 37" fill="none" stroke="#38bdf8" stroke-width="2" filter="${glowRef}" />
        <text x="8" y="16" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700">RECOIL DAMPENER</text>
        <text x="8" y="55" fill="#64748b" font-family="'JetBrains Mono', monospace" font-size="7">f(t)=e^(-λt)cos(ωt)</text>
      </g>
      <!-- Ammunition HUD -->
      <g transform="translate(25, 45)">
        <rect x="0" y="0" width="120" height="52" fill="rgba(6, 12, 22, 0.88)" stroke="rgba(0, 240, 255, 0.3)" rx="4" />
        <text x="10" y="19" fill="#ffffff" font-family="'Rajdhani', sans-serif" font-size="14" font-weight="800">AMMO: 30 / 120</text>
        <rect x="10" y="27" width="100" height="5" fill="rgba(255,255,255,0.15)" rx="2" />
        <rect x="10" y="27" width="80" height="5" fill="#00f0ff" rx="2" filter="${glowRef}" />
        <text x="10" y="44" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="7.5">CAL: 5.56 NATO [AUTO]</text>
      </g>
      <text x="18" y="248" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="700">RAYCAST HITSCAN • SPRING SWAY PHYSICS • 60+ FPS</text>
      <text x="460" y="248" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8.5">FSM COMBAT AI</text>
    `;
  } else if (projectId === 'flight-simulator') {
    content = `
      <rect width="100%" height="100%" fill="#050e18" />
      <rect width="100%" height="100%" fill="${gridRef}" />
      <!-- Artificial Horizon & Pitch Ladder -->
      <g transform="translate(240, 125)" class="bp-flight-horizon">
        <line x1="-120" y1="0" x2="120" y2="0" stroke="#00f0ff" stroke-width="2.2" filter="${glowRef}" />
        <g stroke="rgba(0, 240, 255, 0.65)" stroke-width="1.5">
          <line x1="-35" y1="-30" x2="35" y2="-30" />
          <line x1="-20" y1="-15" x2="20" y2="-15" />
          <line x1="-20" y1="15" x2="20" y2="15" stroke-dasharray="4, 3" />
          <line x1="-35" y1="30" x2="35" y2="30" stroke-dasharray="4, 3" />
        </g>
        <text x="42" y="-27" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="8">+10°</text>
        <text x="42" y="33" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="8">-10°</text>
        <!-- Center Aircraft Boresight -->
        <circle r="5" fill="none" stroke="#f59e0b" stroke-width="2" />
        <line x1="-18" y1="0" x2="-5" y2="0" stroke="#f59e0b" stroke-width="2.5" />
        <line x1="5" y1="0" x2="18" y2="0" stroke="#f59e0b" stroke-width="2.5" />
      </g>
      <!-- Airspeed Tape (Left) -->
      <g transform="translate(45, 55)">
        <rect x="0" y="0" width="46" height="135" fill="rgba(6, 12, 22, 0.88)" stroke="rgba(0, 240, 255, 0.3)" rx="3" />
        <text x="23" y="24" text-anchor="middle" fill="#64748b" font-family="'JetBrains Mono', monospace" font-size="8">260</text>
        <rect x="2" y="48" width="42" height="22" fill="rgba(0, 240, 255, 0.22)" stroke="#00f0ff" stroke-width="1" rx="2" />
        <text x="23" y="63" text-anchor="middle" fill="#ffffff" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700">240</text>
        <text x="23" y="102" text-anchor="middle" fill="#64748b" font-family="'JetBrains Mono', monospace" font-size="8">220</text>
        <text x="23" y="125" text-anchor="middle" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="7">KTS</text>
      </g>
      <!-- Altitude Tape (Right) -->
      <g transform="translate(390, 55)">
        <rect x="0" y="0" width="56" height="135" fill="rgba(6, 12, 22, 0.88)" stroke="rgba(0, 240, 255, 0.3)" rx="3" />
        <text x="28" y="24" text-anchor="middle" fill="#64748b" font-family="'JetBrains Mono', monospace" font-size="8">4600</text>
        <rect x="2" y="48" width="52" height="22" fill="rgba(0, 240, 255, 0.22)" stroke="#00f0ff" stroke-width="1" rx="2" />
        <text x="28" y="63" text-anchor="middle" fill="#ffffff" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700">4500</text>
        <text x="28" y="102" text-anchor="middle" fill="#64748b" font-family="'JetBrains Mono', monospace" font-size="8">4400</text>
        <text x="28" y="125" text-anchor="middle" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="7">ALT FT</text>
      </g>
      <text x="18" y="248" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="700">AERODYNAMIC RIGIDBODY PHYSICS • 6-DOF FORCES</text>
      <text x="460" y="248" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8.5">LIFT / DRAG / YAW</text>
    `;
  } else if (projectId === 'liquid-sort') {
    content = `
      <rect width="100%" height="100%" fill="#090716" />
      <rect width="100%" height="100%" fill="${gridRef}" />
      <g transform="translate(90, 48)">
        <!-- Tube 1 (Standing Upright) -->
        <g transform="translate(40, 10)">
          <rect x="0" y="0" width="34" height="110" rx="17" fill="rgba(15, 23, 42, 0.7)" stroke="#38bdf8" stroke-width="1.8" />
          <path d="M 3 65 L 31 65 L 31 93 A 14 14 0 0 1 3 93 Z" fill="#00f0ff" opacity="0.85" filter="${glowRef}" />
          <path d="M 3 35 L 31 35 L 31 65 L 3 65 Z" fill="#a855f7" opacity="0.85" />
          <text x="17" y="132" text-anchor="middle" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="8">TUBE 01</text>
        </g>
        <!-- Tube 2 (Tilted Pouring) -->
        <g transform="translate(140, 20) rotate(-35)">
          <rect x="0" y="0" width="34" height="110" rx="17" fill="rgba(15, 23, 42, 0.7)" stroke="#c084fc" stroke-width="1.8" />
          <path d="M 3 50 L 31 35 L 31 93 A 14 14 0 0 1 3 93 Z" fill="#10b981" opacity="0.85" filter="${glowRef}" />
          <text x="17" y="132" text-anchor="middle" fill="#c084fc" font-family="'JetBrains Mono', monospace" font-size="8">POURING</text>
        </g>
        <!-- Pouring Stream Arc -->
        <path d="M 125 15 Q 170 30 185 85" fill="none" stroke="#10b981" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="8, 4" class="bp-stream-flow" filter="${glowRef}" />
        <!-- Tube 3 (Receiving Fluid) -->
        <g transform="translate(200, 10)">
          <rect x="0" y="0" width="34" height="110" rx="17" fill="rgba(15, 23, 42, 0.7)" stroke="#10b981" stroke-width="1.8" />
          <path d="M 3 80 L 31 80 L 31 93 A 14 14 0 0 1 3 93 Z" fill="#10b981" opacity="0.85" filter="${glowRef}" />
          <text x="17" y="132" text-anchor="middle" fill="#10b981" font-family="'JetBrains Mono', monospace" font-size="8">TUBE 03</text>
        </g>
      </g>
      <!-- Command Pattern Undo Stack Diagram -->
      <g transform="translate(325, 48)">
        <rect x="0" y="0" width="135" height="118" fill="rgba(6, 12, 22, 0.88)" stroke="rgba(168, 85, 247, 0.35)" rx="4" />
        <text x="12" y="20" fill="#c084fc" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="700">COMMAND PATTERN</text>
        <rect x="12" y="32" width="111" height="20" fill="rgba(0, 240, 255, 0.15)" stroke="#00f0ff" stroke-width="1" rx="2" />
        <text x="67" y="45" text-anchor="middle" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="8">[STATE: STEP 12]</text>
        <text x="67" y="68" text-anchor="middle" fill="#64748b" font-family="'JetBrains Mono', monospace" font-size="7">↕ UNDO / REDO STACK</text>
        <rect x="12" y="76" width="111" height="20" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="1" rx="2" />
        <text x="67" y="89" text-anchor="middle" fill="#10b981" font-family="'JetBrains Mono', monospace" font-size="8">[SOLVABILITY: 100%]</text>
      </g>
      <text x="18" y="248" fill="#10b981" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="700">CONSTRAINT SOLVER • COMMAND PATTERN UNDO • 120 FPS</text>
      <text x="460" y="248" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8.5">DOTWEEN FLUID</text>
    `;
  } else if (projectId === 'solitaire-collection') {
    content = `
      <rect width="100%" height="100%" fill="#05120e" />
      <rect width="100%" height="100%" fill="${gridRef}" />
      <!-- Foundation Target Piles -->
      <g transform="translate(245, 22)">
        <rect x="0" y="0" width="42" height="58" rx="4" fill="none" stroke="rgba(0, 240, 255, 0.35)" stroke-dasharray="3, 3" />
        <text x="21" y="36" text-anchor="middle" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="16">♠</text>
        <rect x="54" y="0" width="42" height="58" rx="4" fill="none" stroke="rgba(244, 63, 94, 0.35)" stroke-dasharray="3, 3" />
        <text x="75" y="36" text-anchor="middle" fill="#f43f5e" font-family="'JetBrains Mono', monospace" font-size="16">♥</text>
        <rect x="108" y="0" width="42" height="58" rx="4" fill="none" stroke="rgba(0, 240, 255, 0.35)" stroke-dasharray="3, 3" />
        <text x="129" y="36" text-anchor="middle" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="16">♣</text>
        <rect x="162" y="0" width="42" height="58" rx="4" fill="none" stroke="rgba(244, 63, 94, 0.35)" stroke-dasharray="3, 3" />
        <text x="183" y="36" text-anchor="middle" fill="#f43f5e" font-family="'JetBrains Mono', monospace" font-size="16">♦</text>
      </g>
      <!-- Stock & Waste Piles -->
      <g transform="translate(30, 22)">
        <rect x="0" y="0" width="42" height="58" rx="4" fill="rgba(16, 185, 129, 0.16)" stroke="#10b981" stroke-width="1.5" />
        <text x="21" y="34" text-anchor="middle" fill="#10b981" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700">STOCK</text>
        <rect x="54" y="0" width="42" height="58" rx="4" fill="rgba(15, 23, 42, 0.88)" stroke="#38bdf8" stroke-width="1.5" />
        <text x="64" y="20" fill="#ffffff" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700">K♠</text>
        <text x="75" y="44" text-anchor="middle" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="18">♠</text>
      </g>
      <!-- Tableau Columns -->
      <g transform="translate(30, 92)">
        <rect x="0" y="0" width="42" height="58" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#38bdf8" stroke-width="1.2" />
        <text x="10" y="18" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700">A♥</text>
        <rect x="54" y="0" width="42" height="58" rx="4" fill="rgba(8, 14, 24, 0.8)" stroke="rgba(255,255,255,0.2)" />
        <rect x="54" y="14" width="42" height="58" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#f43f5e" stroke-width="1.2" />
        <text x="64" y="32" fill="#f43f5e" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700">Q♦</text>
        <rect x="108" y="0" width="42" height="58" rx="4" fill="rgba(8, 14, 24, 0.8)" stroke="rgba(255,255,255,0.2)" />
        <rect x="108" y="14" width="42" height="58" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#00f0ff" stroke-width="1.6" filter="${glowRef}" />
        <text x="118" y="32" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700">J♠</text>
        <path d="M 130 25 Q 170 -10 216 32" fill="none" stroke="#00f0ff" stroke-width="2.2" stroke-dasharray="4, 3" class="bp-path-flow" filter="${glowRef}" />
        <rect x="194" y="14" width="42" height="58" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#f43f5e" stroke-width="1.2" />
        <text x="204" y="32" fill="#f43f5e" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700">Q♥</text>
      </g>
      <text x="18" y="248" fill="#10b981" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="700">COMMAND PATTERN UNDO • FISHER-YATES SHUFFLE • 120 FPS</text>
      <text x="460" y="248" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8.5">KLONDIKE / SPIDER / FREECELL</text>
    `;
  } else if (projectId === 'fruit-game') {
    content = `
      <rect width="100%" height="100%" fill="#0a192f" />
      <rect width="100%" height="100%" fill="${gridRef}" />
      
      <!-- Top Instruction Capsule Banner -->
      <g transform="translate(130, 16)">
        <rect x="0" y="0" width="220" height="22" rx="11" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" stroke-width="1.2" />
        <text x="110" y="14" text-anchor="middle" fill="#6ee7b7" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700">MERGE SAME FRUIT • EVOLVE TO WATERMELON</text>
      </g>

      <!-- 3D Physics Container Chute (Wooden Chute Profile) -->
      <path d="M 85 45 L 135 45 L 135 215 Q 135 225 145 225 L 235 225 Q 245 225 245 215 L 245 45 L 295 45" fill="none" stroke="rgba(245, 158, 11, 0.5)" stroke-width="6" stroke-linejoin="round" />
      <path d="M 85 45 L 135 45 L 135 215 Q 135 225 145 225 L 235 225 Q 245 225 245 215 L 245 45 L 295 45" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linejoin="round" />
      
      <!-- Overflow Danger Boundary Line -->
      <line x1="135" y1="80" x2="245" y2="80" stroke="#f43f5e" stroke-width="1.2" stroke-dasharray="4, 3" />
      <text x="248" y="83" fill="#f43f5e" font-family="'JetBrains Mono', monospace" font-size="6.5">LIMIT</text>

      <!-- Top Fruit Dropper Spawner -->
      <g transform="translate(190, 48)">
        <!-- Aim Pointer / Cloud Spawner -->
        <ellipse cx="0" cy="-6" rx="16" ry="7" fill="rgba(255, 255, 255, 0.18)" stroke="#38bdf8" stroke-width="1" />
        <!-- Dotted Aim Trajectory Guide Line -->
        <line x1="0" y1="8" x2="0" y2="135" stroke="#a855f7" stroke-width="2" stroke-dasharray="3, 4" class="bp-stream-flow" />
        
        <!-- Ready-to-Drop Fruit (Purple Kawaii Grape) -->
        <g transform="translate(0, 4)">
          <circle r="9" fill="#a855f7" stroke="#c084fc" stroke-width="1.2" filter="${glowRef}" />
          <!-- Kawaii Face (Eyes & Smile) -->
          <circle cx="-3" cy="-1" r="1.2" fill="#030712" />
          <circle cx="3" cy="-1" r="1.2" fill="#030712" />
          <circle cx="-2.5" cy="-1.5" r="0.4" fill="#ffffff" />
          <circle cx="3.5" cy="-1.5" r="0.4" fill="#ffffff" />
          <path d="M -2 2 Q 0 4 2 2" fill="none" stroke="#030712" stroke-width="0.8" />
          <ellipse cx="-4.5" cy="1" rx="1.2" ry="0.6" fill="#f472b6" opacity="0.8" />
          <ellipse cx="4.5" cy="1" rx="1.2" ry="0.6" fill="#f472b6" opacity="0.8" />
        </g>
        
        <!-- Hand Pointer Gesture -->
        <g transform="translate(26, 28) scale(0.7)">
          <path d="M 0 0 L 8 18 L 14 16 L 20 28 L 24 26 L 18 14 L 24 12 Z" fill="#ffffff" opacity="0.75" />
        </g>
      </g>

      <!-- Bottom Container Fruits (Physics Colliding & Settling) -->
      <!-- Left Grapes -->
      <g transform="translate(152, 206)">
        <circle r="11" fill="#9333ea" stroke="#c084fc" stroke-width="1" />
        <circle cx="-3" cy="-1" r="1.2" fill="#050814" /><circle cx="3" cy="-1" r="1.2" fill="#050814" />
        <path d="M -2 2 Q 0 3.5 2 2" fill="none" stroke="#050814" stroke-width="0.8" />
        <ellipse cx="-4.5" cy="1" rx="1.2" ry="0.6" fill="#f472b6" />
        <ellipse cx="4.5" cy="1" rx="1.2" ry="0.6" fill="#f472b6" />
      </g>

      <!-- Middle Colliding Oranges (Triggering Merge Evolution) -->
      <g transform="translate(176, 202)">
        <circle r="13" fill="#f97316" stroke="#fdba74" stroke-width="1.2" filter="${glowRef}" />
        <circle cx="-4" cy="-1" r="1.3" fill="#050814" /><circle cx="4" cy="-1" r="1.3" fill="#050814" />
        <path d="M -2 2 Q 0 4 2 2" fill="none" stroke="#050814" stroke-width="0.9" />
        <ellipse cx="-6" cy="1.5" rx="1.4" ry="0.7" fill="#fb7185" />
        <ellipse cx="6" cy="1.5" rx="1.4" ry="0.7" fill="#fb7185" />
      </g>
      
      <!-- Merge Point Shockwave / Sparkle -->
      <g transform="translate(191, 192)">
        <circle r="16" fill="rgba(250, 204, 21, 0.15)" stroke="#facc15" stroke-width="1" stroke-dasharray="2, 2" class="bp-pulse-ring" />
        <text x="0" y="-12" text-anchor="middle" fill="#facc15" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="800">★ MERGE! ★</text>
        <path d="M 0 -5 L 1.5 -1.5 L 5 0 L 1.5 1.5 L 0 5 L -1.5 1.5 L -5 0 L -1.5 -1.5 Z" fill="#fde047" filter="${glowRef}" />
      </g>

      <g transform="translate(206, 202)">
        <circle r="13" fill="#ea580c" stroke="#fed7aa" stroke-width="1.2" />
        <circle cx="-4" cy="-1" r="1.3" fill="#050814" /><circle cx="4" cy="-1" r="1.3" fill="#050814" />
        <path d="M -2 2 Q 0 4 2 2" fill="none" stroke="#050814" stroke-width="0.9" />
        <ellipse cx="-6" cy="1.5" rx="1.4" ry="0.7" fill="#fb7185" />
        <ellipse cx="6" cy="1.5" rx="1.4" ry="0.7" fill="#fb7185" />
      </g>

      <!-- Tiny Right Cherry -->
      <g transform="translate(230, 210)">
        <circle r="7.5" fill="#ef4444" stroke="#fca5a5" stroke-width="1" />
        <circle cx="-2" cy="-1" r="0.9" fill="#050814" /><circle cx="2" cy="-1" r="0.9" fill="#050814" />
        <path d="M -1.5 1.5 Q 0 2.5 1.5 1.5" fill="none" stroke="#050814" stroke-width="0.6" />
      </g>

      <!-- Right Evolution Hierarchy Wheel (Kawaii Fruit Progression) -->
      <g transform="translate(382, 130)">
        <!-- Wheel Track Background -->
        <circle r="56" fill="rgba(245, 158, 11, 0.12)" stroke="rgba(245, 158, 11, 0.4)" stroke-width="14" />
        <circle r="56" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4, 3" />
        
        <!-- Directional Flow Arrow -->
        <path d="M 0 -63 A 63 63 0 0 1 54 32" fill="none" stroke="#00f0ff" stroke-width="1.8" stroke-dasharray="4, 3" />
        <polygon points="56,36 50,30 58,26" fill="#00f0ff" />

        <!-- Evolution Nodes Around Circle -->
        <g transform="translate(28, -44)"><circle r="6" fill="#ef4444" /><circle cx="-1" cy="-1" r="0.7" fill="#000" /><circle cx="1" cy="-1" r="0.7" fill="#000" /></g>
        <g transform="translate(48, -20)"><circle r="7.5" fill="#f43f5e" /><circle cx="-1.5" cy="-1" r="0.8" fill="#000" /><circle cx="1.5" cy="-1" r="0.8" fill="#000" /></g>
        <g transform="translate(52, 10)"><circle r="8.5" fill="#a855f7" /><circle cx="-2" cy="-1" r="0.9" fill="#000" /><circle cx="2" cy="-1" r="0.9" fill="#000" /></g>
        <g transform="translate(42, 38)"><circle r="9.5" fill="#f97316" /><circle cx="-2.5" cy="-1" r="1" fill="#000" /><circle cx="2.5" cy="-1" r="1" fill="#000" /></g>
        <g transform="translate(18, 54)"><circle r="10.5" fill="#dc2626" /><circle cx="-3" cy="-1" r="1" fill="#000" /><circle cx="3" cy="-1" r="1" fill="#000" /></g>
        <g transform="translate(-16, 54)"><circle r="11" fill="#fb7185" /><circle cx="-3" cy="-1" r="1" fill="#000" /><circle cx="3" cy="-1" r="1" fill="#000" /></g>
        <g transform="translate(-44, 34)"><circle r="12" fill="#84cc16" stroke="#65a30d" stroke-width="1" /><circle cx="-3" cy="-1" r="1.1" fill="#000" /><circle cx="3" cy="-1" r="1.1" fill="#000" /></g>
        <!-- Striped Watermelon -->
        <g transform="translate(-52, 0)">
          <circle r="13" fill="#22c55e" stroke="#15803d" stroke-width="1.2" filter="${glowRef}" />
          <path d="M -10 -5 Q -6 0 -10 5 M -4 -9 Q 0 0 -4 9 M 4 -9 Q 8 0 4 9 M 10 -5 Q 14 0 10 5" fill="none" stroke="#14532d" stroke-width="1" />
          <circle cx="-3.5" cy="-1" r="1.2" fill="#000" /><circle cx="3.5" cy="-1" r="1.2" fill="#000" />
        </g>
        <!-- Golden Chest at Zenith -->
        <g transform="translate(-2, -56)">
          <rect x="-11" y="-8" width="22" height="16" rx="3" fill="#eab308" stroke="#fde047" stroke-width="1.5" filter="${glowRef}" />
          <rect x="-8" y="-1" width="16" height="3" fill="#713f12" />
          <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
          <text x="0" y="-10" text-anchor="middle" fill="#fde047" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="800">GOAL</text>
        </g>
        
        <text x="0" y="4" text-anchor="middle" fill="#facc15" font-family="'Rajdhani', sans-serif" font-size="12" font-weight="800">EVOLUTION</text>
        <text x="0" y="16" text-anchor="middle" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="7">CYCLE WHEEL</text>
      </g>

      <!-- Left Fruits 3D Logo Stamp -->
      <g transform="translate(14, 115)">
        <rect x="0" y="0" width="108" height="44" rx="4" fill="rgba(6, 12, 22, 0.88)" stroke="rgba(245, 158, 11, 0.4)" />
        <text x="54" y="22" text-anchor="middle" fill="#22c55e" font-family="'Rajdhani', sans-serif" font-size="16" font-weight="900" letter-spacing="0.06em">FRUITS 3D</text>
        <text x="54" y="35" text-anchor="middle" fill="#facc15" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">WATERMELON MERGE</text>
      </g>

      <!-- Telemetry Bottom Bar -->
      <text x="18" y="248" fill="#facc15" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="700">3D RIGIDBODY SPHERES • CONTINUOUS COLLISION • TIER EVOLUTION FSM • 60 FPS</text>
      <text x="460" y="248" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8.5">SUIKA WATERMELON MERGE</text>
    `;
  } else if (projectId === 'cars-of-voice') {
    content = `
      <rect width="100%" height="100%" fill="#080e1a" />
      <rect width="100%" height="100%" fill="${gridRef}" />

      <!-- Top Left High Score Box (Matching In-Game HUD) -->
      <g transform="translate(18, 14)">
        <path d="M 0 0 L 125 0 L 138 28 L 0 28 Z" fill="rgba(6, 12, 24, 0.9)" stroke="#00f0ff" stroke-width="1.2" />
        <!-- Gold Trophy Icon -->
        <g transform="translate(14, 14)">
          <path d="M -6 -8 L 6 -8 L 4 0 Q 3 4 0 5 Q -3 4 -4 0 Z" fill="#eab308" filter="${glowRef}" />
          <line x1="0" y1="5" x2="0" y2="8" stroke="#eab308" stroke-width="2" />
          <line x1="-5" y1="8" x2="5" y2="8" stroke="#eab308" stroke-width="2" />
        </g>
        <text x="32" y="12" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">HIGH SCORE</text>
        <text x="32" y="24" fill="#ffffff" font-family="'Rajdhani', sans-serif" font-size="13" font-weight="900" letter-spacing="0.05em">25,680</text>
      </g>

      <!-- Top Right Reactive Soundwave UI Visualizer -->
      <g transform="translate(170, 14)">
        <rect x="0" y="0" width="292" height="38" rx="4" fill="rgba(6, 12, 24, 0.9)" stroke="rgba(0, 240, 255, 0.4)" />
        <text x="12" y="14" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700">VOICE SOUNDWAVE [LIVE MIC]</text>
        <text x="280" y="14" text-anchor="end" fill="#f59e0b" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700">88 dB [SHOUT BOOST]</text>
        
        <!-- Animated Voice Waveform Bars -->
        <g transform="translate(12, 22)">
          <rect x="0" y="4" width="4" height="8" fill="#00f0ff" rx="1" />
          <rect x="7" y="1" width="4" height="11" fill="#00f0ff" rx="1" />
          <rect x="14" y="-3" width="4" height="15" fill="#38bdf8" rx="1" />
          <rect x="21" y="-6" width="4" height="18" fill="#38bdf8" rx="1" />
          <rect x="28" y="-9" width="4" height="21" fill="#facc15" rx="1" filter="${glowRef}" />
          <rect x="35" y="-12" width="4" height="24" fill="#f97316" rx="1" filter="${glowRef}" />
          <rect x="42" y="-14" width="4" height="26" fill="#ef4444" rx="1" filter="${glowRef}" />
          <rect x="49" y="-10" width="4" height="22" fill="#facc15" rx="1" />
          <rect x="56" y="-5" width="4" height="17" fill="#38bdf8" rx="1" />
          <rect x="63" y="-2" width="4" height="14" fill="#00f0ff" rx="1" />
          <rect x="70" y="2" width="4" height="10" fill="#00f0ff" rx="1" />
          <rect x="77" y="0" width="4" height="12" fill="#38bdf8" rx="1" />
          <rect x="84" y="-7" width="4" height="19" fill="#facc15" rx="1" />
          <rect x="91" y="-12" width="4" height="24" fill="#ef4444" rx="1" filter="${glowRef}" />
          <rect x="98" y="-6" width="4" height="18" fill="#f97316" rx="1" />
          <rect x="105" y="-1" width="4" height="13" fill="#38bdf8" rx="1" />
          <rect x="112" y="3" width="4" height="9" fill="#00f0ff" rx="1" />
        </g>
        <!-- Vocal Status Pill -->
        <g transform="translate(140, 20)">
          <rect x="0" y="0" width="140" height="14" rx="7" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" stroke-width="0.8" />
          <text x="70" y="10" text-anchor="middle" fill="#fca5a5" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700">THROTTLE: 100% BOOST</text>
        </g>
      </g>

      <!-- Asphalt Track Roadbed -->
      <g transform="translate(0, 160)">
        <rect x="0" y="0" width="480" height="52" fill="#0b1320" />
        <line x1="0" y1="0" x2="480" y2="0" stroke="rgba(0, 240, 255, 0.4)" stroke-width="1.5" />
        <!-- Road Speed Pad Markers -->
        <path d="M 60 12 L 80 20 L 60 28" fill="none" stroke="#00f0ff" stroke-width="3" stroke-linecap="round" filter="${glowRef}" />
        <path d="M 80 12 L 100 20 L 80 28" fill="none" stroke="#00f0ff" stroke-width="3" stroke-linecap="round" filter="${glowRef}" />
        <line x1="0" y1="46" x2="480" y2="46" stroke="#f59e0b" stroke-width="2" stroke-dasharray="14, 10" />
        
        <!-- Jump Ramp Structure -->
        <polygon points="340,0 420,-30 420,0" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" stroke-width="1.8" />
        <text x="380" y="-10" text-anchor="middle" fill="#fde047" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="800">RAMP JUMP</text>
        <!-- Trajectory Curve -->
        <path d="M 420 -30 Q 455 -65 480 -45" fill="none" stroke="#00f0ff" stroke-width="1.8" stroke-dasharray="4, 3" />
      </g>

      <!-- Red Arcade Car (Side Profile Matching Screenshot) -->
      <g transform="translate(230, 138)">
        <!-- Nitro Flame Thrust -->
        <path d="M -48 6 Q -75 3 -90 6 Q -75 9 -48 6" fill="#f97316" opacity="0.9" filter="${glowRef}" />
        <path d="M -48 6 Q -65 4 -78 6 Q -65 8 -48 6" fill="#fde047" filter="${glowRef}" />
        
        <!-- Car Body Chasis -->
        <path d="M -44 14 L 38 14 L 44 4 L 28 -8 L 8 -8 L -14 0 L -44 0 Z" fill="#dc2626" stroke="#f87171" stroke-width="1.5" filter="${glowRef}" />
        <!-- Cabin Windows -->
        <polygon points="-12,-1 6,-7 24,-7 20,-1" fill="#38bdf8" opacity="0.85" stroke="#00f0ff" stroke-width="0.8" />
        <!-- Wheel Wells & Wheels -->
        <g transform="translate(-26, 14)">
          <circle r="10" fill="#0f172a" stroke="#64748b" stroke-width="2" />
          <circle r="4" fill="#cbd5e1" />
        </g>
        <g transform="translate(22, 14)">
          <circle r="10" fill="#0f172a" stroke="#64748b" stroke-width="2" />
          <circle r="4" fill="#cbd5e1" />
        </g>
        <text x="0" y="8" text-anchor="middle" fill="#ffffff" font-family="'Rajdhani', sans-serif" font-size="8" font-weight="900">VOICE RACER</text>
      </g>

      <!-- Left Driving Statistics HUD Card -->
      <g transform="translate(18, 52)">
        <rect x="0" y="0" width="125" height="52" rx="4" fill="rgba(6, 12, 24, 0.88)" stroke="rgba(0, 240, 255, 0.3)" />
        <text x="10" y="16" fill="#00f0ff" font-family="'Rajdhani', sans-serif" font-size="9" font-weight="800">DRIVING STATISTICS</text>
        <text x="10" y="30" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="7">BEST TIME: <tspan fill="#ffffff" font-weight="700">90.9s</tspan></text>
        <text x="10" y="44" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="7">PLAY TIME: <tspan fill="#facc15" font-weight="700">2m 59s</tspan></text>
      </g>

      <!-- Center Bottom Ready To Drive Capsule -->
      <g transform="translate(150, 218)">
        <rect x="0" y="0" width="180" height="20" rx="10" fill="rgba(0, 240, 255, 0.15)" stroke="#00f0ff" stroke-width="1.2" />
        <text x="90" y="13" text-anchor="middle" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="800">VOICE = ACCELERATE • SILENCE = BRAKE</text>
      </g>

      <!-- Telemetry Bottom Bar -->
      <text x="18" y="248" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="700">MICROPHONE DECIBEL DSP • NO TOUCH DRIVING • 60 FPS</text>
      <text x="460" y="248" text-anchor="end" fill="#facc15" font-family="'JetBrains Mono', monospace" font-size="8.5">GOOGLE PLAY v2.6</text>
    `;
  } else if (projectId === 'battleship-2d') {
    content = `
      <rect width="100%" height="100%" fill="#040c18" />
      <rect width="100%" height="100%" fill="${gridRef}" />
      <g transform="translate(140, 26)">
        <rect x="0" y="0" width="200" height="200" fill="rgba(8, 16, 28, 0.85)" stroke="rgba(0, 240, 255, 0.4)" stroke-width="1.5" />
        <path d="
          M 20 0 L 20 200 M 40 0 L 40 200 M 60 0 L 60 200 M 80 0 L 80 200 M 100 0 L 100 200 M 120 0 L 120 200 M 140 0 L 140 200 M 160 0 L 160 200 M 180 0 L 180 200
          M 0 20 L 200 20 M 0 40 L 200 40 M 0 60 L 200 60 M 0 80 L 200 80 M 0 100 L 200 100 M 0 120 L 200 120 M 0 140 L 200 140 M 0 160 L 200 160 M 0 180 L 200 180
        " stroke="rgba(0, 240, 255, 0.15)" stroke-width="0.8" />
        <rect x="42" y="62" width="76" height="16" rx="3" fill="rgba(0, 240, 255, 0.25)" stroke="#00f0ff" stroke-width="1.5" />
        <g stroke="#f43f5e" stroke-width="2">
          <line x1="46" y1="66" x2="56" y2="76" /><line x1="56" y1="66" x2="46" y2="76" />
          <line x1="66" y1="66" x2="76" y2="76" /><line x1="76" y1="66" x2="66" y2="76" />
        </g>
        <circle cx="30" cy="50" r="4" fill="none" stroke="#38bdf8" stroke-width="1.5" />
        <circle cx="90" cy="30" r="4" fill="none" stroke="#38bdf8" stroke-width="1.5" />
        <circle cx="150" cy="110" r="4" fill="none" stroke="#38bdf8" stroke-width="1.5" />
        <rect x="80" y="60" width="20" height="20" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4, 2" filter="${glowRef}" />
        <text x="90" y="74" text-anchor="middle" fill="#f59e0b" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700">P(H)</text>
      </g>
      <g transform="translate(360, 45)">
        <rect x="0" y="0" width="105" height="85" fill="rgba(6, 12, 22, 0.9)" stroke="rgba(0, 240, 255, 0.35)" rx="4" />
        <text x="10" y="18" fill="#7dd3fc" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700">HEURISTIC AI</text>
        <text x="10" y="34" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="7.5">STATE: TARGETING</text>
        <text x="10" y="48" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="7.5">PARITY: CHECKER</text>
        <text x="10" y="62" fill="#10b981" font-family="'JetBrains Mono', monospace" font-size="7.5">PROBABILITY: 94%</text>
        <text x="10" y="76" fill="#f59e0b" font-family="'JetBrains Mono', monospace" font-size="7.5">TARGET: [D, 5]</text>
      </g>
      <text x="18" y="248" fill="#00f0ff" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="700">HUNT-AND-TARGET HEURISTIC AI • 10x10 GRID ARRAY • 60 FPS</text>
      <text x="460" y="248" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8.5">SINGLE-PLAYER TACTICS</text>
    `;
  } else {
    // rocket-launcher (and rocket-launcher-combat fallback)
    content = `
      <rect width="100%" height="100%" fill="#120808" />
      <rect width="100%" height="100%" fill="${gridRef}" />
      <!-- Ballistic Parabolic Arc -->
      <path d="M 50 190 Q 200 40 370 140" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="6, 4" class="bp-ballistic-path" filter="${glowRef}" />
      <!-- Accelerating Missile -->
      <g transform="translate(200, 80) rotate(18)">
        <polygon points="20,0 -8,-6 -4,0 -8,6" fill="#00f0ff" filter="${glowRef}" />
        <path d="M -8 0 Q -24 -4 -32 0 Q -24 4 -8 0" fill="#f59e0b" opacity="0.85" />
      </g>
      <!-- Radial Blast Epicenter -->
      <g transform="translate(370, 140)">
        <circle r="60" fill="rgba(244, 63, 94, 0.06)" stroke="#f43f5e" stroke-width="1" stroke-dasharray="4, 4" />
        <circle r="36" fill="rgba(245, 158, 11, 0.12)" stroke="#f59e0b" stroke-width="1.5" />
        <circle r="14" fill="#f43f5e" opacity="0.8" filter="${glowRef}" />
        <!-- Occlusion Check Rays -->
        <line x1="0" y1="0" x2="-45" y2="-45" stroke="#00f0ff" stroke-width="1.2" stroke-dasharray="2, 2" />
        <line x1="0" y1="0" x2="45" y2="-30" stroke="#00f0ff" stroke-width="1.2" stroke-dasharray="2, 2" />
        <line x1="0" y1="0" x2="-35" y2="40" stroke="#f43f5e" stroke-width="1.2" />
        <rect x="-18" y="-18" width="36" height="36" fill="none" stroke="#00f0ff" stroke-width="1.5" stroke-dasharray="6, 3" />
        <text x="0" y="32" text-anchor="middle" fill="#fda4af" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700">BLAST R=8.5m</text>
      </g>
      <text x="18" y="248" fill="#f59e0b" font-family="'JetBrains Mono', monospace" font-size="9.5" font-weight="700">BALLISTIC IMPULSE • MULTI-RAY OCCLUSION • OBJECT POOLED</text>
      <text x="460" y="248" text-anchor="end" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="8.5">PHYSICS SIMULATION</text>
    `;
  }

  return `
    <div class="project-blueprint-viewport">
      <svg viewBox="0 0 480 270" class="project-blueprint-svg" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        ${defs}
        ${content}
      </svg>
      <div class="blueprint-scanline"></div>
    </div>
  `;
}

/* ==========================================================================
   FEATURED PROJECTS SECTION (FILTERING & CARDS)
   ========================================================================== */
function initProjectsSection() {
  const projectsGrid = document.getElementById('projects-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (!projectsGrid || typeof PROJECTS_DATA === 'undefined') return;

  function renderProjects(filter = 'all') {
    const filtered = PROJECTS_DATA.filter(project => {
      if (filter === 'all') return true;
      if (filter === 'unity') return project.engineType === 'unity';
      if (filter === '2d') return project.tags.includes('2D');
      if (filter === '3d') return project.tags.includes('3D');
      if (filter === 'multiplayer') return project.tags.includes('Multiplayer');
      if (filter === 'fps') return project.tags.includes('FPS');
      if (filter === 'simulation') return project.tags.includes('Simulation') || project.tags.includes('Strategy');
      return true;
    });

    projectsGrid.innerHTML = filtered.map(project => `
      <article class="project-card" data-id="${project.id}">
        <div class="project-card-media project-blueprint-media">
          ${getProjectBlueprintSvg(project.id)}
          <div class="project-blueprint-hud-bar">
            <span class="bp-hud-status"><span class="bp-status-led"></span>UNITY SIMULATION VIEWPORT</span>
            <span class="bp-hud-metric">${project.stats.fps || project.stats.physics || project.stats.waveEngine || '60 FPS'}</span>
          </div>
          <div class="project-engine-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="10 8 16 12 10 16 10 8"></polygon>
            </svg>
            ${project.engine}
          </div>
          <div class="project-genre-tag">${project.genre}</div>
        </div>
        <div class="project-card-body">
          <h3 class="project-card-title">${project.title}</h3>
          <div class="project-card-role">${project.role}</div>
          <p class="project-card-desc">${project.shortDescription}</p>
          <div class="project-tech-tags">
            ${project.technologies.slice(0, 4).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
          <div class="project-card-actions">
            <button class="btn btn-primary open-details-btn" data-project-id="${project.id}">
              View Project
            </button>
            <button class="btn btn-outline open-video-btn" data-project-id="${project.id}">
              Simulation View
            </button>
          </div>
        </div>
      </article>
    `).join('');

    attachProjectCardEvents();
    initButtonAudioEffects();
  }

  // Initial render: show all
  renderProjects('all');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderProjects(filter);
    });
  });
}

function attachProjectCardEvents() {
  document.querySelectorAll('.open-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projId = btn.getAttribute('data-project-id');
      openProjectDetails(projId);
    });
  });

  document.querySelectorAll('.open-video-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projId = btn.getAttribute('data-project-id');
      openVideoModal(projId);
    });
  });
}

/* ==========================================================================
   PROJECT DETAILS MODAL
   ========================================================================== */
function initProjectModals() {
  const modalBackdrop = document.getElementById('project-details-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modalBackdrop || !closeBtn) return;

  closeBtn.addEventListener('click', closeProjectDetails);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeProjectDetails();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeProjectDetails();
    }
  });
}

function openProjectDetails(projectId) {
  if (typeof PROJECTS_DATA === 'undefined') return;
  const project = PROJECTS_DATA.find(p => p.id === projectId);
  if (!project) return;

  const modalBackdrop = document.getElementById('project-details-modal');
  const modalContent = document.getElementById('modal-dynamic-content');

  if (!modalBackdrop || !modalContent) return;

  modalContent.innerHTML = `
    <div class="modal-hero modal-hero-blueprint">
      ${getProjectBlueprintSvg(project.id, true)}
      <div class="modal-hero-overlay">
        <div class="modal-hero-info">
          <div class="modal-blueprint-badge">
            <span class="modal-bp-dot"></span>
            UNITY ENGINE SCHEMATIC & TELEMETRY
          </div>
          <h2 class="modal-project-title">${project.title}</h2>
          <div class="modal-project-sub">${project.subtitle} • ${project.engine}</div>
        </div>
      </div>
    </div>

    <div class="modal-body">
      <!-- Meta Specs Bar -->
      <div class="modal-meta-bar">
        <div class="meta-box">
          <span class="meta-box-label">My Role</span>
          <span class="meta-box-val">${project.role}</span>
        </div>
        <div class="meta-box">
          <span class="meta-box-label">Timeline / Team</span>
          <span class="meta-box-val">${project.timeline} (${project.teamSize})</span>
        </div>
        <div class="meta-box">
          <span class="meta-box-label">Engine & Platform</span>
          <span class="meta-box-val">${project.engine} / ${project.stats.platforms || 'PC'}</span>
        </div>
        <div class="meta-box">
          <span class="meta-box-label">Key Metric</span>
          <span class="meta-box-val">${project.stats.fps || project.stats.physics || project.stats.tickRate || '60 FPS Target'}</span>
        </div>
      </div>

      <!-- Project Overview -->
      <div class="modal-section">
        <h4 class="modal-sec-title">Project Overview</h4>
        <p style="font-size: 1.02rem; line-height: 1.8; color: var(--text-secondary);">
          ${project.overview}
        </p>
      </div>

      <!-- Core Gameplay Features -->
      <div class="modal-section">
        <h4 class="modal-sec-title">Gameplay Features</h4>
        <ul class="modal-features-list">
          ${project.features.map(f => `
            <li class="modal-feature-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>${f}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Technical Challenges & Solutions -->
      <div class="modal-section">
        <h4 class="modal-sec-title">Technical Challenges & Solutions</h4>
        ${project.challenges.map(c => `
          <div class="challenge-card">
            <div class="challenge-card-title">Challenge: ${c.problem}</div>
            <div class="challenge-card-desc"><strong>Engineered Solution:</strong> ${c.solution}</div>
          </div>
        `).join('')}
      </div>

      <!-- Technical Implementation -->
      <div class="modal-section">
        <h4 class="modal-sec-title">Technical Implementation</h4>
        <p style="font-size: 0.95rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 1.25rem;">
          ${project.technicalImplementation}
        </p>
        <div class="project-tech-tags">
          ${project.technologies.map(t => `<span class="tech-tag" style="font-size: 0.82rem; padding: 0.3rem 0.75rem; border-color: var(--border-medium); color: var(--neon-cyan);">${t}</span>`).join('')}
        </div>
      </div>

      <!-- Key Contributions -->
      <div class="modal-section">
        <h4 class="modal-sec-title">My Contributions</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
          ${project.contributions.map(c => `
            <li style="font-size: 0.92rem; color: var(--text-secondary); display: flex; gap: 0.6rem;">
              <span style="color: var(--neon-purple); font-weight: bold;">▹</span> ${c}
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Action Links -->
      <div class="modal-links-bar">
        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          View Source Repository
        </a>
        <button class="btn btn-primary" onclick="openVideoModal('${project.id}')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Watch Gameplay Video
        </button>
      </div>
    </div>
  `;

  modalBackdrop.classList.add('active');
  lockBodyScroll();

  if (window.gameAudio) window.gameAudio.playOpenModal();
  window.location.hash = `/project/${project.id}`;
}

function closeProjectDetails() {
  const modalBackdrop = document.getElementById('project-details-modal');
  if (modalBackdrop) {
    modalBackdrop.classList.remove('active');
    unlockBodyScroll();
    if (window.gameAudio) window.gameAudio.playCloseModal();
    if (window.location.hash.startsWith('#/project/')) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }
}

/* ==========================================================================
   GAMEPLAY VIDEO SIMULATOR MODAL
   ========================================================================== */
function initVideoPlayerModal() {
  const videoModal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('video-close-btn');

  if (!videoModal || !closeBtn) return;

  closeBtn.addEventListener('click', closeVideoModal);

  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      closeVideoModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
      closeVideoModal();
    }
  });
}

function openVideoModal(projectId) {
  if (typeof PROJECTS_DATA === 'undefined') return;
  const project = PROJECTS_DATA.find(p => p.id === projectId);
  if (!project) return;

  const videoModal = document.getElementById('video-modal');
  const screenBlueprint = document.getElementById('video-screen-blueprint');
  const screenImg = document.getElementById('video-screen-img');
  const titleEl = document.getElementById('video-project-title');
  const specEl = document.getElementById('video-project-spec');

  if (screenImg) screenImg.style.display = 'none';
  if (screenBlueprint) {
    screenBlueprint.style.display = 'block';
    screenBlueprint.innerHTML = getProjectBlueprintSvg(project.id, true);
  }

  if (titleEl) titleEl.textContent = `${project.title} - Realtime Engine Simulation`;
  if (specEl) specEl.textContent = `Engine: ${project.engine} | ${project.stats.fps || '60 FPS'} | Audio: Spatial Stereo`;

  videoModal.classList.add('active');
  lockBodyScroll();

  if (window.gameAudio) window.gameAudio.playOpenModal();
}

function closeVideoModal() {
  const videoModal = document.getElementById('video-modal');
  if (videoModal) {
    videoModal.classList.remove('active');
    // Only restore body overflow if details modal isn't also open
    const detailsModal = document.getElementById('project-details-modal');
    if (!detailsModal || !detailsModal.classList.contains('active')) {
      unlockBodyScroll();
    }
    if (window.gameAudio) window.gameAudio.playCloseModal();
  }
}

// Expose openVideoModal globally for inline onclicks
window.openVideoModal = openVideoModal;

/* ==========================================================================
   GAME DEVELOPMENT PROCESS / WORKFLOW
   ========================================================================== */
function initProcessWorkflow() {
  const pipelineContainer = document.getElementById('process-pipeline-steps');
  const detailContainer = document.getElementById('process-active-detail');

  if (!pipelineContainer || !detailContainer || typeof RESUME_DATA === 'undefined') return;

  const workflow = RESUME_DATA.workflow;

  // Render 7 steps
  pipelineContainer.innerHTML = workflow.map((w, idx) => `
    <div class="process-step-card ${idx === 0 ? 'active' : ''}" data-step-index="${idx}">
      <div class="step-num-badge">0${w.step}</div>
      <h4 class="step-title">${w.title}</h4>
      <div class="step-tagline">${w.tagline}</div>
    </div>
  `).join('');

  const deliverablesMap = {
    0: ["High-Concept Pitch Deck", "Core Gameplay Loop Flowchart", "Audience & Market Benchmarks", "Target Technical Scope"],
    1: ["Game Design Document (GDD)", "Controller Input Schematics", "State Machine State Diagrams", "UI/UX Wireframes"],
    2: ["Interactive Greybox Physics Gym", "Weapon Recoil & Controller Feel Validation", "Input Latency Profiling", "Core Loop 'Fun' Sign-off"],
    3: ["Component-Based Gameplay Architecture", "Behavior Tree Enemy AI Systems", "Multiplayer Network Replication", "VFX & Sound Trigger Hookups"],
    4: ["Automated Unit Tests & Network Mock Tests", "Physics Edge-Case Stress Testing", "Cross-Platform Gamepad Audits", "Community Focus Playtesting"],
    5: ["Unity Profiler & Memory Profiler Audits", "Draw Call Reduction & GPU Instancing", "LOD Hierarchies & Occlusion Culling", "Zero-GC Physics Loops"],
    6: ["Platform Steamworks & Console SDK Certifications", "Automated Release CI/CD Pipelines", "Telemetry Crash Diagnostics", "Day-1 Hotfix Patch Protocols"]
  };

  function showStepDetail(index) {
    const item = workflow[index];
    const deliverables = deliverablesMap[index] || ["Technical Specifications", "Architecture Implementation"];

    detailContainer.innerHTML = `
      <div class="process-detail-info">
        <span class="detail-step-badge">STAGE 0${item.step} OF 07 • PIPELINE</span>
        <h4>${item.title}: ${item.tagline}</h4>
        <p>${item.description}</p>
      </div>
      <div class="process-deliverables-list">
        <h5>Key Stage Deliverables & Milestones:</h5>
        <ul>
          ${deliverables.map(d => `<li>${d}</li>`).join('')}
        </ul>
      </div>
    `;

    // Update active class
    const stepCards = document.querySelectorAll('.process-step-card');
    stepCards.forEach((c, idx) => {
      c.classList.toggle('active', idx === index);
    });

    if (window.gameAudio) window.gameAudio.playClick();
  }

  // Initial step detail
  showStepDetail(0);

  // Attach click listener to steps
  const stepCards = document.querySelectorAll('.process-step-card');
  stepCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      showStepDetail(idx);
    });
  });
}

/* ==========================================================================
   EXPERIENCE SECTION (TIMELINE)
   ========================================================================== */
function initExperienceTimeline() {
  const container = document.getElementById('experience-timeline-container');
  if (!container || typeof RESUME_DATA === 'undefined') return;

  const expList = RESUME_DATA.experience;

  container.innerHTML = expList.map(exp => `
    <div class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-card">
        <div class="timeline-header">
          <div>
            <h3 class="timeline-role">${exp.position}</h3>
            <div class="timeline-company">${exp.company} • <span style="font-size: 0.85rem; color: var(--text-muted);">${exp.location}</span></div>
          </div>
          <span class="timeline-period">${exp.duration}</span>
        </div>
        <p class="timeline-desc">${exp.description}</p>
        <ul class="timeline-resp-list">
          ${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}
        </ul>
        <div class="timeline-tags">
          ${exp.projects.map(p => `<span class="tech-tag" style="color: var(--neon-cyan); border-color: rgba(0, 240, 255, 0.2);">${p}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   RESUME SECTION (EDUCATION, CERTS, ACHIEVEMENTS)
   ========================================================================== */
function initResumeSection() {
  const eduContainer = document.getElementById('resume-edu-list');
  const certContainer = document.getElementById('resume-cert-list');
  const achContainer = document.getElementById('resume-achieve-list');
  const printBtn = document.getElementById('print-resume-btn');

  if (typeof RESUME_DATA === 'undefined') return;

  if (eduContainer) {
    eduContainer.innerHTML = RESUME_DATA.education.map(edu => `
      <div class="resume-item">
        <h4 class="resume-item-title">${edu.degree}</h4>
        <div class="resume-item-sub">${edu.institution} | ${edu.year} • ${edu.honors}</div>
        <p class="resume-item-body">${edu.highlights}</p>
      </div>
    `).join('');
  }

  if (certContainer) {
    certContainer.innerHTML = RESUME_DATA.certifications.map(cert => `
      <div class="resume-item">
        <h4 class="resume-item-title">${cert.title}</h4>
        <div class="resume-item-sub">${cert.issuer} • ${cert.year} (ID: ${cert.credentialId})</div>
      </div>
    `).join('');
  }

  if (achContainer) {
    achContainer.innerHTML = RESUME_DATA.achievements.map(ach => `
      <div class="resume-item">
        <h4 class="resume-item-title">${ach.title} (${ach.year})</h4>
        <p class="resume-item-body">${ach.description}</p>
      </div>
    `).join('');
  }

  // Print CV button
  const printCvBtn = document.getElementById('print-cv-btn');
  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      printCvDocument();
    });
  }

  // Toggle PDF Preview
  const togglePdfBtn = document.getElementById('toggle-pdf-preview-btn');
  const closePdfBtn = document.getElementById('close-pdf-preview-btn');
  const pdfContainer = document.getElementById('cv-pdf-preview-container');

  if (togglePdfBtn && pdfContainer) {
    togglePdfBtn.addEventListener('click', () => {
      const isHidden = pdfContainer.style.display === 'none';
      pdfContainer.style.display = isHidden ? 'block' : 'none';
      if (window.gameAudio) window.gameAudio.playClick();
      if (isHidden) {
        if (window.lenisInstance) {
          window.lenisInstance.scrollTo(pdfContainer, { offset: -80, duration: 1.0 });
        } else {
          pdfContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }

  if (closePdfBtn && pdfContainer) {
    closePdfBtn.addEventListener('click', () => {
      pdfContainer.style.display = 'none';
      if (window.gameAudio) window.gameAudio.playClick();
    });
  }
}

/**
 * Print the authentic Amal Thomas CV PDF document
 */
function printCvDocument() {
  if (window.gameAudio) window.gameAudio.playClick();
  const pdfUrl = 'assets/Amal_Thomas_CV.pdf';

  // Use hidden iframe to trigger native print dialog
  let printFrame = document.getElementById('cv-hidden-print-frame');
  if (!printFrame) {
    printFrame = document.createElement('iframe');
    printFrame.id = 'cv-hidden-print-frame';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);
  }

  printFrame.src = pdfUrl;
  printFrame.onload = function() {
    try {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
    } catch (err) {
      // Fallback if cross-origin or sandbox prevents direct iframe printing
      const printWin = window.open(pdfUrl, '_blank');
      if (printWin) {
        printWin.focus();
        printWin.print();
      }
    }
  };
}

window.printCvDocument = printCvDocument;

/* ==========================================================================
   CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('contact-form-status');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      if (statusEl) {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Please fill out all required fields (Name, Email, Message).';
      }
      return;
    }

    // Simulate sending state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        Transmitting Signal...
      `;
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Send Message`;
      }

      if (statusEl) {
        statusEl.className = 'form-status success';
        statusEl.innerHTML = `✓ <strong>Message Transmitted Successfully!</strong> Thank you ${name}, I'll respond within 24 hours.`;
      }

      if (window.gameAudio) window.gameAudio.playSuccess();
      form.reset();

      setTimeout(() => {
        if (statusEl) statusEl.className = 'form-status';
      }, 7000);
    }, 1200);
  });
}

/* ==========================================================================
   ROUTER & HASH NAVIGATION (For Direct Project Links)
   ========================================================================== */
function initHashRouter() {
  function handleHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#/project/')) {
      const projectId = hash.replace('#/project/', '');
      openProjectDetails(projectId);
    }
  }

  window.addEventListener('hashchange', handleHash);
  // Initial check on page load
  if (window.location.hash.startsWith('#/project/')) {
    handleHash();
  }
}

/* ==========================================================================
   ROBOT LOGO INTERACTIVE COMPANION & ANIMATIONS
   ========================================================================== */
function initRobotLogoCompanion() {
  const brandNav = document.querySelector('.nav-brand');
  const robotImg = document.querySelector('.brand-robot-img');

  if (!brandNav || !robotImg) return;

  const GREETINGS = [
    'HELLO HUMAN! 🤖',
    'UNITY 3D READY! 🎮',
    'SYSTEM 100% ⚡',
    'LEVEL UP! 🚀',
    'C# POWERED! 👾',
    'NICE TO MEET YOU! ✨'
  ];

  let isCelebrating = false;
  let bubbleTimeout = null;

  function triggerRobotCelebration() {
    // If audio is active, play happy robot chirp
    if (window.gameAudio && typeof window.gameAudio.playRobotChirp === 'function') {
      window.gameAudio.playRobotChirp();
    }

    // Trigger celebration somersault animation
    if (!isCelebrating) {
      isCelebrating = true;
      robotImg.classList.add('celebrating');
      brandNav.classList.add('celebrating');
      setTimeout(() => {
        robotImg.classList.remove('celebrating');
        brandNav.classList.remove('celebrating');
        isCelebrating = false;
      }, 950);
    }

    // Remove old speech bubble if any
    const existingBubble = brandNav.querySelector('.robot-speech-bubble');
    if (existingBubble) existingBubble.remove();
    if (bubbleTimeout) clearTimeout(bubbleTimeout);

    // Create playful mini speech bubble
    const bubble = document.createElement('div');
    bubble.className = 'robot-speech-bubble';
    const text = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    bubble.textContent = text;
    brandNav.appendChild(bubble);

    bubbleTimeout = setTimeout(() => {
      if (bubble && bubble.parentNode) {
        bubble.remove();
      }
    }, 1600);
  }

  brandNav.addEventListener('click', () => {
    triggerRobotCelebration();
  });

  // Also trigger a friendly hover chirp when hovering brand
  brandNav.addEventListener('mouseenter', () => {
    if (window.gameAudio && typeof window.gameAudio.playHover === 'function') {
      window.gameAudio.playHover();
    }
  });

  // Periodic subtle playful wave every 12 seconds
  setInterval(() => {
    if (!isCelebrating && !brandNav.matches(':hover')) {
      robotImg.style.animation = 'robotHappyWave 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 2 alternate';
      setTimeout(() => {
        if (!brandNav.matches(':hover')) {
          robotImg.style.animation = '';
        }
      }, 1600);
    }
  }, 12000);
}

