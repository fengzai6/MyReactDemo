import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { message } from "antd";
import { computeCollageLayout } from "./compute-layout";
import { renderCollage } from "./render-collage";
import type {
  ICollageImage,
  ICollageRenderResult,
  ICollageSettings,
  TCollageItemScales,
  TCollageMode,
  TCollageResizeMode,
} from "./types";

const DEFAULT_SETTINGS: ICollageSettings = {
  mode: "v",
  resizeMode: "native",
  cols: 2,
  outSize: 1080,
  outScale: 1,
  gap: 12,
  radius: 0,
  background: "#ffffff",
  transparent: false,
  autoSize: false,
};

const clampNumber = (
  value: number,
  minimum: number,
  maximum: number,
  fallback: number,
) => {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(minimum, Math.min(maximum, value));
};

const getDefaultFixedOutSize = (
  items: ICollageImage[],
  settings: ICollageSettings,
) => {
  if (items.length === 0) {
    return DEFAULT_SETTINGS.outSize;
  }

  const nativeLayout = computeCollageLayout(items, {
    ...settings,
    resizeMode: "native",
  });
  const size =
    settings.mode === "h" ? nativeLayout.height : nativeLayout.width;

  return clampNumber(
    Math.round(size),
    1,
    8000,
    DEFAULT_SETTINGS.outSize,
  );
};

