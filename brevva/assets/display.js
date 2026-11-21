/* brevva keys: the worked example in the hero, played once like the keyboard's
   listening display. The page is complete without this file: the HTML already shows
   the finished state. Under Reduce Motion nothing moves; the LED strip is drawn once.
   The whole run is under five seconds and never loops (WCAG 2.2.2). */
(function () {
  var demo = document.getElementById("demo");
  if (!demo) return;
  var canvas = demo.querySelector(".leds canvas");
  var strip = demo.querySelector(".leds");
  var said = demo.querySelector("[data-said]");
  var typed = demo.querySelector("[data-typed]");
  var status = demo.querySelector("[data-status]");
  var count = demo.querySelector(".count");
  var replay = demo.querySelector("[data-replay]");
  var rec = demo.querySelector(".rec");
  var still = window.matchMedia("(prefers-reduced-motion: reduce)");

  var saidHTML = said.innerHTML, typedHTML = typed.innerHTML;
  var statusText = status.textContent, countText = count.textContent;

  // The words as they were spoken, each marked if the tidy takes it out.
  var tokens = [];
  Array.prototype.forEach.call(said.childNodes, function (n) {
    var cut = n.nodeName === "DEL";
    (n.textContent || "").split(/\s+/).forEach(function (w) { if (w) tokens.push({ w: w, cut: cut }); });
  });
  function escape(s) { return s.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function render(n) {
    var out = [];
    for (var i = 0; i < n; i++) out.push(tokens[i].cut ? "<del>" + escape(tokens[i].w) + "</del>" : escape(tokens[i].w));
    return out.join(" ");
  }

  // ---- the LED strip ----
  var ctx = canvas.getContext && canvas.getContext("2d");
  if (!ctx) return;
  strip.classList.remove("static");
  var W = 0, H = 0, dpr = 1, history = [];
  for (var h = 0; h < 32; h++) history.push(0);

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = strip.clientWidth; H = strip.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  }
  function mix(a, b, t) { return Math.round(a + (b - a) * t); }
  function colour(along, alpha) {           // amber at the ends, ember in the middle
    var k = 1 - Math.abs(along - 0.5) * 2;
    return "rgba(" + 255 + "," + mix(176, 120, k) + "," + mix(61, 41, k) + "," + alpha + ")";
  }
  function dot(x, y, s, fill) {
    var r = s * 0.28;
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + s - r, y); ctx.quadraticCurveTo(x + s, y, x + s, y + r);
    ctx.lineTo(x + s, y + s - r); ctx.quadraticCurveTo(x + s, y + s, x + s - r, y + s);
    ctx.lineTo(x + r, y + s); ctx.quadraticCurveTo(x, y + s, x, y + s - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.fillStyle = fill; ctx.fill();
  }
  // level(d, half) gives 0..1 for a column d steps from the middle
  function draw(level, t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var rows = 9, pitch = H / rows, s = pitch * 0.62;
    var cols = Math.max(9, Math.floor(W / pitch) | 1), mid = (cols - 1) / 2, midRow = 4;
    var x0 = (W - cols * pitch) / 2;
    var lit = [];
    for (var c = 0; c < cols; c++) {
      var d = Math.abs(c - mid), along = c / (cols - 1);
      var flick = t == null ? 1 : 0.72 + 0.28 * (Math.sin(c * 1.9 + t * 9) * 0.5 + 0.5);
      var reach = level(d, mid) * flick * midRow + 0.35;
      for (var r = 0; r < rows; r++) {
        var x = x0 + c * pitch + (pitch - s) / 2, y = r * pitch + (pitch - s) / 2;
        var from = Math.abs(r - midRow);
        if (from <= reach) lit.push([x, y, Math.max(0.35, 1 - from / (midRow + 1) * 0.55), along]);
        else dot(x, y, s, "rgba(255,255,255,.07)");
      }
    }
    ctx.save(); ctx.shadowBlur = 8; ctx.shadowColor = "rgba(255,150,50,.55)";
    lit.forEach(function (p) { dot(p[0], p[1], s, colour(p[3], p[2])); });
    ctx.restore();
  }
  function voiceLevel(d, half) {
    var edge = d / half, i = history.length - 1 - Math.round(edge * (history.length - 1));
    return i < 0 ? 0 : history[i] * (1 - edge * edge * 0.7);
  }
  function restLevel(d, half) {             // the settled display: a low line, brighter in the middle
    var edge = d / half;
    return d === 0 ? 0.3 : 0.06 * (1 - edge);
  }

  // ---- the run ----
  var running = false, timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function finish() {
    running = false;
    timers.forEach(clearTimeout); timers = [];
    said.innerHTML = saidHTML; typed.innerHTML = typedHTML;
    said.classList.remove("raw");
    status.textContent = statusText; count.textContent = countText;
    rec.classList.remove("live");
    demo.removeAttribute("aria-busy");
    draw(restLevel, null);
    replay.hidden = false;
  }
  function play() {
    if (running) return;
    running = true; replay.hidden = true;
    demo.setAttribute("aria-busy", "true");
    rec.classList.add("live");
    status.textContent = "Listening";
    said.classList.add("raw"); said.innerHTML = "";
    typed.innerHTML = '<span class="wait">…</span>';
    count.textContent = "0 words";
    var start = performance.now(), shown = 0, step = 200;
    for (var i = 0; i < history.length; i++) history[i] = 0;
    (function frame(now) {
      if (!running) return;
      var t = (now - start) / 1000;
      var listening = shown < tokens.length;
      var syllable = Math.max(0, Math.sin(t * 9 + Math.sin(t * 2.1) * 2)) * (0.5 + 0.5 * Math.sin(t * 1.3));
      var peak = listening ? 0.03 + syllable * 0.34 + Math.random() * 0.05 : 0;
      var shaped = Math.min(1, Math.sqrt(peak) * 1.2), last = history[history.length - 1];
      var level = shaped > last ? last * 0.35 + shaped * 0.65 : last * 0.82 + shaped * 0.18;
      history.shift(); history.push(level);
      draw(voiceLevel, t);
      requestAnimationFrame(frame);
    })(start);
    tokens.forEach(function (_, i) {
      later(function () {
        shown = i + 1;
        said.innerHTML = render(shown);
        count.textContent = shown + (shown === 1 ? " word" : " words");
      }, 250 + i * step);
    });
    var heard = 250 + tokens.length * step;
    later(function () { status.textContent = "Tidying"; rec.classList.remove("live"); said.classList.remove("raw"); }, heard + 150);
    later(finish, heard + 750);
  }

  size();
  draw(restLevel, null);
  addEventListener("resize", function () { size(); if (!running) draw(restLevel, null); }, { passive: true });
  if (still.matches) return;          // no motion: the finished display, drawn once

  replay.addEventListener("click", play);
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { io.disconnect(); play(); }
    }, { threshold: 0.45 });
    io.observe(demo);
  } else {
    play();
  }
})();
