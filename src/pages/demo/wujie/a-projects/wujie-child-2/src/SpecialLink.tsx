import { Fragment, useEffect, useState } from "react";
import { Link } from "./App";

export const SpecialLink = () => {
  const [allLinks, setAllLinks] = useState<
    {
      url: string;
      name: string;
    }[]
  >([]);

  const githubLink = allLinks?.filter((item) => item.name.includes("github"));

  const [count, setCount] = useState(0);

  const handleUpdate = (data: any) => {
    console.log("handleUpdate", data);
    setAllLinks(data);
  };

  useEffect(() => {
    const links = window.$wujie.props?.api.getLinks();

    setAllLinks(links!);

    window.$wujie?.bus.$on("contextUpdated", handleUpdate);
    return () => {
      window.$wujie?.bus.$off("contextUpdated", handleUpdate);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <div
        style={{
          color: "red",
        }}
      >
        I'm alive in iframe
      </div>
      {githubLink &&
        githubLink.map((item, index) => (
          <Fragment key={index}>
            <Link link={item.url} name={item.name + "+count:" + count} />
            <button onClick={() => setCount((count) => count + 1)}>
              private count is {count}
            </button>
          </Fragment>
        ))}
    </div>
  );
};
