document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar & Active Link ScrollSpy
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // 2. Mobile Menu Toggle with Backdrop Overlay
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  
  if (hamburger && mobileMenu) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.classList.toggle('active', isOpen);
      if (menuOverlay) menuOverlay.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    if (menuOverlay) {
      menuOverlay.addEventListener('click', () => toggleMenu(false));
    }

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });
  }

  // 3. Render Experience Timeline from resumeData
  const timelineContainer = document.getElementById('experienceTimeline');
  if (timelineContainer && typeof resumeData !== 'undefined') {
    timelineContainer.innerHTML = resumeData.experience.map(exp => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="exp-header">
            <div>
              <h3 class="exp-role">${exp.role}</h3>
              <div class="exp-company">${exp.company}</div>
            </div>
            <span class="exp-period">${exp.period}</span>
          </div>
          <div class="exp-location">
            <i class="bi bi-geo-alt"></i> ${exp.location}
          </div>
          <ul class="exp-bullets">
            ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
          <div class="tech-tags">
            ${exp.tech.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  // 4. Render Skills Categories
  const skillsContainer = document.getElementById('skillsGrid');
  if (skillsContainer && typeof resumeData !== 'undefined') {
    const skillCategories = [
      { key: 'languages', title: 'Languages', icon: 'bi-code-slash' },
      { key: 'backend', title: 'Backend Frameworks', icon: 'bi-server' },
      { key: 'frontend', title: 'Frontend Technologies', icon: 'bi-window-sidebar' },
      { key: 'ai_ml', title: 'AI, LLM & RAG', icon: 'bi-cpu' },
      { key: 'databases', title: 'Databases & Storage', icon: 'bi-database' },
      { key: 'security', title: 'APIs, Security & OAuth', icon: 'bi-shield-lock' },
      { key: 'tools', title: 'Tools, Cloud & Analytics', icon: 'bi-tools' }
    ];

    skillsContainer.innerHTML = skillCategories.map(cat => `
      <div class="skill-category-card">
        <div class="category-header">
          <i class="bi ${cat.icon}"></i>
          <h3 class="category-title">${cat.title}</h3>
        </div>
        <div class="skills-pill-group">
          ${resumeData.skills[cat.key].map(skill => `<span class="skill-pill"><i class="bi bi-check2-circle"></i> ${skill}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // 5. Render Projects & Filter Logic
  const projectsGrid = document.getElementById('projectsGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function renderProjects(filter = 'all') {
    if (!projectsGrid || typeof resumeData === 'undefined') return;
    
    const filtered = filter === 'all' 
      ? resumeData.projects 
      : resumeData.projects.filter(p => p.category === filter);

    projectsGrid.innerHTML = filtered.map(p => `
      <div class="project-card">
        <div>
          <h3 class="project-title">${p.title}</h3>
          <div class="project-subtitle">${p.subtitle}</div>
          <p class="project-desc">${p.description}</p>
          <div class="tech-tags" style="margin-bottom: 1.2rem;">
            ${p.tech.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="project-footer">
          <button class="btn-project-details" onclick="openProjectModal('${p.id}')">
            View Details <i class="bi bi-arrow-right-short" style="font-size: 1.2rem;"></i>
          </button>
          <div style="display: flex; gap: 0.8rem; align-items: center;">
            ${p.live && p.live !== '#' ? `
              <a href="${p.live}" target="_blank" rel="noopener" style="color: var(--accent-pink); font-size: 1.1rem;" title="Live Demo Website">
                <i class="bi bi-box-arrow-up-right"></i>
              </a>
            ` : ''}
            <a href="${p.github}" target="_blank" rel="noopener" style="color: var(--text-muted); font-size: 1.1rem;" title="GitHub Repository">
              <i class="bi bi-github"></i>
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderProjects();

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.dataset.filter);
    });
  });

  // 6. Project Modal Logic
  window.openProjectModal = function(id) {
    const project = resumeData.projects.find(p => p.id === id);
    if (!project) return;

    const modalBody = document.getElementById('projectModalBody');
    modalBody.innerHTML = `
      <h2 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 0.5rem; color: #fff;">${project.title}</h2>
      <p style="color: var(--primary-purple-light); font-weight: 600; margin-bottom: 1.2rem;">${project.subtitle}</p>
      <p style="color: #cbd5e1; font-size: 1rem; line-height: 1.7; margin-bottom: 1.5rem;">${project.description}</p>
      
      <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 0.8rem;">Key Architecture & Features:</h4>
      <ul class="exp-bullets" style="margin-bottom: 1.5rem;">
        ${project.details.map(d => `<li>${d}</li>`).join('')}
      </ul>

      <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 0.8rem;">Tech Stack Used:</h4>
      <div class="tech-tags" style="margin-bottom: 2rem;">
        ${project.tech.map(t => `<span class="tag" style="font-size: 0.85rem; padding: 0.4rem 0.8rem;">${t}</span>`).join('')}
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        ${project.live && project.live !== '#' ? `
          <a href="${project.live}" target="_blank" rel="noopener" class="btn-hero-projects" style="border-radius: 12px; padding: 0.6rem 1.4rem; text-decoration: none;">
            <i class="bi bi-box-arrow-up-right"></i> Live Demo Website
          </a>
        ` : ''}
        <a href="${project.github}" target="_blank" rel="noopener" class="btn-cv" style="border-radius: 12px; padding: 0.6rem 1.4rem; text-decoration: none;">
          <i class="bi bi-github"></i> View Repository
        </a>
      </div>
    `;

    document.getElementById('projectModal').classList.add('active');
  };

  // Close modals
  document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || el.classList.contains('modal-close')) {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      }
    });
  });

  // 7. Resume Modal Handler
  window.openResumeModal = function() {
    const modalBody = document.getElementById('resumeModalBody');
    if (!modalBody || typeof resumeData === 'undefined') return;

    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 2rem; border-bottom: 1px solid var(--card-border); padding-bottom: 1.5rem;">
        <h1 style="font-family: var(--font-heading); font-size: 2rem; color: #fff;">${resumeData.name}</h1>
        <p style="color: var(--primary-purple-light); font-size: 1.1rem; font-weight: 600;">${resumeData.title} | ${resumeData.subtitle}</p>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem;">
          ${resumeData.contact.email} | ${resumeData.contact.phone} | ${resumeData.location}
        </p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h3 style="color: var(--accent-pink); font-size: 1.1rem; text-transform: uppercase; margin-bottom: 0.5rem;">Professional Summary</h3>
        <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6;">${resumeData.summary}</p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h3 style="color: var(--accent-pink); font-size: 1.1rem; text-transform: uppercase; margin-bottom: 0.8rem;">Work Experience</h3>
        ${resumeData.experience.map(e => `
          <div style="margin-bottom: 1.2rem;">
            <div style="display:flex; justify-style:space-between; font-weight:700; color:#fff;">
              <span>${e.role} — ${e.company}</span>
              <span style="color:var(--text-dim); font-weight:normal; font-size:0.85rem;">${e.period}</span>
            </div>
            <ul class="exp-bullets" style="margin-top:0.4rem;">
              ${e.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h3 style="color: var(--accent-pink); font-size: 1.1rem; text-transform: uppercase; margin-bottom: 0.8rem;">Education</h3>
        ${resumeData.education.map(ed => `
          <div style="margin-bottom: 0.8rem;">
            <div style="font-weight:700; color:#fff;">${ed.degree}</div>
            <div style="color:var(--primary-purple-light); font-size:0.9rem;">${ed.institution} (${ed.period}) — <strong style="color:#fff;">${ed.score}</strong></div>
          </div>
        `).join('')}
      </div>

      <div style="text-align: center; margin-top: 2rem; display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">
        <a href="documents/KARTHIKA NAIR P.pdf" download="KARTHIKA NAIR P.pdf" class="btn-submit" style="width:auto; padding:0.7rem 1.8rem; background: var(--primary-purple); text-decoration:none; display:inline-flex; align-items:center; gap:0.5rem;">
          <i class="bi bi-download"></i> Download PDF Resume
        </a>
        <button onclick="window.print()" class="btn-submit" style="width:auto; padding:0.7rem 1.8rem; background: rgba(255,255,255,0.1);">
          <i class="bi bi-printer"></i> Print Web Version
        </button>
      </div>
    `;

    document.getElementById('resumeModal').classList.add('active');
  };

  // 8. Contact Form Handling
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      showToast("Thank you, Karthika will get back to you shortly!");
      contactForm.reset();
    });
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
});
