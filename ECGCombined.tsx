import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// ─── Heartbeat generation ────────────────────────────────────────────────────

function generateHeartbeatPoints(
  amplitude: number,
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const steps = 200;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let y = 0;

    if (t >= 0.05 && t < 0.2) {
      const pt = (t - 0.05) / 0.15;
      y = 0.12 * Math.sin(pt * Math.PI);
    } else if (t >= 0.25 && t < 0.32) {
      const pt = (t - 0.25) / 0.07;
      y = -0.1 * Math.sin(pt * Math.PI);
    } else if (t >= 0.32 && t < 0.42) {
      const pt = (t - 0.32) / 0.1;
      y = 1.0 * Math.sin(pt * Math.PI);
    } else if (t >= 0.42 && t < 0.5) {
      const pt = (t - 0.42) / 0.08;
      y = -0.25 * Math.sin(pt * Math.PI);
    } else if (t >= 0.55 && t < 0.75) {
      const pt = (t - 0.55) / 0.2;
      y = 0.2 * Math.sin(pt * Math.PI);
    }

    points.push({ x: t, y: y * amplitude });
  }

  return points;
}

type Beat = { startFrame: number; widthPx: number; amplitude: number };

function buildBeats(fps: number): Beat[] {
  const beats: Beat[] = [];
  beats.push({ startFrame: Math.round(0.6 * fps), widthPx: 60, amplitude: 0.25 });
  beats.push({ startFrame: Math.round(1.4 * fps), widthPx: 80, amplitude: 0.45 });
  beats.push({ startFrame: Math.round(2.3 * fps), widthPx: 120, amplitude: 0.85 });
  const normalStart = 3.2;
  for (let i = 0; i < 1; i++) {
    beats.push({
      startFrame: Math.round((normalStart + i) * fps),
      widthPx: 140,
      amplitude: 1.0,
    });
  }
  return beats;
}

// ─── Letter definitions ──────────────────────────────────────────────────────

const LETTERS: Record<string, { x: number; y: number }[]> = {
  A: [
    { x: 0, y: 0 }, { x: 0.48, y: 1 }, { x: 0.53, y: 0.42 },
    { x: 0.6, y: 0.42 }, { x: 1, y: 0 },
  ],
  N: [
    { x: 0, y: 0 }, { x: 0.12, y: 1 }, { x: 0.72, y: 0 },
    { x: 0.88, y: 1 }, { x: 1, y: 0 },
  ],
  D: [
    { x: 0, y: 0 }, { x: 0.1, y: 1 }, { x: 0.5, y: 1 },
    { x: 0.85, y: 0.55 }, { x: 1, y: 0 },
  ],
  R: [
    { x: 0, y: 0 }, { x: 0.1, y: 1 }, { x: 0.35, y: 1 },
    { x: 0.5, y: 0.6 }, { x: 0.55, y: 0.45 }, { x: 1, y: 0 },
  ],
  E: [
    { x: 0, y: 0 }, { x: 0.1, y: 1 }, { x: 0.4, y: 1 },
    { x: 0.45, y: 0.5 }, { x: 0.65, y: 0.5 }, { x: 0.7, y: 0 },
    { x: 1, y: 0 },
  ],
  W: [
    { x: 0, y: 0 }, { x: 0.05, y: 1 }, { x: 0.27, y: 0 },
    { x: 0.5, y: 0.65 }, { x: 0.73, y: 0 }, { x: 0.95, y: 1 },
    { x: 1, y: 0 },
  ],
  C: [
    { x: 0, y: 0 }, { x: 0.08, y: 0.6 }, { x: 0.18, y: 1 },
    { x: 0.6, y: 1 }, { x: 0.8, y: 0.5 }, { x: 0.95, y: 0.1 },
    { x: 1, y: 0 },
  ],
  H: [
    { x: 0, y: 0 }, { x: 0.1, y: 1 }, { x: 0.18, y: 0.5 },
    { x: 0.82, y: 0.5 }, { x: 0.9, y: 1 }, { x: 1, y: 0 },
  ],
  L: [
    { x: 0, y: 0 }, { x: 0.12, y: 1 }, { x: 0.3, y: 1 },
    { x: 0.38, y: 0 }, { x: 1, y: 0 },
  ],
  O: [
    { x: 0, y: 0 }, { x: 0.2, y: 0.85 }, { x: 0.35, y: 1 },
    { x: 0.65, y: 1 }, { x: 0.8, y: 0.85 }, { x: 1, y: 0 },
  ],
};

