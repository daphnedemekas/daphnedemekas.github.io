/* Interactive figures for essays.
 * Usage in markdown:  [viz:name|Caption text]
 * Each figure initialises lazily the first time it becomes visible.
 */
(function () {
  'use strict';

  var COL = {
    ink: '#2a2a2a', light: '#6b6560', faint: '#a09890', border: '#e0dbd5',
    bg: '#f8f6f3', bgAlt: '#f0ede8', paper: '#fdfcfa',
    A: '#b5604a', B: '#2f6aa8', C: '#8a8a3a'
  };
  var FONT = '500 11px Inter, -apple-system, sans-serif';
  var FONT_SMALL = '400 10.5px Inter, -apple-system, sans-serif';
  var DEG = Math.PI / 180;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- helpers ----------
  function el(tag, cls, parent, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function sizeCanvas(c, w, h) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    c.style.width = w + 'px'; c.style.height = h + 'px';
    var ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }
  function rgba(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function btnGroup(parent, items, onPick, initial) {
    var wrap = el('div', 'viz-btns', parent);
    var btns = items.map(function (it) {
      var b = el('button', 'viz-btn', wrap, it.label);
      b.type = 'button';
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        btns.forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
        b.classList.add('active'); b.setAttribute('aria-pressed', 'true');
        onPick(it.key);
      });
      if (it.key === initial) { b.classList.add('active'); b.setAttribute('aria-pressed', 'true'); }
      return b;
    });
    return wrap;
  }
  function button(parent, label, onClick) {
    var b = el('button', 'viz-btn', parent, label);
    b.type = 'button';
    b.addEventListener('click', function (e) { e.stopPropagation(); onClick(b); });
    return b;
  }
  function slider(parent, label, min, max, step, value, onInput) {
    var wrap = el('label', 'viz-slider', parent);
    el('span', 'viz-slider-label', wrap, label);
    var inp = el('input', null, wrap);
    inp.type = 'range'; inp.min = min; inp.max = max; inp.step = step; inp.value = value;
    inp.addEventListener('input', function () { onInput(parseFloat(inp.value)); });
    inp.addEventListener('click', function (e) { e.stopPropagation(); });
    return inp;
  }
  function pointerPos(canvas, e) {
    var r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function drag(canvas, h) {
    var active = false, last = null;
    canvas.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      var p = pointerPos(canvas, e);
      if (h.down && h.down(p) === false) return;
      active = true; last = p;
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', function (e) {
      var p = pointerPos(canvas, e);
      if (!active) { if (h.hover) h.hover(p); return; }
      h.move(p, p.x - last.x, p.y - last.y);
      last = p;
    });
    function end(e) { if (active) { active = false; if (h.up) h.up(); } }
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);
    canvas.addEventListener('click', function (e) { e.stopPropagation(); });
  }
  function text(ctx, s, x, y, color, align, font) {
    ctx.font = font || FONT; ctx.fillStyle = color || COL.light;
    ctx.textAlign = align || 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(s, x, y);
  }

  // =====================================================================
  // 1. ATLAS — no flat chart of a sphere is faithful everywhere
  // =====================================================================
  function atlas(fig, stage, ctrl) {
    var st = { lat0: 25, lon0: -20, viewLon: -20, proj: 'stereo', idleAt: 0 };
    var PROJ = {
      stereo: { name: 'Stereographic', keeps: 'keeps every angle true; inflates area far from the centre',
        k: function (c) { return 2 / (1 + Math.cos(c)); }, cut: 140 * DEG, r: function (c) { return 2 * Math.tan(c / 2); } },
      gnomonic: { name: 'Gnomonic', keeps: 'keeps shortest paths straight; tears apart toward the edge',
        k: function (c) { return 1 / Math.cos(c); }, cut: 72 * DEG, r: function (c) { return Math.tan(c); } },
      equi: { name: 'Equidistant', keeps: 'keeps distance from the centre true; bends shapes far away',
        k: function (c) { return c < 1e-6 ? 1 : c / Math.sin(c); }, cut: 179 * DEG, r: function (c) { return c; } }
    };
    var row = el('div', 'viz-row', stage);
    var g = el('div', 'viz-panel', row), m = el('div', 'viz-panel', row);
    var cg = el('canvas', null, g), cm = el('canvas', null, m);
    cg.setAttribute('aria-label', 'A globe covered in equal small circles, with the region the current chart represents faithfully highlighted');
    cm.setAttribute('aria-label', 'A flat chart of the globe; circles near the centre stay small, circles far away are distorted');
    el('div', 'viz-panel-label', g, 'the whole');
    el('div', 'viz-panel-label', m, 'one chart of it');
    var note = el('div', 'viz-note', ctrl);
    btnGroup(ctrl, [{ key: 'stereo', label: 'Stereographic' }, { key: 'gnomonic', label: 'Gnomonic' }, { key: 'equi', label: 'Equidistant' }],
      function (k) { st.proj = k; updNote(); }, 'stereo');
    el('div', 'viz-hint', ctrl, 'Drag either panel to move the chart.');
    function updNote() { note.textContent = PROJ[st.proj].name + ' projection: ' + PROJ[st.proj].keeps + '.'; }
    updNote();

    // Tissot circles
    var centers = [];
    for (var la = -75; la <= 75; la += 30) for (var lo = -180; lo < 180; lo += 30) centers.push([la * DEG, (lo + (la / 30 % 2 ? 15 : 0)) * DEG]);
    function smallCircle(phc, lac, rho, n) {
      var pts = [];
      for (var i = 0; i <= n; i++) {
        var b = i / n * 2 * Math.PI;
        var ph = Math.asin(Math.sin(phc) * Math.cos(rho) + Math.cos(phc) * Math.sin(rho) * Math.cos(b));
        var l = lac + Math.atan2(Math.sin(b) * Math.sin(rho) * Math.cos(phc), Math.cos(rho) - Math.sin(phc) * Math.sin(ph));
        pts.push([ph, l]);
      }
      return pts;
    }
    var tissot = centers.map(function (c) { return smallCircle(c[0], c[1], 7 * DEG, 28); });
    var grat = [];
    for (var a = -60; a <= 60; a += 30) { var L = []; for (var b2 = -180; b2 <= 180; b2 += 4) L.push([a * DEG, b2 * DEG]); grat.push(L); }
    for (var b3 = -180; b3 < 180; b3 += 30) { var L2 = []; for (var a2 = -88; a2 <= 88; a2 += 4) L2.push([a2 * DEG, b3 * DEG]); grat.push(L2); }

    // azimuthal coordinates relative to a centre
    function rel(ph, l, ph0, l0) {
      var cl = Math.cos(l - l0);
      var cc = Math.sin(ph0) * Math.sin(ph) + Math.cos(ph0) * Math.cos(ph) * cl;
      return { x: Math.cos(ph) * Math.sin(l - l0), y: Math.cos(ph0) * Math.sin(ph) - Math.sin(ph0) * Math.cos(ph) * cl, c: Math.acos(clamp(cc, -1, 1)) };
    }
    var S = 300, ctxG, ctxM;
    function resize() {
      var W = fig.clientWidth;
      S = W < 560 ? Math.min(W, 360) : Math.min(360, Math.floor((W - 20) / 2));
      ctxG = sizeCanvas(cg, S, S); ctxM = sizeCanvas(cm, S, S);
    }
    function path(ctx, pts, f) {
      var pen = false; ctx.beginPath();
      for (var i = 0; i < pts.length; i++) {
        var q = f(pts[i]);
        if (!q) { pen = false; continue; }
        if (pen) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]);
        pen = true;
      }
    }
    function drawGlobe() {
      var ctx = ctxG, R = S * 0.44, cx = S / 2, cy = S / 2;
      var ph1 = 18 * DEG, l1 = st.viewLon * DEG;
      ctx.clearRect(0, 0, S, S);
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI);
      ctx.fillStyle = COL.paper; ctx.fill(); ctx.strokeStyle = COL.faint; ctx.lineWidth = 1; ctx.stroke();
      function P(p) { var r = rel(p[0], p[1], ph1, l1); if (r.c > Math.PI / 2) return null; return [cx + R * r.x, cy - R * r.y]; }
      ctx.strokeStyle = rgba(COL.faint, 0.45); ctx.lineWidth = 0.75;
      grat.forEach(function (L) { path(ctx, L, P); ctx.stroke(); });
      // fidelity cap
      var cap = smallCircle(st.lat0 * DEG, st.lon0 * DEG, 35 * DEG, 90);
      path(ctx, cap, P); ctx.fillStyle = rgba(COL.A, 0.12); ctx.fill(); ctx.strokeStyle = COL.A; ctx.lineWidth = 1.5; ctx.stroke();
      tissot.forEach(function (T) {
        var vis = T.every(function (p) { return P(p); });
        if (!vis) return;
        path(ctx, T, P); ctx.fillStyle = rgba(COL.ink, 0.16); ctx.fill(); ctx.strokeStyle = rgba(COL.ink, 0.55); ctx.lineWidth = 0.75; ctx.stroke();
      });
      var c = P([st.lat0 * DEG, st.lon0 * DEG]);
      if (c) { ctx.beginPath(); ctx.arc(c[0], c[1], 4, 0, 2 * Math.PI); ctx.fillStyle = COL.A; ctx.fill(); }
    }
    function drawMap() {
      var ctx = ctxM, pr = PROJ[st.proj], cx = S / 2, cy = S / 2, sc = S / 2 / 2.3;
      var ph0 = st.lat0 * DEG, l0 = st.lon0 * DEG;
      ctx.clearRect(0, 0, S, S);
      ctx.fillStyle = COL.paper; ctx.fillRect(0, 0, S, S);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, S, S); ctx.clip();
      function P(p) { var r = rel(p[0], p[1], ph0, l0); if (r.c > pr.cut) return null; var k = pr.k(r.c); return [cx + sc * k * r.x, cy - sc * k * r.y]; }
      ctx.strokeStyle = rgba(COL.faint, 0.45); ctx.lineWidth = 0.75;
      grat.forEach(function (L) {
        // break lines with large jumps
        var pen = false, prev = null; ctx.beginPath();
        L.forEach(function (p) {
          var q = P(p);
          if (!q || (prev && Math.hypot(q[0] - prev[0], q[1] - prev[1]) > S * 0.4)) { pen = false; prev = q; if (!q) return; }
          if (pen) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]);
          pen = true; prev = q;
        });
        ctx.stroke();
      });
      tissot.forEach(function (T) {
        var pts = T.map(P);
        if (pts.some(function (q) { return !q; })) return;
        ctx.beginPath(); pts.forEach(function (q, i) { if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); });
        ctx.closePath(); ctx.fillStyle = rgba(COL.ink, 0.16); ctx.fill(); ctx.strokeStyle = rgba(COL.ink, 0.55); ctx.lineWidth = 0.75; ctx.stroke();
      });
      var rr = sc * pr.r(35 * DEG);
      ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 2 * Math.PI);
      ctx.fillStyle = rgba(COL.A, 0.08); ctx.fill();
      ctx.setLineDash([4, 4]); ctx.strokeStyle = COL.A; ctx.lineWidth = 1.5; ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, 2 * Math.PI); ctx.fillStyle = COL.A; ctx.fill();
      ctx.restore();
      ctx.strokeStyle = COL.border; ctx.lineWidth = 1; ctx.strokeRect(0.5, 0.5, S - 1, S - 1);
      text(ctx, 'trustworthy here', cx, cy - rr - 9, COL.A, 'center');
    }
    function draw() { drawGlobe(); drawMap(); }
    function mv(dx, dy, k) {
      st.lon0 = ((st.lon0 - dx * k + 540) % 360) - 180;
      st.lat0 = clamp(st.lat0 + dy * k, -70, 70);
      st.idleAt = performance.now();
    }
    drag(cm, { move: function (p, dx, dy) { mv(dx, -dy, 0.35); draw(); } });
    drag(cg, { move: function (p, dx, dy) { mv(-dx, -dy, 0.4); draw(); } });
    cg.style.touchAction = cm.style.touchAction = 'none';
    var t0 = performance.now();
    return {
      resize: function () { resize(); draw(); },
      tick: function (now) {
        if (now - st.idleAt > 3500 && !reduceMotion) {
          st.lon0 = ((st.lon0 + 0.12 + 540) % 360) - 180;
          var target = 30 * Math.sin((now - t0) / 7000);
          st.lat0 += (target - st.lat0) * 0.01;
        }
        var d = ((st.lon0 - st.viewLon + 540) % 360) - 180;
        st.viewLon += d * 0.03;
        draw();
      }
    };
  }

  // =====================================================================
  // 2. FRAMES — coordinates differ, distances agree
  // =====================================================================
  function frames(fig, stage, ctrl) {
    var c = el('canvas', null, stage); c.style.touchAction = 'none';
    c.setAttribute('aria-label', 'Three coloured coordinate frames observe the same three points. Their coordinates disagree; the distances between the points agree.');
    var table = el('table', 'viz-table', el('div', 'viz-table-wrap', ctrl));
    el('div', 'viz-hint', ctrl, 'Drag a frame’s origin to move it, or the tip of its arrow to rotate it. Drag the black points to change the world itself.');
    var W = 600, H = 330, ctx, u = 50;
    var pts = [{ x: -0.6, y: 0.6, n: 'P' }, { x: 1.6, y: 1.2, n: 'Q' }, { x: 0.9, y: -1.0, n: 'R' }];
    var fr = [
      { ox: -3.4, oy: -1.6, a: 0.25, col: COL.A, n: 'A', ph: 0 },
      { ox: 3.2, oy: -1.4, a: 2.1, col: COL.B, n: 'B', ph: 2 },
      { ox: 0.2, oy: 2.0, a: -1.2, col: COL.C, n: 'C', ph: 4 }
    ];
    var idleAt = -1e9, held = null, focus = 0, focusAt = 0;
    table.addEventListener('pointerover', function (e) {
      var tr = e.target.closest && e.target.closest('tr[data-i]');
      if (tr) { focus = +tr.getAttribute('data-i'); focusAt = performance.now() + 6000; draw(); }
    });
    function resize() {
      W = fig.clientWidth; H = Math.round(clamp(W * 0.55, 260, 360));
      u = Math.min(W / 9.5, H / 5.6);
      ctx = sizeCanvas(c, W, H);
    }
    function S(x, y) { return [W / 2 + x * u, H / 2 - y * u]; }
    function W2(p) { return { x: (p.x - W / 2) / u, y: (H / 2 - p.y) / u }; }
    function local(f, p) {
      var dx = p.x - f.ox, dy = p.y - f.oy, ca = Math.cos(f.a), sa = Math.sin(f.a);
      return { x: dx * ca + dy * sa, y: -dx * sa + dy * ca };
    }
    function arrow(x1, y1, x2, y2, col, w) {
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      var a = Math.atan2(y2 - y1, x2 - x1), h = 7;
      ctx.beginPath(); ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - h * Math.cos(a - 0.4), y2 - h * Math.sin(a - 0.4));
      ctx.lineTo(x2 - h * Math.cos(a + 0.4), y2 - h * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill();
    }
    var AX = 1.1;
    function tip(f) { return { x: f.ox + AX * Math.cos(f.a), y: f.oy + AX * Math.sin(f.a) }; }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = COL.paper; ctx.fillRect(0, 0, W, H);
      // frames
      fr.forEach(function (f, fi) {
        var o = S(f.ox, f.oy), ca = Math.cos(f.a), sa = Math.sin(f.a);
        // grid of the focused frame only
        ctx.strokeStyle = rgba(f.col, 0.16); ctx.lineWidth = 1;
        for (var i = -8; i <= 8 && fi === focus; i++) {
          var p1 = S(f.ox + i * (-sa) - 9 * ca, f.oy + i * ca - 9 * sa), p2 = S(f.ox + i * (-sa) + 9 * ca, f.oy + i * ca + 9 * sa);
          ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke();
          var q1 = S(f.ox + i * ca - 9 * (-sa), f.oy + i * sa - 9 * ca), q2 = S(f.ox + i * ca + 9 * (-sa), f.oy + i * sa + 9 * ca);
          ctx.beginPath(); ctx.moveTo(q1[0], q1[1]); ctx.lineTo(q2[0], q2[1]); ctx.stroke();
        }
        var t = S(f.ox + AX * ca, f.oy + AX * sa), t2 = S(f.ox - AX * 0.7 * sa, f.oy + AX * 0.7 * ca);
        arrow(o[0], o[1], t[0], t[1], f.col, 2);
        arrow(o[0], o[1], t2[0], t2[1], f.col, 1.5);
        ctx.beginPath(); ctx.arc(o[0], o[1], 5, 0, 2 * Math.PI); ctx.fillStyle = f.col; ctx.fill();
        ctx.beginPath(); ctx.arc(t[0], t[1], 6, 0, 2 * Math.PI); ctx.strokeStyle = f.col; ctx.lineWidth = 1; ctx.stroke();
        text(ctx, 'frame ' + f.n, o[0] + 8, o[1] + 12, f.col, 'left');
      });
      // how the focused frame locates P: dashed lines parallel to its axes
      (function () {
        var f = fr[focus], P0 = pts[0], lp = local(f, P0), ca = Math.cos(f.a), sa = Math.sin(f.a);
        var fx = { x: f.ox + lp.x * ca, y: f.oy + lp.x * sa }, fy = { x: f.ox - lp.y * sa, y: f.oy + lp.y * ca };
        var o = S(f.ox, f.oy), p = S(P0.x, P0.y), a = S(fx.x, fx.y), b = S(fy.x, fy.y);
        ctx.setLineDash([3, 3]); ctx.strokeStyle = rgba(f.col, 0.8); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(a[0], a[1]); ctx.lineTo(p[0], p[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(o[0], o[1]); ctx.stroke();
        ctx.setLineDash([]);
      })();
      // triangle
      ctx.strokeStyle = COL.ink; ctx.lineWidth = 1.5; ctx.beginPath();
      pts.forEach(function (p, i) { var s = S(p.x, p.y); if (i) ctx.lineTo(s[0], s[1]); else ctx.moveTo(s[0], s[1]); });
      ctx.closePath(); ctx.stroke();
      pts.forEach(function (p) {
        var s = S(p.x, p.y);
        ctx.beginPath(); ctx.arc(s[0], s[1], 6, 0, 2 * Math.PI); ctx.fillStyle = COL.ink; ctx.fill();
        ctx.strokeStyle = COL.paper; ctx.lineWidth = 2; ctx.stroke();
        text(ctx, p.n, s[0] + 10, s[1] - 10, COL.ink, 'left');
      });
      ctx.strokeStyle = COL.border; ctx.lineWidth = 1; ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
      renderTable();
    }
    function f1(v) { return (v >= 0 ? ' ' : '−') + Math.abs(v).toFixed(2); }
    function renderTable() {
      var P = pts[0], Q = pts[1], R = pts[2];
      var dPQ = Math.hypot(P.x - Q.x, P.y - Q.y);
      var v1 = [Q.x - P.x, Q.y - P.y], v2 = [R.x - P.x, R.y - P.y];
      var ang = Math.acos(clamp((v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(v1[0], v1[1]) * Math.hypot(v2[0], v2[1])), -1, 1)) / DEG;
      var h = '<thead><tr><th></th><th>where P is</th><th>where Q is</th><th class="inv">distance P–Q</th><th class="inv">angle at P</th></tr></thead><tbody>';
      fr.forEach(function (f, fi) {
        var lp = local(f, P), lq = local(f, Q);
        h += '<tr data-i="' + fi + '"' + (fi === focus ? ' class="focus"' : '') + '><td><span class="sw" style="background:' + f.col + '"></span>frame ' + f.n + '</td>' +
          '<td class="num">(' + f1(lp.x) + ', ' + f1(lp.y) + ')</td>' +
          '<td class="num">(' + f1(lq.x) + ', ' + f1(lq.y) + ')</td>' +
          '<td class="num inv">' + dPQ.toFixed(2) + '</td>' +
          '<td class="num inv">' + ang.toFixed(1) + '°</td></tr>';
      });
      h += '</tbody>';
      table.innerHTML = h;
    }
    function hit(p) {
      var w = W2(p), best = null, bd = 14 / u;
      pts.forEach(function (q) { var d = Math.hypot(q.x - w.x, q.y - w.y); if (d < bd) { bd = d; best = { k: 'pt', o: q }; } });
      fr.forEach(function (f) {
        var t = tip(f), d = Math.hypot(t.x - w.x, t.y - w.y); if (d < bd) { bd = d; best = { k: 'rot', o: f }; }
        var d2 = Math.hypot(f.ox - w.x, f.oy - w.y); if (d2 < bd) { bd = d2; best = { k: 'org', o: f }; }
      });
      return best;
    }
    drag(c, {
      down: function (p) {
        held = hit(p); if (!held) return false; idleAt = performance.now();
        if (held.k !== 'pt') { focus = fr.indexOf(held.o); focusAt = performance.now() + 6000; }
      },
      move: function (p) {
        var w = W2(p); idleAt = performance.now();
        if (held.k === 'pt') { held.o.x = clamp(w.x, -4.5, 4.5); held.o.y = clamp(w.y, -2.6, 2.6); }
        if (held.k === 'org') { held.o.ox = clamp(w.x, -4.5, 4.5); held.o.oy = clamp(w.y, -2.6, 2.6); }
        if (held.k === 'rot') { held.o.a = Math.atan2(w.y - held.o.oy, w.x - held.o.ox); }
        draw();
      },
      hover: function (p) { c.style.cursor = hit(p) ? 'grab' : 'default'; },
      up: function () { held = null; }
    });
    var base = fr.map(function (f) { return { ox: f.ox, oy: f.oy }; });
    return {
      resize: function () { resize(); draw(); },
      tick: function (now) {
        if (now > focusAt) { focus = (focus + 1) % 3; focusAt = now + 3500; if (reduceMotion) draw(); }
        if (reduceMotion || now - idleAt < 4000) return;
        fr.forEach(function (f, i) {
          f.a += 0.004 * (i === 1 ? -1 : 1) * (1 + i * 0.3);
          f.ox += (base[i].ox + 0.25 * Math.cos(now / 2600 + f.ph) - f.ox) * 0.05;
          f.oy += (base[i].oy + 0.25 * Math.sin(now / 3100 + f.ph) - f.oy) * 0.05;
        });
        draw();
      },
      resetBase: function () {}
    };
  }

  // =====================================================================
  // 3. ERLANGEN — the group decides what counts as real
  // =====================================================================
  function erlangen(fig, stage, ctrl) {
    var c = el('canvas', null, stage);
    c.setAttribute('aria-label', 'A square with a grid, an inscribed circle and four marked collinear points, continuously transformed by the chosen group of transformations');
    var groupNote = el('div', 'viz-note', ctrl);
    var GROUPS = {
      rigid: { label: 'Rigid', note: 'Counted as “just a change of perspective”: turning and moving.' },
      similar: { label: '+ Zoom', note: 'Now also counted as mere reframing: changing scale.' },
      affine: { label: '+ Shear', note: 'Now also: stretching and shearing, as long as parallel lines stay parallel.' },
      proj: { label: '+ Perspective', note: 'Now also: looking from any vantage point, as a painter does.' }
    };
    var ORDER = ['rigid', 'similar', 'affine', 'proj'];
    var group = 'rigid';
    btnGroup(ctrl, ORDER.map(function (k) { return { key: k, label: GROUPS[k].label }; }), function (k) { group = k; newTarget(true); upd(); }, 'rigid');
    var list = el('ul', 'viz-props', ctrl);
    var PROPS = [
      { n: 'length of a side', lost: 'similar' },
      { n: 'angle at a corner', lost: 'affine' },
      { n: 'ratio of two sides', lost: 'affine' },
      { n: 'opposite sides parallel', lost: 'proj' },
      { n: 'midpoint stays the midpoint', lost: 'proj' },
      { n: 'cross-ratio of the four dots', lost: null },
      { n: 'straight lines stay straight', lost: null }
    ];
    var items = PROPS.map(function (p) {
      var li = el('li', null, list);
      var mark = el('span', 'mark', li); el('span', 'pname', li, p.n); var val = el('span', 'pval', li);
      return { li: li, mark: mark, val: val, p: p };
    });
    function lost(p) { return p.lost && ORDER.indexOf(group) >= ORDER.indexOf(p.lost); }
    function upd() {
      groupNote.textContent = GROUPS[group].note;
      items.forEach(function (it) {
        var l = lost(it.p);
        it.li.className = l ? 'lost' : 'kept';
        it.mark.textContent = l ? '✕' : '✓';
      });
    }
    var cur = ident(), from = ident(), to = ident(), tStart = 0, DUR = 2600;
    function ident() { return { th: 0, s: 1, sh: 0, an: 1, tx: 0, ty: 0, px: 0, py: 0 }; }
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function newTarget(now) {
      from = cur; tStart = performance.now();
      var gi = ORDER.indexOf(group);
      to = { th: rnd(-0.8, 0.8), s: gi >= 1 ? rnd(0.7, 1.1) : 1, sh: gi >= 2 ? rnd(-0.45, 0.45) : 0, an: gi >= 2 ? rnd(0.75, 1.3) : 1,
        tx: rnd(-0.3, 0.3), ty: rnd(-0.2, 0.2), px: gi >= 3 ? rnd(-0.27, 0.27) : 0, py: gi >= 3 ? rnd(-0.27, 0.27) : 0 };
      if (gi >= 2) { to.s *= 0.85; }
    }
    function lerp(a, b, t) { var o = {}; for (var k in a) o[k] = a[k] + (b[k] - a[k]) * t; return o; }
    function apply(T, x, y) {
      var X = x * T.an, Y = y / T.an;          // anisotropic stretch (area preserving)
      X = X + T.sh * Y;                       // shear
      var ca = Math.cos(T.th), sa = Math.sin(T.th);
      var x2 = T.s * (ca * X - sa * Y) + T.tx, y2 = T.s * (sa * X + ca * Y) + T.ty;
      var w = 1 + T.px * x + T.py * y;          // perspective
      return [x2 / w, y2 / w];
    }
    var W = 600, H = 320, ctx;
    function resize() { W = fig.clientWidth; H = Math.round(clamp(W * 0.5, 240, 330)); ctx = sizeCanvas(c, W, H); }
    var DOTS = [-1, -0.45, 0.25, 1];
    function measures(T) {
      var A = apply(T, -1, -1), B = apply(T, 1, -1), C = apply(T, 1, 1), D = apply(T, -1, 1), M = apply(T, 0, 0);
      function d(p, q) { return Math.hypot(p[0] - q[0], p[1] - q[1]); }
      var ab = [B[0] - A[0], B[1] - A[1]], ad = [D[0] - A[0], D[1] - A[1]], dc = [C[0] - D[0], C[1] - D[1]];
      var ang = Math.acos(clamp((ab[0] * ad[0] + ab[1] * ad[1]) / (d(A, B) * d(A, D)), -1, 1)) / DEG;
      var par = Math.abs(Math.atan2(ab[0] * dc[1] - ab[1] * dc[0], ab[0] * dc[0] + ab[1] * dc[1])) / DEG;
      var mid = d(A, M) / d(A, C);
      var P = DOTS.map(function (x) { return apply(T, x, -1); });
      var cr = (d(P[0], P[2]) * d(P[1], P[3])) / (d(P[1], P[2]) * d(P[0], P[3]));
      return [d(A, B).toFixed(2), ang.toFixed(1) + '°', (d(A, B) / d(A, D)).toFixed(2), par < 0.05 ? 'yes' : 'off by ' + par.toFixed(1) + '°', mid.toFixed(3), cr.toFixed(3), 'yes'];
    }
    function draw() {
      var sc = Math.min(W, H) * 0.25, cx = W / 2, cy = H / 2;
      function S(p) { return [cx + p[0] * sc, cy - p[1] * sc]; }
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = COL.paper; ctx.fillRect(0, 0, W, H);
      function polyline(T, pts) { ctx.beginPath(); pts.forEach(function (q, i) { var s = S(apply(T, q[0], q[1])); if (i) ctx.lineTo(s[0], s[1]); else ctx.moveTo(s[0], s[1]); }); }
      function line(T, a, b, n) { var p = []; for (var i = 0; i <= n; i++) p.push([a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n]); polyline(T, p); }
      function figure(T, ghost) {
        ctx.lineWidth = 1; ctx.strokeStyle = ghost ? rgba(COL.faint, 0.22) : rgba(COL.light, 0.55);
        if (ghost) ctx.setLineDash([2, 3]);
        for (var i = -1; i <= 1; i += 0.5) { line(T, [i, -1], [i, 1], 10); ctx.stroke(); line(T, [-1, i], [1, i], 10); ctx.stroke(); }
        var circ = []; for (var k = 0; k <= 72; k++) circ.push([Math.cos(k / 72 * 2 * Math.PI), Math.sin(k / 72 * 2 * Math.PI)]);
        polyline(T, circ); ctx.strokeStyle = ghost ? rgba(COL.A, 0.2) : COL.A; ctx.lineWidth = ghost ? 1 : 2; ctx.stroke();
        ctx.setLineDash([]);
        if (ghost) return;
        ctx.lineWidth = 2.5; ctx.strokeStyle = COL.B;
        line(T, [-1, -1], [1, -1], 2); ctx.stroke(); line(T, [-1, 1], [1, 1], 2); ctx.stroke();
        ctx.lineWidth = 1.5; ctx.strokeStyle = COL.ink;
        line(T, [-1, -1], [-1, 1], 2); ctx.stroke(); line(T, [1, -1], [1, 1], 2); ctx.stroke();
        ctx.setLineDash([3, 3]); line(T, [-1, -1], [1, 1], 2); ctx.stroke(); ctx.setLineDash([]);
        var m = S(apply(T, 0, 0)); ctx.beginPath(); ctx.arc(m[0], m[1], 4, 0, 2 * Math.PI); ctx.fillStyle = COL.ink; ctx.fill();
        DOTS.forEach(function (x) { var s = S(apply(T, x, -1)); ctx.beginPath(); ctx.arc(s[0], s[1], 5, 0, 2 * Math.PI); ctx.fillStyle = COL.C; ctx.fill(); ctx.strokeStyle = COL.paper; ctx.lineWidth = 2; ctx.stroke(); });
      }
      figure(ident(), true);
      figure(cur, false);
      ctx.strokeStyle = COL.border; ctx.lineWidth = 1; ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
      text(ctx, 'faint: the original', 10, H - 12, COL.faint, 'left', FONT_SMALL);
      var ms = measures(cur);
      items.forEach(function (it, i) { it.val.textContent = ms[i]; });
    }
    upd(); newTarget();
    return {
      resize: function () { resize(); draw(); },
      tick: function (now) {
        if (reduceMotion) { cur = to; draw(); return; }
        var t = (now - tStart) / DUR;
        cur = lerp(from, to, smooth(t));
        if (t >= 1.25) newTarget();
        draw();
      }
    };
  }

  // =====================================================================
  // 4. FIXED POINTS — a framework that reads experience, which confirms it
  // =====================================================================
  function fixedpoint(fig, stage, ctrl) {
    var c = el('canvas', null, stage); c.style.touchAction = 'manipulation';
    c.setAttribute('aria-label', 'A cobweb diagram: repeated reinterpretation of an experience converges to a fixed point that depends on where it started');
    var status = el('div', 'viz-note', ctrl);
    var sl = el('div', 'viz-sliders', ctrl);
    var st = { g: 11, w: 0.04, e: 0.32 };
    slider(sl, 'how tightly the framework is held', 0.5, 16, 0.1, st.g, function (v) { st.g = v; restart(); });
    slider(sl, 'how much the experience can talk back', 0, 0.8, 0.01, st.w, function (v) { st.w = v; restart(); });
    el('div', 'viz-hint', ctrl, 'Click inside the plot to start a new reader from that point.');
    function sig(x) { return 1 / (1 + Math.exp(-st.g * (x - 0.5))); }
    function f(x) { var s0 = sig(0), s1 = sig(1); return (1 - st.w) * (sig(x) - s0) / (s1 - s0) + st.w * st.e; }
    var webs = [];
    function restart(extra) {
      webs = [{ x0: 0.14, col: COL.A, n: 0, t: performance.now() }, { x0: 0.84, col: COL.B, n: 0, t: performance.now() }];
      if (extra != null) webs.push({ x0: extra, col: COL.C, n: 0, t: performance.now() });
    }
    restart();
    var S = 360, ctx, PAD = 44;
    function resize() { S = Math.min(fig.clientWidth, 440); ctx = sizeCanvas(c, S, S); }
    function X(x) { return PAD + x * (S - PAD - 14); }
    function Y(y) { return S - PAD - y * (S - PAD - 14); }
    function fixed() {
      var out = [], N = 2000, prev = f(0) - 0;
      for (var i = 1; i <= N; i++) {
        var x = i / N, v = f(x) - x;
        if ((v <= 0 && prev > 0) || (v >= 0 && prev < 0)) {
          var xs = x - 0.5 / N, h = 1e-4, d = (f(xs + h) - f(xs - h)) / (2 * h);
          out.push({ x: xs, stable: Math.abs(d) < 1 });
        }
        prev = v;
      }
      return out;
    }
    function orbit(x0, n) { var p = [x0]; for (var i = 0; i < n; i++) p.push(f(p[p.length - 1])); return p; }
    c.addEventListener('click', function (e) {
      e.stopPropagation();
      var p = pointerPos(c, e), x = clamp((p.x - PAD) / (S - PAD - 14), 0, 1);
      webs = webs.filter(function (w) { return w.col !== COL.C; });
      webs.push({ x0: x, col: COL.C, n: 0, t: performance.now() });
    });
    function draw(now) {
      ctx.clearRect(0, 0, S, S); ctx.fillStyle = COL.paper; ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = COL.border; ctx.lineWidth = 1; ctx.strokeRect(0.5, 0.5, S - 1, S - 1);
      // axes
      ctx.strokeStyle = COL.faint; ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(1), Y(0)); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(0), Y(1)); ctx.stroke();
      ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(1), Y(1)); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, 'reading now →', X(0.5), Y(0) + 16, COL.light, 'center', FONT_SMALL);
      ctx.save(); ctx.translate(X(0) - 16, Y(1)); ctx.rotate(-Math.PI / 2); text(ctx, 'reading next →', 0, 0, COL.light, 'right', FONT_SMALL); ctx.restore();
      text(ctx, 'none', X(0), Y(0) + 16, COL.faint, 'left', FONT_SMALL);
      text(ctx, 'total', X(1), Y(0) + 16, COL.faint, 'right', FONT_SMALL);
      // what is there
      ctx.strokeStyle = rgba(COL.ink, 0.5); ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.moveTo(X(st.e), Y(0)); ctx.lineTo(X(st.e), Y(1)); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, 'what is actually there', X(st.e) + 5, Y(1) + 4, COL.light, 'left', FONT_SMALL);
      // curve
      ctx.strokeStyle = COL.ink; ctx.lineWidth = 2; ctx.beginPath();
      for (var i = 0; i <= 200; i++) { var x = i / 200, yy = f(x); if (i) ctx.lineTo(X(x), Y(yy)); else ctx.moveTo(X(x), Y(yy)); }
      ctx.stroke();
      // cobwebs
      var ends = [];
      webs.forEach(function (w) {
        var steps = reduceMotion ? 40 : Math.min(40, Math.floor((now - w.t) / 260));
        var o = orbit(w.x0, steps);
        ctx.strokeStyle = w.col; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(o[0]), Y(0));
        for (var k = 0; k < o.length - 1; k++) { ctx.lineTo(X(o[k]), Y(o[k + 1])); ctx.lineTo(X(o[k + 1]), Y(o[k + 1])); }
        ctx.stroke();
        ctx.beginPath(); ctx.arc(X(o[0]), Y(0), 5, 0, 2 * Math.PI); ctx.fillStyle = w.col; ctx.fill();
        ends.push(o[o.length - 1]);
        w.done = steps >= 40;
      });
      fixed().forEach(function (p) {
        ctx.beginPath(); ctx.arc(X(p.x), Y(p.x), 5.5, 0, 2 * Math.PI);
        if (p.stable) { ctx.fillStyle = COL.ink; ctx.fill(); } else { ctx.fillStyle = COL.paper; ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 1.5; ctx.stroke(); }
      });
      var a = ends[0], b = ends[1];
      if (webs[0].done && webs[1].done) {
        status.textContent = Math.abs(a - b) < 0.03
          ? 'The two readers end in the same place, near what is actually there.'
          : 'Same experience, two readers, two different resting places. Each reading has become self-confirming.';
      } else status.textContent = 'Each step reads the experience through the framework, and the reading becomes the next experience.';
    }
    var lastRestart = performance.now();
    return {
      resize: function () { resize(); draw(performance.now()); },
      tick: function (now) {
        if (webs.every(function (w) { return w.done; }) && now - webs[0].t > 14000) restart();
        draw(now);
      }
    };
  }

  // =====================================================================
  // 5. WITNESSES — an object known only through its shadows (tomography)
  // =====================================================================
  function witnesses(fig, stage, ctrl) {
    var N = 96, R = N / 2;
    var truth = new Float32Array(N * N);
    function inEll(x, y, cx, cy, a, b, rot) {
      var c = Math.cos(rot), s = Math.sin(rot), dx = x - cx, dy = y - cy;
      var u = (dx * c + dy * s) / a, v = (-dx * s + dy * c) / b; return u * u + v * v <= 1;
    }
    for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) {
      var x = (i + 0.5) / R - 1, y = 1 - (j + 0.5) / R, v = 0;
      if (x * x + y * y > 0.92) { continue; }
      if (inEll(x, y, -0.18, 0.05, 0.56, 0.38, 25 * DEG)) v = 1;
      if (inEll(x, y, -0.1, 0.1, 0.2, 0.11, 25 * DEG)) v = 0;
      if (inEll(x, y, 0.5, -0.45, 0.15, 0.15, 0)) v = 0.85;
      if (inEll(x, y, 0.36, 0.48, 0.3, 0.05, -35 * DEG)) v = 0.65;
      if (inEll(x, y, -0.45, -0.52, 0.09, 0.2, 60 * DEG)) v = 0.5;
      truth[j * N + i] = v;
    }
    var row = el('div', 'viz-row', stage);
    var pL = el('div', 'viz-panel', row), pR = el('div', 'viz-panel', row);
    var cL = el('canvas', null, pL), cR = el('canvas', null, pR);
    cL.setAttribute('aria-label', 'A hidden object inside a circle, seen by witnesses from different directions; each witness only records a shadow');
    cR.setAttribute('aria-label', 'What all the shadows together determine: a reconstruction that sharpens as more different witnesses are added');
    el('div', 'viz-panel-label', pL, 'the hidden thing, and the witnesses’ shadows');
    var lblR = el('div', 'viz-panel-label', pR, 'what the shadows jointly determine');
    var note = el('div', 'viz-note', ctrl);
    var bar = el('div', 'viz-btns', ctrl);
    var mode = 'diverse', reveal = false;
    btnGroup(ctrl, [{ key: 'diverse', label: 'Witnesses who differ' }, { key: 'alike', label: 'Witnesses who agree' }], function (k) { mode = k; reset(); }, 'diverse');
    button(bar, 'Add a witness', function () { add(); auto = false; });
    button(bar, 'Start again', function () { reset(); });
    var rv = button(bar, 'Reveal the thing', function (b) { reveal = !reveal; b.textContent = reveal ? 'Hide the thing' : 'Reveal the thing'; drawL(); });
    var angles = [], acc = new Float32Array(N * N), lastProj = null, auto = true, nextAt = 0, MAX = 48;
    function angleFor(k) {
      var g = (k * 0.6180339887) % 1;
      return mode === 'diverse' ? g * 2 * Math.PI : (35 + (g - 0.5) * 22) * DEG;
    }
    function project(th) {
      var p = new Float32Array(N), nx = -Math.sin(th), ny = Math.cos(th);
      for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) {
        var v = truth[j * N + i]; if (!v) continue;
        var x = i + 0.5 - R, y = R - (j + 0.5), s = x * nx + y * ny + R - 0.5, b = Math.floor(s), fr = s - b;
        if (b >= 0 && b < N) p[b] += v * (1 - fr); if (b + 1 >= 0 && b + 1 < N) p[b + 1] += v * fr;
      }
      return p;
    }
    var kernel = (function () { var k = new Float32Array(2 * N + 1); for (var n = -N; n <= N; n++) k[n + N] = n === 0 ? 0.25 : (n % 2 ? -1 / (Math.PI * Math.PI * n * n) : 0); return k; })();
    function filt(p) {
      var q = new Float32Array(N);
      for (var a = 0; a < N; a++) { var s = 0; for (var b = 0; b < N; b++) s += p[b] * kernel[a - b + N]; q[a] = s; }
      return q;
    }
    function add() {
      if (angles.length >= MAX) return;
      var th = angleFor(angles.length + 1); angles.push(th);
      var p = project(th); lastProj = { th: th, p: p };
      var q = filt(p), nx = -Math.sin(th), ny = Math.cos(th);
      for (var j = 0; j < N; j++) for (var i = 0; i < N; i++) {
        var x = i + 0.5 - R, y = R - (j + 0.5); if (x * x + y * y > R * R) continue;
        var s = x * nx + y * ny + R - 0.5, b = Math.floor(s), fr = s - b;
        if (b >= 0 && b < N - 1) acc[j * N + i] += q[b] * (1 - fr) + q[b + 1] * fr;
      }
      drawL(); drawR(); upd();
    }
    function reset() { angles = []; acc = new Float32Array(N * N); lastProj = null; auto = true; nextAt = 0; drawL(); drawR(); upd(); }
    function upd() {
      var k = angles.length;
      note.textContent = k === 0 ? 'No witnesses yet. Nothing about the hidden thing is determined.'
        : (k === 1 ? 'One witness: a single shadow is consistent with countless different things.'
          : k + ' witnesses' + (mode === 'alike' ? ', all looking from nearly the same place. They agree with one another, and the picture stays smeared along their shared blind spot.'
            : ', each from a different angle. Where they disagree, the shape comes into focus.'));
    }
    var S = 300, ctxL, ctxR, off = document.createElement('canvas'); off.width = N; off.height = N;
    var octx = off.getContext('2d'), img = octx.createImageData(N, N);
    function resize() {
      var W = fig.clientWidth; S = W < 560 ? Math.min(W, 340) : Math.min(340, Math.floor((W - 20) / 2));
      ctxL = sizeCanvas(cL, S, S); ctxR = sizeCanvas(cR, S, S);
    }
    function drawImg(ctx, arr, scale, rad) {
      var d = img.data;
      for (var k = 0; k < N * N; k++) {
        var v = clamp(arr[k] * scale, 0, 1);
        var bg = [253, 252, 250], ink = [42, 42, 42];
        d[4 * k] = bg[0] + (ink[0] - bg[0]) * v; d[4 * k + 1] = bg[1] + (ink[1] - bg[1]) * v; d[4 * k + 2] = bg[2] + (ink[2] - bg[2]) * v; d[4 * k + 3] = 255;
      }
      octx.putImageData(img, 0, 0);
      ctx.save(); ctx.beginPath(); ctx.arc(S / 2, S / 2, rad, 0, 2 * Math.PI); ctx.clip();
      ctx.imageSmoothingEnabled = true; ctx.drawImage(off, S / 2 - rad, S / 2 - rad, 2 * rad, 2 * rad); ctx.restore();
    }
    function drawL() {
      var ctx = ctxL, rad = S * 0.3, cx = S / 2, cy = S / 2;
      ctx.clearRect(0, 0, S, S); ctx.fillStyle = COL.paper; ctx.fillRect(0, 0, S, S);
      if (reveal) drawImg(ctx, truth, 1, rad);
      else {
        ctx.beginPath(); ctx.arc(cx, cy, rad, 0, 2 * Math.PI); ctx.fillStyle = COL.bgAlt; ctx.fill();
        text(ctx, '?', cx, cy, COL.faint, 'center', '300 34px "Cormorant Garamond", Georgia, serif');
      }
      ctx.beginPath(); ctx.arc(cx, cy, rad, 0, 2 * Math.PI); ctx.strokeStyle = COL.faint; ctx.lineWidth = 1; ctx.stroke();
      // all witnesses as eyes on the rim
      angles.forEach(function (th, k) {
        var dx = Math.cos(th), dy = -Math.sin(th), last = k === angles.length - 1;
        var ex = cx - dx * (rad + 14), ey = cy - dy * (rad + 14);
        ctx.beginPath(); ctx.arc(ex, ey, last ? 4.5 : 3, 0, 2 * Math.PI); ctx.fillStyle = last ? COL.B : rgba(COL.B, 0.45); ctx.fill();
      });
      if (lastProj) {
        var th = lastProj.th, dx = Math.cos(th), dy = -Math.sin(th), nx = -dy, ny = dx, p = lastProj.p;
        ctx.strokeStyle = rgba(COL.B, 0.18); ctx.lineWidth = 1;
        for (var s = -0.9; s <= 0.9; s += 0.15) {
          var ox = cx + nx * s * rad, oy = cy + ny * s * rad;
          ctx.beginPath(); ctx.moveTo(ox - dx * rad * 1.1, oy - dy * rad * 1.1); ctx.lineTo(ox + dx * rad * 1.05, oy + dy * rad * 1.05); ctx.stroke();
        }
        var mx = 0; for (var i = 0; i < N; i++) mx = Math.max(mx, p[i]);
        ctx.beginPath();
        for (var b = 0; b < N; b++) {
          var sv = ((b + 0.5) / R - 1), h = mx ? p[b] / mx * S * 0.085 : 0;
          // s axis in the image is (−sin, cos) in math coords; canvas y is flipped
          var bx = cx + (-Math.sin(th)) * sv * rad, by = cy - Math.cos(th) * sv * rad;
          var qx = bx + dx * (rad + 6 + h), qy = by + dy * (rad + 6 + h);
          if (b) ctx.lineTo(qx, qy); else ctx.moveTo(qx, qy);
        }
        ctx.strokeStyle = COL.B; ctx.lineWidth = 1.5; ctx.stroke();
      }
      ctx.strokeStyle = COL.border; ctx.strokeRect(0.5, 0.5, S - 1, S - 1);
    }
    function drawR() {
      var ctx = ctxR, rad = S * 0.3;
      ctx.clearRect(0, 0, S, S); ctx.fillStyle = COL.paper; ctx.fillRect(0, 0, S, S);
      if (angles.length) drawImg(ctx, acc, Math.PI / angles.length / 1.0, rad);
      else { ctx.beginPath(); ctx.arc(S / 2, S / 2, rad, 0, 2 * Math.PI); ctx.fillStyle = COL.paper; ctx.fill(); }
      ctx.beginPath(); ctx.arc(S / 2, S / 2, rad, 0, 2 * Math.PI); ctx.strokeStyle = COL.faint; ctx.lineWidth = 1; ctx.stroke();
      ctx.strokeStyle = COL.border; ctx.strokeRect(0.5, 0.5, S - 1, S - 1);
    }
    upd();
    return {
      resize: function () { resize(); drawL(); drawR(); },
      tick: function (now) {
        if (!auto || angles.length >= MAX) return;
        if (reduceMotion) { while (angles.length < 24) add(); auto = false; return; }
        if (now > nextAt) { add(); nextAt = now + (angles.length < 6 ? 900 : 380); }
      }
    };
  }

  // =====================================================================
  // 6. PENROSE — locally consistent, globally impossible
  // =====================================================================
  function penrose(fig, stage, ctrl) {
    var c = el('canvas', null, stage); c.style.touchAction = 'none';
    c.setAttribute('aria-label', 'Three bars of cubes that look like a closed impossible triangle from one vantage point, and reveal a gap from every other');
    var note = el('div', 'viz-note', ctrl);
    var bar = el('div', 'viz-btns', ctrl);
    button(bar, 'Return to the one view where it closes', function () { goIso = true; idleAt = performance.now(); });
    el('div', 'viz-hint', ctrl, 'Drag to turn it.');
    var L = 6, cubes = [];
    for (var i = 0; i <= L; i++) cubes.push({ p: [i, 0, 0], col: COL.A });
    for (var j = 1; j <= L; j++) cubes.push({ p: [L, j, 0], col: COL.B });
    for (var k = 1; k < L; k++) cubes.push({ p: [L, L, k], col: COL.C });
    var cen = [0, 0, 0]; cubes.forEach(function (q) { cen[0] += q.p[0]; cen[1] += q.p[1]; cen[2] += q.p[2]; });
    cen = cen.map(function (v) { return v / cubes.length; });
    var ISO_A = 45 * DEG, ISO_B = Math.asin(1 / Math.sqrt(3));
    var st = { a: ISO_A + 0.5, b: ISO_B + 0.15 }, goIso = false, idleAt = -1e9, t0 = performance.now();
    var W = 600, H = 340, ctx;
    function resize() { W = fig.clientWidth; H = Math.round(clamp(W * 0.6, 280, 380)); ctx = sizeCanvas(c, W, H); }
    function shade(hex, f) {
      var n = parseInt(hex.slice(1), 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
      if (f > 1) { r += (255 - r) * (f - 1); g += (255 - g) * (f - 1); b += (255 - b) * (f - 1); } else { r *= f; g *= f; b *= f; }
      return 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ')';
    }
    var FACES = [
      { n: [1, 0, 0], v: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], f: 0.92 },
      { n: [0, 1, 0], v: [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]], f: 0.7 },
      { n: [0, 0, 1], v: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], f: 1.45 },
      { n: [-1, 0, 0], v: [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]], f: 0.8 },
      { n: [0, -1, 0], v: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]], f: 0.6 },
      { n: [0, 0, -1], v: [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]], f: 0.5 }
    ];
    function draw() {
      var a = st.a, b = st.b;
      var v = [Math.cos(b) * Math.cos(a), Math.cos(b) * Math.sin(a), Math.sin(b)];
      var r = [-Math.sin(a), Math.cos(a), 0];
      var up = [v[1] * r[2] - v[2] * r[1], v[2] * r[0] - v[0] * r[2], v[0] * r[1] - v[1] * r[0]];
      var sc = Math.min(W, H) / 10;
      function P(q) { var x = q[0] - cen[0], y = q[1] - cen[1], z = q[2] - cen[2]; return [W / 2 + sc * (x * r[0] + y * r[1] + z * r[2]), H / 2 - sc * (x * up[0] + y * up[1] + z * up[2])]; }
      function depth(q) { return (q[0] + 0.5) * v[0] + (q[1] + 0.5) * v[1] + (q[2] + 0.5) * v[2]; }
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = COL.paper; ctx.fillRect(0, 0, W, H);
      var order = cubes.slice().sort(function (p, q) { return depth(p.p) - depth(q.p); });
      order.forEach(function (cb) {
        FACES.forEach(function (F) {
          if (F.n[0] * v[0] + F.n[1] * v[1] + F.n[2] * v[2] <= 0) return;
          ctx.beginPath();
          F.v.forEach(function (o, i) { var s = P([cb.p[0] + o[0], cb.p[1] + o[1], cb.p[2] + o[2]]); if (i) ctx.lineTo(s[0], s[1]); else ctx.moveTo(s[0], s[1]); });
          ctx.closePath(); ctx.fillStyle = shade(cb.col, F.f); ctx.fill();
          ctx.strokeStyle = 'rgba(253,252,250,0.55)'; ctx.lineWidth = 0.8; ctx.stroke();
        });
      });
      ctx.strokeStyle = COL.border; ctx.lineWidth = 1; ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
      var dev = Math.hypot(st.a - ISO_A, st.b - ISO_B) / DEG;
      note.textContent = dev < 1.2
        ? 'From this one vantage point the three pieces close into a single object. Each corner, taken alone, is perfectly possible.'
        : 'From anywhere else you can see that the pieces never met. Every local join was consistent; the whole was not.';
    }
    drag(c, { move: function (p, dx, dy) { st.a -= dx * 0.008; st.b = clamp(st.b + dy * 0.006, -0.2, 1.3); goIso = false; idleAt = performance.now(); draw(); } });
    return {
      resize: function () { resize(); draw(); },
      tick: function (now) {
        if (goIso) {
          st.a += (ISO_A - st.a) * 0.08; st.b += (ISO_B - st.b) * 0.08;
          if (Math.hypot(st.a - ISO_A, st.b - ISO_B) < 1e-3) { st.a = ISO_A; st.b = ISO_B; goIso = false; }
          draw(); return;
        }
        if (reduceMotion || now - idleAt < 5000) return;
        // breathe: rest at the closing view, then swing away and back
        var T = 9000, ph = ((now - t0) % T) / T;
        var off = ph < 0.35 ? 0 : Math.sin((ph - 0.35) / 0.65 * Math.PI);
        var ta = ISO_A + 0.55 * off, tb = ISO_B + 0.12 * off;
        st.a += (ta - st.a) * 0.08; st.b += (tb - st.b) * 0.08;
        draw();
      }
    };
  }

  // ---------- registry & lifecycle ----------
  var BUILDERS = { atlas: atlas, frames: frames, erlangen: erlangen, fixedpoint: fixedpoint, witnesses: witnesses, penrose: penrose };
  var live = [];
  function build(fig) {
    if (fig._viz) return;
    var name = fig.getAttribute('data-viz'), B = BUILDERS[name];
    if (!B) return;
    var cap = fig.querySelector('figcaption');
    var stage = el('div', 'viz-stage'); var ctrl = el('div', 'viz-controls');
    fig.insertBefore(stage, cap); fig.insertBefore(ctrl, cap);
    fig.addEventListener('click', function (e) { e.stopPropagation(); });
    var inst = B(fig, stage, ctrl); inst.fig = fig; inst.visible = true; inst.w = fig.clientWidth;
    fig._viz = inst; inst.resize(); live.push(inst);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var fig = en.target;
      if (en.isIntersecting && fig.clientWidth > 0) build(fig);
      if (fig._viz) fig._viz.visible = en.isIntersecting;
    });
  }, { rootMargin: '200px 0px' });
  function loop(now) {
    live.forEach(function (v) {
      if (!v.visible || v.fig.clientWidth === 0) return;
      if (Math.abs(v.fig.clientWidth - v.w) > 1) { v.w = v.fig.clientWidth; v.resize(); }
      v.tick(now);
    });
    requestAnimationFrame(loop);
  }
  function init() {
    document.querySelectorAll('figure.viz[data-viz]').forEach(function (f) { io.observe(f); });
    requestAnimationFrame(loop);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
