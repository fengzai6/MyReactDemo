import { Fragment, useEffect, useState } from "react";
import { Link } from "./App";

export const SpecialLink = () => {
  const links = window.$wujie.props?.api.getLinks();
  // console.log("links", links);

  const [linkList, setLinkList] = useState(
    links?.filter((item) => item.name.includes("github"))
  );

  // filter仅数组中当链接包括 github 时，显示该链接
  // const githubLink = ;

  const [count, setCount] = useState(0);

  const handleUpdate = (data: any) => {
    console.log("handleUpdate", data);
    setLinkList(data.filter((item: any) => item.name.includes("github")));
    // setCount((count) => count + 1);
  };

  useEffect(() => {
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
        justifyContent: "center",
      }}
    >
      {linkList &&
        linkList.map((item, index) => (
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
