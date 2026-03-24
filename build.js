#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, 'content');
const POEMS_DIR = path.join(CONTENT_DIR, 'poems');
const THOUGHTS_DIR = path.join(CONTENT_DIR, 'thoughts');
const RESEARCH_DIR = path.join(CONTENT_DIR, 'research');
const IMAGES_DIR = path.join(__dirname, 'images');
const OUTPUT = path.join(__dirname, 'index.html');

// --- Helpers ---

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw.trim() };
  const meta = {};
  match[1].split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx > -1) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim();
      meta[key] = val;
    }
  });
  return { meta, body: match[2].trim() };
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function readContentDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
      return { filename: f, ...parseFrontmatter(raw) };
    })
    .sort((a, b) => (Number(a.meta.order) || 99) - (Number(b.meta.order) || 99));
}

// --- Poem rendering ---

function poemBodyToHtml(body) {
  // Split into stanzas by blank lines, then wrap each stanza in <p> with <br> for lines
  const stanzas = body.split(/\n\s*\n/).filter(s => s.trim());
  return stanzas
    .map(stanza => {
      const lines = stanza.split('\n').map(l => escapeHtml(l.trim())).filter(Boolean);
      return `            <p>${lines.join('<br>\n            ')}</p>`;
    })
    .join('\n');
}

function renderPoems(poems) {
  if (poems.length === 0) {
    return '        <p class="empty-state">No poems yet. Add .md files to content/poems/</p>';
  }
  return poems.map(poem => `
        <article class="poem">
          <h3 class="poem-title">${escapeHtml(poem.meta.title || 'Untitled')}</h3>
          <div class="poem-text">
${poemBodyToHtml(poem.body)}
          </div>
        </article>`).join('\n');
}

// --- Thought rendering ---

function thoughtBodyToHtml(body) {
  const lines = body.split('\n');
  let html = '';
  let inParagraph = false;
  let paragraphLines = [];

  function flushParagraph() {
    if (paragraphLines.length > 0) {
      const text = paragraphLines.join(' ')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\u201c/g, '&ldquo;').replace(/\u201d/g, '&rdquo;')
        .replace(/\u2014/g, '&mdash;').replace(/\u2019/g, '&rsquo;');
      html += `            <p>${text}</p>\n`;
      paragraphLines = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('## ')) {
      flushParagraph();
      const heading = escapeHtml(trimmed.slice(3));
      html += `            <h4>${heading}</h4>\n`;
    } else if (trimmed === '') {
      flushParagraph();
    } else {
      paragraphLines.push(trimmed);
    }
  }
  flushParagraph();
  return html;
}

function getPreviewText(body) {
  // Get first paragraph of plain text for the preview
  const lines = body.split('\n').filter(l => l.trim() && !l.trim().startsWith('##'));
  const first = lines.slice(0, 3).join(' ').trim();
  // Trim to ~200 chars at word boundary
  if (first.length <= 200) return escapeHtml(first);
  return escapeHtml(first.slice(0, 200).replace(/\s+\S*$/, '')) + '&hellip;';
}

function renderThoughts(thoughts) {
  if (thoughts.length === 0) {
    return '        <p class="empty-state">No posts yet. Add .md files to content/thoughts/</p>';
  }
  return thoughts.map(t => {
    const slug = (t.meta.title || 'post').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const preview = getPreviewText(t.body);
    return `
        <article class="thought" id="${slug}">
          <div class="thought-header">
            <h3 class="thought-title">${escapeHtml(t.meta.title || 'Untitled')}</h3>
            <time class="thought-date">${escapeHtml(t.meta.date || '')}</time>
          </div>
          <p class="thought-preview">${preview}</p>
          <div class="thought-body">
${thoughtBodyToHtml(t.body)}
          </div>
          <div class="thought-collapse"><button>Close</button></div>
        </article>`;
  }).join('\n');
}

// --- Research rendering ---

