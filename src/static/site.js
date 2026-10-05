(function () {
  /* ---------- Playbook: diagrams built from the logo's X and O ----------
     Geometry is measured from the logo artwork: for a mark of size S,
     the X is two butt-ended bars 0.19S thick spanning S; the O is a ring 0.18S thick, 1.12S across. */
  var NS = 'http://www.w3.org/2000/svg';

  function el(name, attrs) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  function markO(cx, cy, S) {
    return el('circle', { cx: cx, cy: cy, r: (0.472 * S).toFixed(2), 'stroke-width': (0.176 * S).toFixed(2), class: 'mk o' });
  }

  function markX(cx, cy, S) {
    var a = 0.433 * S, w = (0.188 * S).toFixed(2), g = el('g', { class: 'mk x' });
    g.appendChild(el('line', { x1: cx - a, y1: cy - a, x2: cx + a, y2: cy + a, 'stroke-width': w, pathLength: 1 }));
    g.appendChild(el('line', { x1: cx + a, y1: cy - a, x2: cx - a, y2: cy + a, 'stroke-width': w, pathLength: 1 }));
    return g;
  }

  // Route with rounded corners (or a smooth curve), stopping short so the arrowhead sits on the end
  function routePath(pts, radius, curve, trim) {
    pts = pts.map(function (p) { return p.slice(); });
    var n = pts.length, a = pts[n - 2], b = pts[n - 1];
    var dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
    pts[n - 1] = [b[0] - (dx / len) * trim, b[1] - (dy / len) * trim];
    function f(v) { return v.toFixed(1); }
    var d = 'M' + f(pts[0][0]) + ' ' + f(pts[0][1]);
    if (curve) {
      for (var i = 0; i < n - 1; i++) {
        var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        d += 'C' + f(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + f(p1[1] + (p2[1] - p0[1]) / 6) + ' ' +
             f(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + f(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f(p2[0]) + ' ' + f(p2[1]);
      }
      return d;
    }
    for (var j = 1; j < n - 1; j++) {
      var P = pts[j - 1], C = pts[j], N = pts[j + 1];
      var l1 = Math.hypot(C[0] - P[0], C[1] - P[1]), l2 = Math.hypot(N[0] - C[0], N[1] - C[1]);
      var r = Math.min(radius, l1 / 2, l2 / 2);
      var s1 = [C[0] - (C[0] - P[0]) / l1 * r, C[1] - (C[1] - P[1]) / l1 * r];
      var s2 = [C[0] + (N[0] - C[0]) / l2 * r, C[1] + (N[1] - C[1]) / l2 * r];
      d += 'L' + f(s1[0]) + ' ' + f(s1[1]) + 'Q' + f(C[0]) + ' ' + f(C[1]) + ' ' + f(s2[0]) + ' ' + f(s2[1]);
    }
    return d + 'L' + f(pts[n - 1][0]) + ' ' + f(pts[n - 1][1]);
  }

  function arrow(pts, size, curve) {
    var b = pts[pts.length - 1], a = pts[pts.length - 2];
    var ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    var L = size, W = size * 0.62;
    var bx = b[0] - Math.cos(ang) * L, by = b[1] - Math.sin(ang) * L;
    var px = -Math.sin(ang) * W, py = Math.cos(ang) * W;
    return el('polygon', { points: [b[0], b[1], bx + px, by + py, bx + Math.cos(ang) * L * 0.28, by + Math.sin(ang) * L * 0.28, bx - px, by - py].map(function (v) { return v.toFixed(1); }).join(' ') });
  }

  // A block: a short bar across the end of the line
  function blockBar(pts, size, sw) {
    var b = pts[pts.length - 1], a = pts[pts.length - 2];
    var ang = Math.atan2(b[1] - a[1], b[0] - a[0]), px = -Math.sin(ang) * size / 2, py = Math.cos(ang) * size / 2;
    return el('line', { x1: (b[0] + px).toFixed(1), y1: (b[1] + py).toFixed(1), x2: (b[0] - px).toFixed(1), y2: (b[1] - py).toFixed(1), 'stroke-width': sw });
  }

  // One move each: a single X and one or two O's.
  // r = route with arrow, h = highlighted route, b = block (ends in a bar), hb = highlighted block, c: true = curved
  var PLAYS = {
    // Mesh: two shallow crosses run past each other, rubbing the linebacker off the receiver
    mesh: { vb: [400, 150], S: 20, items: [
      { x: [[200, 34]] },
      { o: [[44, 126], [356, 126]] },
      { r: [[344, 114], [326, 104], [56, 80]] },
      { h: [[56, 114], [74, 104], [346, 70]] }
    ] },
    // Dig: push vertical to get the linebacker to bail, then break flat across the field behind him
    dig: { vb: [400, 150], S: 20, items: [
      { x: [[196, 92]] },
      { o: [[56, 128]] },
      { h: [[56, 113], [56, 52], [356, 52]] }
    ] },
    // Sweep: the guard pulls and kicks out the edge defender, the back bends round the outside
    sweep: { vb: [400, 150], S: 20, items: [
      { x: [[292, 62]] },
      { o: [[60, 130], [136, 104]] },
      { b: [[151, 102], [232, 96], [277, 76]] },
      { h: [[75, 132], [190, 134], [296, 122], [338, 82], [348, 14]], c: true }
    ] },
    // Screen: the back drifts out to the flat behind the line, a lineman releases to clear the way
    screen: { vb: [400, 150], S: 20, items: [
      { x: [[112, 60]] },
      { o: [[300, 122], [190, 102]] },
      { b: [[176, 96], [129, 72]] },
      { h: [[286, 126], [180, 132], [96, 120], [68, 76], [64, 14]], c: true }
    ] },
    // Drag: a shallow cross underneath the coverage, running away from the defender
    drag: { vb: [400, 150], S: 20, items: [
      { x: [[150, 44]] },
      { o: [[40, 124]] },
      { h: [[52, 114], [90, 94], [360, 94]] }
    ] },
    // Go route: outside release past the corner, then vertical
    strategy: { vb: [240, 150], S: 20, items: [
      { x: [[96, 70]] },
      { o: [[70, 128]] },
      { h: [[70, 113], [50, 88], [50, 12]] }
    ] },
    // Curl: drive the defender deep, then come back to the ball
    measurement: { vb: [240, 150], S: 20, items: [
      { x: [[132, 30]] },
      { o: [[120, 132]] },
      { h: [[120, 117], [120, 66], [100, 84]] }
    ] },
    // Lead block: the fullback takes the defender, the back cuts inside it
    activation: { vb: [240, 150], S: 20, items: [
      { x: [[156, 52]] },
      { o: [[120, 108], [92, 138]] },
      { b: [[120, 93], [120, 80], [143, 63]] },
      { h: [[92, 123], [100, 92], [96, 56], [94, 12]] }
    ] },
    // Kick-out: the guard pulls along the line and finishes on the end
    // Slant: a quick break inside the defender
    slant: { vb: [240, 150], S: 20, items: [
      { x: [[198, 60]] },
      { o: [[164, 128]] },
      { h: [[164, 113], [164, 92], [96, 30]] }
    ] },
    transformation: { vb: [240, 150], S: 20, items: [
      { x: [[184, 66]] },
      { o: [[56, 118]] },
      { hb: [[71, 120], [150, 124], [172, 82]] }
    ] }
  };

  function render(svg, play) {
    var S = play.S, order = 0, marks = [], routes = [], heads = [];
    svg.setAttribute('viewBox', '0 0 ' + play.vb[0] + ' ' + play.vb[1]);
    svg.setAttribute('aria-hidden', 'true');
    play.items.forEach(function (it) {
      (it.o || []).forEach(function (p) { marks.push(markO(p[0], p[1], S)); });
      (it.x || []).forEach(function (p) { marks.push(markX(p[0], p[1], S)); });
      var pts = it.r || it.h || it.b || it.hb;
      if (pts) {
        var cls = (it.h || it.hb) ? ' hl' : '', isBlock = !!(it.b || it.hb), sw = (S * 0.12).toFixed(2);
        var path = el('path', { d: routePath(pts, S * 0.9, it.c, isBlock ? 0.001 : S * 0.45), class: 'route' + cls, 'stroke-width': sw, pathLength: 1 });
        var head = isBlock ? blockBar(pts, S * 0.95, sw) : arrow(pts, S * 0.62, it.c);
        head.setAttribute('class', 'head' + (isBlock ? ' bar' : '') + cls);
        routes.push(path); heads.push(head);
      }
    });
    marks.forEach(function (m, i) { m.style.setProperty('--d', (i * 0.03).toFixed(3) + 's'); svg.appendChild(m); });
    var t0 = marks.length * 0.03 + 0.15;
    routes.forEach(function (r, i) {
      var d = t0 + i * 0.18;
      r.style.setProperty('--d', d.toFixed(3) + 's');
      heads[i].style.setProperty('--d', (d + 0.7).toFixed(3) + 's');
      svg.appendChild(r); svg.appendChild(heads[i]);
    });
  }

  function renderCount(svg) {
    // The Sponsorship Effect: 92 coded case studies, one O each
    var cols = 12, cell = 50;
    svg.setAttribute('viewBox', '0 0 ' + cols * cell + ' ' + Math.ceil(92 / cols) * cell);
    svg.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 92; i++) {
      var o = markO((i % cols) * cell + cell / 2, Math.floor(i / cols) * cell + cell / 2, 30);
      o.style.setProperty('--d', (0.3 + i * 0.014).toFixed(3) + 's');
      svg.appendChild(o);
    }
  }

  function renderGlyph(svg, kind) {
    svg.setAttribute('viewBox', '0 0 40 40');
    svg.setAttribute('aria-hidden', 'true');
    svg.appendChild(kind === 'x' ? markX(20, 20, 32) : markO(20, 20, 32));
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Plays are drawn at rest. Ones on screen at load run straight away; the rest run when scrolled to.
  var io = ('IntersectionObserver' in window) && !reduce;
  function replay(svg) {
    svg.classList.remove('drawing');
    void svg.getBoundingClientRect();
    svg.classList.add('drawing');
  }
  var playWatch = io ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { replay(e.target); playWatch.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px' }) : null;
  document.querySelectorAll('svg[data-play]').forEach(function (svg) {
    var name = svg.getAttribute('data-play');
    if (name === 'count') renderCount(svg);
    else if (PLAYS[name]) render(svg, PLAYS[name]);
    if (reduce) return;
    var r = svg.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) svg.classList.add('drawing');
    else if (playWatch) playWatch.observe(svg);
  });

  // Sections ease up as they arrive. The trigger fires just below the fold, so nothing sits hidden on screen.
  if (io) {
    var revealWatch = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('revealed'); revealWatch.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px 80px 0px' });
    var sel = '.thesis-inner > *, .blocks .block, .people-strip-inner > *, .section-title, .versus .side, .after, .count-copy, .split > *, .cta-band-inner, .intro-line, .legal > *';
    document.querySelectorAll(sel).forEach(function (n, i) {
      var r = n.getBoundingClientRect();
      if (r.top < window.innerHeight) return;            // already on screen: leave it alone
      var sib = n.parentElement ? Array.prototype.indexOf.call(n.parentElement.children, n) : 0;
      n.style.setProperty('--i', Math.min(sib, 5));
      n.classList.add('reveal');
      revealWatch.observe(n);
    });
  }
  document.querySelectorAll('svg[data-glyph]').forEach(function (svg) { renderGlyph(svg, svg.getAttribute('data-glyph')); });

  // Re-run a block's play when it is hovered or focused
  document.querySelectorAll('[data-redraw]').forEach(function (block) {
    var svg = block.querySelector('svg[data-play]');
    if (!svg || reduce) return;
    block.addEventListener('mouseenter', function () { replay(svg); });
    block.addEventListener('focusin', function () { replay(svg); });
  });

  /* ---------- Navigation ---------- */
  var slug = (document.body.className.match(/page-(\S+)/) || [])[1];
  if (slug) {
    var current = document.querySelector('.site-nav a[data-nav="' + slug + '"]');
    if (current) current.setAttribute('aria-current', 'page');
  }
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'Close' : 'Menu';
    });
  }

  /* ---------- Course booking: sticky bar ---------- */
  var sticky = document.getElementById('sticky-buy');
  if (sticky && 'IntersectionObserver' in window) {
    var cardOut = false, bookIn = false;
    var set = function () { sticky.hidden = !(cardOut && !bookIn); };
    new IntersectionObserver(function (e) { cardOut = !e[0].isIntersecting; set(); }).observe(document.getElementById('buy-card'));
    new IntersectionObserver(function (e) { bookIn = e[0].isIntersecting; set(); }, { rootMargin: '0px 0px -30% 0px' }).observe(document.getElementById('book'));
  }

  /* ---------- Forms: contact, and course booking with Stripe hand-off ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('form-status');
    var button = document.getElementById('contact-submit');
    var checkout = form.dataset.checkout;            // Stripe Payment Link, set on the training page
    var isBooking = form.hasAttribute('data-checkout');
    var label = button.innerHTML;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ref = 'BC-' + Date.now().toString(36).toUpperCase();
      var refField = document.getElementById('booking-ref');
      if (refField) refField.value = ref;
      button.disabled = true;
      button.textContent = isBooking ? 'Taking you to payment…' : 'Sending…';
      status.removeAttribute('data-state');
      status.textContent = '';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('bad status');
          if (isBooking) {
            if (!checkout) {
              status.dataset.state = 'error';
              status.textContent = "Online payment isn't switched on yet. Your details are with Rory, who will be in touch to complete your booking.";
              return;
            }
            var url = checkout + (checkout.indexOf('?') > -1 ? '&' : '?') +
              'prefilled_email=' + encodeURIComponent(form.email.value) + '&client_reference_id=' + ref;
            window.location.href = url;
            return;
          }
          form.reset();
          status.dataset.state = 'ok';
          status.textContent = 'Thanks. Your message is with Rory.';
        })
        .catch(function () {
          status.dataset.state = 'error';
          status.textContent = "That didn't go through. Please try again, or email rory@boxcount.co.";
        })
        .finally(function () { button.disabled = false; button.innerHTML = label; });
    });
  }
})();
