import type {
  ICollageImage,
  ICollageLayout,
  ICollageLayoutBox,
  ICollageSettings,
} from "./types";

const createEmptyLayout = (): ICollageLayout => ({
  boxes: [],
  width: 0,
  height: 0,
  scales: [],
});

const computeVerticalLayout = (
  items: ICollageImage[],
  settings: ICollageSettings,
): ICollageLayout => {
  const boxes: ICollageLayoutBox[] = [];
  const scales: number[] = [];

  if (settings.resizeMode === "native") {
    const width = Math.max(...items.map((item) => item.width));
    let y = 0;

    for (const item of items) {
      const scale = settings.autoSize ? width / item.width : 1;
      const itemWidth = Math.max(1, Math.round(item.width * scale));
      const itemHeight = Math.max(1, Math.round(item.height * scale));

      boxes.push({
        x: Math.round((width - itemWidth) / 2),
        y,
        width: itemWidth,
        height: itemHeight,
        item,
      });
      scales.push(scale);
      y += itemHeight + settings.gap;
    }

    return {
      boxes,
      width,
      height: Math.max(1, y - settings.gap),
      scales,
    };
  }

  const width = Math.max(
    1,
    Math.round(settings.outSize * settings.outScale),
  );
  let y = 0;

  for (const item of items) {
    const height = Math.max(1, Math.round((item.height * width) / item.width));
    boxes.push({
      x: 0,
      y,
      width,
      height,
      item,
    });
    scales.push(width / item.width);
    y += height + settings.gap;
  }

  return {
    boxes,
    width,
    height: Math.max(1, y - settings.gap),
    scales,
  };
};

const computeHorizontalLayout = (
  items: ICollageImage[],
  settings: ICollageSettings,
): ICollageLayout => {
  const boxes: ICollageLayoutBox[] = [];
  const scales: number[] = [];

  if (settings.resizeMode === "native") {
    const height = Math.max(...items.map((item) => item.height));
    let x = 0;

    for (const item of items) {
      const scale = settings.autoSize ? height / item.height : 1;
      const itemWidth = Math.max(1, Math.round(item.width * scale));
      const itemHeight = Math.max(1, Math.round(item.height * scale));

      boxes.push({
        x,
        y: Math.round((height - itemHeight) / 2),
        width: itemWidth,
        height: itemHeight,
        item,
      });
      scales.push(scale);
      x += itemWidth + settings.gap;
    }

    return {
      boxes,
      width: Math.max(1, x - settings.gap),
      height,
      scales,
    };
  }

  const height = Math.max(
    1,
    Math.round(settings.outSize * settings.outScale),
  );
  let x = 0;

  for (const item of items) {
    const width = Math.max(1, Math.round((item.width * height) / item.height));
    boxes.push({
      x,
      y: 0,
      width,
      height,
      item,
    });
    scales.push(height / item.height);
    x += width + settings.gap;
  }

  return {
    boxes,
    width: Math.max(1, x - settings.gap),
    height,
    scales,
  };
};

