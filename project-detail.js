(() => {
  const page = document.body;
  const dataPath = page.dataset.projectData;

  function readPath(data, path) {
    return path.split('.').reduce((value, key) => value && value[key], data);
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element && typeof value === 'string' && value.trim()) element.textContent = value.trim();
  }

  function fillList(element, values) {
    if (!Array.isArray(values) || !values.length) return;
    const items = values.filter((value) => typeof value === 'string' && value.trim());
    if (!items.length) return;
    element.replaceChildren(...items.map((value) => {
      const item = document.createElement('li');
      item.textContent = value.trim();
      return item;
    }));
  }

  function resolveAsset(source) {
    if (!source || typeof source !== 'string') return '';
    if (/^https?:\/\//i.test(source)) return source;
    return new URL(`../../${source.replace(/^\/+/, '')}`, window.location.href).href;
  }

  function createOutput(item, index) {
    const figure = document.createElement('figure');
    figure.className = 'output-card';
    if (item.orientation === 'portrait') figure.classList.add('output-card--portrait');
    if (item.orientation === 'landscape') figure.classList.add('output-card--landscape');
    if (item.orientation === 'sheet') figure.classList.add('output-card--sheet');
    const visual = document.createElement('div');
    visual.className = 'output-visual';
    const kind = typeof item.type === 'string' ? item.type.toLowerCase() : 'link';
    const source = resolveAsset(item.src);

    if (source && kind === 'image') {
      const image = document.createElement('img');
      image.src = source;
      image.alt = item.alt || item.title || 'Hình ảnh dự án';
      image.loading = 'lazy';
      image.decoding = 'async';
      visual.append(image);
    } else if (source && kind === 'video') {
      const video = document.createElement('video');
      video.src = source;
      video.controls = true;
      video.preload = 'metadata';
      video.playsInline = true;
      video.setAttribute('aria-label', item.title || 'Video dự án');
      visual.append(video);
    } else if (source && kind === 'audio') {
      visual.classList.add('output-audio');
      const audioLabel = document.createElement('span');
      audioLabel.setAttribute('aria-hidden', 'true');
      audioLabel.textContent = '♫';
      const audio = document.createElement('audio');
      audio.src = source;
      audio.controls = true;
      audio.preload = 'metadata';
      audio.setAttribute('aria-label', item.title || 'Audio dự án');
      visual.append(audioLabel, audio);
    } else {
      const symbol = document.createElement('span');
      symbol.className = 'output-symbol';
      symbol.setAttribute('aria-hidden', 'true');
      symbol.textContent = kind === 'article' ? 'Aa' : '↗';
      visual.append(symbol);
      if (item.url && /^https?:\/\//i.test(item.url)) {
        const link = document.createElement('a');
        link.href = item.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = kind === 'article' ? 'ĐỌC BÀI VIẾT' : 'MỞ SẢN PHẨM';
        visual.append(link);
      }
    }

    const caption = document.createElement('figcaption');
    const label = document.createElement('span');
    label.className = 'output-kind';
    label.textContent = item.label || kind.toUpperCase();
    const title = document.createElement('b');
    title.textContent = item.title || `Sản phẩm ${String(index + 1).padStart(2, '0')}`;
    caption.append(label, title);
    if (item.caption) {
      const note = document.createElement('p');
      note.textContent = item.caption;
      caption.append(note);
    }
    figure.append(visual, caption);
    return figure;
  }

  function createMetricIcon(kind) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    if (kind === 'likes') {
      const heart = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      heart.setAttribute('d', 'M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z');
      svg.append(heart);
    } else if (kind === 'videos') {
      const screen = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      screen.setAttribute('x', '3');
      screen.setAttribute('y', '5');
      screen.setAttribute('width', '18');
      screen.setAttribute('height', '14');
      screen.setAttribute('rx', '2');
      const play = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      play.setAttribute('d', 'm10 9 5 3-5 3z');
      svg.append(screen, play);
    } else if (kind === 'views') {
      const eye = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      eye.setAttribute('d', 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z');
      const pupil = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pupil.setAttribute('cx', '12');
      pupil.setAttribute('cy', '12');
      pupil.setAttribute('r', '2.5');
      svg.append(eye, pupil);
    } else {
      const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      head.setAttribute('cx', '9');
      head.setAttribute('cy', '8');
      head.setAttribute('r', '3.5');
      const people = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      people.setAttribute('d', 'M2.5 20v-1.4a4.1 4.1 0 0 1 4.1-4.1h4.8a4.1 4.1 0 0 1 4.1 4.1V20M16.5 4.8a3.5 3.5 0 0 1 0 6.4M18 14.7a4 4 0 0 1 3.5 4V20');
      svg.append(head, people);
    }
    return svg;
  }

  function createEvidenceImage(item) {
    const figure = document.createElement('figure');
    figure.className = 'evidence-card';
    const image = document.createElement('img');
    image.src = resolveAsset(item.src);
    image.alt = item.alt || item.title || 'Ảnh số liệu dự án';
    image.loading = 'lazy';
    image.decoding = 'async';
    const caption = document.createElement('figcaption');
    const title = document.createElement('b');
    title.textContent = item.title || 'Ảnh số liệu';
    caption.append(title);
    if (item.caption) {
      const note = document.createElement('span');
      note.textContent = item.caption;
      caption.append(note);
    }
    figure.append(image, caption);
    return figure;
  }

  function renderProject(data) {
    setText('[data-project-title]', data.title);
    setText('[data-project-number]', data.projectNumber);
    setText('[data-project-category]', data.category);
    setText('[data-project-summary]', data.summary);
    document.title = `${data.title || 'Dự án'} — Nguyễn Thùy Linh`;

    for (const element of document.querySelectorAll('[data-project-field]')) {
      const value = readPath(data, element.dataset.projectField);
      if (typeof value === 'string' && value.trim()) element.textContent = value.trim();
    }

    for (const element of document.querySelectorAll('[data-project-list]')) {
      fillList(element, readPath(data, element.dataset.projectList));
    }

    const meta = document.querySelector('[data-project-meta]');
    const metaItems = [data.period, ...(Array.isArray(data.platforms) ? data.platforms : [])]
      .filter((value) => typeof value === 'string' && value.trim());
    if (meta && metaItems.length) {
      meta.hidden = false;
      meta.replaceChildren(...metaItems.map((value) => {
        const chip = document.createElement('span');
        chip.textContent = value.trim();
        return chip;
      }));
    }

    const outputs = document.querySelector('[data-project-outputs]');
    if (outputs && Array.isArray(data.selectedOutputs) && data.selectedOutputs.length) {
      outputs.replaceChildren(...data.selectedOutputs.map(createOutput));
    }

    if (Array.isArray(data.selectedOutputGroups)) {
      for (const group of data.selectedOutputGroups) {
        const track = document.querySelector(`[data-project-output-group="${group.id}"]`);
        if (track && Array.isArray(group.items) && group.items.length) {
          track.replaceChildren(...group.items.map(createOutput));
        }
      }
    }

    const featuredVideos = document.querySelector('[data-project-result-videos]');
    if (featuredVideos && Array.isArray(data.results?.featuredVideos) && data.results.featuredVideos.length) {
      featuredVideos.replaceChildren(...data.results.featuredVideos.map(createOutput));
    }

    const metrics = document.querySelector('[data-project-metrics]');
    const verifiedMetrics = Array.isArray(data.results?.metrics)
      ? data.results.metrics.filter((item) => item.label && item.value && item.evidence)
      : [];
    if (metrics && verifiedMetrics.length) {
      metrics.replaceChildren(...verifiedMetrics.map((item) => {
        const card = document.createElement('article');
        card.className = 'metric-item';
        const top = document.createElement('div');
        top.className = 'metric-top';
        const icon = document.createElement('span');
        icon.className = 'metric-icon';
        icon.append(createMetricIcon(item.icon));
        const value = document.createElement('b');
        value.textContent = item.value;
        const label = document.createElement('span');
        label.textContent = item.label;
        top.append(icon, value, label);
        const evidence = document.createElement('small');
        evidence.textContent = `Nguồn: ${item.evidence}`;
        card.append(top, evidence);
        return card;
      }));
    }

    const evidenceImages = document.querySelector('[data-project-evidence]');
    if (evidenceImages && Array.isArray(data.results?.evidenceImages) && data.results.evidenceImages.length) {
      evidenceImages.replaceChildren(...data.results.evidenceImages.map(createEvidenceImage));
    }
  }

  async function loadProject() {
    if (!dataPath) return;
    try {
      const response = await fetch(new URL(dataPath, document.baseURI));
      if (!response.ok) throw new Error(`Could not load project data (${response.status})`);
      renderProject(await response.json());
    } catch (error) {
      const notice = document.querySelector('[data-project-load-notice]');
      if (notice) notice.hidden = false;
      if (window.location.protocol !== 'file:') console.warn('Using the editable placeholders because project JSON could not be loaded.', error);
    }
  }

  loadProject();
})();