function researchBodyToHtml(body) {
  const lines = body.split('\n');
  let html = '';
  let paragraphLines = [];

  function flushParagraph() {
    if (paragraphLines.length > 0) {
      const text = paragraphLines.join(' ')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\u201c/g, '&ldquo;').replace(/\u201d/g, '&rdquo;')
        .replace(/\u2014/g, '&mdash;').replace(/\u2019/g, '&rsquo;')
        .replace(/\u2013/g, '&ndash;');
      html += `            <p>${text}</p>\n`;
      paragraphLines = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    // Video embed: [video:filename.mov]
    const videoMatch = trimmed.match(/^\[video:(.+?)\]$/);
    if (videoMatch) {
      flushParagraph();
      const file = escapeHtml(videoMatch[1]);
      html += `            <div class="research-video">
              <video controls playsinline preload="metadata">
                <source src="media/${file}" type="video/quicktime">
                <source src="media/${file}" type="video/mp4">
              </video>
            </div>\n`;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushParagraph();
      const heading = escapeHtml(trimmed.slice(3));
      html += `            <h4>${heading}</h4>\n`;
    } else if (trimmed === '') {
      flushParagraph();
    } else {
      paragraphLines.push(trimmed);
    }
  }
  flushParagraph();
  return html;
}

function renderResearch(items) {
  if (items.length === 0) {
    return '        <p class="empty-state">No research posts yet. Add .md files to content/research/</p>';
  }
  return items.map(t => {
    const slug = (t.meta.title || 'post').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const preview = getPreviewText(t.body);
    return `
        <article class="thought" id="${slug}">
          <div class="thought-header">
            <h3 class="thought-title">${escapeHtml(t.meta.title || 'Untitled')}</h3>
            <time class="thought-date">${escapeHtml(t.meta.date || '')}</time>
          </div>
          <p class="thought-preview">${preview}</p>
          <div class="thought-body">
${researchBodyToHtml(t.body)}
          </div>
          <div class="thought-collapse"><button>Close</button></div>
        </article>`;
  }).join('\n');
}

// --- Photo rendering ---

const PHOTOS_MANIFEST = path.join(CONTENT_DIR, 'photos.json');

function readPhotos() {
  // Use curated manifest if it exists, otherwise auto-scan
  if (fs.existsSync(PHOTOS_MANIFEST)) {
    const manifest = JSON.parse(fs.readFileSync(PHOTOS_MANIFEST, 'utf-8'));
    // Verify files exist
    return manifest.filter(entry => fs.existsSync(path.join(IMAGES_DIR, entry.file)));
  }
  if (!fs.existsSync(IMAGES_DIR)) return [];
  const exts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
  return fs.readdirSync(IMAGES_DIR)
    .filter(f => exts.has(path.extname(f).toLowerCase()))
    .sort()
    .map(f => ({ file: f, layout: '', group: '' }));
}

function renderPhotos(photos) {
  if (photos.length === 0) {
    return '        <p class="empty-state">Add images to the <code>images/</code> folder and rebuild.</p>';
  }
  return photos.map(photo => {
    const cls = photo.layout ? ` photo-${photo.layout}` : '';
    return `        <div class="photo-item${cls}">
          <img src="images/${escapeHtml(photo.file)}" alt="" loading="lazy">
        </div>`;
  }).join('\n');
}

// --- Build ---

const poems = readContentDir(POEMS_DIR);
const thoughts = readContentDir(THOUGHTS_DIR);
const research = readContentDir(RESEARCH_DIR);
const photos = readPhotos();

