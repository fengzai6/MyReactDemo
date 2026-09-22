import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Tooltip } from "antd";
import { cn } from "@/utils/cn";
import type { ICollageImage } from "./types";

interface ISortableImageItemProps {
  item: ICollageImage;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  isSelected: boolean;
  scale: number;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (index: number) => void;
  onSelect: (id: string) => void;
}

export const SortableImageItem = ({
  item,
  index,
  isFirst,
  isLast,
  isSelected,
  scale,
  onMove,
  onRemove,
  onSelect,
}: ISortableImageItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(item.id)}
      className={cn(
        "group flex cursor-pointer items-center gap-2 rounded-lg border bg-white p-2 transition-colors",
        isSelected
          ? "border-blue-400 bg-blue-50/40 ring-2 ring-blue-100"
          : "border-gray-200 hover:border-blue-200",
        isDragging && "relative z-10 opacity-70 shadow-md",
      )}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        aria-label={`拖动 ${item.name}`}
        className="cursor-grab touch-none rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <HolderOutlined />
      </button>

      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100">
        <img
          src={item.url}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-700">
          {index + 1}. {item.name}
        </p>
        <p className="mt-0.5 text-xs text-gray-400">
          {item.width} × {item.height}
        </p>
        {Math.abs(scale - 1) > 0.002 && (
          <p className="mt-0.5 text-xs font-medium text-amber-600">
            {scale > 1 ? "放大" : "缩小"} {scale.toFixed(2)}×
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-col gap-1">
        <Tooltip title="上移">
          <Button
            type="text"
            size="small"
            icon={<ArrowUpOutlined />}
            disabled={isFirst}
            onClick={(event) => {
              event.stopPropagation();
              onMove(index, -1);
            }}
          />
        </Tooltip>
        <Tooltip title="下移">
          <Button
            type="text"
            size="small"
            icon={<ArrowDownOutlined />}
            disabled={isLast}
            onClick={(event) => {
              event.stopPropagation();
              onMove(index, 1);
            }}
          />
        </Tooltip>
        <Tooltip title="移除">
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={(event) => {
              event.stopPropagation();
              onRemove(index);
            }}
          />
        </Tooltip>
      </div>
    </div>
  );
};
