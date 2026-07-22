/* Bowditch / Y-shaped pendulum physics core.
 * Principal-axis model: x is parallel to the support line (short mode),
 * y is perpendicular to it (long mode). All exported functions are pure.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.BowditchPhysics = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const FIXED_DT = 1 / 240;
  const EPS = 1e-12;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function deriveGeometry({ lowerLength, upperLength, supportSpacing }) {
    const lower = Number(lowerLength);
    const upper = Number(upperLength);
    const spacing = Number(supportSpacing);
    if (!(lower > 0) || !(upper > 0) || !(spacing >= 0)) {
      throw new RangeError("Lengths must be positive and support spacing non-negative.");
    }
    const halfSpacing = spacing / 2;
    if (halfSpacing >= upper) {
      throw new RangeError("Each upper branch must exceed half the support spacing.");
    }
    const junctionDepth = Math.sqrt(Math.max(EPS, upper * upper - halfSpacing * halfSpacing));
    const shortLength = lower;
    const longLength = lower + junctionDepth;
    const branchAngle = Math.atan2(halfSpacing, junctionDepth);
    const upperTensionFactor = upper / (2 * junctionDepth); // each branch, in units of mg at rest
    return {
      lowerLength: lower,
      upperLength: upper,
      supportSpacing: spacing,
      halfSpacing,
      junctionDepth,
      shortLength,
      longLength,
      branchAngle,
      upperTensionFactor,
    };
  }

  function modeFrequencies(geometry, gravity = 9.81, detunePercent = 0) {
    const g = Number(gravity);
    if (!(g > 0)) throw new RangeError("Gravity must be positive.");
    const detune = 1 + Number(detunePercent) / 100;
    const omegaXIdeal = Math.sqrt(g / geometry.shortLength);
    const omegaY = Math.sqrt(g / geometry.longLength);
    const omegaX = omegaXIdeal * detune;
    return {
      omegaX,
      omegaY,
      frequencyX: omegaX / (2 * Math.PI),
      frequencyY: omegaY / (2 * Math.PI),
      periodX: 2 * Math.PI / omegaX,
      periodY: 2 * Math.PI / omegaY,
      ratio: omegaX / omegaY,
      idealRatio: omegaXIdeal / omegaY,
    };
  }

  function nearestRational(value, maxDenominator = 12) {
    const x = Math.abs(Number(value));
    let best = { p: Math.round(x), q: 1, value: Math.round(x), error: Infinity };
    for (let q = 1; q <= maxDenominator; q += 1) {
      const p = Math.max(1, Math.round(x * q));
      const candidate = p / q;
      const error = Math.abs(candidate - x);
      if (error < best.error - EPS || (Math.abs(error - best.error) < EPS && q < best.q)) {
        best = { p, q, value: candidate, error };
      }
    }
    best.relativeError = x > EPS ? best.error / x : 0;
    return best;
  }

  function projectCoordinates(geometry, thetaX, thetaY) {
    const l = geometry.lowerLength;
    const h = geometry.junctionDepth;
    const x = l * Math.sin(thetaX);
    const y = (l + h) * Math.sin(thetaY);
    const junctionY = h * Math.sin(thetaY);
    const junctionZ = -h * Math.cos(thetaY);
    const lowerDy = y - junctionY;
    const horizontalSquared = x * x + lowerDy * lowerDy;
    const lowerDz = -Math.sqrt(Math.max(EPS, l * l - horizontalSquared));
    return {
      x,
      y,
      z: junctionZ + lowerDz,
      junction: { x: 0, y: junctionY, z: junctionZ },
      lowerDy,
      geometryClamped: horizontalSquared >= l * l,
    };
  }

  function linearState(params, time) {
    const {
      geometry,
      gravity = 9.81,
      detunePercent = 0,
      amplitudeX = 0.12,
      amplitudeY = 0.12,
      phase = Math.PI / 2,
      betaX = 0,
      betaY = 0,
    } = params;
    const t = Math.max(0, Number(time));
    const frequencies = modeFrequencies(geometry, gravity, detunePercent);
    const wx = Math.sqrt(Math.max(EPS, frequencies.omegaX ** 2 - betaX ** 2));
    const wy = Math.sqrt(Math.max(EPS, frequencies.omegaY ** 2 - betaY ** 2));
    const ex = Math.exp(-betaX * t);
    const ey = Math.exp(-betaY * t);
    const px = wx * t;
    const py = wy * t + phase;
    const thetaX = amplitudeX * ex * Math.cos(px);
    const thetaY = amplitudeY * ey * Math.cos(py);
    const thetaDotX = amplitudeX * ex * (-betaX * Math.cos(px) - wx * Math.sin(px));
    const thetaDotY = amplitudeY * ey * (-betaY * Math.cos(py) - wy * Math.sin(py));
    return {
      t,
      thetaX,
      thetaY,
      thetaDotX,
      thetaDotY,
      frequencies,
      ...projectCoordinates(geometry, thetaX, thetaY),
    };
  }

  function createNonlinearState(params) {
    const frequencies = modeFrequencies(params.geometry, params.gravity, params.detunePercent);
    const phaseX = 0;
    const phaseY = Number(params.phase || 0);
    return {
      t: 0,
      thetaX: params.amplitudeX * Math.cos(phaseX),
      thetaDotX: -params.amplitudeX * frequencies.omegaX * Math.sin(phaseX),
      thetaY: params.amplitudeY * Math.cos(phaseY),
      thetaDotY: -params.amplitudeY * frequencies.omegaY * Math.sin(phaseY),
    };
  }

  function derivative(state, omega0, beta) {
    return {
      theta: state.velocity,
      velocity: -2 * beta * state.velocity - omega0 * omega0 * Math.sin(state.theta),
    };
  }

  function rk4Step(state, dt, omega0, beta = 0) {
    const s1 = { theta: state.theta, velocity: state.velocity };
    const k1 = derivative(s1, omega0, beta);
    const s2 = {
      theta: state.theta + 0.5 * dt * k1.theta,
      velocity: state.velocity + 0.5 * dt * k1.velocity,
    };
    const k2 = derivative(s2, omega0, beta);
    const s3 = {
      theta: state.theta + 0.5 * dt * k2.theta,
      velocity: state.velocity + 0.5 * dt * k2.velocity,
    };
    const k3 = derivative(s3, omega0, beta);
    const s4 = {
      theta: state.theta + dt * k3.theta,
      velocity: state.velocity + dt * k3.velocity,
    };
    const k4 = derivative(s4, omega0, beta);
    return {
      theta: state.theta + (dt / 6) * (k1.theta + 2 * k2.theta + 2 * k3.theta + k4.theta),
      velocity: state.velocity + (dt / 6) * (k1.velocity + 2 * k2.velocity + 2 * k3.velocity + k4.velocity),
    };
  }

  function advanceNonlinear(state, params, dt = FIXED_DT) {
    const frequencies = modeFrequencies(params.geometry, params.gravity, params.detunePercent);
    const x = rk4Step(
      { theta: state.thetaX, velocity: state.thetaDotX },
      dt,
      frequencies.omegaX,
      params.betaX || 0,
    );
    const y = rk4Step(
      { theta: state.thetaY, velocity: state.thetaDotY },
      dt,
      frequencies.omegaY,
      params.betaY || 0,
    );
    return {
      t: state.t + dt,
      thetaX: x.theta,
      thetaDotX: x.velocity,
      thetaY: y.theta,
      thetaDotY: y.velocity,
    };
  }

  function nonlinearView(state, params) {
    return {
      ...state,
      frequencies: modeFrequencies(params.geometry, params.gravity, params.detunePercent),
      ...projectCoordinates(params.geometry, state.thetaX, state.thetaY),
    };
  }

  function closureMetrics(frequencies, maxDenominator = 12, tolerance = 0.0015) {
    const rational = nearestRational(frequencies.ratio, maxDenominator);
    const closes = rational.relativeError <= tolerance;
    const baseOmega = frequencies.omegaX / rational.p;
    return {
      ...rational,
      closes,
      closureTime: closes ? 2 * Math.PI / baseOmega : null,
      phaseSlipPerCandidateCycle: 2 * Math.PI * rational.q * (frequencies.ratio - rational.value),
    };
  }

  return {
    FIXED_DT,
    clamp,
    deriveGeometry,
    modeFrequencies,
    nearestRational,
    projectCoordinates,
    linearState,
    createNonlinearState,
    rk4Step,
    advanceNonlinear,
    nonlinearView,
    closureMetrics,
  };
});
