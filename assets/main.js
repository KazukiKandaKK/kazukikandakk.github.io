(() => {
  const navLinkMap = new Map();

  document.addEventListener('DOMContentLoaded', () => {
    fetch('content.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load content.json');
        return res.json();
      })
      .then((data) => {
        renderPage(data);
      })
      .catch((err) => {
        console.error(err);
        fallbackRender();
      });
  });

  function renderPage(data) {
    const {
      profile,
      sections = {},
      focus = [],
      projects = [],
      writing = {},
      experience = [],
      education = [],
      skills = {},
      contact = {},
      ui = {},
      footerNote = ''
    } = data;

    setText('skip-link', ui.skipLink);
    setBrand(profile);
    buildNav(sections.navigation || []);
    setHeadings(sections.headings || {});
    renderHero(profile, ui);
    renderFocus(focus);
    renderProjects(projects, ui);
    renderWriting(writing);
    renderExperience(experience, ui);
    renderEducation(education, ui);
    renderSkills(skills);
    renderContact(contact, ui);
    setText('issue-prompt', ui.issuePrompt);
    setText('footer-note', footerNote);
    initTheme(ui);
    setupScrollSpy(sections.navigation || []);
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value) {
      el.textContent = value;
    }
  }

  function setBrand(profile = {}) {
    setText('brand-name', profile.name);
    setText('brand-handle', profile.handle ? `@${profile.handle}` : '');
  }

  function setHeadings(headings = {}) {
    Object.entries(headings).forEach(([key, text]) => {
      const el = document.querySelector(`[data-heading="${key}"]`);
      if (el) el.textContent = text;
    });
  }

  function buildNav(items) {
    const list = document.getElementById('nav-links');
    if (!list) return;
    list.innerHTML = '';
    items.forEach((item) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${item.id}`;
      link.textContent = item.label;
      link.dataset.target = item.id;
      link.addEventListener('click', () => setActiveNav(item.id));
      li.appendChild(link);
      list.appendChild(li);
      navLinkMap.set(item.id, link);
    });
  }

  function renderHero(profile = {}, ui = {}) {
    if (profile.name) {
      document.title = `${profile.name} | Portfolio`;
    }
    setText('hero-tagline', profile.tagline);
    setText('hero-name', profile.name);
    setText('hero-handle-display', profile.handle ? `@${profile.handle}` : '');

    const photo = document.getElementById('hero-photo');
    if (photo) {
      const wrapper = photo.closest('.hero-photo');
      if (profile.photo && profile.photo.src) {
        photo.src = profile.photo.src;
        photo.alt = profile.photo.alt || '';
        if (wrapper) wrapper.hidden = false;
      } else if (wrapper) {
        wrapper.hidden = true;
      }
    }

    const summaryWrap = document.getElementById('hero-summary');
    if (summaryWrap && Array.isArray(profile.summary)) {
      summaryWrap.innerHTML = '';
      profile.summary.forEach((line) => {
        const p = document.createElement('p');
        p.textContent = line;
        summaryWrap.appendChild(p);
      });
    }

    setText('quick-links-label', ui.quickLinks);
    const linksWrap = document.getElementById('quick-links');
    if (linksWrap && Array.isArray(profile.quickLinks)) {
      linksWrap.innerHTML = '';
      profile.quickLinks.forEach((item) => {
        const a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.label;
        a.target = '_blank';
        a.rel = 'noreferrer noopener';
        linksWrap.appendChild(a);
      });
    }
  }

  function renderFocus(items) {
    const list = document.getElementById('focus-list');
    if (!list) return;
    list.innerHTML = '';
    items.forEach((line) => {
      const li = document.createElement('li');
      li.textContent = line;
      list.appendChild(li);
    });
  }

  function renderProjects(projects = [], ui = {}) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    grid.innerHTML = '';
    projects.forEach((proj) => {
      const card = document.createElement('article');
      card.className = 'card';

      const header = document.createElement('div');
      header.className = 'card-head';

      const title = document.createElement('h3');
      title.textContent = proj.name;
      header.appendChild(title);

      if (proj.status) {
        const status = document.createElement('span');
        status.className = 'status';
        const label = ui.projectStatus ? `${ui.projectStatus}: ` : '';
        status.textContent = `${label}${proj.status}`;
        header.appendChild(status);
      }

      card.appendChild(header);

      if (proj.oneLiner) {
        const one = document.createElement('p');
        one.className = 'one-liner';
        one.textContent = proj.oneLiner;
        card.appendChild(one);
      }

      if (Array.isArray(proj.highlights)) {
        const ul = document.createElement('ul');
        ul.className = 'highlights';
        proj.highlights.forEach((item) => {
          const li = document.createElement('li');
          li.textContent = item;
          ul.appendChild(li);
        });
        card.appendChild(ul);
      }

      if (proj.tech) {
        const meta = document.createElement('div');
        meta.className = 'meta';
        const tech = document.createElement('span');
        const techLabel = ui.projectTech ? `${ui.projectTech}: ` : '';
        tech.textContent = `${techLabel}${proj.tech}`;
        meta.appendChild(tech);
        card.appendChild(meta);
      }

      if (Array.isArray(proj.links)) {
        const linkWrap = document.createElement('div');
        linkWrap.className = 'link-list';
        proj.links.forEach((link) => {
          const a = document.createElement('a');
          a.href = link.url;
          a.textContent = link.label;
          a.target = '_blank';
          a.rel = 'noreferrer noopener';
          linkWrap.appendChild(a);
        });
        card.appendChild(linkWrap);
      }

      grid.appendChild(card);
    });
  }

  function renderWriting(writing = {}) {
    const grid = document.getElementById('writing-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (writing.zenn) {
      grid.appendChild(createWritingCard(writing.zenn));
    }
    if (writing.archive) {
      grid.appendChild(createWritingCard(writing.archive));
    }
  }

  function createWritingCard(entry) {
    const card = document.createElement('article');
    card.className = 'writing-card';
    const title = document.createElement('h3');
    title.textContent = entry.title;
    card.appendChild(title);

    if (entry.countLabel) {
      const p = document.createElement('p');
      p.textContent = entry.countLabel;
      card.appendChild(p);
    }

    if (entry.note) {
      const p = document.createElement('p');
      p.textContent = entry.note;
      card.appendChild(p);
    }

    if (entry.url) {
      const link = document.createElement('a');
      link.href = entry.url;
      link.textContent = entry.url;
      link.target = '_blank';
      link.rel = 'noreferrer noopener';
      card.appendChild(link);
    }

    return card;
  }

  function renderExperience(items = [], ui = {}) {
    const wrap = document.getElementById('experience-list');
    if (!wrap) return;
    const section = document.getElementById('experience');
    if (!items.length) {
      if (section) section.hidden = true;
      return;
    }
    if (section) section.hidden = false;
    wrap.innerHTML = '';
    items.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'timeline-item';
      const title = document.createElement('h3');
      title.textContent = item.role || '';
      row.appendChild(title);

      if (item.period) {
        const period = document.createElement('div');
        period.className = 'period';
        period.textContent = item.period;
        row.appendChild(period);
      }

      if (item.summary) {
        const p = document.createElement('p');
        p.textContent = item.summary;
        row.appendChild(p);
      }

      wrap.appendChild(row);
    });

    setText('timeline-note', ui.timelineNote);
  }

  function renderEducation(items = [], ui = {}) {
    const list = document.getElementById('education-list');
    if (!list) return;
    list.innerHTML = '';
    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'edu-item';
      const title = document.createElement('h3');
      title.textContent = item.degree || '';
      li.appendChild(title);

      if (item.institution) {
        const inst = document.createElement('p');
        inst.textContent = item.institution;
        li.appendChild(inst);
      }

      if (item.notes) {
        const note = document.createElement('p');
        note.textContent = item.notes;
        li.appendChild(note);
      }

      list.appendChild(li);
    });
    setText('education-note', ui.educationNote);
  }

  function renderSkills(groups = {}) {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;
    grid.innerHTML = '';
    Object.entries(groups).forEach(([name, list]) => {
      const block = document.createElement('div');
      block.className = 'skill-group';
      const title = document.createElement('h3');
      title.textContent = name;
      block.appendChild(title);

      if (Array.isArray(list)) {
        const ul = document.createElement('ul');
        list.forEach((item) => {
          const li = document.createElement('li');
          li.textContent = item;
          ul.appendChild(li);
        });
        block.appendChild(ul);
      }

      grid.appendChild(block);
    });
  }

  function renderContact(contact = {}, ui = {}) {
    setText('contact-email', contact.email);
    setText('contact-note', contact.note);
    const note = document.getElementById('contact-note');
    if (note) {
      note.hidden = !contact.note;
    }

    const issue = document.getElementById('issue-prompt');
    if (issue && ui.issuePrompt && contact.github) {
      const link = document.createElement('a');
      link.href = contact.github;
      link.textContent = contact.github;
      link.target = '_blank';
      link.rel = 'noreferrer noopener';
      issue.textContent = `${ui.issuePrompt} `;
      issue.appendChild(link);
      issue.hidden = false;
    } else if (issue) {
      issue.hidden = true;
    }
  }

  function setActiveNav(id) {
    navLinkMap.forEach((link) => link.classList.remove('active'));
    const target = navLinkMap.get(id);
    if (target) target.classList.add('active');
  }

  function setupScrollSpy(items = []) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0.4 }
    );

    items.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  function initTheme(ui = {}) {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    const root = document.documentElement;
    const saved = root.getAttribute('data-theme');
    const initial = saved || 'light';
    applyTheme(initial, toggle);
    toggle.textContent = ui.modeToggle || '';
    toggle.setAttribute('aria-label', ui.modeToggle || 'Toggle dark mode');
    toggle.setAttribute('aria-pressed', initial === 'dark');
    toggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next, toggle);
    });
  }

  function applyTheme(theme, toggle) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('kk-theme', theme);
    if (toggle) {
      toggle.setAttribute('aria-pressed', theme === 'dark');
    }
  }

  function fallbackRender() {
    const page = document.getElementById('page');
    if (!page) return;
    page.innerHTML = '';
    const message = document.createElement('p');
    message.textContent = 'Unable to load portfolio content. Please try again later.';
    page.appendChild(message);
  }
})();
