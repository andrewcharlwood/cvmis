import { useMemo } from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

type PillProps = {
  src: string;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
};

type PillTransform = {
  x: number;
  y: number;
  rotation: number;
};

const PILL_WIDTH = 200;
const PILL_HEIGHT = 450;
const RISE_DURATION_FRAMES = 150;
const RISE_SETTLE_PAUSE_FRAMES = 0;
const GAP_AFTER_RISE_FRAMES = 30;
const FAN_DURATION_FRAMES = 236;
const FAN_START_FRAME = RISE_DURATION_FRAMES + RISE_SETTLE_PAUSE_FRAMES + GAP_AFTER_RISE_FRAMES;

const OVERLAY_BLEND_START_PROGRESS = 0.5;
const OVERLAY_BLEND_TRANSITION_FRAMES = 150;
const OVERLAP_BLEND_MAX_OPACITY = 0.2;
const BACKGROUND_COLOR = "#efefef";
const COLOR_CODE = "#E38B16";
const COLOR_RX = "#0E7A7D";
const COLOR_DATA = "#109E6C";

const Pill: React.FC<PillProps> = ({ src, x, y, rotation, zIndex }) => {
  return (
    <Img
      src={src}
      style={{
        position: "absolute",
        width: PILL_WIDTH,
        height: PILL_HEIGHT,
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg)`,
        transformOrigin: "50% 100%",
        zIndex,
      }}
    />
  );
};

const withCapsuleTransform = ({
  ctx,
  transform,
  videoWidth,
  videoHeight,
  draw,
}: {
  ctx: CanvasRenderingContext2D;
  transform: PillTransform;
  videoWidth: number;
  videoHeight: number;
  draw: () => void;
}) => {
  ctx.save();
  // Match the CSS transform order and origin used for the visible pills.
  ctx.translate(videoWidth / 2, videoHeight / 2);
  ctx.translate(-PILL_WIDTH / 2, -PILL_HEIGHT / 2);
  ctx.translate(transform.x, transform.y);
  ctx.translate(PILL_WIDTH / 2, PILL_HEIGHT);
  ctx.rotate((transform.rotation * Math.PI) / 180);
  ctx.translate(-PILL_WIDTH / 2, -PILL_HEIGHT);
  draw();
  ctx.restore();
};

const drawCapsuleFill = ({
  ctx,
  transform,
  fill,
  videoWidth,
  videoHeight,
}: {
  ctx: CanvasRenderingContext2D;
  transform: PillTransform;
  fill: string;
  videoWidth: number;
  videoHeight: number;
}) => {
  withCapsuleTransform({
    ctx,
    transform,
    videoWidth,
    videoHeight,
    draw: () => {
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.roundRect(0, 0, PILL_WIDTH, PILL_HEIGHT, PILL_WIDTH / 2);
      ctx.fill();
    },
  });
};

const buildPairBlendIntersection = ({
  outputCtx,
  pairCtx,
  maskCtx,
  colorA,
  colorB,
  transformA,
  transformB,
  videoWidth,
  videoHeight,
}: {
  outputCtx: CanvasRenderingContext2D;
  pairCtx: CanvasRenderingContext2D;
  maskCtx: CanvasRenderingContext2D;
  colorA: string;
  colorB: string;
  transformA: PillTransform;
  transformB: PillTransform;
  videoWidth: number;
  videoHeight: number;
}) => {
  // Build blended color result for the two pills.
  pairCtx.clearRect(0, 0, videoWidth, videoHeight);
  pairCtx.globalCompositeOperation = "source-over";
  drawCapsuleFill({ ctx: pairCtx, transform: transformA, fill: colorA, videoWidth, videoHeight });
  pairCtx.globalCompositeOperation = "multiply";
  drawCapsuleFill({ ctx: pairCtx, transform: transformB, fill: colorB, videoWidth, videoHeight });
  pairCtx.globalCompositeOperation = "source-over";

  // Build hard intersection mask for the same pair.
  maskCtx.clearRect(0, 0, videoWidth, videoHeight);
  maskCtx.globalCompositeOperation = "source-over";
  drawCapsuleFill({ ctx: maskCtx, transform: transformA, fill: "#fff", videoWidth, videoHeight });
  maskCtx.globalCompositeOperation = "source-in";
  drawCapsuleFill({ ctx: maskCtx, transform: transformB, fill: "#fff", videoWidth, videoHeight });
  maskCtx.globalCompositeOperation = "source-over";

  // Keep only overlap area from blended result.
  pairCtx.globalCompositeOperation = "destination-in";
  pairCtx.drawImage(maskCtx.canvas, 0, 0);
  pairCtx.globalCompositeOperation = "source-over";

  // Accumulate pair overlap into final output.
  outputCtx.drawImage(pairCtx.canvas, 0, 0);
};

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const overlayBlendEndProgress = Math.min(
    1,
    OVERLAY_BLEND_START_PROGRESS + OVERLAY_BLEND_TRANSITION_FRAMES / FAN_DURATION_FRAMES,
  );

  const codeSrc = staticFile("logo/capsuleCode.svg");
  const rxSrc = staticFile("logo/capsuleRx.svg");
  const dataSrc = staticFile("logo/capsuleData.svg");

  const rise = interpolate(frame, [0, RISE_DURATION_FRAMES], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fan = spring({
    frame: frame - FAN_START_FRAME,
    fps,
    durationInFrames: FAN_DURATION_FRAMES,
    config: { damping: 200 },
  });

  const centerY = interpolate(rise, [0, 1], [560, 76], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leftY = interpolate(fan, [0, 1], [centerY, 74], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rightY = interpolate(fan, [0, 1], [centerY, 74], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leftX = interpolate(fan, [0, 1], [0, -36], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rightX = interpolate(fan, [0, 1], [0, 36], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leftRotation = interpolate(fan, [0, 1], [0, -50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rightRotation = interpolate(fan, [0, 1], [0, 50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const overlapBlendProgress =
    overlayBlendEndProgress >= 1
      ? interpolate(fan, [0, OVERLAY_BLEND_START_PROGRESS, 1], [0, 0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(
          fan,
          [0, OVERLAY_BLEND_START_PROGRESS, overlayBlendEndProgress, 1],
          [0, 0, 1, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
  
  const overlapMaskSrc = useMemo(() => {
    const centerTransform: PillTransform = { x: 0, y: centerY, rotation: 0 };
    const leftTransform: PillTransform = { x: leftX, y: leftY, rotation: leftRotation };
    const rightTransform: PillTransform = { x: rightX, y: rightY, rotation: rightRotation };

    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = width;
    outputCanvas.height = height;
    const outputCtx = outputCanvas.getContext("2d");

    const pairCanvas = document.createElement("canvas");
    pairCanvas.width = width;
    pairCanvas.height = height;
    const pairCtx = pairCanvas.getContext("2d");

    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext("2d");

    if (!outputCtx || !pairCtx || !maskCtx) {
      return null;
    }

    outputCtx.clearRect(0, 0, width, height);

    buildPairBlendIntersection({
      outputCtx,
      pairCtx,
      maskCtx,
      colorA: COLOR_CODE,
      colorB: COLOR_RX,
      transformA: centerTransform,
      transformB: leftTransform,
      videoWidth: width,
      videoHeight: height,
    });

    buildPairBlendIntersection({
      outputCtx,
      pairCtx,
      maskCtx,
      colorA: COLOR_CODE,
      colorB: COLOR_DATA,
      transformA: centerTransform,
      transformB: rightTransform,
      videoWidth: width,
      videoHeight: height,
    });

    buildPairBlendIntersection({
      outputCtx,
      pairCtx,
      maskCtx,
      colorA: COLOR_RX,
      colorB: COLOR_DATA,
      transformA: leftTransform,
      transformB: rightTransform,
      videoWidth: width,
      videoHeight: height,
    });

    const pixels = outputCtx.getImageData(0, 0, width, height).data;
    let hasAlphaPixels = false;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] > 0) {
        hasAlphaPixels = true;
        break;
      }
    }

    if (!hasAlphaPixels) {
      return null;
    }

    return outputCanvas.toDataURL("image/png");
  }, [centerY, height, leftRotation, leftX, leftY, rightRotation, rightX, rightY, width]);

  return (
    <AbsoluteFill style={{ backgroundColor: BACKGROUND_COLOR }}>
      <Pill src={codeSrc} x={0} y={centerY} rotation={0} zIndex={3} />
      <Pill src={rxSrc} x={leftX} y={leftY} rotation={leftRotation} zIndex={1} />
      <Pill src={dataSrc} x={rightX} y={rightY} rotation={rightRotation} zIndex={2} />
      {overlapMaskSrc ? (
        <Img
          src={overlapMaskSrc}
          style={{
            position: "absolute",
            inset: 0,
            opacity: OVERLAP_BLEND_MAX_OPACITY * overlapBlendProgress,
            pointerEvents: "none",
            zIndex: 20,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