function interpolateLetterY(
  points: { x: number; y: number }[],
  t: number,
): number {
  if (t <= points[0].x) return points[0].y;
  if (t >= points[points.length - 1].x) return points[points.length - 1].y;
  for (let i = 0; i < points.length - 1; i++) {
    if (t >= points[i].x && t <= points[i + 1].x) {
      const segT = (t - points[i].x) / (points[i + 1].x - points[i].x);
      return points[i].y + (points[i + 1].y - points[i].y) * segT;
    }
  }
  return 0;
}

// ─── Text layout ─────────────────────────────────────────────────────────────

const TEXT = "ANDREW CHARLWOOD";
const LETTER_WIDTH = 72;
const LETTER_GAP = 10;
const SPACE_WIDTH = 30;
const BASE_LEFT_INSET = 9;
const BASE_RIGHT_INSET = 0;

type LetterLayout = {
  char: string;
  startX: number;
  endX: number;
  startConnector: number;
  endConnector: number;
};

type ConnectorProfile = { leftInset: number; rightInset: number };

const CONNECTOR_PROFILES: Record<string, ConnectorProfile> = {
  C: { leftInset: 20, rightInset: 8 },
  O: { leftInset: 17, rightInset: 7 },
  D: { leftInset: 0, rightInset: 13 },
  L: { leftInset: 5, rightInset: 0 },
  E: { leftInset: 5, rightInset: 0 },
};

const DEFAULT_PROFILE: ConnectorProfile = { leftInset: 0, rightInset: 0 };

function layoutText(offsetX: number): LetterLayout[] {
  const layout: LetterLayout[] = [];
  let cursor = offsetX;

  for (const char of TEXT) {
    if (char === " ") {
      cursor += SPACE_WIDTH;
      continue;
    }
    const profile = CONNECTOR_PROFILES[char] ?? DEFAULT_PROFILE;
    const startX = cursor;
    const endX = cursor + LETTER_WIDTH;
    layout.push({
      char,
      startX,
      endX,
      startConnector: startX + BASE_LEFT_INSET + profile.leftInset,
      endConnector: endX - BASE_RIGHT_INSET - profile.rightInset,
    });
    cursor += LETTER_WIDTH + LETTER_GAP;
  }

  return layout;
}

function getTextTotalWidth(): number {
  return (
    TEXT.replace(/ /g, "").length * (LETTER_WIDTH + LETTER_GAP) -
    LETTER_GAP +
    (TEXT.split(" ").length - 1) * SPACE_WIDTH
  );
}

// ─── Timing constants ────────────────────────────────────────────────────────

const TRACE_SPEED = 350;
const HEAD_SCREEN_RATIO = 1;
const FLAT_GAP_SECONDS = 0.5;
const HOLD_SECONDS = 1.25;
const COMP_FPS = 60;

// How long the dot/line takes to exit the right side after text finishes
const EXIT_SECONDS = 1.5;

// Pre-compute duration for export
const _beats = buildBeats(COMP_FPS);
const _lastBeat = _beats[_beats.length - 1];
const _lastBeatEndWX = (_lastBeat.startFrame / COMP_FPS) * TRACE_SPEED + _lastBeat.widthPx;
const _textStartWX = _lastBeatEndWX + FLAT_GAP_SECONDS * TRACE_SPEED;
const _totalTextW = getTextTotalWidth();
const _textEndWX = _textStartWX + _totalTextW;
const _textEndFrame = Math.round((_textEndWX / TRACE_SPEED) * COMP_FPS);

export const ECGCOMBINED_DURATION = _textEndFrame + Math.round(HOLD_SECONDS * COMP_FPS) + Math.round(EXIT_SECONDS * COMP_FPS);

// ─── Component ───────────────────────────────────────────────────────────────