const formatTimestamp = () => {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("") +
    "-" +
    [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join(
      "",
    );
};

const canvasToBlob = (canvas: HTMLCanvasElement) => {
  return new Promise<Blob | null>((resolve) => {
    if (canvas.toBlob) {
      canvas.toBlob((blob) => resolve(blob), "image/png");
      return;
    }

    resolve(null);
  });
};

const getInfoText = (renderResult: ICollageRenderResult) => {
  let text = `${renderResult.canvasWidth} × ${renderResult.canvasHeight}`;
  let warning = false;

  if (renderResult.imageScale < 1) {
    text += ` · 超长已缩小 ${renderResult.imageScale.toFixed(2)}×`;
    warning = true;
  }

  return {
    text,
    warning,
  };
};

export const useCollage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<ICollageImage[]>([]);
  const pendingCountRef = useRef(0);
  const [items, setItems] = useState<ICollageImage[]>([]);
  const [settings, setSettings] =
    useState<ICollageSettings>(DEFAULT_SETTINGS);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [itemScales, setItemScales] = useState<TCollageItemScales>({});
  const [info, setInfo] = useState("");
  const [isInfoWarning, setIsInfoWarning] = useState(false);

  const syncItems = (nextItems: ICollageImage[]) => {
    itemsRef.current = nextItems;
    setItems(nextItems);
  };

  const showLatestItemMessage = (nextItems: ICollageImage[]) => {
    if (pendingCountRef.current !== 0 || nextItems.length === 0) {
      return;
    }

    const latestItem = nextItems[nextItems.length - 1];
    void message.success(
      `已添加 ${nextItems.length} 张 · 最新 ${latestItem.width}×${latestItem.height}`,
    );
  };

  const addFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const url = URL.createObjectURL(file);
    const image = new Image();
    pendingCountRef.current += 1;

    image.onload = () => {
      pendingCountRef.current -= 1;
      const width = image.naturalWidth || image.width;
      const height = image.naturalHeight || image.height;

      if (!width || !height) {
        URL.revokeObjectURL(url);
        void message.error("这张图片读不了");
        return;
      }

      const nextItems = [
        ...itemsRef.current,
        {
          id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
          name: file.name && file.name !== "image.png" ? file.name : "粘贴的图片",
          url,
          image,
          width,
          height,
        },
      ];

      syncItems(nextItems);
      showLatestItemMessage(nextItems);
    };

    image.onerror = () => {
      pendingCountRef.current -= 1;
      URL.revokeObjectURL(url);
      void message.error(`「${file.name || "图片"}」解码失败`);
    };

    image.src = url;
  };

  const addFiles = (files: FileList | File[]) => {
    Array.from(files).forEach(addFile);
  };

  const handleAddButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      addFiles(event.target.files);
    }

    event.target.value = "";
  };

  const handleClear = () => {
    for (const item of itemsRef.current) {
      URL.revokeObjectURL(item.url);
    }

    syncItems([]);
    setSelectedItemId(null);
    void message.success("已清空");
  };

  const handleSelect = (id: string) => {
    setSelectedItemId((current) => (current === id ? null : id));
  };

  const handleReorder = (activeId: string, overId: string | null) => {
    if (!overId || activeId === overId) {
      return;
    }

    const previousItems = itemsRef.current;
    const activeIndex = previousItems.findIndex((item) => item.id === activeId);
    const overIndex = previousItems.findIndex((item) => item.id === overId);

    if (activeIndex < 0 || overIndex < 0) {
      return;
    }

    const nextItems = [...previousItems];
    const [activeItem] = nextItems.splice(activeIndex, 1);
    nextItems.splice(overIndex, 0, activeItem);
    syncItems(nextItems);
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    const nextItems = [...itemsRef.current];

    if (nextIndex < 0 || nextIndex >= nextItems.length) {
      return;
    }

    [nextItems[index], nextItems[nextIndex]] = [
      nextItems[nextIndex],
      nextItems[index],
    ];
    syncItems(nextItems);
  };

  const handleRemove = (index: number) => {
    const item = itemsRef.current[index];

    if (item) {
      URL.revokeObjectURL(item.url);
    }

    syncItems(itemsRef.current.filter((_, itemIndex) => itemIndex !== index));
    setSelectedItemId((current) => (current === item?.id ? null : current));
  };

  const handleModeChange = (mode: TCollageMode) => {
    setSettings((current) => {
      if (current.resizeMode === "native") {
        return {
          ...current,
          mode,
        };
      }

      return {
        ...current,
        mode,
        outSize: getDefaultFixedOutSize(itemsRef.current, {
          ...current,
          mode,
        }),
        outScale: 1,
      };
    });
  };

  const handleResizeModeChange = (resizeMode: TCollageResizeMode) => {
    setSettings((current) => {
      if (resizeMode === "native") {
        return {
          ...current,
          resizeMode,
        };
      }

      return {
        ...current,
        resizeMode,
        outSize: getDefaultFixedOutSize(itemsRef.current, current),
        outScale: 1,
      };
    });
  };

  const handleNumberChange = (
    key: "cols" | "outSize" | "outScale" | "gap" | "radius",
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const fallback =
      key === "outSize"
        ? DEFAULT_SETTINGS.outSize
        : key === "cols" || key === "outScale"
          ? 1
          : 0;
    const minimum = key === "outSize" ? 1 : key === "outScale" ? 0.1 : 0;
    const maximum =
      key === "outSize" ? 8000 : key === "cols" ? 8 : key === "outScale" ? 8 : 200;

    setSettings((current) => ({
      ...current,
      [key]: clampNumber(
        Number(event.target.value),
        minimum,
        maximum,
        fallback,
      ),
    }));
  };

  const handleBackgroundChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSettings((current) => ({
      ...current,
      background: event.target.value,
    }));
  };

  const handleTransparentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSettings((current) => ({
      ...current,
      transparent: event.target.checked,
    }));
  };

  const handleAutoSizeChange = (checked: boolean) => {
    setSettings((current) => ({
      ...current,
      autoSize: checked,
    }));
  };

  const handleOutScaleChange = (outScale: number) => {
    setSettings((current) => ({
      ...current,
      outScale,
    }));
  };

  const handleSave = async () => {
    if (itemsRef.current.length === 0) {
      return;
    }

    const exportCanvas = document.createElement("canvas");
    const exportLayout = computeCollageLayout(itemsRef.current, settings);
    const renderResult = renderCollage(
      exportCanvas,
      exportLayout,
      settings,
      false,
    );
    const blob = await canvasToBlob(exportCanvas);

    if (!blob) {
      void message.error("导出失败");
      return;
    }

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `拼图-${formatTimestamp()}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    void message.success(
      `已下载 ${renderResult.canvasWidth} × ${renderResult.canvasHeight}`,
    );
  };

  const handleCopy = async () => {
    if (itemsRef.current.length === 0) {
      return;
    }

    if (!navigator.clipboard || !window.ClipboardItem) {
      void message.warning("当前浏览器不支持复制，请用下载");
      return;
    }

    try {
      const exportCanvas = document.createElement("canvas");
      const exportLayout = computeCollageLayout(itemsRef.current, settings);
      renderCollage(exportCanvas, exportLayout, settings, false);
      const blob = await canvasToBlob(exportCanvas);

      if (!blob) {
        throw new Error("Canvas export failed");
      }

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);
      void message.success("已复制到剪贴板");
    } catch {
      void message.error("复制失败，请用下载");
    }
  };

  const handlePaste = useEffectEvent((event: ClipboardEvent) => {
    const files: File[] = [];
    const clipboardItems = event.clipboardData?.items;

    if (!clipboardItems) {
      return;
    }

    for (const clipboardItem of clipboardItems) {
      if (
        clipboardItem.kind === "file" &&
        clipboardItem.type.startsWith("image/")
      ) {
        const file = clipboardItem.getAsFile();

        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      event.preventDefault();
      addFiles(files);
    }
  });

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer) {
      return;
    }

    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    if (event.dataTransfer.files.length > 0) {
      addFiles(event.dataTransfer.files);
    }
  };

  useEffect(() => {
    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  useEffect(() => {
    return () => {
      for (const item of itemsRef.current) {
        URL.revokeObjectURL(item.url);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    if (items.length === 0) {
      const context = canvas.getContext("2d");
      canvas.width = 1;
      canvas.height = 1;
      context?.clearRect(0, 0, 1, 1);
      setInfo("");
      setIsInfoWarning(false);
      setItemScales({});
      return;
    }

    const nextLayout = computeCollageLayout(items, settings, selectedItemId);
    const renderResult = renderCollage(canvas, nextLayout, settings);
    const nextInfo = getInfoText(renderResult);

    setItemScales(
      Object.fromEntries(
        nextLayout.boxes.map((box, index) => [
          box.item.id,
          nextLayout.scales[index] ?? 1,
        ]),
      ),
    );
    setInfo(nextInfo.text);
    setIsInfoWarning(nextInfo.warning);
  }, [items, selectedItemId, settings]);

  useEffect(() => {
    if (
      selectedItemId &&
      !items.some((item) => item.id === selectedItemId)
    ) {
      setSelectedItemId(null);
    }
  }, [items, selectedItemId]);

  return {
    canvasRef,
    fileInputRef,
    items,
    settings,
    isDragOver,
    selectedItemId,
    itemScales,
    info,
    isInfoWarning,
    hasItems: items.length > 0,
    handleAddButtonClick,
    handleFileChange,
    handleClear,
    handleSelect,
    handleReorder,
    handleMove,
    handleRemove,
    handleModeChange,
    handleResizeModeChange,
    handleNumberChange,
    handleBackgroundChange,
    handleTransparentChange,
    handleAutoSizeChange,
    handleOutScaleChange,
    handleSave,
    handleCopy,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};
