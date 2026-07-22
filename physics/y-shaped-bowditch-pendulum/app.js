"use strict";

(function () {
  const P = window.BowditchPhysics;
  if (!P) throw new Error("BowditchPhysics failed to load");
  const FIXED_DT = BowditchPhysics.FIXED_DT;

  const ids = [
    "playPause", "stepOnce", "resetSim", "clearTrail", "downloadCsv", "exportPng",
    "presetSelect", "modelMode", "lowerLength", "upperLength", "supportSpacing",
    "gravity", "mass", "ampX", "ampY", "phase", "damping", "dampingSplit",
    "detune", "playbackSpeed", "trailLength", "apparatusCanvas", "traceCanvas",
    "seriesCanvas", "frequencyXVal", "frequencyYVal", "ratioVal", "ratioHint",
    "closureVal", "closureHint", "junctionDepthVal", "branchTensionVal", "timeVal",
    "modelNotice", "traceNote", "largeAngleWarning", "constraintWarning",
  ];
  const el = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));

  const outputMap = {
    lowerLength: ["lowerLengthOut", (v) => `${Number(v).toFixed(2)} m`],
    upperLength: ["upperLengthOut", (v) => `${Number(v).toFixed(3)} m`],
    supportSpacing: ["supportSpacingOut", (v) => `${Number(v).toFixed(2)} m`],
    gravity: ["gravityOut", (v) => `${Number(v).toFixed(2)} m/s²`],
    mass: ["massOut", (v) => `${Number(v).toFixed(2)} kg`],
    ampX: ["ampXOut", (v) => `${Number(v).toFixed(1)}°`],
    ampY: ["ampYOut", (v) => `${Number(v).toFixed(1)}°`],
    phase: ["phaseOut", (v) => `${Math.round(Number(v))}°`],
    damping: ["dampingOut", (v) => `${Number(v).toFixed(3)} s⁻¹`],
    dampingSplit: ["dampingSplitOut", (v) => `${Number(v) > 0 ? "+" : ""}${Math.round(Number(v))}%`],
    detune: ["detuneOut", (v) => `${Number(v) > 0 ? "+" : ""}${Number(v).toFixed(2)}%`],
    playbackSpeed: ["playbackSpeedOut", (v) => `${Number(v).toFixed(2)}×`],
    trailLength: ["trailLengthOut", (v) => `${Math.round(Number(v))} s`],
  };

  const presets = {
    threeTwo: {
      lowerLength: 0.8, upperLength: 1.16619, supportSpacing: 1.2,
      ampX: 12, ampY: 12, phase: 90, damping: 0.004, dampingSplit: 0,
      detune: 0, gravity: 9.81, mass: 0.25, modelMode: "linear", trailLength: 15,
    },
    twoOne: {
      lowerLength: 0.4, upperLength: 1.34164, supportSpacing: 1.2,
      ampX: 11, ampY: 11, phase: 90, damping: 0.002, dampingSplit: 0,
      detune: 0, gravity: 9.81, mass: 0.25, modelMode: "linear", trailLength: 12,
    },
    fourThree: {
      lowerLength: 0.9, upperLength: 0.86023, supportSpacing: 1.0,
      ampX: 13, ampY: 10, phase: 45, damping: 0.002, dampingSplit: 0,
      detune: 0, gravity: 9.81, mass: 0.25, modelMode: "linear", trailLength: 22,
    },
    nearOne: {
      lowerLength: 1.1, upperLength: 0.40792, supportSpacing: 0.8,
      ampX: 10, ampY: 10, phase: 90, damping: 0.002, dampingSplit: 0,
      detune: -3.44, gravity: 9.81, mass: 0.25, modelMode: "linear", trailLength: 12,
    },
    detuned: {
      lowerLength: 0.8, upperLength: 1.16619, supportSpacing: 1.2,
      ampX: 12, ampY: 12, phase: 90, damping: 0.002, dampingSplit: 0,
      detune: 0.55, gravity: 9.81, mass: 0.25, modelMode: "linear", trailLength: 35,
    },
    damped: {
      lowerLength: 0.8, upperLength: 1.16619, supportSpacing: 1.2,
      ampX: 15, ampY: 12, phase: 65, damping: 0.045, dampingSplit: 55,
      detune: 0, gravity: 9.81, mass: 0.25, modelMode: "linear", trailLength: 35,
    },
    nonlinear: {
      lowerLength: 0.8, upperLength: 1.16619, supportSpacing: 1.2,
      ampX: 24, ampY: 21, phase: 60, damping: 0.003, dampingSplit: 0,
      detune: 0, gravity: 9.81, mass: 0.25, modelMode: "nonlinear", trailLength: 35,
    },
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let running = !reducedMotion;
  let params;
  let simTime = 0;
  let currentState = null;
  let nonlinearState = null;
  let nonlinearAccumulator = 0;
  let trail = [];
  let series = [];
  let lastTimestamp = null;
  let lastSampleTime = -Infinity;
  let lastDiagnosticTime = -Infinity;

  function degrees(rad) { return rad * 180 / Math.PI; }
  function radians(deg) { return deg * Math.PI / 180; }
  function formatNumber(value, digits = 3) {
    return Number.isFinite(value) ? Number(value).toFixed(digits) : "—";
  }

  function refreshControlOutputs() {
    for (const [inputId, [outputId, formatter]] of Object.entries(outputMap)) {
      const output = document.getElementById(outputId);
      if (output && el[inputId]) output.textContent = formatter(el[inputId].value);
    }
  }

  function constrainGeometryControls(changedId = "") {
    const upper = Number(el.upperLength.value);
    const safeMax = Math.max(0.11, Math.min(2.2, 1.98 * upper));
    el.supportSpacing.max = safeMax.toFixed(3);
    if (Number(el.supportSpacing.value) >= 2 * upper || changedId === "upperLength" && Number(el.supportSpacing.value) > safeMax) {
      el.supportSpacing.value = safeMax.toFixed(3);
    }
  }

  function readParams() {
    constrainGeometryControls();
    const geometry = P.deriveGeometry({
      lowerLength: Number(el.lowerLength.value),
      upperLength: Number(el.upperLength.value),
      supportSpacing: Number(el.supportSpacing.value),
    });
    const meanBeta = Number(el.damping.value);
    const split = Number(el.dampingSplit.value) / 100;
    return {
      geometry,
      gravity: Number(el.gravity.value),
      mass: Number(el.mass.value),
      amplitudeX: radians(Number(el.ampX.value)),
      amplitudeY: radians(Number(el.ampY.value)),
      phase: radians(Number(el.phase.value)),
      betaX: meanBeta * (1 + split),
      betaY: meanBeta * (1 - split),
      detunePercent: Number(el.detune.value),
      playbackSpeed: Number(el.playbackSpeed.value),
      trailLength: Number(el.trailLength.value),
      modelMode: el.modelMode.value,
    };
  }

  function stateForCurrentModel() {
    if (params.modelMode === "nonlinear") return P.nonlinearView(nonlinearState, params);
    return P.linearState(params, simTime);
  }

  function appendSample(state, force = false) {
    if (!force && state.t - lastSampleTime < 1 / 90) return;
    const sample = {
      t: state.t, x: state.x, y: state.y, z: state.z,
      thetaX: state.thetaX, thetaY: state.thetaY,
      junction: state.junction,
      geometryClamped: state.geometryClamped,
    };
    trail.push(sample);
    series.push(sample);
    lastSampleTime = state.t;
    const cutoff = state.t - params.trailLength;
    const seriesCutoff = state.t - Math.min(12, params.trailLength);
    while (trail.length > 2 && trail[0].t < cutoff) trail.shift();
    while (series.length > 2 && series[0].t < seriesCutoff) series.shift();
    if (trail.length > 7000) trail.splice(0, trail.length - 7000);
    if (series.length > 1800) series.splice(0, series.length - 1800);
  }

  function resetSimulation(keepRunning = true) {
    params = readParams();
    simTime = 0;
    nonlinearAccumulator = 0;
    nonlinearState = P.createNonlinearState(params);
    currentState = stateForCurrentModel();
    trail = [];
    series = [];
    lastSampleTime = -Infinity;
    lastDiagnosticTime = -Infinity;
    appendSample(currentState, true);
    if (!keepRunning) setRunning(false);
    refreshControlOutputs();
    updateDiagnostics(currentState, true);
    drawAll();
  }

  function setRunning(next) {
    running = Boolean(next);
    el.playPause.setAttribute("aria-pressed", String(running));
    const icon = el.playPause.querySelector(".button-icon");
    const label = el.playPause.querySelector(".button-label");
    if (icon) icon.textContent = running ? "Ⅱ" : "▶";
    if (label) label.textContent = running ? "暫停" : "播放";
    lastTimestamp = null;
  }

  function advanceBy(delta) {
    if (params.modelMode === "linear") {
      simTime += delta;
      currentState = P.linearState(params, simTime);
    } else {
      nonlinearAccumulator += delta;
      let guard = 0;
      while (nonlinearAccumulator >= P.FIXED_DT && guard < 2400) {
        nonlinearState = P.advanceNonlinear(nonlinearState, params, P.FIXED_DT);
        nonlinearAccumulator -= P.FIXED_DT;
        guard += 1;
      }
      simTime = nonlinearState.t;
      currentState = P.nonlinearView(nonlinearState, params);
    }
    appendSample(currentState);
  }

  function resizeCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(280, Math.round(rect.width));
    const height = Math.max(160, Math.round(rect.height));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const pixelWidth = Math.round(width * dpr);
    const pixelHeight = Math.round(height * dpr);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    return { ctx, width, height, dpr };
  }

  function drawGrid(ctx, width, height, spacing = 36) {
    ctx.save();
    ctx.strokeStyle = "rgba(163, 199, 202, .075)";
    ctx.lineWidth = 1;
    for (let x = spacing; x < width; x += spacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = spacing; y < height; y += spacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }
    ctx.restore();
  }

  function drawLine(ctx, a, b, style, width = 2) {
    ctx.save();
    ctx.strokeStyle = style;
    ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    ctx.restore();
  }

  function drawApparatus() {
    const { ctx, width, height } = resizeCanvas(el.apparatusCanvas);
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#061c2a");
    gradient.addColorStop(1, "#0a2e3d");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    drawGrid(ctx, width, height, Math.max(32, Math.round(width / 14)));

    const g = params.geometry;
    const totalHeight = g.junctionDepth + g.lowerLength;
    const worldWidth = Math.max(g.supportSpacing, g.lowerLength * 1.4, .8);
    const scale = Math.min(width / (worldWidth * 2.05), height / ((totalHeight + .35) * 1.25));
    const cx = width * .50;
    const top = Math.max(34, height * .08);
    const project = (point) => ({
      x: cx + scale * (point.x + 0.42 * point.y),
      y: top + scale * (-point.z + 0.20 * point.y),
    });

    const anchorA = { x: -g.halfSpacing, y: 0, z: 0 };
    const anchorB = { x: g.halfSpacing, y: 0, z: 0 };
    const bob = { x: currentState.x, y: currentState.y, z: currentState.z };
    const a2 = project(anchorA);
    const b2 = project(anchorB);
    const j2 = project(currentState.junction);
    const p2 = project(bob);

    const floorZ = -(g.junctionDepth + g.lowerLength + .04);
    if (trail.length > 1) {
      ctx.save();
      ctx.strokeStyle = "rgba(24,184,170,.24)";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      trail.forEach((sample, i) => {
        const q = project({ x: sample.x, y: sample.y, z: floorZ });
        if (i === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y);
      });
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.strokeStyle = "rgba(235,246,244,.95)";
    ctx.shadowColor = "rgba(255,255,255,.22)";
    ctx.shadowBlur = 4;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(a2.x, a2.y); ctx.lineTo(j2.x, j2.y); ctx.lineTo(b2.x, b2.y); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.98)";
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(j2.x, j2.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "#f0a329";
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(a2.x - 18, a2.y - 2); ctx.lineTo(b2.x + 18, b2.y - 2); ctx.stroke();
    for (const point of [a2, b2]) {
      ctx.fillStyle = "#ffd083";
      ctx.beginPath(); ctx.arc(point.x, point.y, 5.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();

    ctx.fillStyle = "#e7f4f2";
    ctx.beginPath(); ctx.arc(j2.x, j2.y, 4.5, 0, Math.PI * 2); ctx.fill();
    const bobRadius = 10 + 7 * Math.sqrt(params.mass / 1.5);
    const bobGradient = ctx.createRadialGradient(p2.x - bobRadius * .35, p2.y - bobRadius * .4, 2, p2.x, p2.y, bobRadius * 1.2);
    bobGradient.addColorStop(0, "#b8fff6");
    bobGradient.addColorStop(.28, "#21c9bb");
    bobGradient.addColorStop(1, "#08746d");
    ctx.save();
    ctx.shadowColor = "rgba(24,184,170,.62)";
    ctx.shadowBlur = 18;
    ctx.fillStyle = bobGradient;
    ctx.beginPath(); ctx.arc(p2.x, p2.y, bobRadius, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    const axisOrigin = { x: 46, y: height - 38 };
    drawLine(ctx, axisOrigin, { x: axisOrigin.x + 62, y: axisOrigin.y }, "#18b8aa", 2.2);
    drawLine(ctx, axisOrigin, { x: axisOrigin.x + 28, y: axisOrigin.y - 32 }, "#f0a329", 2.2);
    ctx.fillStyle = "#8fe1d9"; ctx.font = "12px monospace"; ctx.fillText("x ∥", axisOrigin.x + 68, axisOrigin.y + 4);
    ctx.fillStyle = "#ffc76e"; ctx.fillText("y ⟂", axisOrigin.x + 31, axisOrigin.y - 35);

    if (width > 480) {
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "rgba(224,240,238,.72)";
      ctx.fillText(`S = ${g.upperLength.toFixed(3)} m`, Math.max(16, a2.x - 8), (a2.y + j2.y) / 2);
      ctx.fillText(`ℓ = ${g.lowerLength.toFixed(2)} m`, j2.x + 12, (j2.y + p2.y) / 2);
      ctx.fillText("接點", j2.x + 9, j2.y - 8);
    }
  }

  function traceTransform(width, height) {
    const pad = Math.max(34, width * .075);
    const xMax = Math.abs(params.geometry.lowerLength * Math.sin(params.amplitudeX));
    const yMax = Math.abs(params.geometry.longLength * Math.sin(params.amplitudeY));
    const extent = Math.max(.055, xMax, yMax) * 1.18;
    const scale = Math.min((width - 2 * pad) / (2 * extent), (height - 2 * pad) / (2 * extent));
    return {
      map: (x, y) => ({ x: width / 2 + x * scale, y: height / 2 - y * scale }),
      scale, extent, pad,
    };
  }

  function drawTrace() {
    const { ctx, width, height } = resizeCanvas(el.traceCanvas);
    const gradient = ctx.createRadialGradient(width * .5, height * .45, 0, width * .5, height * .5, Math.max(width, height) * .7);
    gradient.addColorStop(0, "#0a3041");
    gradient.addColorStop(1, "#061b29");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    drawGrid(ctx, width, height, Math.max(32, Math.round(width / 14)));
    const tr = traceTransform(width, height);
    const origin = tr.map(0, 0);
    drawLine(ctx, { x: tr.pad, y: origin.y }, { x: width - tr.pad, y: origin.y }, "rgba(24,184,170,.42)", 1.2);
    drawLine(ctx, { x: origin.x, y: tr.pad }, { x: origin.x, y: height - tr.pad }, "rgba(240,163,41,.42)", 1.2);

    if (params.modelMode === "linear") {
      const f = P.modeFrequencies(params.geometry, params.gravity, params.detunePercent);
      const closure = P.closureMetrics(f, 12);
      const duration = closure.closes && closure.closureTime < 50 ? closure.closureTime : Math.min(32, params.trailLength * 1.5);
      const samples = Math.min(1600, Math.max(420, Math.round(duration * 90)));
      ctx.save();
      ctx.strokeStyle = "rgba(163, 211, 209, .20)";
      ctx.lineWidth = 1.1;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      for (let i = 0; i <= samples; i += 1) {
        const s = P.linearState(params, duration * i / samples);
        const q = tr.map(s.x, s.y);
        if (i === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y);
      }
      ctx.stroke();
      ctx.restore();
    }

    if (trail.length > 1) {
      for (let i = 1; i < trail.length; i += 1) {
        const a = tr.map(trail[i - 1].x, trail[i - 1].y);
        const b = tr.map(trail[i].x, trail[i].y);
        const fraction = i / trail.length;
        ctx.strokeStyle = `rgba(${Math.round(40 + 210 * fraction)}, ${Math.round(165 + 25 * fraction)}, ${Math.round(145 - 90 * fraction)}, ${0.12 + 0.82 * fraction})`;
        ctx.lineWidth = 1.1 + 1.5 * fraction;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }

    const now = tr.map(currentState.x, currentState.y);
    ctx.save();
    ctx.shadowColor = "rgba(255,198,94,.75)";
    ctx.shadowBlur = 13;
    ctx.fillStyle = "#ffd077";
    ctx.beginPath(); ctx.arc(now.x, now.y, 5.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    ctx.font = "12px monospace";
    ctx.fillStyle = "#72d8cf"; ctx.fillText("x ∥", width - tr.pad - 22, origin.y - 9);
    ctx.fillStyle = "#f5b84f"; ctx.fillText("y ⟂", origin.x + 9, tr.pad + 4);
    ctx.fillStyle = "rgba(198,219,219,.62)";
    ctx.fillText(`±${tr.extent.toFixed(2)} m`, 12, 20);
  }

  function drawSeries() {
    const { ctx, width, height } = resizeCanvas(el.seriesCanvas);
    ctx.fillStyle = "#061b29";
    ctx.fillRect(0, 0, width, height);
    drawGrid(ctx, width, height, Math.max(34, Math.round(width / 26)));
    const pad = { left: 48, right: 20, top: 20, bottom: 30 };
    const windowSeconds = Math.min(12, params.trailLength);
    const endT = Math.max(windowSeconds, currentState.t);
    const startT = endT - windowSeconds;
    const ampMax = Math.max(3, Number(el.ampX.value), Number(el.ampY.value)) * 1.18;
    const map = (t, theta) => ({
      x: pad.left + (t - startT) / windowSeconds * (width - pad.left - pad.right),
      y: height / 2 - degrees(theta) / ampMax * (height - pad.top - pad.bottom) / 2,
    });
    drawLine(ctx, { x: pad.left, y: height / 2 }, { x: width - pad.right, y: height / 2 }, "rgba(214,231,231,.22)", 1);

    const drawSignal = (key, color) => {
      const visible = series.filter((s) => s.t >= startT);
      if (visible.length < 2) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      visible.forEach((s, i) => {
        const q = map(s.t, s[key]);
        if (i === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y);
      });
      ctx.stroke();
    };
    drawSignal("thetaX", "#18b8aa");
    drawSignal("thetaY", "#f0a329");

    ctx.font = "11px monospace";
    ctx.fillStyle = "rgba(203,223,222,.66)";
    ctx.fillText(`+${ampMax.toFixed(0)}°`, 8, pad.top + 4);
    ctx.fillText("0°", 20, height / 2 + 4);
    ctx.fillText(`−${ampMax.toFixed(0)}°`, 8, height - pad.bottom + 4);
    ctx.fillText(`${startT.toFixed(1)} s`, pad.left, height - 9);
    ctx.fillText(`${endT.toFixed(1)} s`, width - pad.right - 45, height - 9);
  }

  function updateDiagnostics(state, force = false) {
    if (!force && state.t - lastDiagnosticTime < .08) {
      el.timeVal.textContent = state.t.toFixed(2);
      return;
    }
    lastDiagnosticTime = state.t;
    const f = P.modeFrequencies(params.geometry, params.gravity, params.detunePercent);
    const closure = P.closureMetrics(f, 12);
    const tension = params.mass * params.gravity * params.geometry.upperTensionFactor;
    el.frequencyXVal.textContent = `${formatNumber(f.frequencyX, 3)} Hz`;
    el.frequencyYVal.textContent = `${formatNumber(f.frequencyY, 3)} Hz`;
    el.ratioVal.textContent = formatNumber(f.ratio, 4);
    el.ratioHint.textContent = `小角度線性基準；最接近 ${closure.p}:${closure.q}（誤差 ${(closure.relativeError * 100).toFixed(3)}%）`;
    const hasDamping = params.betaX > 1e-8 || params.betaY > 1e-8;
    if (params.modelMode === "nonlinear") {
      el.closureVal.textContent = `${closure.p}:${closure.q} 線性基準`;
      el.closureHint.textContent = `大振幅下需由數值週期判定`;
    } else if (closure.closes && hasDamping) {
      el.closureVal.textContent = `${closure.p}:${closure.q} 理想候選`;
      el.closureHint.textContent = `理想無阻尼閉合 ${closure.closureTime.toFixed(2)} s；目前有阻尼，軌跡收縮`;
    } else if (closure.closes) {
      el.closureVal.textContent = `${closure.p}:${closure.q} 近閉合`;
      el.closureHint.textContent = `理想無阻尼候選時間 ${closure.closureTime.toFixed(2)} s`;
    } else {
      el.closureVal.textContent = `線性基準不閉合`;
      el.closureHint.textContent = `每候選週期滑移 ${degrees(closure.phaseSlipPerCandidateCycle).toFixed(1)}°`;
    }
    el.junctionDepthVal.textContent = `${params.geometry.junctionDepth.toFixed(3)} m`;
    el.branchTensionVal.textContent = `${tension.toFixed(2)} N`;
    el.timeVal.textContent = state.t.toFixed(2);

    if (params.modelMode === "linear") {
      el.modelNotice.innerHTML = `<strong>小角度線性模型：</strong>兩主模態以解析式疊加；淡線可直接預覽理論路徑。頻率微調只施加在平行模態。`;
      el.traceNote.textContent = `線性模式：淡線為小角度模型的預測路徑；亮線為實際播放累積軌跡。`;
    } else {
      el.modelNotice.innerHTML = `<strong>非線性獨立模態近似：</strong>以固定步長 ${P.FIXED_DT.toFixed(5)} s 的 RK4 積分兩個 sin θ 非線性方程；不等同完整三維弦張力耦合。`;
      el.traceNote.textContent = `非線性模式：只顯示 RK4 數值積分的累積軌跡；上方頻率比與閉合候選僅是小角度線性基準。`;
    }
    el.largeAngleWarning.hidden = Math.max(Number(el.ampX.value), Number(el.ampY.value)) <= 12;
    el.constraintWarning.hidden = !state.geometryClamped;
  }

  function drawAll() {
    if (!currentState || !params) return;
    drawApparatus();
    drawTrace();
    drawSeries();
  }

  function applyPreset(name) {
    const preset = presets[name] || presets.threeTwo;
    for (const [key, value] of Object.entries(preset)) {
      if (el[key]) el[key].value = String(value);
    }
    constrainGeometryControls();
    refreshControlOutputs();
    resetSimulation();
  }

  function buildExportSamples() {
    const f = P.modeFrequencies(params.geometry, params.gravity, params.detunePercent);
    const closure = P.closureMetrics(f, 12);
    const duration = Math.min(30, closure.closes && closure.closureTime ? Math.max(6, closure.closureTime) : 12);
    const dt = 1 / 120;
    const samples = [];
    if (params.modelMode === "linear") {
      for (let t = 0; t <= duration + 1e-9; t += dt) samples.push(P.linearState(params, t));
    } else {
      let state = P.createNonlinearState(params);
      samples.push(P.nonlinearView(state, params));
      while (state.t < duration) {
        state = P.advanceNonlinear(state, params, P.FIXED_DT);
        if (samples.length === 0 || state.t - samples[samples.length - 1].t >= dt - 1e-6) samples.push(P.nonlinearView(state, params));
      }
    }
    return samples;
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1200);
  }

  function downloadCsv() {
    const samples = buildExportSamples();
    const lines = ["time_s,x_m,y_m,z_m,theta_parallel_deg,theta_perpendicular_deg,model"];
    for (const s of samples) {
      lines.push([
        s.t.toFixed(6), s.x.toFixed(8), s.y.toFixed(8), s.z.toFixed(8),
        degrees(s.thetaX).toFixed(6), degrees(s.thetaY).toFixed(6), params.modelMode,
      ].join(","));
    }
    const ratio = P.modeFrequencies(params.geometry, params.gravity, params.detunePercent).ratio.toFixed(3).replace(".", "-");
    triggerDownload(new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" }), `bowditch-pendulum-ratio-${ratio}.csv`);
  }

  function exportPng() {
    const out = document.createElement("canvas");
    out.width = 1600;
    out.height = 1040;
    const ctx = out.getContext("2d");
    ctx.fillStyle = "#f3f7f6";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.fillStyle = "#061b29";
    ctx.font = "700 42px sans-serif";
    ctx.fillText("Y 型擺 · Bowditch Pendulum", 62, 72);
    ctx.fillStyle = "#526b75";
    ctx.font = "22px monospace";
    const f = P.modeFrequencies(params.geometry, params.gravity, params.detunePercent);
    ctx.fillText(`f∥/f⟂ = ${f.ratio.toFixed(4)}   t = ${currentState.t.toFixed(2)} s   model = ${params.modelMode}`, 62, 112);
    ctx.drawImage(el.apparatusCanvas, 55, 150, 720, 530);
    ctx.drawImage(el.traceCanvas, 825, 150, 720, 530);
    ctx.drawImage(el.seriesCanvas, 55, 720, 1490, 255);
    ctx.fillStyle = "#617681";
    ctx.font = "18px sans-serif";
    ctx.fillText("Generated locally by Y-shaped Pendulum Interactive Lab", 62, 1015);
    out.toBlob((blob) => {
      if (blob) triggerDownload(blob, "bowditch-pendulum-snapshot.png");
    }, "image/png");
  }

  function frame(timestamp) {
    if (running && lastTimestamp !== null) {
      const wallDelta = Math.min(.05, Math.max(0, (timestamp - lastTimestamp) / 1000));
      advanceBy(wallDelta * params.playbackSpeed);
      updateDiagnostics(currentState);
      drawAll();
    }
    lastTimestamp = timestamp;
    requestAnimationFrame(frame);
  }

  el.playPause.addEventListener("click", () => setRunning(!running));
  el.stepOnce.addEventListener("click", () => {
    setRunning(false);
    advanceBy(1 / 30);
    updateDiagnostics(currentState, true);
    drawAll();
  });
  el.resetSim.addEventListener("click", () => resetSimulation());
  el.clearTrail.addEventListener("click", () => {
    trail = [];
    series = [];
    lastSampleTime = -Infinity;
    appendSample(currentState, true);
    drawAll();
  });
  el.downloadCsv.addEventListener("click", downloadCsv);
  el.exportPng.addEventListener("click", exportPng);
  el.presetSelect.addEventListener("change", () => applyPreset(el.presetSelect.value));

  const resetIds = [
    "modelMode", "lowerLength", "upperLength", "supportSpacing", "gravity",
    "ampX", "ampY", "phase", "damping", "dampingSplit", "detune",
  ];
  for (const id of resetIds) {
    el[id].addEventListener("input", () => {
      constrainGeometryControls(id);
      refreshControlOutputs();
      resetSimulation();
    });
  }
  for (const id of ["mass", "playbackSpeed", "trailLength"]) {
    el[id].addEventListener("input", () => {
      params = readParams();
      refreshControlOutputs();
      updateDiagnostics(currentState, true);
      drawAll();
    });
  }

  window.addEventListener("resize", drawAll, { passive: true });
  document.addEventListener("visibilitychange", () => { lastTimestamp = null; });

  refreshControlOutputs();
  resetSimulation();
  setRunning(!reducedMotion);
  requestAnimationFrame(frame);
})();
