import { isValidElement } from "react";
import WujieReact from "wujie-react";
import { useWujieState } from "../store/useWujieStore";
import type { IWuJieLink, IWujieLinksPageData } from "../types";

interface ILinksPanelProps {
  api: { getLinks: () => IWuJieLink[] };
}

const LinkItem = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <a
    href={to.replace(/\/$/, "")}
    target="_blank"
    rel="noreferrer"
    className="m-1 inline-block w-fit rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
  >
    {children}
  </a>
);

export const LinksPanel = ({ api }: ILinksPanelProps) => {
  const { plugins, contextLinks } = useWujieState();

  return (
    <div>
      <div className="my-4">和原 link 共存</div>
      {plugins.map((plugin) => {
        const links = plugin.comp?.links?.(contextLinks);
        const isComponent = isValidElement(links);
        const isPageData =
          typeof links === "object" &&
          links !== null &&
          "title" in links &&
          "url" in links;

        return (
          <div key={plugin.name}>
            {isComponent && links}
            {isPageData && (
              <WujieReact
                // @ts-expect-error wujie-react 类型声明待补充
                name={plugin.name}
                url={plugin.url + (links as IWujieLinksPageData).url}
                props={{ api }}
                width="100%"
                height="300px"
              />
            )}
          </div>
        );
      })}
      <div>
        <div>我是原组件</div>
        {contextLinks.map((item) => (
          <LinkItem key={item.url} to={item.url}>
            {item.name}
          </LinkItem>
        ))}
      </div>
    </div>
  );
};
