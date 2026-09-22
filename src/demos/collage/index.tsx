import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  InboxOutlined,
  PictureOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Button,
  ColorPicker,
  Input,
  InputNumber,
  Segmented,
  Switch,
} from "antd";
import { cn } from "@/utils/cn";
import type { Color } from "antd/es/color-picker";
import { useEffect, useEffectEvent, useRef, type ChangeEvent } from "react";
import { useCollage } from "./use-collage";
import type { TCollageMode, TCollageResizeMode } from "./types";
import { SortableImageItem } from "./sortable-image-item";

const MODE_OPTIONS = [
  {
    label: "竖排",
    value: "v",
  },
  {
    label: "横排",
    value: "h",
  },
  {
    label: "网格",
    value: "g",
  },
];

const RESIZE_MODE_OPTIONS = [
  {
    label: "原始尺寸",
    value: "native",
  },
  {
    label: "指定尺寸",
    value: "fixed",
  },
];

const OUT_SCALE_MIN = 0.1;
const OUT_SCALE_MAX = 8;
const OUT_SCALE_STEP = 0.1;

interface INumberFieldProps {
  label: string;
  value: number;
  minimum: number;
  maximum: number;
  step?: number;
  suffix?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const NumberField = ({
  label,
  value,
  minimum,
  maximum,
  step,
  suffix,
  onChange,
}: INumberFieldProps) => {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
      <span className="shrink-0 text-xs font-medium text-gray-500">{label}</span>
      <Input
        type="number"
        value={value}
        min={minimum}
        max={maximum}
        step={step}
        onChange={onChange}
        variant="borderless"
        className="w-[76px] px-0"
      />
      {suffix && <span className="text-xs text-gray-400">{suffix}</span>}
    </label>
  );
};

interface IOutputSizeFieldProps {
  label: string;
  value: number;
  scale: number;
  onValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onScaleChange: (scale: number) => void;
}

const OutputSizeField = ({
  label,
  value,
  scale,
  onValueChange,
  onScaleChange,
}: IOutputSizeFieldProps) => {
  const scaleControlRef = useRef<HTMLDivElement>(null);
  const handleWheelScale = useEffectEvent((event: WheelEvent) => {
    if (event.deltaY === 0) {
      return;
    }

    const direction = event.deltaY < 0 ? 1 : -1;
    onScaleChange(
      Number(
        Math.max(
          OUT_SCALE_MIN,
          Math.min(OUT_SCALE_MAX, scale + direction * OUT_SCALE_STEP),
        ).toFixed(1),
      ),
    );
  });

  useEffect(() => {
    const scaleControl = scaleControlRef.current;

    if (!scaleControl) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      handleWheelScale(event);
    };

    scaleControl.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      scaleControl.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
      <span className="shrink-0 text-xs font-medium text-gray-500">{label}</span>
      <Input
        type="number"
        value={value}
        min={1}
        max={8000}
        step={10}
        variant="borderless"
        className="w-[64px] px-0"
        onChange={onValueChange}
      />
      <span className="text-xs text-gray-400">px</span>
      <span className="text-xs text-gray-300">·</span>
      <div
        ref={scaleControlRef}
        className="shrink-0"
      >
        <InputNumber
          value={scale}
          min={OUT_SCALE_MIN}
          max={OUT_SCALE_MAX}
          step={OUT_SCALE_STEP}
          precision={1}
          suffix="×"
          className="w-[88px]"
          onChange={(nextScale) => {
            if (nextScale !== null) {
              onScaleChange(Number(nextScale.toFixed(1)));
            }
          }}
        />
      </div>
    </div>
  );
};

