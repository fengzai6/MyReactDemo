import type { IWuJieLink } from "../types";
import { useWujieState } from "../store/useWujieStore";

interface IProgressLinkProps {
  data: IWuJieLink;
}

const LinkItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <a
    href={to.replace(/\/$/, "")}
    target="_blank"
    rel="noreferrer"
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit m-1 inline-block"
  >
    {children}
  </a>
);

export const ProgressLink = ({ data }: IProgressLinkProps) => {
  const { plugins } = useWujieState();
  const link = plugins
    .find((p) => p.name === "wujie-child")
    ?.comp?.link?.(data);

  if (link) return link;
  return <LinkItem to={data.url}>{data.name}</LinkItem>;
};