const computeNativeGridLayout = (
  items: ICollageImage[],
  cols: number,
  gap: number,
  autoSize: boolean,
): ICollageLayout => {
  const boxes: ICollageLayoutBox[] = [];
  const scales: number[] = [];
  const rows = Math.ceil(items.length / cols);
  const colWidths = new Array<number>(cols).fill(0);
  const rowHeights = new Array<number>(rows).fill(0);

  if (autoSize) {
    items.forEach((item, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      colWidths[col] = Math.max(colWidths[col], item.width);
      rowHeights[row] = Math.max(rowHeights[row], item.height);
    });
  } else {
    items.forEach((item, index) => {
      const col = index % cols;
      colWidths[col] = Math.max(colWidths[col], item.width);
    });
  }

  const colX: number[] = [];
  let x = 0;

  for (let col = 0; col < cols; col += 1) {
    colX[col] = x;
    x += colWidths[col] + gap;
  }

  let y = 0;

  for (let rowIndex = 0; rowIndex * cols < items.length; rowIndex += 1) {
    const row = items.slice(rowIndex * cols, rowIndex * cols + cols);
    const rowItems = row.map((item, col) => {
      if (!autoSize) {
        return {
          item,
          col,
          width: item.width,
          height: item.height,
          scale: 1,
        };
      }

      const cellWidth = colWidths[col];
      const cellHeight = rowHeights[rowIndex];
      const scale = Math.max(cellWidth / item.width, cellHeight / item.height);
      const sourceWidth = cellWidth / scale;
      const sourceHeight = cellHeight / scale;

      return {
        item,
        col,
        width: cellWidth,
        height: cellHeight,
        sourceX: (item.width - sourceWidth) / 2,
        sourceY: (item.height - sourceHeight) / 2,
        sourceWidth,
        sourceHeight,
        scale,
      };
    });
    const rowHeight = autoSize
      ? rowHeights[rowIndex]
      : Math.max(...rowItems.map((entry) => entry.height));

    rowItems.forEach((entry) => {
      boxes.push({
        x:
          colX[entry.col] +
          (autoSize
            ? 0
            : Math.round((colWidths[entry.col] - entry.width) / 2)),
        y: y + (autoSize ? 0 : Math.round((rowHeight - entry.height) / 2)),
        width: entry.width,
        height: entry.height,
        sourceX: entry.sourceX,
        sourceY: entry.sourceY,
        sourceWidth: entry.sourceWidth,
        sourceHeight: entry.sourceHeight,
        item: entry.item,
      });
      scales.push(entry.scale);
    });

    y += rowHeight + gap;
  }

  return {
    boxes,
    width: Math.max(1, x - gap),
    height: Math.max(1, y - gap),
    scales,
  };
};

const computeFixedGridLayout = (
  items: ICollageImage[],
  settings: ICollageSettings,
): ICollageLayout => {
  const boxes: ICollageLayoutBox[] = [];
  const scales: number[] = [];
  const cols = Math.max(1, settings.cols);
  const outSize = Math.max(
    1,
    Math.round(settings.outSize * settings.outScale),
  );
  const cellWidth = Math.max(
    1,
    Math.floor((outSize - settings.gap * (cols - 1)) / cols),
  );
  let y = 0;

  for (let rowIndex = 0; rowIndex * cols < items.length; rowIndex += 1) {
    const row = items.slice(rowIndex * cols, rowIndex * cols + cols);
    const scaled = row.map((item) => ({
      item,
      height: Math.max(1, Math.round((item.height * cellWidth) / item.width)),
    }));
    const rowHeight = Math.max(...scaled.map((entry) => entry.height));

    scaled.forEach((entry, col) => {
      boxes.push({
        x: col * (cellWidth + settings.gap),
        y: y + Math.round((rowHeight - entry.height) / 2),
        width: cellWidth,
        height: entry.height,
        item: entry.item,
      });
      scales.push(cellWidth / entry.item.width);
    });

    y += rowHeight + settings.gap;
  }

  return {
    boxes,
    width: outSize,
    height: Math.max(1, y - settings.gap),
    scales,
  };
};

export const computeCollageLayout = (
  items: ICollageImage[],
  settings: ICollageSettings,
  selectedItemId?: string | null,
): ICollageLayout => {
  if (items.length === 0) {
    return createEmptyLayout();
  }

  let layout: ICollageLayout;

  if (settings.mode === "v") {
    layout = computeVerticalLayout(items, settings);
  } else if (settings.mode === "h") {
    layout = computeHorizontalLayout(items, settings);
  } else if (settings.resizeMode === "native") {
    layout = computeNativeGridLayout(
      items,
      Math.max(1, settings.cols),
      settings.gap,
      settings.autoSize,
    );
  } else {
    layout = computeFixedGridLayout(items, settings);
  }

  return {
    ...layout,
    boxes: layout.boxes.map((box) => ({
      ...box,
      selected: box.item.id === selectedItemId,
    })),
  };
};
