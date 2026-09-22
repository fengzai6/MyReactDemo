import type {
  ICollageLayout,
  ICollageRenderResult,
  ICollageSettings,
} from "./types";

const MAX_DIMENSION = 32000;
const MAX_AREA = 80_000_000;

const drawRoundedRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  const resolvedRadius = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + resolvedRadius, y);
  context.arcTo(x + width, y, x + width, y + height, resolvedRadius);
  context.arcTo(x + width, y + height, x, y + height, resolvedRadius);
  context.arcTo(x, y + height, x, y, resolvedRadius);
  context.arcTo(x, y, x + width, y, resolvedRadius);
  context.closePath();
};

export const renderCollage = (
  canvas: HTMLCanvasElement,
  layout: ICollageLayout,
  settings: ICollageSettings,
  showSelection = true,
): ICollageRenderResult => {
  const context = canvas.getContext("2d");

  if (!context) {
    return {
      canvasWidth: 0,
      canvasHeight: 0,
      imageScale: 1,
    };
  }

  let imageScale = 1;
  const longestSide = Math.max(layout.width, layout.height);

  if (longestSide > MAX_DIMENSION) {
    imageScale = MAX_DIMENSION / longestSide;
  }

  const area = layout.width * layout.height;

  if (area * imageScale * imageScale > MAX_AREA) {
    imageScale = Math.sqrt(MAX_AREA / area);
  }

  const canvasWidth = Math.max(1, Math.round(layout.width * imageScale));
  const canvasHeight = Math.max(1, Math.round(layout.height * imageScale));
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.width = "";
  canvas.style.height = "";

  context.setTransform(imageScale, 0, 0, imageScale, 0, 0);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  if (!settings.transparent) {
    context.fillStyle = settings.background;
    context.fillRect(0, 0, layout.width, layout.height);
  }

  for (const box of layout.boxes) {
    const sourceWidth = box.item.width;
    const sourceHeight = box.item.height;
    const sourceX = box.sourceX ?? 0;
    const sourceY = box.sourceY ?? 0;
    const resolvedSourceWidth = box.sourceWidth ?? sourceWidth;
    const resolvedSourceHeight = box.sourceHeight ?? sourceHeight;
    const isExactSize = box.width === sourceWidth && box.height === sourceHeight;

    if (settings.radius > 0) {
      drawRoundedRect(
        context,
        box.x,
        box.y,
        box.width,
        box.height,
        settings.radius,
      );
      context.save();
      context.clip();

      if (
        box.sourceWidth !== undefined ||
        box.sourceHeight !== undefined
      ) {
        context.drawImage(
          box.item.image,
          sourceX,
          sourceY,
          resolvedSourceWidth,
          resolvedSourceHeight,
          box.x,
          box.y,
          box.width,
          box.height,
        );
      } else if (isExactSize) {
        context.drawImage(box.item.image, box.x, box.y);
      } else {
        context.drawImage(
          box.item.image,
          box.x,
          box.y,
          box.width,
          box.height,
        );
      }

      context.restore();
      continue;
    }

    if (box.sourceWidth !== undefined || box.sourceHeight !== undefined) {
      context.drawImage(
        box.item.image,
        sourceX,
        sourceY,
        resolvedSourceWidth,
        resolvedSourceHeight,
        box.x,
        box.y,
        box.width,
        box.height,
      );
    } else if (isExactSize) {
      context.drawImage(box.item.image, box.x, box.y);
    } else {
      context.drawImage(
        box.item.image,
        box.x,
        box.y,
        box.width,
        box.height,
      );
    }
  }

  const selectedBox = showSelection
    ? layout.boxes.find((box) => box.selected)
    : undefined;

  if (selectedBox) {
    const borderWidth = Math.max(2, Math.round(settings.gap / 2));
    const halfBorderWidth = borderWidth / 2;

    context.save();
    context.strokeStyle = "#2563eb";
    context.lineWidth = borderWidth;
    context.setLineDash([8, 6]);
    context.strokeRect(
      selectedBox.x + halfBorderWidth,
      selectedBox.y + halfBorderWidth,
      Math.max(0, selectedBox.width - borderWidth),
      Math.max(0, selectedBox.height - borderWidth),
    );
    context.restore();
  }

  return {
    canvasWidth,
    canvasHeight,
    imageScale,
  };
};