console.log(`Found ${poems.length} poems, ${thoughts.length} thoughts, ${research.length} research, ${photos.length} photos`);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daphne Demekas</title>
  <meta name="description" content="AI researcher, writer, and thinker. Focused on aligning AI systems with human cognition, development, and flourishing.">
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
</head>
<body>

  <!-- Navigation -->
  <nav class="nav" id="nav">
    <a href="#home" class="nav-logo">Daphne Demekas</a>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle menu">
      <span></span>
      <span></span>
    </button>
    <div class="nav-links" id="navLinks">
      <a href="#home" class="nav-link">Home</a>
      <a href="#about" class="nav-link">About</a>
      <a href="#research" class="nav-link">Research</a>
      <a href="#photos" class="nav-link">Photos</a>
      <a href="#thoughts" class="nav-link">Thoughts</a>
      <a href="#poetry" class="nav-link">Poetry</a>
    </div>
  </nav>

  <!-- Home -->
  <section id="home" class="section section-home">
    <div class="home-content">
      <h1 class="home-title">Daphne<br>Demekas</h1>
      <p class="home-subtitle">ML Engineer &middot; Researcher &middot; Writer</p>
      <div class="home-nav-grid">
        <a href="#about" class="home-card">
          <span class="home-card-label">About</span>
        </a>
        <a href="#research" class="home-card">
          <span class="home-card-label">Research</span>
        </a>
        <a href="#photos" class="home-card">
          <span class="home-card-label">Photos</span>
        </a>
        <a href="#thoughts" class="home-card">
          <span class="home-card-label">Thoughts</span>
        </a>
        <a href="#poetry" class="home-card">
          <span class="home-card-label">Poetry</span>
        </a>
      </div>
      <div class="home-contact">
        <a href="mailto:daphnedemekas@gmail.com">daphnedemekas@gmail.com</a>
        <div class="home-socials">
          <a href="https://github.com/daphnedemekas" target="_blank" rel="noopener">GitHub</a>
          <a href="https://uk.linkedin.com/in/daphne-demekas" target="_blank" rel="noopener">LinkedIn</a>
          <a href="https://scholar.google.com/citations?hl=en&amp;user=oI6WRUUAAAAJ" target="_blank" rel="noopener">Google Scholar</a>
        </div>
      </div>
    </div>
  </section>

  <!-- About -->
  <section id="about" class="section section-about">
    <div class="container">
      <header class="section-header">
        <h2 class="section-title">About</h2>
      </header>

      <div class="about-intro">
        <div class="about-details">
          <p class="about-meta">San Francisco, CA &middot; <a href="mailto:daphnedemekas@gmail.com">daphnedemekas@gmail.com</a> &middot;</p>
        </div>
        <p class="about-summary">An AI researcher focused on aligning AI systems with human cognition, development, and flourishing. Recently worked with Emmett Shear at Softmax (an AI alignment company). Currently a member at South Park Commons, co-founding an AI company building foundation models trained on human behavior.</p>
      </div>

      <div class="cv-section">
        <h3 class="cv-heading">Education</h3>
        <div class="cv-entry">
          <div class="cv-entry-header">
            <h4>M.Sc. in Computing (AI &amp; ML), First Class Honours</h4>
            <span class="cv-date">2020 &ndash; 2021</span>
          </div>
          <p class="cv-institution"><a href="https://www.imperial.ac.uk/computing/" target="_blank" rel="noopener">Imperial College London</a></p>
          <p class="cv-detail">Thesis: Multi-agent generative model of the spread of ideas on Twitter, using active inference agents</p>
          <p class="cv-detail cv-courses">Reinforcement Learning, Deep Learning, Machine Vision, NLP, Probabilistic Inference, Probabilistic Programming, Multi-agent Systems</p>
        </div>
        <div class="cv-entry">
          <div class="cv-entry-header">
            <h4>B.Sc. in Mathematics, First Class Honours</h4>
            <span class="cv-date">2017 &ndash; 2020</span>
          </div>
          <p class="cv-institution"><a href="https://www.ucl.ac.uk/maths/" target="_blank" rel="noopener">University College London</a></p>
          <p class="cv-detail cv-courses">Real and Complex Analysis, Probability &amp; Statistics, Stochastic Processes, Risk &amp; Decision Making, Financial Mathematics, Quantum Physics, Linear Algebra</p>
        </div>
      </div>

      <div class="cv-section">
        <h3 class="cv-heading">Recent Work</h3>
        <div class="cv-entry">
          <div class="cv-entry-header">
            <h4>Founding Engineer &mdash; <a href="https://softmax.com/" target="_blank" rel="noopener">Softmax</a></h4>
            <span class="cv-date">Sep 2023 &ndash; Jan 2026</span>
          </div>
          <ul class="cv-list">
            <li>Joined as third employee and wrote core technical stack</li>
            <li>Multi-agent reinforcement learning environment studying emergent coordination and alignment</li>
            <li>Co-led Cybernetics team designing experiments in agent learning and strategy development</li>
            <li>Deep RL at scale: policy training, curriculum design, and reward structure debugging</li>
          </ul>
          <p class="cv-detail" style="margin-top: 0.75rem;"><a href="#cybernetics-at-softmax" class="cv-inline-link">Read about my work on the cybernetics team &rarr;</a></p>
        </div>
      </div>

      <div class="cv-section">
        <h3 class="cv-heading">Peer-Reviewed Publications</h3>
        <ol class="pub-list">
          <li>Olsen, D., et al. (2025). <a href="https://academic.oup.com/bioinformatics/article/41/Supplement_1/i449/8199346" target="_blank" rel="noopener">&ldquo;NEAR: Neural Embeddings for Amino Acid Relationships.&rdquo;</a> <em>Bioinformatics.</em></li>
          <li>Demekas, D., et al. (2023). <a href="https://link.springer.com/chapter/10.1007/978-3-031-47958-8_10" target="_blank" rel="noopener">&ldquo;An Analytical Model of Active Inference in the Iterated Prisoner&rsquo;s Dilemma.&rdquo;</a> <em>International Workshop on Active Inference (IWAI).</em></li>
          <li>Heins, C., et al. (2023). <a href="https://link.springer.com/chapter/10.1007/978-3-031-28719-0_6" target="_blank" rel="noopener">&ldquo;Spin Glass Systems as Collective Active Inference.&rdquo;</a> <em>International Workshop on Active Inference (IWAI).</em></li>
          <li>Albarracin, et al. (2022). <a href="https://www.mdpi.com/1099-4300/24/4/476" target="_blank" rel="noopener">&ldquo;Epistemic Communities Under Active Inference.&rdquo;</a> <em>Entropy.</em></li>
          <li>Heins, C., Millidge, B., Demekas, D., et al. (2022). <a href="https://joss.theoj.org/papers/10.21105/joss.04098" target="_blank" rel="noopener">&ldquo;pymdp: A Python Library for Active Inference in Discrete State Spaces.&rdquo;</a> <em>Journal of Open Source Software.</em></li>
          <li>Demekas, D., et al. (2020). <a href="https://www.frontiersin.org/journals/computational-neuroscience/articles/10.3389/fncom.2020.00030/full" target="_blank" rel="noopener">&ldquo;An Investigation of the Free Energy Principle for Emotion Recognition.&rdquo;</a> <em>Frontiers in Computational Neuroscience.</em></li>
        </ol>
      </div>

      <div class="cv-section">
        <h3 class="cv-heading">Manuscripts in Preparation</h3>
        <p class="cv-detail">Demekas, D. &amp; Deane, G. &ldquo;Recursive self-models and minimal phenomenal experience&rdquo;</p>
      </div>

      <div class="cv-section">
        <h3 class="cv-heading">Awards</h3>
        <div class="cv-entry">
          <div class="cv-entry-header">
            <h4>The 2025 Computational Phenomenology of Pure Awareness Prize</h4>
          </div>
          <p class="cv-detail">Awarded to George Deane and Daphne Demekas for work on recursive self-models and minimal phenomenal experience &mdash; framing minimal phenomenal experience as a limit case within a computational architecture where a policy model generating behavior is recursively coupled to a program model explaining that behavior.</p>
        </div>
      </div>

      <div class="cv-section">
        <h3 class="cv-heading">Past Work</h3>
        <div class="cv-entry">
          <div class="cv-entry-header">
            <h4>Software Scientist &mdash; <a href="http://wheelerlab.org/" target="_blank" rel="noopener">Wheeler Lab</a>, University of Arizona</h4>
            <span class="cv-date">Jan 2023 &ndash; Aug 2024</span>
          </div>
          <ul class="cv-list">
            <li>NEAR (CNN-based protein homology detection) and DIPLOMAT (ML animal tracking and behavior analysis)</li>
            <li>Mentored Masters students; participated in research groups and literature reviews</li>
          </ul>
        </div>
        <div class="cv-entry">
          <div class="cv-entry-header">
            <h4>Research Associate (ML) &mdash; <a href="https://www.dcs.bbk.ac.uk/" target="_blank" rel="noopener">Birkbeck, University of London</a></h4>
            <span class="cv-date">May 2022 &ndash; Sep 2022</span>
          </div>
          <ul class="cv-list">
            <li>Collaborated with <a href="https://www.vam.ac.uk/" target="_blank" rel="noopener">Victoria &amp; Albert Museum</a>; fine-tuned diffusion models on museum collection</li>
            <li>Developed demonstration platform for exhibition showing generated image combinations across collection themes and styles</li>
          </ul>
        </div>
        <div class="cv-entry">
          <div class="cv-entry-header">
            <h4>Developer &mdash; <a href="https://www.networkscienceinstitute.org/" target="_blank" rel="noopener">Northeastern University, Network Science Institute</a></h4>
            <span class="cv-date">Jan 2022 &ndash; Jan 2023</span>
          </div>
          <ul class="cv-list">
            <li>Network simulations (Erd&#337;s-R&eacute;nyi and Watts-Strogatz models); modeled belief propagation in active inference agent networks</li>
            <li>First author on analytical model of Iterated Prisoner&rsquo;s Dilemma showing bounded-rational Bayesian agents recover optimal strategies</li>
            <li>Contributed mathematical derivations to work on active inference collectives as spin glass systems</li>
          </ul>
        </div>
        <div class="cv-entry">
          <div class="cv-entry-header">
            <h4>Software Engineer &mdash; <a href="https://www.9fin.com/" target="_blank" rel="noopener">9fin</a></h4>
            <span class="cv-date">Jan 2022 &ndash; Jan 2023</span>
          </div>
          <ul class="cv-list">
            <li>Backend engineering on fixed income asset information platform</li>
            <li>Built endpoints using AWS state machines, lambdas, SQL, and S3</li>
            <li>Computer vision and NLP: recommendation engine parsing PDF documents for legal team workflow optimization</li>
          </ul>
        </div>
        <div class="cv-entry">
          <div class="cv-entry-header">
            <h4>ML Engineer &mdash; <a href="https://www.nestedminds.org/" target="_blank" rel="noopener">Nested Minds</a></h4>
            <span class="cv-date">Jan 2021 &ndash; Jan 2022</span>
          </div>
          <ul class="cv-list">
            <li>Active inference startup from Karl Friston&rsquo;s theoretical neurobiology group at UCL</li>
            <li>Algorithm design, generative models, backend development, infrastructure, team leadership</li>
            <li>Huxley: AI diffusion algorithm for Duran Duran&rsquo;s &ldquo;Invisible&rdquo; music video</li>
            <li>Disney Autonomy: social interaction robot for theme park</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Research -->
  <section id="research" class="section section-research">
    <div class="container">
      <header class="section-header">
        <h2 class="section-title">Research</h2>
      </header>
      <div class="thoughts-list">
${renderResearch(research)}
      </div>
    </div>
  </section>

  <!-- Photos -->
  <section id="photos" class="section section-photos">
    <div class="container">
      <header class="section-header">
        <h2 class="section-title">Photos</h2>
      </header>
      <div class="photo-gallery" id="photoGallery">
${renderPhotos(photos)}
      </div>
    </div>
  </section>

  <!-- Thoughts -->
  <section id="thoughts" class="section section-thoughts">
    <div class="container">
      <header class="section-header">
        <h2 class="section-title">Thoughts</h2>
      </header>
      <div class="thoughts-list">
${renderThoughts(thoughts)}
      </div>
    </div>
  </section>

  <!-- Poetry -->
  <section id="poetry" class="section section-poetry">
    <div class="container">
      <header class="section-header">
        <h2 class="section-title">Poetry</h2>
      </header>
      <div class="poems-grid">
${renderPoems(poems)}
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-links">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#research">Research</a>
        <a href="#photos">Photos</a>
        <a href="#thoughts">Thoughts</a>
        <a href="#poetry">Poetry</a>
      </div>
      <div class="footer-contact">
        <a href="mailto:daphnedemekas@gmail.com">daphnedemekas@gmail.com</a>
        <span class="footer-divider">&middot;</span>
        <a href="https://github.com/daphnedemekas" target="_blank" rel="noopener">GitHub</a>
        <span class="footer-divider">&middot;</span>
        <a href="https://uk.linkedin.com/in/daphne-demekas" target="_blank" rel="noopener">LinkedIn</a>
      </div>
      <p class="footer-copy">&copy; 2026 Daphne Demekas</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;

fs.writeFileSync(OUTPUT, html, 'utf-8');
console.log(`Built index.html (${(html.length / 1024).toFixed(1)} KB)`);
