/**
 * Game Developer Portfolio - Main Controller & Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
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
  initButtonAudioEffects();
});

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
  const interactives = document.querySelectorAll('button, .btn, .nav-link, .filter-btn, .skills-tab-btn, .social-btn, .process-step-card');
  
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

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navLinksContainer.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navLinksContainer.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   HERO 3D TILT EFFECT
   ========================================================================== */
function initHeroVisualTilt() {
  const card = document.querySelector('.hero-visual-card');
  if (!card) return;

  const wrapper = document.querySelector('.hero-visual-wrapper');

  wrapper.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  });
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
      if (filter === 'unreal') return project.engineType === 'unreal';
      if (filter === '2d') return project.tags.includes('2D');
      if (filter === '3d') return project.tags.includes('3D');
      if (filter === 'multiplayer') return project.tags.includes('Multiplayer');
      if (filter === 'fps') return project.tags.includes('FPS');
      if (filter === 'simulation') return project.tags.includes('Simulation');
      return true;
    });

    projectsGrid.innerHTML = filtered.map(project => `
      <article class="project-card" data-id="${project.id}">
        <div class="project-card-media">
          <img src="${project.heroImage}" alt="${project.title} screenshot" loading="lazy">
          <div class="project-card-overlay"></div>
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
              Gameplay Video
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
    <div class="modal-hero">
      <img src="${project.heroImage}" alt="${project.title}">
      <div class="modal-hero-overlay">
        <div class="modal-hero-info">
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
  document.body.style.overflow = 'hidden';

  if (window.gameAudio) window.gameAudio.playOpenModal();
  window.location.hash = `/project/${project.id}`;
}

function closeProjectDetails() {
  const modalBackdrop = document.getElementById('project-details-modal');
  if (modalBackdrop) {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
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
  const screenImg = document.getElementById('video-screen-img');
  const titleEl = document.getElementById('video-project-title');
  const specEl = document.getElementById('video-project-spec');

  if (screenImg) screenImg.src = project.heroImage;
  if (titleEl) titleEl.textContent = `${project.title} - Realtime Gameplay Preview`;
  if (specEl) specEl.textContent = `Engine: ${project.engine} | ${project.stats.fps || '60 FPS'} | Audio: Spatial Stereo`;

  videoModal.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (window.gameAudio) window.gameAudio.playOpenModal();
}

function closeVideoModal() {
  const videoModal = document.getElementById('video-modal');
  if (videoModal) {
    videoModal.classList.remove('active');
    // Only restore body overflow if details modal isn't also open
    const detailsModal = document.getElementById('project-details-modal');
    if (!detailsModal || !detailsModal.classList.contains('active')) {
      document.body.style.overflow = '';
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
    5: ["Unreal Insights / Unity Profiler Memory Audits", "Draw Call Reduction & GPU Instancing", "LOD Hierarchies & Occlusion Culling", "Zero-GC Physics Loops"],
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
        pdfContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