export const ECGCombined = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const baselineY = height * 0.5;
  const lineColor = "#00ff41";
  const ecgMaxDeflection = height * 0.28;
  const textMaxDeflection = height * 0.09;
  const beats = buildBeats(fps);

  // ── World-space text position ──
  const lastBeat = beats[beats.length - 1];
  const lastBeatEndWorldX = (lastBeat.startFrame / fps) * TRACE_SPEED + lastBeat.widthPx;
  const textStartWorldX = lastBeatEndWorldX + FLAT_GAP_SECONDS * TRACE_SPEED;
  const totalTextWidth = getTextTotalWidth();
  const textEndWorldX = textStartWorldX + totalTextWidth;
  const textLayout = layoutText(textStartWorldX); // world-space positions

  // ── Final screen position: text centered when done ──
  const desiredTextStartScreen = (width - totalTextWidth) / 2;
  const finalHeadScreenX = desiredTextStartScreen + totalTextWidth;
  const headScreenDuringEcg = HEAD_SCREEN_RATIO * width;

  // ── Head position (world space, keeps moving past text) ──
  const currentTime = frame / fps;
  const headX = currentTime * TRACE_SPEED;
  const textEndFrame = Math.round((textEndWorldX / TRACE_SPEED) * fps);
  const isTextPhase = headX > textStartWorldX;
  const isTextDone = frame >= textEndFrame - 3;

  // ── Viewport: keeps scrolling, head drifts from 75% → right edge ──
  let headScreenX: number;
  let viewOffset: number;

  if (headX <= textStartWorldX) {
    viewOffset = Math.max(0, headX - headScreenDuringEcg);
    headScreenX = headX - viewOffset;
  } else if (headX >= textEndWorldX) {
    // Lock viewport so text stays centered; dot keeps moving right
    viewOffset = textEndWorldX - finalHeadScreenX;
    headScreenX = headX - viewOffset;
  } else {
    const p = (headX - textStartWorldX) / (textEndWorldX - textStartWorldX);
    headScreenX = headScreenDuringEcg + p * (finalHeadScreenX - headScreenDuringEcg);
    viewOffset = headX - headScreenX;
  }

  // ── Y function (world space) ──
  function getYAtX(worldX: number): number {
    for (const beat of beats) {
      const beatStartX = (beat.startFrame / fps) * TRACE_SPEED;
      const beatEndX = beatStartX + beat.widthPx;
      if (worldX >= beatStartX && worldX <= beatEndX) {
        const progress = (worldX - beatStartX) / beat.widthPx;
        const beatPoints = generateHeartbeatPoints(beat.amplitude);
        const idx = Math.min(
          Math.floor(progress * (beatPoints.length - 1)),
          beatPoints.length - 1,
        );
        return baselineY - beatPoints[idx].y * ecgMaxDeflection;
      }
    }
    for (const item of textLayout) {
      if (worldX >= item.startX && worldX <= item.endX) {
        const t = (worldX - item.startX) / (item.endX - item.startX);
        const letterDef = LETTERS[item.char];
        if (letterDef) {
          return baselineY - interpolateLetterY(letterDef, t) * textMaxDeflection;
        }
      }
    }
    return baselineY;
  }

  // ── ECG trace path (up to text start) ──
  const firstBeatWorldX = (beats[0].startFrame / fps) * TRACE_SPEED;
  const traceStartWX = Math.max(Math.floor(firstBeatWorldX), Math.floor(viewOffset));
  const ecgTraceEndWX = Math.min(
    Math.ceil(headX),
    Math.ceil(textStartWorldX),
    Math.ceil(viewOffset + width),
  );

  const traceSegments: string[] = [];
  if (ecgTraceEndWX >= traceStartWX) {
    for (let wx = traceStartWX; wx <= ecgTraceEndWX; wx++) {
      const sx = wx - viewOffset;
      const y = getYAtX(wx);
      traceSegments.push(wx === traceStartWX ? `M ${sx} ${y}` : `L ${sx} ${y}`);
    }
  }
  const tracePathD = traceSegments.join(" ");

  // ── Flat exit line after text finishes ──
  let exitPathD = "";
  if (isTextDone && headX > textEndWorldX) {
    const exitStartSX = textEndWorldX - viewOffset - 32;
    const exitEndSX = headX - viewOffset;
    exitPathD = `M ${exitStartSX} ${baselineY} L ${exitEndSX} ${baselineY}`;
  }

  // ── Neon fade ──
  const neonLengthPx = 200;
  const neonFadeScreenEnd = headScreenX;
  const neonFadeScreenStart = neonFadeScreenEnd - neonLengthPx;

  // ── Text mask ──
  const maskBrushSize = 1;
  const clipLeadPx = 20;
  const blockUnmaskDelay = 15;
  const blockFeatherPx = 10;

  const textMaskEndSX = isTextPhase
    ? (isTextDone ? width : Math.max(0, Math.min(Math.ceil(headScreenX), width)))
    : 0;

  const textMaskSegments: string[] = [];
  if (isTextPhase && textMaskEndSX > 0 && !isTextDone) {
    for (let sx = 0; sx <= textMaskEndSX; sx++) {
      const y = getYAtX(viewOffset + sx);
      textMaskSegments.push(sx === 0 ? `M ${sx} ${y}` : `L ${sx} ${y}`);
    }
  }
  const textMaskPathD = textMaskSegments.join(" ");
  const blockUnmaskX = isTextDone ? width : Math.max(0, textMaskEndSX - blockUnmaskDelay);

  // ── Connectors (screen space) ──
  const connectorSegments: string[] = [];
  for (let i = 0; i < textLayout.length - 1; i++) {
    const curr = textLayout[i];
    const next = textLayout[i + 1];
    connectorSegments.push(
      `M ${curr.endConnector - viewOffset - 18} ${baselineY} L ${next.startConnector - viewOffset} ${baselineY}`,
    );
  }
  const connectorPathD = connectorSegments.join(" ");

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden" }}>
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="neonText" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="tblur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="tblur2" />
            <feMerge>
              <feMergeNode in="tblur2" />
              <feMergeNode in="tblur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient
            id="neonMaskGrad"
            gradientUnits="userSpaceOnUse"
            x1={neonFadeScreenStart} y1={0}
            x2={neonFadeScreenEnd} y2={0}
          >
            <stop offset="0%" stopColor="black" />
            <stop offset="100%" stopColor="white" />
          </linearGradient>
          <mask id="neonMask">
            <rect x={0} y={0} width={width} height={height} fill="url(#neonMaskGrad)" />
          </mask>
          <clipPath id="textReveal">
            <rect
              x={0} y={0}
              width={isTextDone ? width : Math.max(0, headScreenX + clipLeadPx)}
              height={height}
            />
          </clipPath>
          <linearGradient
            id="blockUnmaskGrad"
            gradientUnits="userSpaceOnUse"
            x1={blockUnmaskX - blockFeatherPx} y1={0}
            x2={blockUnmaskX} y2={0}
          >
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </linearGradient>
          <mask id="textWipeMask">
            <rect x={0} y={0} width={width} height={height} fill={isTextDone ? "white" : "black"} />
            {!isTextDone && blockUnmaskX > 0 && (
              <rect x={0} y={0} width={blockUnmaskX} height={height} fill="url(#blockUnmaskGrad)" />
            )}
            {!isTextDone && textMaskPathD && (
              <path
                d={textMaskPathD}
                fill="none"
                stroke="white"
                strokeWidth={15 * maskBrushSize}
                strokeLinejoin="round"
                strokeLinecap="round"
                filter="url(#neonText)"
              />
            )}
          </mask>
          <radialGradient id="headGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.8} />
            <stop offset="30%" stopColor={lineColor} stopOpacity={0.6} />
            <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* ECG trace */}
        {tracePathD && (
          <g>
            <path d={tracePathD} fill="none" stroke={lineColor} strokeWidth={2}
              strokeLinejoin="round" strokeLinecap="round" />
            <path d={tracePathD} fill="none" stroke={lineColor} strokeWidth={2.5}
              strokeLinejoin="round" strokeLinecap="round"
              filter="url(#neon)" mask="url(#neonMask)" />
          </g>
        )}

        {/* Text + connectors */}
        {isTextPhase && (
          <g clipPath="url(#textReveal)">
            <g mask="url(#textWipeMask)">
              {textLayout.map((item, i) => (
                <text
                  key={i}
                  x={(item.startX + item.endX) / 2 - viewOffset}
                  y={baselineY}
                  textAnchor="middle"
                  dominantBaseline="alphabetic"
                  fontSize={Math.round(textMaxDeflection / 0.715)}
                  fontFamily="Arial, Helvetica, sans-serif"
                  fontWeight="bold"
                  fill="none"
                  stroke={lineColor}
                  strokeWidth={1.5}
                  filter="url(#neonText)"
                >
                  {item.char}
                </text>
              ))}
              {connectorPathD && (
                <path d={connectorPathD} fill="none" stroke={lineColor}
                  strokeWidth={1.5} strokeLinecap="round" />
              )}
            </g>
          </g>
        )}

        {/* Flat exit line after text */}
        {exitPathD && (
          <g>
            <path d={exitPathD} fill="none" stroke={lineColor} strokeWidth={2}
              strokeLinejoin="round" strokeLinecap="round" />
            <path d={exitPathD} fill="none" stroke={lineColor} strokeWidth={2.5}
              strokeLinejoin="round" strokeLinecap="round"
              filter="url(#neon)" />
          </g>
        )}

        {/* Head dot */}
        {headScreenX >= 0 && headScreenX <= width && (
          <>
            <circle cx={headScreenX} cy={getYAtX(headX)} r={20} fill="url(#headGlow)" />
            <circle cx={headScreenX} cy={getYAtX(headX)} r={3} fill={lineColor} />
          </>
        )}
      </svg>

      {/* Scanlines */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
        pointerEvents: "none",
      }} />

      {/* Vignette */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
        background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
