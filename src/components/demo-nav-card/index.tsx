import { cn } from "@/utils/cn";
import { useNavigate } from "react-router";

interface IDemoNavCardProps {
  path: string;
  name: string;
  description: string;
  tags: string[];
}

export const DemoNavCard = ({ path, name, description, tags }: IDemoNavCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(path)}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 text-left",
        "cursor-pointer transition-all duration-200 hover:border-blue-300 hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600">
          {name}
        </h3>
        <svg
          className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
      <p className="text-sm leading-relaxed text-gray-500">{description}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-500"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
};