export const CollageDemo = () => {
  const {
    canvasRef,
    fileInputRef,
    items,
    settings,
    isDragOver,
    selectedItemId,
    itemScales,
    info,
    isInfoWarning,
    hasItems,
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
  } = useCollage();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    handleReorder(String(active.id), String(over.id));
  };

  const handleColorChange = (color: Color) => {
    handleBackgroundChange({
      target: {
        value: color.toHexString(),
      },
    } as ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-3">
      <section className="rounded-xl border border-gray-200 bg-white px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex shrink-0 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
              Canvas
            </span>
            <h1 className="min-w-0 truncate text-lg font-semibold leading-6 text-gray-900">
              在线拼图工具
            </h1>
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-2 [&_.ant-btn]:w-full sm:flex sm:flex-wrap sm:items-center sm:[&_.ant-btn]:w-auto">
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={handleAddButtonClick}
            >
              添加图片
            </Button>
            <Button
              size="small"
              icon={<DeleteOutlined />}
              disabled={!hasItems}
              onClick={handleClear}
            >
              清空
            </Button>
            <Button
              size="small"
              icon={<CopyOutlined />}
              disabled={!hasItems}
              onClick={() => void handleCopy()}
            >
              复制
            </Button>
            <Button
              size="small"
              type="primary"
              icon={<DownloadOutlined />}
              disabled={!hasItems}
              onClick={() => void handleSave()}
            >
              下载 PNG
            </Button>
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white p-4">
        <Segmented
          options={MODE_OPTIONS}
          value={settings.mode}
          onChange={(value) => handleModeChange(value as TCollageMode)}
        />
        <Segmented
          options={RESIZE_MODE_OPTIONS}
          value={settings.resizeMode}
          onChange={(value) =>
            handleResizeModeChange(value as TCollageResizeMode)
          }
        />

        {settings.mode === "g" && (
          <NumberField
            label="列数"
            value={settings.cols}
            minimum={1}
            maximum={8}
            onChange={(event) => handleNumberChange("cols", event)}
          />
        )}

        {settings.resizeMode === "fixed" && (
          <OutputSizeField
            label={settings.mode === "h" ? "基准高度" : "基准宽度"}
            value={settings.outSize}
            scale={settings.outScale}
            onValueChange={(event) => handleNumberChange("outSize", event)}
            onScaleChange={handleOutScaleChange}
          />
        )}

        {settings.resizeMode === "native" && (
          <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
            <span className="text-xs font-medium text-gray-500">
              自适应大小
            </span>
            <Switch
              size="small"
              checked={settings.autoSize}
              onChange={handleAutoSizeChange}
            />
          </label>
        )}

        <NumberField
          label="间距"
          value={settings.gap}
          minimum={0}
          maximum={200}
          suffix="px"
          onChange={(event) => handleNumberChange("gap", event)}
        />
        <NumberField
          label="圆角"
          value={settings.radius}
          minimum={0}
          maximum={200}
          suffix="px"
          onChange={(event) => handleNumberChange("radius", event)}
        />

        <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
          <span className="text-xs font-medium text-gray-500">背景</span>
          <ColorPicker
            value={settings.background}
            disabled={settings.transparent}
            onChangeComplete={handleColorChange}
          />
        </label>

        <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
          <span className="text-xs font-medium text-gray-500">透明背景</span>
          <Switch
            size="small"
            checked={settings.transparent}
            onChange={(checked) =>
              handleTransparentChange({
                target: {
                  checked,
                },
              } as ChangeEvent<HTMLInputElement>)
            }
          />
        </label>

        <div className="ml-auto">
          <span
            className={cn(
              "inline-flex rounded-lg border px-3 py-2 text-xs font-medium tabular-nums",
              isInfoWarning
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-blue-200 bg-blue-50 text-blue-600",
            )}
          >
            {info || "等待添加图片"}
          </span>
        </div>
      </section>

      <div className="grid min-h-[640px] gap-3 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="flex min-h-[280px] flex-col rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <PictureOutlined className="text-gray-400" />
              图片列表
            </div>
            <span className="text-xs text-gray-400">{items.length} 张</span>
          </div>
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 p-6 text-center">
                <PictureOutlined className="text-3xl text-gray-300" />
                <p className="mt-3 text-sm text-gray-400">暂无图片</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={items.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {items.map((item, index) => (
                    <SortableImageItem
                      key={item.id}
                      item={item}
                      index={index}
                      isFirst={index === 0}
                      isLast={index === items.length - 1}
                      isSelected={selectedItemId === item.id}
                      scale={itemScales[item.id] ?? 1}
                      onMove={handleMove}
                      onRemove={handleRemove}
                      onSelect={handleSelect}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </aside>

        <section
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-xl border bg-white p-5",
            isDragOver ? "border-blue-400 bg-blue-50/30" : "border-gray-200",
          )}
        >
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%), linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%)",
              backgroundPosition: "0 0, 10px 10px",
              backgroundSize: "20px 20px",
            }}
          />

          {!hasItems && (
            <div className="relative z-10 max-w-md text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-500">
                <InboxOutlined />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-700">
                粘贴图片开始拼图
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                支持 Ctrl / ⌘ + V 粘贴截图、拖拽图片或点击“添加图片”，可一次添加多张。
              </p>
            </div>
          )}

          <canvas
            ref={canvasRef}
            className={cn(
              "relative z-10 max-h-[70vh] max-w-full shadow-lg",
              hasItems ? "block" : "hidden",
            )}
          />

          {isDragOver && (
            <div className="pointer-events-none absolute inset-4 z-20 flex items-center justify-center rounded-lg border-2 border-dashed border-blue-400 bg-blue-50/90 text-sm font-medium text-blue-600">
              松手加入图片
            </div>
          )}
        </section>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};
