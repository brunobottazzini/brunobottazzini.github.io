/* Bruno Bottazzini · personal site
   Vanilla JS, no dependencies, no network calls. Every block is progressive enhancement:
   the page content is complete without it. */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const lang = /^en/i.test(root.lang) ? 'en' : /^pt/i.test(root.lang) ? 'pt' : 'it';
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
      pGo: 'Vai a', pDo: 'Azioni', pLangs: 'Lingua', pAgent: 'Agente', pAsk: 'Chiedi all’agente', pHome: 'Inizio',
      pCopy: 'Copia l’email', pFocus: 'Fai una domanda all’agente', pPlay: 'Gioca a Human in the loop',
      gAgain: 'Rigioca', gLevel: 'Il tuo livello', gRecord: 'Nuovo record!',
      gShip: 'Giusto: va in produzione.', gStop: 'Giusto: fermata in tempo.',
      gBug: 'Errore: è finita in produzione.', gBlocked: 'Errore: era valida e l’hai fermata.', gTimeout: 'Tempo scaduto: nessuno ha validato.',
      gOver: n => `Fine turno: ${n} ${n === 1 ? 'proposta validata' : 'proposte validate'}.`,
      hello: 'Ciao! Il codice è vanilla: niente framework, niente tracker. Prova la command palette.'
    },
    en: {
      copied: 'Email address copied.', copyFail: 'You can copy the address above.',
      steps: ['parsing the question', 'searching: ', 'composing the answer'], profile: 'profile', sources: 'sources',
      introQ: 'Who is Bruno?',
      pGo: 'Go to', pDo: 'Actions', pLangs: 'Language', pAgent: 'Agent', pAsk: 'Ask the agent', pHome: 'Top',
      pCopy: 'Copy email address', pFocus: 'Ask the agent a question', pPlay: 'Play Human in the loop',
      gAgain: 'Play again', gLevel: 'Your level', gRecord: 'New best!',
      gShip: 'Right: it ships.', gStop: 'Right: stopped in time.',
      gBug: 'Wrong: it reached production.', gBlocked: 'Wrong: it was fine and you stopped it.', gTimeout: 'Time is up: nobody validated it.',
      gOver: n => `Shift over: ${n} ${n === 1 ? 'proposal' : 'proposals'} validated.`,
      hello: 'Hi! The code is vanilla: no framework, no trackers. Try the command palette.'
    },
    pt: {
      copied: 'Endereço copiado.', copyFail: 'Você pode copiar o endereço acima.',
      steps: ['interpretando a pergunta', 'buscando em: ', 'compondo a resposta'], profile: 'perfil', sources: 'fontes',
      introQ: 'Quem é o Bruno?',
      pGo: 'Ir para', pDo: 'Ações', pLangs: 'Idioma', pAgent: 'Agente', pAsk: 'Perguntar ao agente', pHome: 'Início',
      pCopy: 'Copiar o e-mail', pFocus: 'Fazer uma pergunta ao agente', pPlay: 'Jogar Human in the loop',
      gAgain: 'Jogar de novo', gLevel: 'Seu nível', gRecord: 'Novo recorde!',
      gShip: 'Certo: vai para produção.', gStop: 'Certo: barrada a tempo.',
      gBug: 'Errou: foi parar em produção.', gBlocked: 'Errou: era válida e você barrou.', gTimeout: 'Tempo esgotado: ninguém validou.',
      gOver: n => `Fim do turno: ${n} ${n === 1 ? 'proposta validada' : 'propostas validadas'}.`,
      hello: 'Oi! O código é vanilla: sem framework, sem trackers. Experimente a paleta de comandos.'
    }
  }[lang];

  // Sections the agent can cite and the palette can jump to.
  const SEC = {
    ai: { href: '#ai', it: 'Competence Center', en: 'Competence Center', pt: 'Competence Center' },
    method: { href: '#method', it: 'Metodo', en: 'Method', pt: 'Método' },
    approach: { href: '#approach', it: 'Approccio', en: 'Approach', pt: 'Abordagem' },
    experience: { href: '#experience', it: 'Percorso', en: 'Experience', pt: 'Trajetória' },
    skills: { href: '#skills', it: 'Competenze', en: 'Skills', pt: 'Competências' },
    learning: { href: '#learning', it: 'Studio continuo', en: 'Learning', pt: 'Estudo contínuo' },
    projects: { href: '#projects', it: 'Progetti', en: 'Projects', pt: 'Projetos' },
    opensource: { href: '#opensource', it: 'Open source', en: 'Open source', pt: 'Open source' },
    contact: { href: '#contact', it: 'Contatti', en: 'Contact', pt: 'Contato' },
    mail: { href: 'mailto:' + EMAIL, it: 'Scrivi a Bruno', en: 'Email Bruno', pt: 'Escrever para o Bruno' }
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
  // k: keywords (lowercase, no accents; a trailing space asks for the whole word; Italian, English and Portuguese mixed)
  // p: topic weight (specific topics beat generic ones)   c: sections cited under the answer   a: the answer, per language
  const KB = [
    { k: ['chi e', 'chi sei', 'who is', 'who are', 'whoami', 'presenta', 'introduce', 'about', 'bio ', 'quem e', 'sobre', 'apresent'], p: 1, c: ['experience', 'ai'],
      a: { it: 'Bruno Bottazzini è Software Architect e Technical Lead in Tinexta Infocert, e vive a Torino. Progetta piattaforme cloud-native, ha oltre quindici anni di software alle spalle tra Brasile e Italia e fa parte dell’AI Competence Center dell’azienda.',
           en: 'Bruno Bottazzini is a Software Architect and Technical Lead at Tinexta Infocert, based in Turin. He designs cloud-native platforms, has more than fifteen years of software behind him across Brazil and Italy, and is part of the company’s AI Competence Center.',
           pt: 'Bruno Bottazzini é Software Architect e Technical Lead na Tinexta Infocert e mora em Turim. Projeta plataformas cloud-native, tem mais de quinze anos de software nas costas entre Brasil e Itália e faz parte do AI Competence Center da empresa.' } },
    { k: ['ai ', 'ia ', 'intelligenza artificiale', 'artificial intelligence', 'inteligencia artificial', 'llm', 'genai', 'copilot', 'usa l ai', 'use ai', 'uses ai', 'usa a ia', 'usa ia'], p: 2.5, c: ['method', 'approach'],
      a: { it: 'Per Bruno l’AI è parte del metodo di lavoro: sviluppo guidato dalle specifiche, coding assistito, simulazione di scenari architetturali, review e test automatizzati. Con una regola: l’AI accelera, le decisioni restano alle persone.',
           en: 'For Bruno, AI is part of the working method: spec-driven development, assisted coding, architectural scenario simulation, automated review and testing. With one rule: AI accelerates, decisions stay with people.',
           pt: 'Para o Bruno, a IA faz parte do método de trabalho: desenvolvimento guiado por especificações, coding assistido, simulação de cenários arquiteturais, revisão e testes automatizados. Com uma regra: a IA acelera, as decisões continuam com as pessoas.' } },
    { k: ['ai-dlc', 'aidlc', 'dlc', 'bolt', 'inception', 'mob ', 'lifecycle', 'life cycle', 'aws'], p: 2, c: ['method'],
      a: { it: 'AI-DLC è il ciclo di sviluppo AI-native descritto da AWS. L’AI propone un piano, fa domande e implementa solo dopo la validazione del team. Tre fasi: Inception, Construction, Operations. Al posto degli sprint ci sono i bolt, cicli di ore o giorni. Bruno lo ha portato in sviluppo reale con il Competence Center.',
           en: 'AI-DLC is the AI-native development lifecycle described by AWS. The AI drafts a plan, asks questions and implements only after the team validates. Three phases: Inception, Construction, Operations. Sprints give way to bolts, cycles of hours or days. Bruno took it into real delivery with the Competence Center.',
           pt: 'AI-DLC é o ciclo de desenvolvimento AI-native descrito pela AWS. A IA propõe um plano, faz perguntas e só implementa depois da validação do time. Três fases: Inception, Construction, Operations. No lugar dos sprints entram os bolts, ciclos de horas ou dias. O Bruno levou o método para o desenvolvimento real com o Competence Center.' } },
    { k: ['sdd', 'spec', 'specifica', 'specifiche', 'especific'], p: 2, c: ['method', 'ai'],
      a: { it: 'Nello Spec-Driven Development la specifica viene prima del codice ed è la fonte di verità: versionata nel repository, guida persone e agenti. In Tinexta Infocert Bruno e il Competence Center lo hanno portato in sviluppo reale.',
           en: 'In Spec-Driven Development the spec comes before the code and is the source of truth: versioned in the repository, it guides both people and agents. At Tinexta Infocert, Bruno and the Competence Center took it into real delivery.',
           pt: 'No Spec-Driven Development a especificação vem antes do código e é a fonte da verdade: versionada no repositório, guia pessoas e agentes. Na Tinexta Infocert, o Bruno e o Competence Center levaram o método para o desenvolvimento real.' } },
    { k: ['competence', 'center', 'centre', 'coe ', 'champion', 'workshop', 'onboarding', 'formazione', 'abilitazione', 'training', 'enablement', 'insegn', 'teach', 'capacita', 'treinamento', 'formacao', 'ensina', 'centro de compet'], p: 1.5, c: ['ai'],
      a: { it: 'Nell’AI Competence Center di Tinexta Infocert Bruno si occupa di abilitazione e formazione: workshop, onboarding dei team e una rete di champion che diffonde le pratiche. In più costruisce skill e connettori MCP per gli agenti.',
           en: 'In the AI Competence Center at Tinexta Infocert, Bruno works on enablement and training: workshops, team onboarding and a network of champions who spread the practices. He also builds skills and MCP connectors for agents.',
           pt: 'No AI Competence Center da Tinexta Infocert, o Bruno cuida de capacitação e treinamento: workshops, onboarding dos times e uma rede de champions que espalha as práticas. Além disso, constrói skills e conectores MCP para agentes.' } },
    { k: ['mcp', 'connett', 'connector', 'conector', 'agent', 'skill e', 'skills and', 'skills e', 'tool ', 'ferrament'], p: 2, c: ['ai'],
      a: { it: 'Bruno costruisce skill e connettori MCP: sono il modo in cui un agente riceve regole, strumenti e conoscenza del dominio. È la parte più pratica del suo lavoro nel Competence Center.',
           en: 'Bruno builds skills and MCP connectors: they are how an agent gets rules, tools and domain knowledge. It is the most hands-on part of his work in the Competence Center.',
           pt: 'O Bruno constrói skills e conectores MCP: é assim que um agente recebe regras, ferramentas e conhecimento de domínio. É a parte mais prática do trabalho dele no Competence Center.' } },
    { k: ['kubern', 'k8s', 'cka', 'cloud', 'azure', 'container', 'docker', 'devops', 'certific', 'nuvem'], p: 2, c: ['skills'],
      a: { it: 'Su Kubernetes Bruno gioca in casa: ha conseguito la certificazione CKA (Certified Kubernetes Administrator), ha completato il corso LFS258 e guida le decisioni architetturali su piattaforme Java in ambienti Kubernetes. Ha conseguito anche la certificazione Microsoft Azure Solutions Architect Technologies.',
           en: 'Kubernetes is home turf for Bruno: he earned the CKA (Certified Kubernetes Administrator) certification, completed the LFS258 course and leads architectural decisions on Java platforms running on Kubernetes. He also earned the Microsoft Azure Solutions Architect Technologies certification.',
           pt: 'Em Kubernetes o Bruno joga em casa: conquistou a certificação CKA (Certified Kubernetes Administrator), concluiu o curso LFS258 e conduz as decisões de arquitetura em plataformas Java que rodam em Kubernetes. Também conquistou a certificação Microsoft Azure Solutions Architect Technologies.' } },
    { k: ['java', 'kotlin', 'spring', 'stack', 'tecnolog', 'technolog', 'linguag', 'programming', 'programa', 'competenz', 'competencias', 'habilidad', 'skills ', 'backend', 'android', 'codice', 'code ', 'codigo '], p: 1.5, c: ['skills'],
      a: { it: 'Java prima di tutto, dal 2010. Poi Kotlin, Spring, Kubernetes e Azure. Lungo il percorso anche C, Android, JavaScript e Node.js. Oggi lo stack include gli strumenti dell’AI engineering: specifiche, agenti, skill e MCP.',
           en: 'Java first, since 2010. Then Kotlin, Spring, Kubernetes and Azure. Along the way also C, Android, JavaScript and Node.js. Today the stack includes the tools of AI engineering: specs, agents, skills and MCP.',
           pt: 'Java em primeiro lugar, desde 2010. Depois Kotlin, Spring, Kubernetes e Azure. Pelo caminho, também C, Android, JavaScript e Node.js. Hoje o stack inclui as ferramentas de AI engineering: especificações, agentes, skills e MCP.' } },
    { k: ['esperienz', 'experienc', 'carriera', 'career', 'carreira', 'percorso', 'trajetoria', 'lavorato', 'worked', 'trabalhou', 'aziend', 'compan', 'empresa', 'intel', 'targa', 'eco-mind', 'ecomind', 'infocert', 'tinexta', 'brasil', 'brazil', 'curriculum', 'curriculo', 'resume', 'cv ', 'anni', 'years', 'anos ', 'background', 'storia', 'history', 'historia'], p: 0.5, c: ['experience'],
      a: { it: 'Sette aziende in due continenti. In Brasile: ricerca al CTI Renato Archer, ERP enterprise, poi Intel. In Italia dal 2016: IoT e fleet management in Targa Telematics, full-stack in Eco-Mind e, dal 2023, architettura in Tinexta Infocert.',
           en: 'Seven companies on two continents. In Brazil: research at CTI Renato Archer, enterprise ERP, then Intel. In Italy since 2016: IoT and fleet management at Targa Telematics, full-stack at Eco-Mind and, since 2023, architecture at Tinexta Infocert.',
           pt: 'Sete empresas em dois continentes. No Brasil: pesquisa no CTI Renato Archer, ERP enterprise e depois Intel. Na Itália desde 2016: IoT e gestão de frotas na Targa Telematics, full-stack na Eco-Mind e, desde 2023, arquitetura na Tinexta Infocert.' } },
    { k: ['studi', 'study', 'estud', 'impar', 'learn', 'aprend', 'curios', 'corso', 'course', 'curso', 'libri', 'book', 'livro', 'aggiorn'], p: 1.5, c: ['learning'],
      a: { it: 'In questo momento: AWS AI-DLC, Spec-Driven Development, workflow agentici, skill e MCP. Per Bruno studiare è un’abitudine: ogni dominio nuovo è passato da studio, esperimento, costruzione e condivisione con il team.',
           en: 'Right now: AWS AI-DLC, Spec-Driven Development, agentic workflows, skills and MCP. Studying is a habit for Bruno: every new domain has gone through study, experiment, build and sharing with the team.',
           pt: 'Neste momento: AWS AI-DLC, Spec-Driven Development, fluxos agênticos, skills e MCP. Estudar é um hábito para o Bruno: cada novo domínio passou por estudo, experimento, construção e compartilhamento com o time.' } },
    { k: ['perche', 'why', 'por que', 'porque', 'assum', 'hire', 'contrat', 'sfid', 'challenge', 'desafio', 'forza', 'strength', 'forca', 'lavorare con', 'work with', 'trabalhar com', 'valore', 'valor ', 'different'], p: 1, c: ['approach', 'contact'],
      a: { it: 'Tre motivi. Tiene insieme architettura, codice e persone. Porta l’AI nei team con metodo e criterio. E davanti a un problema che non conosce fa la cosa più utile: lo studia fino in fondo. Le sfide difficili sono quelle che preferisce.',
           en: 'Three reasons. He holds architecture, code and people together. He brings AI into teams with method and judgment. And when he meets a problem he doesn’t know, he does the most useful thing: he studies it all the way down. Hard challenges are the ones he likes best.',
           pt: 'Três motivos. Ele mantém arquitetura, código e pessoas juntos. Leva a IA para os times com método e critério. E, diante de um problema que não conhece, faz a coisa mais útil: estuda até o fim. Os desafios difíceis são os que ele prefere.' } },
    { k: ['progett', 'project', 'projeto', 'vinoozy', 'trasloco', 'tiramisu', 'app ', 'aplicativo', 'gioco', 'giochi', 'game', 'jogo', 'github', 'hobby', 'vino', 'wine', 'vinho', 'carte ', 'cards', 'cartas'], p: 1.5, c: ['projects'],
      a: { it: 'Fuori dal lavoro Bruno ha costruito Vinoozy, un’app Flutter per gestire la cantina anche offline, e Trasloco, un solitario con le carte regionali italiane scritto in Kotlin e pubblicato su Google Play. Ha in cantiere anche un nuovo gioco, Tiramisù.',
           en: 'Outside work Bruno built Vinoozy, a Flutter app for managing a wine cellar even offline, and Trasloco, a solitaire game with regional Italian decks, written in Kotlin and published on Google Play. He also has a new game in the works, Tiramisù.',
           pt: 'Fora do trabalho, o Bruno construiu o Vinoozy, um app Flutter para gerenciar a adega mesmo offline, e o Trasloco, um jogo de paciência com baralhos regionais italianos, feito em Kotlin e publicado no Google Play. Também tem um novo jogo em construção, o Tiramisù.' } },
    { k: ['open source', 'opensource', 'codigo aberto', 'systemd', 'yocto', 'openembedded', 'clear linux', 'clearlinux', 'soletta', 'linux', 'kernel', 'embedded', 'embarcado', 'commit', 'contribu', 'patch'], p: 2, c: ['opensource'],
      a: { it: 'Negli anni in Intel, tra il 2015 e il 2016, Bruno ha contribuito a progetti open source: un commit in systemd entrato nella versione 219, patch in Yocto e OpenEmbedded, fix e packaging in Clear Linux. Nel progetto Soletta ha avviato il layer Yocto meta-soletta ed è l’autore principale della Soletta Dev App. I link ai commit sono nella sezione Progetti.',
           en: 'During his Intel years, in 2015 and 2016, Bruno contributed to open-source projects: a commit in systemd that shipped in version 219, patches in Yocto and OpenEmbedded, fixes and packaging in Clear Linux. In the Soletta project he started the meta-soletta Yocto layer and is the main author of the Soletta Dev App. The commit links are in the Projects section.',
           pt: 'Nos anos de Intel, entre 2015 e 2016, o Bruno contribuiu com projetos open source: um commit no systemd que entrou na versão 219, patches no Yocto e no OpenEmbedded, correções e empacotamento no Clear Linux. No projeto Soletta, ele começou a layer Yocto meta-soletta e é o autor principal do Soletta Dev App. Os links dos commits estão na seção Projetos.' } },
    { k: ['contatt', 'contact', 'contato', 'email', 'e-mail', 'mail', 'linkedin', 'scriv', 'escrev', 'reach', 'telefono', 'telefone', 'phone', 'parlare', 'talk', 'falar', 'conversar', 'sentire'], p: 1.5, c: ['contact', 'mail'],
      a: { it: 'Il modo più diretto è l’email: ' + EMAIL + '. Lo trovi anche su LinkedIn e GitHub.',
           en: 'The most direct way is email: ' + EMAIL + '. You can also find him on LinkedIn and GitHub.',
           pt: 'O jeito mais direto é o e-mail: ' + EMAIL + '. Ele também está no LinkedIn e no GitHub.' } },
    { k: ['lingu', 'language', 'idioma', 'inglese', 'english', 'ingles', 'portoghese', 'portuguese', 'portugues', 'italiano', 'italian', 'parla ', 'speak', 'fala '], p: 1, c: ['skills'],
      a: { it: 'Italiano e portoghese da madrelingua, inglese professionale. Bruno ha lavorato in team internazionali in Brasile e in Italia.',
           en: 'Native Italian and Portuguese, professional English. Bruno has worked in international teams in Brazil and in Italy.',
           pt: 'Italiano e português nativos, inglês profissional. O Bruno trabalhou em times internacionais no Brasil e na Itália.' } },
    { k: ['trust', 'eidas', 'compliance', 'conformita', 'conformidade', 'sicurezza', 'security', 'seguranca', 'firma', 'signature', 'assinatura', 'identita', 'identity', 'identidade', 'dominio', 'domain', 'regolament', 'regulat', 'confianca'], p: 2, c: ['ai'],
      a: { it: 'Bruno lavora su piattaforme di digital trust in ambito eIDAS2. In questo dominio sicurezza, conformità e affidabilità sono requisiti di partenza, e anche l’AI va usata con lo stesso rigore.',
           en: 'Bruno works on digital trust platforms in the eIDAS2 space. In this domain security, compliance and reliability are the starting requirements, and AI has to be used with the same rigour.',
           pt: 'O Bruno trabalha com plataformas de digital trust no âmbito do eIDAS2. Nesse domínio, segurança, conformidade e confiabilidade são requisitos de partida, e a IA também precisa ser usada com o mesmo rigor.' } },
    { k: ['leader', 'lider', 'team', 'equipe', 'mentor', 'gestion', 'gestisce', 'gestao', 'manage', 'persone', 'people', 'pessoas', 'guida', 'fte', 'rischi', 'risk', 'risco', 'ownership', 'responsab', 'decision', 'decis'], p: 1.2, c: ['approach'],
      a: { it: 'Bruno gestisce le persone del team e la direzione dell’architettura. Decide dove portarla, si assume la responsabilità delle scelte e porta i progetti fino in produzione. Resta vicino al codice e crede nel mentoring e in team che capiscono il perché delle scelte.',
           en: 'Bruno manages the people on the team and the direction of the architecture. He decides where to take it, takes responsibility for the choices and sees projects through to production. He stays close to the code and believes in mentoring and in teams that understand the reasoning behind their choices.',
           pt: 'O Bruno faz a gestão das pessoas do time e da direção da arquitetura. Decide para onde levá-la, assume a responsabilidade pelas escolhas e leva os projetos até a produção. Continua perto do código e acredita em mentoria e em times que entendem o porquê das escolhas.' } },
    { k: ['dove', 'where', 'onde', 'torino', 'turin', 'turim', 'vive', 'lives', 'mora ', 'based', 'remot', 'milano', 'milan', 'milao', 'sede'], p: 0.5, c: ['experience'],
      a: { it: 'Bruno vive a Torino. Il suo ruolo attuale in Tinexta Infocert fa capo a Milano.',
           en: 'Bruno lives in Turin. His current role at Tinexta Infocert is based in Milan.',
           pt: 'O Bruno mora em Turim. O cargo atual dele na Tinexta Infocert é baseado em Milão.' } },
    { k: ['sei un', 'sei una', 'are you', 'voce e', 'reale', 'real ', 'vero ', 'vera ', 'verdade', 'chatgpt', 'gpt', 'claude', 'modello', 'model', 'bot ', 'robo', 'umano', 'human', 'come funzioni', 'how do you work', 'como funciona', 'privacy', 'privacidade', 'dati ', 'data ', 'dados '], p: 1.5, c: ['mail'],
      a: { it: 'Sono un agente dimostrativo: le risposte le ha scritte Bruno e girano nel tuo browser, senza modelli e senza chiamate di rete. Per una conversazione vera c’è lui.',
           en: 'I am a demo agent: Bruno wrote the answers and they run in your browser, with no model and no network calls. For a real conversation, there is Bruno himself.',
           pt: 'Sou um agente de demonstração: as respostas foram escritas pelo Bruno e rodam no seu navegador, sem modelo e sem chamadas de rede. Para uma conversa de verdade, fale com ele.' } },
    { k: ['help', 'aiuto', 'ajuda', 'comand', 'commands', 'cosa posso', 'what can', 'o que posso', 'menu'], p: 1, c: [],
      a: { it: 'Puoi chiedermi di: percorso, AI, AI-DLC, Spec-Driven Development, Competence Center, Kubernetes, stack, studio, progetti, open source, contatti. La command palette si apre con Cmd o Ctrl + K.',
           en: 'You can ask me about: experience, AI, AI-DLC, Spec-Driven Development, Competence Center, Kubernetes, stack, learning, projects, open source, contact. The command palette opens with Cmd or Ctrl + K.',
           pt: 'Você pode me perguntar sobre: trajetória, IA, AI-DLC, Spec-Driven Development, Competence Center, Kubernetes, stack, estudo, projetos, open source, contato. A paleta de comandos abre com Cmd ou Ctrl + K.' } },
    { k: ['sudo', 'rm -rf', 'hack'], p: 3, c: ['mail'],
      a: { it: 'Permesso accordato. Prossimo passo: scrivi a Bruno e proponi la tua sfida.',
           en: 'Permission granted. Next step: email Bruno and pitch your challenge.',
           pt: 'Permissão concedida. Próximo passo: escreva para o Bruno e proponha o seu desafio.' } },
    { k: ['ciao', 'hello', 'hi ', 'hey', 'salve', 'buongiorno', 'buonasera', 'oi ', 'ola ', 'bom dia', 'boa tarde', 'boa noite', 'grazie', 'thanks', 'thank', 'obrigad', 'valeu'], p: 0.5, c: [],
      a: { it: 'Ciao! Sono l’agente dimostrativo di Bruno. Chiedimi del suo percorso, di come usa l’AI o di cosa sta studiando.',
           en: 'Hi! I am Bruno’s demo agent. Ask me about his experience, how he uses AI or what he is studying.',
           pt: 'Oi! Sou o agente de demonstração do Bruno. Pergunte sobre a trajetória dele, como ele usa a IA ou o que está estudando.' } }
  ];
  const FALLBACK = { c: ['mail'],
    a: { it: 'Su questo non ho una risposta scritta. Prova con percorso, AI, AI-DLC, Kubernetes, studio o progetti. Oppure chiedilo direttamente a Bruno.',
         en: 'I don’t have a written answer for that. Try experience, AI, AI-DLC, Kubernetes, learning or projects. Or ask Bruno directly.',
         pt: 'Para isso eu não tenho uma resposta escrita. Tente trajetória, IA, AI-DLC, Kubernetes, estudo ou projetos. Ou pergunte direto ao Bruno.' } };

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
      jump('ai'), jump('method'), jump('approach'), jump('experience'), jump('skills'), jump('learning'), jump('projects'), jump('opensource'), jump('contact')
    ];
    if (agent) items.push({ group: T.pDo, label: T.pFocus, hint: 'bruno.agent', run: () => agent.focus() });
    if ($('#game')) items.push({ group: T.pDo, label: T.pPlay, hint: '#play', run: () => go('#play') });
    if (canCopy) items.push({ group: T.pDo, label: T.pCopy, hint: EMAIL, run: () => { go('#contact'); copyEmail(); } });
    items.push(
      { group: T.pDo, label: 'LinkedIn', hint: 'linkedin.com/in/brunobottazzini', run: () => window.open('https://www.linkedin.com/in/brunobottazzini/', '_blank', 'noopener') },
      { group: T.pDo, label: 'GitHub', hint: 'github.com/brunobottazzini', run: () => window.open('https://github.com/brunobottazzini', '_blank', 'noopener') }
    );
    $$('.languages a:not([aria-current])').forEach(link => items.push({
      group: T.pLangs, label: link.getAttribute('aria-label'), hint: link.textContent, run: () => { window.location.href = link.href; }
    }));

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

  /* ---------- mini game: human in the loop ----------
     The AI proposes, the visitor validates: approve what can ship and reject the rest before the timer
     runs out. Three mistakes end the shift. The best score stays in this browser only. */
  (function game() {
    const box = $('#game');
    if (!box) return;
    const label = $('.game-label', box), card = $('#game-proposal'), bar = $('.game-timer i', box), msg = $('#game-msg');
    const scoreEl = $('#game-score'), bestEl = $('#game-best'), livesEl = $('.game-lives', box), dots = $$('.game-lives i', box);
    const startBtn = $('#game-start'), yesBtn = $('#game-yes'), noBtn = $('#game-no');
    const GOOD = [
      'tests: 128 passed', 'review: approved', 'spec: updated', 'rollback plan: ready', 'secrets: in vault',
      'input: validated', 'coverage: 87%', 'docs: updated', 'health check: 200 OK', 'retry with backoff',
      'idempotent POST', 'feature flag: enabled', 'TLS verify: true', 'least privilege: on', 'migration: reversible',
      'timeout: 3s, retries: 2', 'replicas: 3  # prod', 'logs: no PII', 'canary: 5% traffic', 'SBOM: generated',
      'lint: 0 warnings', 'PreparedStatement(id)', 'backup: verified', 'unit of work: done', 'human review: done'
    ];
    const BAD = [
      'git push --force main', 'rm -rf /', 'password = "admin123"', 'catch (e) { /* ignore */ }', 'eval(userInput)',
      'chmod -R 777 /', 'DROP TABLE users;', 'deploy: friday 18:00', 'tests: skipped', 'API_KEY in README.md',
      'while (true) { retry() }', 'TLS verify: false', '// TODO: add auth', 'curl http://x.sh | sudo bash',
      'log.info(creditCard)', 'replicas: 0  # prod', 'it works on my machine', 'review: skipped', 'rollback plan: none',
      'secrets: committed', 'sleep(5000) // fix race', '"WHERE id = " + userId', 'kubectl delete ns prod',
      'float money = 0.1 + 0.2', 'human review: skipped'
    ];
    const RANKS = [[30, 'Human in the loop'], [20, 'Tech lead'], [12, 'Senior engineer'], [5, 'Reviewer'], [0, 'Intern']];
    const START_MS = 4200, MIN_MS = 1500, PAUSE_MS = 480, KEY = 'bb-hitl-best';
    const idleLabel = label.textContent, livesLabel = livesEl.getAttribute('aria-label');
    let state = 'idle', deck = [], current = null, score = 0, lives = 3, limit = START_MS, left = 0, last = 0, raf = 0;
    let locked = false, inView = true, best = 0;
    try { best = Number(window.localStorage.getItem(KEY)) || 0; } catch { best = 0; }
    bestEl.textContent = best;
    box.tabIndex = -1;

    const setState = value => { state = value; box.dataset.state = value; };
    const paintLives = () => {
      dots.forEach((dot, i) => dot.classList.toggle('lost', i >= lives));
      livesEl.setAttribute('aria-label', `${livesLabel}: ${lives}`);
    };
    const draw = () => {
      if (!deck.length) {
        deck = GOOD.map(text => ({ text, ok: true })).concat(BAD.map(text => ({ text, ok: false })));
        for (let i = deck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        if (current && deck[deck.length - 1].text === current.text) deck.unshift(deck.pop());
      }
      return deck.pop();
    };
    const next = () => {
      current = draw();
      card.classList.remove('is-right', 'is-wrong');
      card.textContent = current.text;
      left = limit;
      bar.style.transform = 'scaleX(1)';
      locked = false;
    };
    const finish = () => {
      setState('over');
      cancelAnimationFrame(raf);
      raf = 0;
      const record = score > best;
      if (record) {
        best = score;
        bestEl.textContent = best;
        try { window.localStorage.setItem(KEY, String(best)); } catch { /* private mode: the record just is not kept */ }
      }
      card.classList.remove('is-right', 'is-wrong');
      label.textContent = T.gLevel;
      card.textContent = RANKS.find(rank => score >= rank[0])[1];
      bar.style.transform = 'scaleX(0)';
      msg.textContent = T.gOver(score) + (record ? ' ' + T.gRecord : '');
      startBtn.textContent = T.gAgain;
      startBtn.focus({ preventScroll: true });
    };
    // approve: true = approve, false = reject, null = the timer ran out
    const decide = approve => {
      if (state !== 'play' || locked) return;
      locked = true;
      const right = approve !== null && approve === current.ok;
      card.classList.add(right ? 'is-right' : 'is-wrong');
      if (right) {
        score += 1;
        scoreEl.textContent = score;
        limit = Math.max(MIN_MS, limit * 0.955);
        msg.textContent = current.ok ? T.gShip : T.gStop;
      } else {
        lives -= 1;
        paintLives();
        msg.textContent = approve === null ? T.gTimeout : current.ok ? T.gBlocked : T.gBug;
      }
      setTimeout(() => {
        if (state !== 'play') return;
        if (lives > 0) next(); else finish();
      }, PAUSE_MS);
    };
    const tick = time => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(100, time - last) : 0;
      last = time;
      if (state !== 'play' || locked || doc.hidden || !inView) return; // the clock stops when nobody is looking
      left -= dt;
      bar.style.transform = `scaleX(${Math.max(0, left / limit)})`;
      if (left <= 0) decide(null);
    };
    const start = () => {
      score = 0; lives = 3; limit = START_MS; deck = []; current = null;
      scoreEl.textContent = '0';
      label.textContent = idleLabel;
      msg.textContent = '';
      paintLives();
      setState('play');
      next();
      last = 0;
      if (!raf) raf = requestAnimationFrame(tick);
      box.focus({ preventScroll: true });
    };

    startBtn.addEventListener('click', start);
    yesBtn.addEventListener('click', () => decide(true));
    noBtn.addEventListener('click', () => decide(false));
    doc.addEventListener('keydown', event => {
      if (state !== 'play' || !inView || event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
      const key = event.key.toLowerCase();
      if (key === 'a' || key === 'arrowleft') { event.preventDefault(); decide(false); }
      else if (key === 'd' || key === 'arrowright') { event.preventDefault(); decide(true); }
    });
    if (hasIO) new IntersectionObserver(entries => { inView = entries[0].isIntersecting; }, { threshold: 0.2 }).observe(box);
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
