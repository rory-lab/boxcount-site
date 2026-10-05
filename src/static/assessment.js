/* Rights Holder Effectiveness Ladder: 12 questions, average score rounded to a level (1 to 5). */
(function () {
  var questions = [
      {
        question: "How do you primarily structure sponsor relationships?",
        options: [
          { text: "We sell inventory (branding, signage, hospitality) with limited tailoring", value: 1 },
          { text: "We tailor packages to what sponsors ask for, mostly from a menu of assets", value: 2 },
          { text: "We design partnership plans around clearly defined marketing objectives", value: 3 },
          { text: "We co-create campaign-led partnerships built for commercial outcomes, with a learning agenda", value: 4 },
          { text: "We run partnerships like a product: repeatable methods, evidence standards, and continual improvement", value: 5 }
        ]
      },
      {
        question: "How do you define sponsorship success with a sponsor?",
        options: [
          { text: "Outputs and delivery (assets, exposure, hospitality fulfilment)", value: 1 },
          { text: "Sponsor satisfaction plus a few basic metrics depending on the deal", value: 2 },
          { text: "Agreed brand outcomes (for example awareness, consideration, preference) tracked consistently", value: 3 },
          { text: "A structured measurement plan linking activity to business outcomes (for example leads, sales, retention)", value: 4 },
          { text: "Decision-grade measurement used to optimise the partnership during the term, not just report at the end", value: 5 }
        ]
      },
      {
        question: "How well do you understand the sponsor's real objectives and constraints?",
        options: [
          { text: "We mainly focus on what we can sell and what they can buy", value: 1 },
          { text: "We ask about goals, but they are often broad and not translated into a plan", value: 2 },
          { text: "We translate goals into a small set of measurable objectives and activation requirements", value: 3 },
          { text: "We understand category context, internal stakeholder pressures, and what success has to prove", value: 4 },
          { text: "We help sponsors sharpen objectives and prioritise what will actually move outcomes", value: 5 }
        ]
      },
      {
        question: "How do you price sponsorships?",
        options: [
          { text: "Rate card or fixed packages based on inventory and comparables", value: 1 },
          { text: "Negotiated pricing with some flexibility based on sponsor needs", value: 2 },
          { text: "Value-based pricing informed by the partnership plan and deliverables, not just assets", value: 3 },
          { text: "Pricing reflects expected impact, with clear assumptions, risks, and responsibilities on both sides", value: 4 },
          { text: "Pricing is tied to a repeatable value story backed by evidence, benchmarks, and case studies", value: 5 }
        ]
      },
      {
        question: "What is the quality of your audience and market insight?",
        options: [
          { text: "Basic attendance and simple demographics", value: 1 },
          { text: "Some survey work and channel metrics, used occasionally", value: 2 },
          { text: "Consistent audience insight used to shape propositions and activation design", value: 3 },
          { text: "Insight is connected to sponsor categories and used to guide creative and channel choices", value: 4 },
          { text: "Insight is treated as a strategic asset with governance, standards, and clear applications to decisions", value: 5 }
        ]
      },
      {
        question: "How do you approach activation and creative development?",
        options: [
          { text: "Mostly asset delivery, branding and hospitality", value: 1 },
          { text: "Some added-value ideas, often tactical and time-bound", value: 2 },
          { text: "Planned activation across multiple touchpoints, with clear roles and responsibilities", value: 3 },
          { text: "Campaign-led activation designed to create outcomes, with creative quality controls", value: 4 },
          { text: "Activation is engineered: strong briefs, senior creative input, testing/learning, and optimisation", value: 5 }
        ]
      },
      {
        question: "How do you run partnership management with sponsors?",
        options: [
          { text: "Reactive. We respond when needed and report after key moments", value: 1 },
          { text: "Regular check-ins and post-event reporting", value: 2 },
          { text: "A structured cadence (for example quarterly reviews) linked to objectives and plans", value: 3 },
          { text: "Governance that includes performance reviews, optimisation decisions, and senior stakeholder access", value: 4 },
          { text: "Partnership management is a performance system: clear accountabilities, decisions, and learning loops", value: 5 }
        ]
      },
      {
        question: "How do you demonstrate value during and after the partnership?",
        options: [
          { text: "A recap focused on delivery and reach/exposure style metrics", value: 1 },
          { text: "A mixed report with some survey metrics when possible", value: 2 },
          { text: "Consistent reporting against agreed outcomes, with context and benchmarks", value: 3 },
          { text: "A clear narrative linking what happened, what it changed, and what to do next", value: 4 },
          { text: "A rigorous evidence pack that supports renewal, expansion, and internal sponsor advocacy", value: 5 }
        ]
      },
      {
        question: "What is your approach to content and storytelling with sponsors?",
        options: [
          { text: "Sponsor logos appear in our content and comms", value: 1 },
          { text: "Some co-branded content, usually around events and announcements", value: 2 },
          { text: "Planned content programmes that support the partnership objectives", value: 3 },
          { text: "Content is designed as part of an integrated campaign approach across channels", value: 4 },
          { text: "Content is treated as a creative product with quality control and consistency of distinctive assets", value: 5 }
        ]
      },
      {
        question: "How capable are you at planning and using channels (digital and otherwise)?",
        options: [
          { text: "Basic website and social presence. Limited planning", value: 1 },
          { text: "Standard sponsor integrations across owned channels", value: 2 },
          { text: "Planned channel use with clear roles for owned, earned and paid opportunities", value: 3 },
          { text: "Channel decisions are guided by objectives, audience insight and evidence", value: 4 },
          { text: "We have a repeatable planning approach that makes channel choices accountable and measurable", value: 5 }
        ]
      },
      {
        question: "How is your partnerships function set up organisationally?",
        options: [
          { text: "Sales-led team focused on inventory and closing deals", value: 1 },
          { text: "Sales plus account management, with some support from marketing/comms", value: 2 },
          { text: "A partnership team that can brief, plan and deliver activation reliably", value: 3 },
          { text: "Integrated capability across partnerships, insight, creative, comms and delivery", value: 4 },
          { text: "A mature operating model: standards, training, templates, QA, and continuous improvement", value: 5 }
        ]
      },
      {
        question: "How do you approach contracts, renewals, and long-term growth?",
        options: [
          { text: "Short-term agreements with renewal discussions near the end", value: 1 },
          { text: "Some multi-year deals, but plans change year to year", value: 2 },
          { text: "Multi-year partnerships with planned growth milestones", value: 3 },
          { text: "Contracts include a measurement plan, learning agenda, and optimisation checkpoints", value: 4 },
          { text: "Renewal is designed in from day one: evidence, outcomes, and a roadmap for expansion", value: 5 }
        ]
      }
    ];

  var levels = {
      1: {
        name: "Level 1: Inventory Seller",
        description: "Your partnerships function is built around what you have to sell, rather than what sponsors need to achieve. That's a common starting point, but it creates a ceiling on the value you can command and the relationships you can build. The gap between where you are and where you could be is significant, but a self-assessment can only give you a high-level overview. The reality is specific to your organisation.",
        recommendations: [
          "What would your top three sponsors say if asked whether your partnership is contributing to their commercial objectives - and how confident are you in that answer?",
          "Where in your current process does sponsor intent actually get captured, and what happens to it?",
          "How is your partnerships function perceived internally - as a revenue line, a marketing asset, or something else - and does that match how you'd want it positioned?",
          "What would it take for a sponsor to describe renewing with you as strategically essential rather than convenient?"
        ]
      },
      2: {
        name: "Level 2: Service Provider",
        description: "You've moved beyond pure inventory and your sponsors broadly feel well-served. But 'good service' and 'demonstrably valuable' are different things, and the distinction matters for sales, retention, pricing power, and renewal conversations. The issues at this level tend to be structural rather than attitudinal, and they're rarely visible without an outside perspective.",
        recommendations: [
          "How do you currently articulate the commercial case for renewing a partnership - and is that case built on evidence or on relationship?",
          "Where does measurement enter the conversation with sponsors, and who owns it when things are unclear?",
          "What's the honest gap between what your activation delivers and what sponsors assume it will deliver?",
          "Are your pricing conversations grounded in the value you create, or in what the market will bear?"
        ]
      },
      3: {
        name: "Level 3: Marketing Partner",
        description: "You understand your sponsors' marketing objectives, and you build programmes around them. That puts you ahead of most. But marketing outcomes and business outcomes are not the same thing, and the organisations that command the most value are the ones that can connect directly to the latter. At this level, the constraints are often less about capability and more about how that capability is organised and communicated.",
        recommendations: [
          "How well can you currently trace the line between your partnership activity and a sponsor's commercial performance - and what would it take to make that case more robustly?",
          "Where in your organisation does effectiveness thinking sit, and how much influence does it have on how partnerships are designed and priced?",
          "What's the quality of your evidence at renewal - and is it decision-grade, or is it narrative?",
          "Which parts of your operating model are genuinely scalable, and which depend on the right people being in the right conversations?"
        ]
      },
      4: {
        name: "Level 4: Business Partner",
        description: "You operate at a level most rights holders don't reach. Your sponsors think of you as genuinely strategic, and your approach to measurement and account management reflects that. The questions at this level are about codification, scalability, and whether the value you create is fully visible to sponsors, to your own leadership, and to the market. The ceiling here is often less obvious, but it's real.",
        recommendations: [
          "How much of what makes your partnerships function excellent lives in systems and standards versus in individuals?",
          "Is the value you create for sponsors being communicated in a way that influences their internal advocacy for the partnership?",
          "Where are the inconsistencies in how effectiveness is defined and evidenced across your portfolio?",
          "What would it take to make your approach to commercial partnerships a genuine point of market differentiation?"
        ]
      },
      5: {
        name: "Level 5: Industry Leader",
        description: "Based on your responses, you're operating at the top of the effectiveness curve. That's genuinely rare. The risk at this level isn't capability - it's complacency, and the assumption that current standards will remain competitive. The most valuable thing an external perspective can offer isn't diagnosis; it's challenge. Are you as far ahead as you think you are, and are the right people in your organisation asking that question?",
        recommendations: [
          "How do you currently pressure-test your effectiveness standards against what best practice actually looks like across the industry?",
          "Is your approach to measurement and value creation genuinely proprietary, or is it replicable by better-resourced competitors?",
          "Where in your organisation is effectiveness thinking most fragile - and what would happen if one or two key people left?",
          "What's your honest answer to whether your sponsors would describe your partnership as irreplaceable?"
        ]
      }
    };

  var answers = [], i = 0;
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(id) {
    ['rha-intro', 'rha-quiz', 'rha-results'].forEach(function (v) { $(v).hidden = v !== id; });
    $('rha-lead').hidden = id !== 'rha-results';
    $('rha').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  function render(index, dir) {
    i = index;
    var q = questions[i], card = $('rha-card');
    $('rha-current').textContent = i + 1;
    $('rha-bar').style.width = ((i + 1) / questions.length * 100) + '%';
    $('rha-question').textContent = q.question;
    var box = $('rha-options'); box.innerHTML = '';
    q.options.forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'rha-option'; b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', answers[i] === o.value ? 'true' : 'false');
      b.textContent = o.text;
      b.addEventListener('click', function () { pick(o.value, b); });
      box.appendChild(b);
    });
    $('rha-back').disabled = i === 0;
    $('rha-next').disabled = answers[i] === undefined;
    $('rha-next').textContent = i === questions.length - 1 ? 'See your results' : 'Next';
    if (!reduce) { card.classList.remove('in'); void card.offsetWidth; card.dataset.dir = dir || 'fwd'; card.classList.add('in'); }
    $('rha-question').focus({ preventScroll: true });
  }

  function pick(value, btn) {
    answers[i] = value;
    [].forEach.call($('rha-options').children, function (c) { c.setAttribute('aria-checked', c === btn ? 'true' : 'false'); });
    $('rha-next').disabled = false;
    var at = i;
    setTimeout(function () { if (at === i) next(); }, reduce ? 0 : 320);
  }

  function next() { if (i < questions.length - 1) render(i + 1, 'fwd'); else results(); }

  function results() {
    var total = answers.reduce(function (s, v) { return s + v; }, 0);
    var level = Math.min(5, Math.max(1, Math.round(total / answers.length)));
    var L = levels[level];
    $('rha-level-num').textContent = level;
    $('rha-level').textContent = L.name;
    $('rha-desc').textContent = L.description;
    $('rha-recs').innerHTML = '';
    L.recommendations.forEach(function (r) { var li = document.createElement('li'); li.textContent = r; $('rha-recs').appendChild(li); });
    [].forEach.call($('rha-ladder').children, function (li, n) {
      li.classList.toggle('reached', n + 1 <= level);
      li.classList.toggle('here', n + 1 === level);
      if (n + 1 === level) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    $('rha-f-level').value = level;
    $('rha-f-score').value = total;
    $('rha-f-answers').value = JSON.stringify(answers);
    show('rha-results');
    $('rha-level').focus({ preventScroll: true });
  }

  $('rha-begin').addEventListener('click', function () { $('rha-total').textContent = questions.length; show('rha-quiz'); render(0); });
  $('rha-next').addEventListener('click', next);
  $('rha-back').addEventListener('click', function () { if (i > 0) render(i - 1, 'back'); });

  var form = $('rha-form'), status = $('rha-status'), btn = $('rha-submit');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    btn.disabled = true; btn.textContent = 'Sending…';
    status.removeAttribute('data-state'); status.textContent = '';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('bad status');
        form.reset();
        status.dataset.state = 'ok';
        status.textContent = 'Thanks. Rory will look at your results before getting in touch, usually within one working day.';
      })
      .catch(function () {
        status.dataset.state = 'error';
        status.textContent = "That didn't go through. Please try again, or email hello@boxcount.co.";
      })
      .finally(function () { btn.disabled = false; btn.textContent = 'Talk to us about the audit'; });
  });
})();
