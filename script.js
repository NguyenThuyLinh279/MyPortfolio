(() => {
  async function loadPersonalInfo() {
    try {
      const response = await fetch(new URL('./data/personal.json', document.baseURI));
      if (!response.ok) throw new Error(`Could not load personal.json (${response.status})`);
      const personal = await response.json();

      for (const element of document.querySelectorAll('[data-personal-src]')) {
        const value = personal[element.dataset.personalSrc];
        if (typeof value === 'string' && value.trim()) element.src = value.trim();
      }

      for (const element of document.querySelectorAll('[data-personal]')) {
        const value = personal[element.dataset.personal];
        if (typeof value === 'string') element.textContent = value;
      }

      const interestsList = document.querySelector('[data-personal-list="interests"]');
      if (interestsList && Array.isArray(personal.interests)) {
        interestsList.replaceChildren(...personal.interests.map((interest) => {
          const item = document.createElement('span');
          item.textContent = interest;
          return item;
        }));
      }

      if (typeof personal.pageTitle === 'string') document.title = personal.pageTitle;

      const emailLink = document.querySelector('[data-personal-email]');
      if (emailLink && typeof personal.email === 'string' && personal.email.trim()) {
        const emailValue = emailLink.querySelector('[data-contact-value]');
        if (emailValue) emailValue.textContent = personal.email.trim();
      }

      const phoneLink = document.querySelector('[data-personal-phone]');
      if (phoneLink && typeof personal.phone === 'string' && personal.phone.trim()) {
        const phoneValue = phoneLink.querySelector('[data-contact-value]');
        if (phoneValue) phoneValue.textContent = personal.phone.trim();
      }

      const facebookLink = document.querySelector('[data-personal-facebook]');
      if (facebookLink && typeof personal.facebook === 'string' && personal.facebook.trim()) {
        facebookLink.href = personal.facebook.trim();
      }
    } catch (error) {
      if (window.location.protocol !== 'file:') console.warn('Using the built-in portfolio text because personal.json could not be loaded.', error);
    }
  }

  loadPersonalInfo();

  function renderTvcProjects() {
    const projectList = document.querySelector('#tvc-project-list');
    if (!projectList) return;

    const projects = Array.isArray(window.TVC_PROJECTS) ? window.TVC_PROJECTS : [];
    if (!projects.length) {
      const notice = document.createElement('p');
      notice.className = 'tvc-data-notice';
      notice.textContent = 'Chưa có dữ liệu TVC. Bạn có thể cập nhật trong data/tvc-projects.js.';
      projectList.replaceChildren(notice);
      return;
    }

    const cards = projects.map((project, index) => {
      const article = document.createElement('article');
      article.className = 'tvc-project';
      article.dataset.projectId = project.id || `tvc-${index + 1}`;
      if (index % 2 === 1) article.classList.add('tvc-project-reverse');

      const media = document.createElement('div');
      media.className = 'tvc-project-media';

      if (typeof project.videoUrl === 'string' && project.videoUrl.trim()) {
        const videoUrl = project.videoUrl.trim();
        const drivePreviewUrl = /^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+\/preview(?:[?#].*)?$/.test(videoUrl);

        if (drivePreviewUrl) {
          const embed = document.createElement('iframe');
          embed.className = 'tvc-video-embed';
          embed.src = videoUrl;
          embed.title = `Video: ${project.title || project.brand || 'TVC'}`;
          embed.loading = 'lazy';
          embed.allowFullscreen = true;
          embed.referrerPolicy = 'strict-origin-when-cross-origin';
          embed.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
          media.append(embed);
        } else {
          const video = document.createElement('video');
          video.className = 'tvc-video';
          video.controls = true;
          video.preload = 'none';
          video.playsInline = true;
          video.setAttribute('aria-label', `Video: ${project.title || project.brand || 'TVC'}`);
          if (typeof project.thumbnail === 'string' && project.thumbnail.trim()) {
            video.poster = project.thumbnail.trim();
          }

          const source = document.createElement('source');
          source.src = videoUrl;
          source.type = 'video/mp4';
          video.append(source);

          const playHint = document.createElement('span');
          playHint.className = 'tvc-video-play-hint';
          playHint.setAttribute('aria-hidden', 'true');
          playHint.textContent = '▶';
          video.addEventListener('play', () => media.classList.add('is-playing'));
          video.addEventListener('pause', () => media.classList.remove('is-playing'));
          video.addEventListener('ended', () => media.classList.remove('is-playing'));
          video.addEventListener('error', () => media.classList.add('has-video-error'));

          media.append(video, playHint);
          const errorNotice = document.createElement('span');
          errorNotice.className = 'tvc-video-error';
          errorNotice.textContent = 'Không tải được video. Hãy kiểm tra đường dẫn videoUrl trong data/tvc-projects.js.';
          media.append(errorNotice);
        }
      } else {
        media.classList.add('is-placeholder');
        if (typeof project.thumbnail === 'string' && project.thumbnail.trim()) {
          const image = document.createElement('img');
          image.src = project.thumbnail.trim();
          image.alt = `Ảnh minh họa ${project.title || project.brand || 'dự án TVC'}`;
          media.append(image);
        }
        const placeholder = document.createElement('span');
        placeholder.className = 'tvc-media-placeholder';
        placeholder.textContent = 'Video sẽ được thêm tại data/tvc-projects.js.';
        media.append(placeholder);
      }

      const content = document.createElement('div');
      content.className = 'tvc-project-content';

      const header = document.createElement('header');
      header.className = 'tvc-project-header';
      const indexLabel = document.createElement('p');
      indexLabel.className = 'tvc-project-index';
      const category = typeof project.category === 'string' ? project.category.trim() : '';
      indexLabel.textContent = category
        ? `${String(index + 1).padStart(2, '0')} / ${category}`
        : `TVC / ${String(index + 1).padStart(2, '0')}`;
      const title = document.createElement('h3');
      title.textContent = project.title || 'Dự án TVC';
      const brand = document.createElement('p');
      brand.className = 'tvc-project-brand';
      brand.textContent = project.brand || '';
      header.append(indexLabel, title);
      if (brand.textContent) header.append(brand);
      content.append(header);

      if (typeof project.overview === 'string' && project.overview.trim()) {
        const overview = document.createElement('section');
        overview.className = 'tvc-project-block';
        const label = document.createElement('h4');
        label.textContent = 'Project Overview';
        const copy = document.createElement('p');
        copy.textContent = project.overview.trim();
        overview.append(label, copy);
        content.append(overview);
      }

      const roleBlock = document.createElement('section');
      roleBlock.className = 'tvc-project-block tvc-project-role';
      const roleLabel = document.createElement('h4');
      roleLabel.textContent = 'My Role';
      roleBlock.append(roleLabel);

      if (typeof project.myRole === 'string' && project.myRole.trim()) {
        const roleCopy = document.createElement('p');
        roleCopy.textContent = project.myRole.trim();
        roleBlock.append(roleCopy);
      } else if (!Array.isArray(project.roleTags) || !project.roleTags.length) {
        const emptyRole = document.createElement('p');
        emptyRole.className = 'tvc-role-empty';
        emptyRole.textContent = 'Chưa có thông tin vai trò được cung cấp.';
        roleBlock.append(emptyRole);
      }

      const roleTags = Array.isArray(project.roleTags)
        ? project.roleTags.filter((tag) => typeof tag === 'string' && tag.trim())
        : [];
      if (roleTags.length) {
        const tags = document.createElement('ul');
        tags.className = 'tvc-role-tags';
        for (const role of roleTags) {
          const tag = document.createElement('li');
          tag.textContent = role.trim();
          tags.append(tag);
        }
        roleBlock.append(tags);
      }
      content.append(roleBlock);

      article.append(media, content);
      return article;
    });

    projectList.replaceChildren(...cards);
  }

  renderTvcProjects();

  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const navTargets = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  function updateActiveNavigation() {
    const marker = window.innerHeight * 0.42;
    let activeTarget = null;

    for (const target of navTargets) {
      if (target.getBoundingClientRect().top <= marker) activeTarget = target;
    }

    const atPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
    if (atPageEnd) activeTarget = navTargets.at(-1) ?? activeTarget;

    for (const link of navLinks) {
      const isActive = activeTarget && link.hash === `#${activeTarget.id}`;
      link.classList.toggle('is-active', Boolean(isActive));
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  let scrollQueued = false;
  function queueNavigationUpdate() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(() => {
      updateActiveNavigation();
      scrollQueued = false;
    });
  }

  window.addEventListener('scroll', queueNavigationUpdate, { passive: true });
  window.addEventListener('resize', queueNavigationUpdate);
  updateActiveNavigation();
})();
