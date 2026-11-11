/* Bruno Bottazzini · personal site
   Vanilla JS, no dependencies, no network calls. Every block is progressive enhancement:
   the page content is complete without it. */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const lang = root.lang === 'en' ? 'en' : 'it';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const EMAIL = 'bottazzinibruno@gmail.com';

  const $ = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const el = (tag, cls, text) => {
    const node = doc.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };
  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\-+ ]/g, ' ').replace(/\s+/g, ' ').trim();
  const go = hash => {
    const target = $(hash);
    if (target) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const T = {
    it: {
      copied: 'Indirizzo copiato.', copyFail: 'Puoi copiare l’indirizzo qui sopra.',
      steps: ['interpreto la domanda', 'cerco in: ', 'compongo la risposta'], profile: 'profilo', sources: 'fonti',
      introQ: 'Chi è Bruno?',
      pGo: 'Vai a', pDo: 'Azioni', pAgent: 'Agente', pAsk: 'Chiedi all’agente', pHome: 'Inizio',
      pCopy: 'Copia l’email', pLang: 'Switch to English', pLangHint: 'EN', pFocus: 'Fai una domanda all’agente',
      hello: 'Ciao! Il codice è vanilla: niente framework, niente tracker. Prova la command palette.'
    },
    en: {
      copied: 'Email address copied.', copyFail: 'You can copy the address above.',
      steps: ['parsing the question', 'searching: ', 'composing the answer'], profile: 'profile', sources: 'sources',
      introQ: 'Who is Bruno?',
      pGo: 'Go to', pDo: 'Actions', pAgent: 'Agent', pAsk: 'Ask the agent', pHome: 'Top',
      pCopy: 'Copy email address', pLang: 'Passa all’italiano', pLangHint: 'IT', pFocus: 'Ask the agent a question',
      hello: 'Hi! The code is vanilla: no framework, no trackers. Try the command palette.'
    }
  }[lang];

  // Sections the agent can cite and the palette can jump to.
  const SEC = {
    ai: { href: '#ai', it: 'Competence Center', en: 'Competence Center' },
    method: { href: '#method', it: 'Metodo', en: 'Method' },
    approach: { href: '#approach', it: 'Approccio', en: 'Approach' },
    experience: { href: '#experience', it: 'Percorso', en: 'Experience' },
    skills: { href: '#skills', it: 'Competenze', en: 'Skills' },
    learning: { href: '#learning', it: 'Studio continuo', en: 'Learning' },
    projects: { href: '#projects', it: 'Progetti', en: 'Projects' },
    contact: { href: '#contact', it: 'Contatti', en: 'Contact' },
    mail: { href: 'mailto:' + EMAIL, it: 'Scrivi a Bruno', en: 'Email Bruno' }
  };

  /* ---------- menu ---------- */
  const menuButton = $('.menu-toggle');
  const navigation = $('.nav');
  if (menuButton && navigation) {
    const closeMenu = () => {
      navigation.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    };
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      navigation.classList.toggle('is-open', open);
    });
    $$('a', navigation).forEach(link => link.addEventListener('click', closeMenu));
    doc.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
      }
    });
  }

  /* ---------- copy email ---------- */
  const copyStatus = $('.copy-status');
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      if (copyStatus) copyStatus.textContent = T.copied;
      return true;
    } catch {
      if (copyStatus) copyStatus.textContent = T.copyFail;
      return false;
    }
  };
  const canCopy = !!(navigator.clipboard && window.isSecureContext);
  if (canCopy) {
    $$('[data-copy-email]').forEach(button => {
      button.hidden = false;
      button.addEventListener('click', copyEmail);
    });
  }

  /* ---------- scroll progress, header state, current section ---------- */
  const progress = $('.progress');
  const header = $('.site-header');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = root.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      if (header) header.classList.toggle('is-stuck', window.scrollY > 8);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  const hasIO = 'IntersectionObserver' in window;
  const navLinks = $$('.nav a[href^="#"]');
  if (hasIO && navLinks.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    $$('main > section[id]').forEach(section => spy.observe(section));
  }

  /* ---------- reveal on scroll ---------- */
  const reveals = $$('.reveal');
  const trainlog = $('#trainlog');
  if (hasIO && !reduce) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const node = entry.target;
        io.unobserve(node);
        node.classList.add('in');
        if (node === trainlog) node.classList.add('run');
        // once settled, drop the classes so hover transforms are not slowed by the reveal transition
        setTimeout(() => node.classList.remove('reveal', 'in'), 1600);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    reveals.forEach(node => io.observe(node));
  } else {
    reveals.forEach(node => node.classList.remove('reveal'));
    if (trainlog) trainlog.classList.add('run');
  }

  /* ---------- neural field (hero canvas) ----------
     Signals travel left to right through a layered network. Lime pulses are the AI at work;
     the visitor's pointer injects amber activations: the human in the loop. */
  (function neural() {
    const canvas = $('.neural');
    if (!canvas || !canvas.getContext) return;
    const hero = canvas.closest('.hero');
    const ctx = canvas.getContext('2d');
    const AI = '213,237,172', HUMAN = '255,184,112', TAU = Math.PI * 2, R = 170;
    const rnd = Math.random;
    const ptr = { x: -1e4, y: -1e4, on: false };
    let w = 0, h = 0, nodes = [], edges = [], pulses = [], first = [];
    let raf = 0, last = 0, spawn = 600, inView = true;

    function build() {
      const rect = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = []; edges = []; pulses = [];
      const layers = Math.max(4, Math.min(12, Math.round(w / 118)));
      const most = h > 900 ? 8 : 7;
      const cols = [];
      for (let l = 0; l < layers; l++) {
        const count = 3 + Math.floor(rnd() * (most - 2));
        const x = w * (0.03 + 0.94 * (l / (layers - 1)));
        const col = [];
        for (let i = 0; i < count; i++) {
          const y = h * (0.05 + 0.9 * ((i + 0.5) / count)) + (rnd() - 0.5) * (h / count) * 0.5;
          const node = { bx: x + (rnd() - 0.5) * 46, by: y, x: 0, y: 0, a: 0, hu: 0, ph: rnd() * TAU, out: [] };
          node.x = node.bx; node.y = node.by;
          col.push(node);
          nodes.push(node);
        }
        cols.push(col);
      }
      for (let l = 0; l < layers - 1; l++) {
        for (const a of cols[l]) {
          const next = cols[l + 1].slice().sort((p, q) => Math.abs(p.by - a.by) - Math.abs(q.by - a.by));
          const links = Math.min(next.length, 2 + (rnd() < 0.35 ? 1 : 0));
          for (let i = 0; i < links; i++) {
            const edge = { a, b: next[i] };
            edges.push(edge);
            a.out.push(edge);
          }
        }
      }
      first = cols[0];
    }

    function emit(node, hu, count) {
      for (let i = 0; i < count && pulses.length < 80 && node.out.length; i++) {
        pulses.push({ e: node.out[Math.floor(rnd() * node.out.length)], t: 0, sp: 0.0009 + rnd() * 0.0008, hu });
      }
    }
    function arrive(node, hu) {
      node.a = 1;
      node.hu = hu;
      if (rnd() < 0.9) emit(node, hu, rnd() < 0.2 ? 2 : 1);
    }

    function draw(t, dt) {
      ctx.clearRect(0, 0, w, h);
      const decay = Math.exp(-dt / 700);
      for (const n of nodes) {
        if (dt) {
          n.x = n.bx + Math.sin(t * 0.00045 + n.ph) * 7;
          n.y = n.by + Math.cos(t * 0.00038 + n.ph) * 7;
          n.a *= decay;
          if (n.a < 0.02) n.hu = 0;
        }
        if (ptr.on) {
          const dx = n.x - ptr.x, dy = n.y - ptr.y, d = Math.hypot(dx, dy);
          if (d < R) {
            const k = 1 - d / R;
            if (k > n.a) { n.a = k; n.hu = 1; }
            if (dt && rnd() < 0.014 * k) emit(n, 1, 1);
            ctx.strokeStyle = `rgba(${HUMAN},${0.3 * k})`;
            ctx.beginPath(); ctx.moveTo(ptr.x, ptr.y); ctx.lineTo(n.x, n.y); ctx.stroke();
          }
        }
      }
      ctx.lineWidth = 1;
      for (const e of edges) {
        const lead = e.a.a >= e.b.a ? e.a : e.b;
        ctx.strokeStyle = `rgba(${lead.hu ? HUMAN : AI},${0.15 + 0.42 * lead.a})`;
        ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); ctx.stroke();
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += dt * p.sp;
        if (p.t >= 1) { pulses.splice(i, 1); arrive(p.e.b, p.hu); continue; }
        const x = p.e.a.x + (p.e.b.x - p.e.a.x) * p.t, y = p.e.a.y + (p.e.b.y - p.e.a.y) * p.t;
        const col = p.hu ? HUMAN : AI, tail = Math.max(0, p.t - 0.16);
        ctx.strokeStyle = `rgba(${col},.75)`; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(p.e.a.x + (p.e.b.x - p.e.a.x) * tail, p.e.a.y + (p.e.b.y - p.e.a.y) * tail); ctx.lineTo(x, y); ctx.stroke();
        ctx.lineWidth = 1;
        ctx.fillStyle = `rgba(${col},.18)`; ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.fill();
        ctx.fillStyle = `rgba(${col},1)`; ctx.beginPath(); ctx.arc(x, y, 2.2, 0, TAU); ctx.fill();
      }
      for (const n of nodes) {
        const col = n.hu ? HUMAN : AI, r = 1.9 + 2.6 * n.a;
        if (n.a > 0.04) { ctx.fillStyle = `rgba(${col},${0.16 * n.a})`; ctx.beginPath(); ctx.arc(n.x, n.y, r + 11 * n.a, 0, TAU); ctx.fill(); }
        ctx.fillStyle = `rgba(${col},${0.5 + 0.5 * n.a})`; ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, TAU); ctx.fill();
      }
    }

    function frame(t) {
      const dt = Math.min(48, last ? t - last : 16);
      last = t;
      spawn -= dt;
      if (spawn <= 0 && first.length) { arrive(first[Math.floor(rnd() * first.length)], 0); spawn = 300 + rnd() * 620; }
      draw(t, dt);
      raf = requestAnimationFrame(frame);
    }
    const start = () => { if (!raf && inView && !doc.hidden) { last = 0; raf = requestAnimationFrame(frame); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    build();
    if (reduce) {
      nodes.forEach(n => { if (rnd() < 0.3) n.a = 0.3 + rnd() * 0.6; });
      draw(0, 0);
      return;
    }
    hero.addEventListener('pointermove', e => {
      const rect = canvas.getBoundingClientRect();
      ptr.x = e.clientX - rect.left; ptr.y = e.clientY - rect.top; ptr.on = true;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { ptr.on = false; });
    hero.addEventListener('pointerdown', e => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      nodes.forEach(n => { if (Math.hypot(n.x - x, n.y - y) < 230) arrive(n, 1); });
    }, { passive: true });
    if (hasIO) new IntersectionObserver(entries => { inView = entries[0].isIntersecting; inView ? start() : stop(); }).observe(hero);
    doc.addEventListener('visibilitychange', () => (doc.hidden ? stop() : start()));
    if ('ResizeObserver' in window) {
      let timer = 0;
      new ResizeObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const rect = hero.getBoundingClientRect();
          if (Math.abs(rect.width - w) > 2 || Math.abs(rect.height - h) > 60) build();
        }, 180);
      }).observe(hero);
    }
    start();
  })();

  /* ---------- demo agent ----------
     Scripted, local, honest about it: keyword matching over answers Bruno wrote. No model, no requests. */
  const KB = [
    { k: ['chi e', 'chi sei', 'who is', 'who are', 'whoami', 'presenta', 'introduce', 'about', 'bio '], p: 1, c: ['experience', 'ai'],
      a: { it: 'Bruno Bottazzini è Software Architect e Technical Lead in Tinexta Infocert, e vive a Torino. Progetta piattaforme cloud-native, ha oltre quindici anni di software alle spalle tra Brasile e Italia e fa parte dell’AI Competence Center dell’azienda.',
           en: 'Bruno Bottazzini is a Software Architect and Technical Lead at Tinexta Infocert, based in Turin. He designs cloud-native platforms, has more than fifteen years of software behind him across Brazil and Italy, and is part of the company’s AI Competence Center.' } },
    { k: ['ai ', 'ia ', 'intelligenza artificiale', 'artificial intelligence', 'llm', 'genai', 'copilot', 'usa l ai', 'use ai', 'uses ai'], p: 2.5, c: ['method', 'approach'],
      a: { it: 'Per Bruno l’AI è parte del metodo di lavoro: sviluppo guidato dalle specifiche, coding assistito, simulazione di scenari architetturali, review e test automatizzati. Con una regola: l’AI accelera, le decisioni restano alle persone.',
           en: 'For Bruno, AI is part of the working method: spec-driven development, assisted coding, architectural scenario simulation, automated review and testing. With one rule: AI accelerates, decisions stay with people.' } },
    { k: ['ai-dlc', 'aidlc', 'dlc', 'bolt', 'inception', 'mob ', 'lifecycle', 'life cycle', 'aws'], p: 2, c: ['method'],
      a: { it: 'AI-DLC è il ciclo di sviluppo AI-native descritto da AWS. L’AI propone un piano, fa domande e implementa solo dopo la validazione del team. Tre fasi: Inception, Construction, Operations. Al posto degli sprint ci sono i bolt, cicli di ore o giorni. Bruno lo ha portato in sviluppo reale con il Competence Center.',
           en: 'AI-DLC is the AI-native development lifecycle described by AWS. The AI drafts a plan, asks questions and implements only after the team validates. Three phases: Inception, Construction, Operations. Sprints give way to bolts, cycles of hours or days. Bruno took it into real delivery with the Competence Center.' } },
    { k: ['sdd', 'spec', 'specifica', 'specifiche'], p: 2, c: ['method', 'ai'],
      a: { it: 'Nello Spec-Driven Development la specifica viene prima del codice ed è la fonte di verità: versionata nel repository, guida persone e agenti. In Tinexta Infocert Bruno e il Competence Center lo hanno portato in sviluppo reale.',
           en: 'In Spec-Driven Development the spec comes before the code and is the source of truth: versioned in the repository, it guides both people and agents. At Tinexta Infocert, Bruno and the Competence Center took it into real delivery.' } },
    { k: ['competence', 'center', 'centre', 'coe ', 'champion', 'workshop', 'onboarding', 'formazione', 'abilitazione', 'training', 'enablement', 'insegn', 'teach'], p: 1.5, c: ['ai'],
      a: { it: 'Nell’AI Competence Center di Tinexta Infocert Bruno si occupa di abilitazione e formazione: workshop, onboarding dei team e una rete di champion che diffonde le pratiche. In più costruisce skill e connettori MCP per gli agenti.',
           en: 'In the AI Competence Center at Tinexta Infocert, Bruno works on enablement and training: workshops, team onboarding and a network of champions who spread the practices. He also builds skills and MCP connectors for agents.' } },
    { k: ['mcp', 'connett', 'connector', 'agent', 'skill e', 'skills and', 'tool '], p: 2, c: ['ai'],
      a: { it: 'Bruno costruisce skill e connettori MCP: sono il modo in cui un agente riceve regole, strumenti e conoscenza del dominio. È la parte più pratica del suo lavoro nel Competence Center.',
           en: 'Bruno builds skills and MCP connectors: they are how an agent gets rules, tools and domain knowledge. It is the most hands-on part of his work in the Competence Center.' } },
    { k: ['kubern', 'k8s', 'cka', 'cloud', 'azure', 'container', 'docker', 'devops', 'certific'], p: 2, c: ['skills'],
      a: { it: 'Su Kubernetes Bruno gioca in casa: è Certified Kubernetes Administrator (CKA), ha completato LFS258 e guida le decisioni architetturali su piattaforme Java in ambienti Kubernetes. Ha anche la certificazione Microsoft Azure Solutions Architect Technologies.',
           en: 'Kubernetes is home turf for Bruno: he is a Certified Kubernetes Administrator (CKA), completed LFS258 and leads architectural decisions on Java platforms running on Kubernetes. He also holds the Microsoft Azure Solutions Architect Technologies certification.' } },
    { k: ['java', 'kotlin', 'spring', 'stack', 'tecnolog', 'technolog', 'linguagg', 'programming', 'competenz', 'skills ', 'backend', 'android', 'codice', 'code '], p: 1.5, c: ['skills'],
      a: { it: 'Java prima di tutto, dal 2010. Poi Kotlin, Spring, Kubernetes e Azure. Lungo il percorso anche C, Android, JavaScript e Node.js. Oggi lo stack include gli strumenti dell’AI engineering: specifiche, agenti, skill e MCP.',
           en: 'Java first, since 2010. Then Kotlin, Spring, Kubernetes and Azure. Along the way also C, Android, JavaScript and Node.js. Today the stack includes the tools of AI engineering: specs, agents, skills and MCP.' } },
    { k: ['esperienz', 'experience', 'carriera', 'career', 'percorso', 'lavorato', 'worked', 'aziend', 'compan', 'intel', 'targa', 'eco-mind', 'ecomind', 'infocert', 'tinexta', 'brasil', 'brazil', 'curriculum', 'resume', 'cv ', 'anni', 'years', 'background', 'storia', 'history'], p: 0.5, c: ['experience'],
      a: { it: 'Sette aziende in due continenti. In Brasile: ricerca al CTI Renato Archer, ERP enterprise, poi Intel. In Italia dal 2016: IoT e fleet management in Targa Telematics, full-stack in Eco-Mind e, dal 2023, architettura in Tinexta Infocert.',
           en: 'Seven companies on two continents. In Brazil: research at CTI Renato Archer, enterprise ERP, then Intel. In Italy since 2016: IoT and fleet management at Targa Telematics, full-stack at Eco-Mind and, since 2023, architecture at Tinexta Infocert.' } },
    { k: ['studi', 'study', 'impar', 'learn', 'curios', 'corso', 'course', 'libri', 'book', 'aggiorn'], p: 1.5, c: ['learning'],
      a: { it: 'In questo momento: AWS AI-DLC, Spec-Driven Development, workflow agentici, skill e MCP. Per Bruno studiare è un’abitudine: ogni dominio nuovo è passato da studio, esperimento, costruzione e condivisione con il team.',
           en: 'Right now: AWS AI-DLC, Spec-Driven Development, agentic workflows, skills and MCP. Studying is a habit for Bruno: every new domain has gone through study, experiment, build and sharing with the team.' } },
    { k: ['perche', 'why', 'assum', 'hire', 'sfid', 'challenge', 'forza', 'strength', 'lavorare con', 'work with', 'valore', 'different'], p: 1, c: ['approach', 'contact'],
      a: { it: 'Tre motivi. Tiene insieme architettura, codice e persone. Porta l’AI nei team con metodo e criterio. E davanti a un problema che non conosce fa la cosa più utile: lo studia fino in fondo. Le sfide difficili sono quelle che preferisce.',
           en: 'Three reasons. He holds architecture, code and people together. He brings AI into teams with method and judgment. And when he meets a problem he doesn’t know, he does the most useful thing: he studies it all the way down. Hard challenges are the ones he likes best.' } },
    { k: ['progett', 'project', 'vinoozy', 'trasloco', 'app ', 'gioco', 'game', 'github', 'open source', 'hobby', 'vino', 'wine', 'carte ', 'cards'], p: 1.5, c: ['projects'],
      a: { it: 'Fuori dal lavoro Bruno ha costruito Vinoozy, un’app Flutter per gestire la cantina anche offline, e Trasloco, un solitario con le carte regionali italiane scritto in Kotlin e pubblicato su Google Play.',
           en: 'Outside work Bruno built Vinoozy, a Flutter app for managing a wine cellar even offline, and Trasloco, a solitaire game with regional Italian decks, written in Kotlin and published on Google Play.' } },
    { k: ['contatt', 'contact', 'email', 'mail', 'linkedin', 'scriv', 'reach', 'telefono', 'phone', 'parlare', 'talk', 'sentire'], p: 1.5, c: ['contact', 'mail'],
      a: { it: 'Il modo più diretto è l’email: ' + EMAIL + '. Lo trovi anche su LinkedIn e GitHub.',
           en: 'The most direct way is email: ' + EMAIL + '. You can also find him on LinkedIn and GitHub.' } },
    { k: ['lingu', 'language', 'inglese', 'english', 'portoghese', 'portuguese', 'italiano', 'italian', 'parla ', 'speak'], p: 1, c: ['skills'],
      a: { it: 'Italiano e portoghese da madrelingua, inglese professionale. Bruno ha lavorato in team internazionali in Brasile e in Italia.',
           en: 'Native Italian and Portuguese, professional English. Bruno has worked in international teams in Brazil and in Italy.' } },
    { k: ['trust', 'eidas', 'compliance', 'conformita', 'sicurezza', 'security', 'firma', 'signature', 'identita', 'identity', 'dominio', 'domain', 'regolament', 'regulat'], p: 2, c: ['ai'],
      a: { it: 'Bruno lavora su piattaforme di digital trust in ambito eIDAS2. In questo dominio sicurezza, conformità e affidabilità sono requisiti di partenza, e anche l’AI va usata con lo stesso rigore.',
           en: 'Bruno works on digital trust platforms in the eIDAS2 space. In this domain security, compliance and reliability are the starting requirements, and AI has to be used with the same rigour.' } },
    { k: ['leader', 'team', 'mentor', 'gestion', 'manage', 'persone', 'people', 'guida'], p: 1, c: ['approach'],
      a: { it: 'Bruno guida le decisioni tecniche, affianca gli ingegneri e continua a contribuire al codice. Crede nel mentoring e in team che capiscono il perché delle scelte.',
           en: 'Bruno guides technical decisions, mentors engineers and keeps contributing to the code. He believes in mentoring and in teams that understand the reasoning behind their choices.' } },
    { k: ['dove', 'where', 'torino', 'turin', 'vive', 'lives', 'based', 'remot', 'milano', 'milan', 'sede'], p: 0.5, c: ['experience'],
      a: { it: 'Bruno vive a Torino. Il suo ruolo attuale in Tinexta Infocert fa capo a Milano.',
           en: 'Bruno lives in Turin. His current role at Tinexta Infocert is based in Milan.' } },
    { k: ['sei un', 'sei una', 'are you', 'reale', 'real ', 'vero ', 'vera ', 'chatgpt', 'gpt', 'claude', 'modello', 'model', 'bot ', 'umano', 'human', 'come funzioni', 'how do you work', 'privacy', 'dati ', 'data '], p: 1.5, c: ['mail'],
      a: { it: 'Sono un agente dimostrativo: le risposte le ha scritte Bruno e girano nel tuo browser, senza modelli e senza chiamate di rete. Per una conversazione vera c’è lui.',
           en: 'I am a demo agent: Bruno wrote the answers and they run in your browser, with no model and no network calls. For a real conversation, there is Bruno himself.' } },
    { k: ['help', 'aiuto', 'comandi', 'commands', 'cosa posso', 'what can', 'menu'], p: 1, c: [],
      a: { it: 'Puoi chiedermi di: percorso, AI, AI-DLC, Spec-Driven Development, Competence Center, Kubernetes, stack, studio, progetti, contatti. La command palette si apre con Cmd o Ctrl + K.',
           en: 'You can ask me about: experience, AI, AI-DLC, Spec-Driven Development, Competence Center, Kubernetes, stack, learning, projects, contact. The command palette opens with Cmd or Ctrl + K.' } },
    { k: ['sudo', 'rm -rf', 'hack'], p: 3, c: ['mail'],
      a: { it: 'Permesso accordato. Prossimo passo: scrivi a Bruno e proponi la tua sfida.',
           en: 'Permission granted. Next step: email Bruno and pitch your challenge.' } },
    { k: ['ciao', 'hello', 'hi ', 'hey', 'salve', 'buongiorno', 'buonasera', 'ola ', 'grazie', 'thanks', 'thank'], p: 0.5, c: [],
      a: { it: 'Ciao! Sono l’agente dimostrativo di Bruno. Chiedimi del suo percorso, di come usa l’AI o di cosa sta studiando.',
           en: 'Hi! I am Bruno’s demo agent. Ask me about his experience, how he uses AI or what he is studying.' } }
  ];
  const FALLBACK = { c: ['mail'],
    a: { it: 'Su questo non ho una risposta scritta. Prova con percorso, AI, AI-DLC, Kubernetes, studio o progetti. Oppure chiedilo direttamente a Bruno.',
         en: 'I don’t have a written answer for that. Try experience, AI, AI-DLC, Kubernetes, learning or projects. Or ask Bruno directly.' } };

  function match(question) {
    const text = ' ' + norm(question) + ' ';
    let best = FALLBACK, score = 0;
    for (const item of KB) {
      let s = 0;
      for (const key of item.k) if (text.includes(' ' + key)) s += key.trim().length;
      s *= item.p; // generic topics weigh less than specific ones
      if (s > score) { score = s; best = item; }
    }
    return best;
  }

  const agent = (function initAgent() {
    const box = $('#agent');
    if (!box) return null;
    const log = $('#agent-log'), form = $('#agent-form'), input = $('#agent-input'), live = $('#agent-live');
    let busy = false, pending = null, touched = false;
    const scroll = () => { log.scrollTop = log.scrollHeight; };

    async function stream(node, text) {
      if (reduce) { node.textContent = text; return; }
      const caret = el('span', 'caret');
      const out = doc.createTextNode('');
      node.append(out, caret);
      for (const part of text.split(/(\s+)/)) {
        out.data += part;
        if (part.trim()) { scroll(); await wait(16 + Math.random() * 34); }
      }
      caret.remove();
    }

    async function ask(question) {
      const q = String(question || '').trim().slice(0, 140);
      if (!q) return;
      if (busy) { pending = q; return; }
      busy = true;
      box.classList.add('is-busy');
      const item = match(q);
      const answer = item.a[lang];
      log.append(el('p', 'msg-q', q));
      const block = el('div', 'msg-a'), steps = el('ul', 'msg-steps'), text = el('p', 'msg-text');
      block.append(steps, text);
      log.append(block);
      const where = item.c.filter(id => id !== 'mail').map(id => SEC[id][lang].toLowerCase()).join(', ') || T.profile;
      for (const label of [T.steps[0], T.steps[1] + where, T.steps[2]]) {
        const li = el('li', '', label);
        steps.append(li);
        scroll();
        await wait(reduce ? 0 : 230 + Math.random() * 200);
        li.classList.add('done');
      }
      await stream(text, answer);
      if (item.c.length) {
        const cites = el('p', 'msg-cites');
        cites.append(el('span', '', T.sources));
        item.c.forEach(id => {
          const link = el('a', 'cite', SEC[id][lang]);
          link.href = SEC[id].href;
          cites.append(link);
        });
        block.append(cites);
      }
      while (log.children.length > 12) log.firstElementChild.remove();
      scroll();
      live.textContent = answer;
      busy = false;
      box.classList.remove('is-busy');
      if (pending) { const next = pending; pending = null; ask(next); }
    }

    form.addEventListener('submit', event => {
      event.preventDefault();
      touched = true;
      const q = input.value;
      input.value = '';
      ask(q);
    });
    $$('[data-ask]', box).forEach(chip => chip.addEventListener('click', () => { touched = true; ask(chip.dataset.ask); }));
    input.addEventListener('focus', () => { touched = true; }, { once: true });

    // Open with one real exchange, so the first view shows what the agent does.
    const intro = () => setTimeout(() => { if (!touched) ask(T.introQ); }, reduce ? 0 : 900);
    if (hasIO) {
      const io = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { io.disconnect(); intro(); }
      }, { threshold: 0.3 });
      io.observe(box);
    } else intro();

    return {
      ask(q) { touched = true; return ask(q); },
      focus() {
        touched = true;
        box.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
        input.focus({ preventScroll: true });
      }
    };
  })();

  /* ---------- command palette ---------- */
  (function palette() {
    const dialog = $('#palette');
    const openers = $$('[data-open-palette]');
    if (!dialog || typeof dialog.showModal !== 'function') { openers.forEach(b => { b.hidden = true; }); return; }
    const input = $('#palette-input'), list = $('#palette-list');
    const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
    $$('[data-kbd]').forEach(node => { node.textContent = mac ? '⌘K' : 'Ctrl K'; });

    const jump = id => ({ group: T.pGo, label: SEC[id][lang], hint: SEC[id].href, run: () => go(SEC[id].href) });
    const items = [
      { group: T.pGo, label: T.pHome, hint: '#top', run: () => go('#top') },
      jump('ai'), jump('method'), jump('approach'), jump('experience'), jump('skills'), jump('learning'), jump('projects'), jump('contact')
    ];
    if (agent) items.push({ group: T.pDo, label: T.pFocus, hint: 'bruno.agent', run: () => agent.focus() });
    if (canCopy) items.push({ group: T.pDo, label: T.pCopy, hint: EMAIL, run: () => { go('#contact'); copyEmail(); } });
    items.push(
      { group: T.pDo, label: 'LinkedIn', hint: 'linkedin.com/in/brunobottazzini', run: () => window.open('https://www.linkedin.com/in/brunobottazzini/', '_blank', 'noopener') },
      { group: T.pDo, label: 'GitHub', hint: 'github.com/brunobottazzini', run: () => window.open('https://github.com/brunobottazzini', '_blank', 'noopener') },
      { group: T.pDo, label: T.pLang, hint: T.pLangHint, run: () => { const link = $('.languages a:not([aria-current])'); if (link) window.location.href = link.href; } }
    );

    let shown = [], active = 0;
    const setActive = index => {
      active = Math.max(0, Math.min(shown.length - 1, index));
      $$('.palette-item', list).forEach((node, i) => {
        node.setAttribute('aria-selected', String(i === active));
        if (i === active) node.scrollIntoView({ block: 'nearest' });
      });
      input.setAttribute('aria-activedescendant', shown.length ? 'palette-item-' + active : '');
    };
    const run = index => {
      const item = shown[index];
      if (!item) return;
      dialog.close();
      item.run();
    };
    const render = () => {
      const raw = input.value.trim();
      const query = norm(raw);
      shown = items.filter(item => !query || norm(item.label + ' ' + item.hint).includes(query));
      if (raw && agent) shown.push({ group: T.pAgent, label: `${T.pAsk}: «${raw}»`, hint: 'bruno.agent', run: () => { agent.focus(); agent.ask(raw); } });
      list.textContent = '';
      let group = null;
      shown.forEach((item, i) => {
        if (item.group !== group) {
          group = item.group;
          const head = el('li', 'palette-group', group);
          head.setAttribute('role', 'presentation');
          list.append(head);
        }
        const node = el('li', 'palette-item');
        node.id = 'palette-item-' + i;
        node.setAttribute('role', 'option');
        node.append(el('span', '', item.label), el('small', '', item.hint));
        node.addEventListener('click', () => run(i));
        node.addEventListener('pointermove', () => { if (active !== i) setActive(i); });
        list.append(node);
      });
      setActive(0);
    };
    const open = () => {
      if (dialog.open) return;
      input.value = '';
      render();
      dialog.showModal();
      input.focus();
    };

    input.addEventListener('input', render);
    input.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown') { event.preventDefault(); setActive(active + 1 > shown.length - 1 ? 0 : active + 1); }
      else if (event.key === 'ArrowUp') { event.preventDefault(); setActive(active - 1 < 0 ? shown.length - 1 : active - 1); }
      else if (event.key === 'Enter') { event.preventDefault(); run(active); }
    });
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    openers.forEach(button => button.addEventListener('click', open));
    doc.addEventListener('keydown', event => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable;
      if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        dialog.open ? dialog.close() : open();
      } else if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        open();
      }
    });
  })();

  /* ---------- AI-DLC phases (tabs with autoplay) ---------- */
  (function phases() {
    const box = $('#phases');
    if (!box) return;
    const tabs = $$('[role="tab"]', box);
    const panels = tabs.map(tab => $('#' + tab.getAttribute('aria-controls')));
    const MS = 7000;
    box.style.setProperty('--phase-ms', MS + 'ms');
    let index = 0, timer = 0, auto = !reduce, inView = false, hover = false;

    panels.forEach((panel, i) => { panel.hidden = i !== 0; });
    const select = (i, focus) => {
      index = (i + tabs.length) % tabs.length;
      tabs.forEach((tab, n) => {
        const on = n === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[n].hidden = !on;
      });
      if (focus) tabs[index].focus();
    };
    const schedule = () => {
      clearTimeout(timer);
      const running = auto && inView && !hover;
      box.classList.toggle('is-auto', running);
      if (running) timer = setTimeout(() => { select(index + 1); schedule(); }, MS);
    };
    const manual = () => { auto = false; schedule(); };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => { manual(); select(i); });
      tab.addEventListener('keydown', event => {
        const move = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 }[event.key];
        if (move === undefined) return;
        event.preventDefault();
        manual();
        select(move, true);
      });
    });
    box.addEventListener('pointerenter', () => { hover = true; schedule(); });
    box.addEventListener('pointerleave', () => { hover = false; schedule(); });
    box.addEventListener('focusin', manual);
    if (hasIO) new IntersectionObserver(entries => { inView = entries[0].isIntersecting; schedule(); }, { threshold: 0.35 }).observe(box);
  })();

  /* ---------- skills: show where each one was used ---------- */
  (function skills() {
    const out = $('#evidence-text');
    const buttons = $$('.skill');
    if (!out || !buttons.length) return;
    buttons.forEach(button => button.addEventListener('click', () => {
      buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      out.textContent = '';
      out.append(el('strong', '', button.textContent), ' — ' + button.dataset.evidence);
    }));
  })();

  /* ---------- pointer details: spotlight, tilt, magnetic button ---------- */
  if (fine && !reduce) {
    $$('.spot').forEach(card => card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (event.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (event.clientY - rect.top) + 'px');
    }, { passive: true }));

    $$('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5, py = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${(-py * 3.2).toFixed(2)}deg) rotateY(${(px * 3.2).toFixed(2)}deg)`;
      }, { passive: true });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });

    $$('[data-magnetic]').forEach(button => {
      button.addEventListener('pointermove', event => {
        const rect = button.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2), dy = event.clientY - (rect.top + rect.height / 2);
        button.style.transform = `translate(${(dx * 0.18).toFixed(1)}px,${(dy * 0.3).toFixed(1)}px)`;
      }, { passive: true });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });
  }

  root.classList.add('ready'); // reached only if everything above booted without throwing
  if (window.console && console.info) console.info('%cbruno.bottazzini%c ' + T.hello, 'background:#d5edac;color:#131c0d;padding:2px 6px;font-weight:700', '');
})();
