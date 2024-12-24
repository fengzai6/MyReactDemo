import WujieReact from "wujie-react";

export const WujieChild = (props: Partial<WujieReact>) => {
  if (!props) {
    return null; // 容错处理
  }
  return (
    <WujieReact
      {...props}
      width="100%"
      height="100%"
      name="wujie-child"
      url={"http://localhost:3057/"}
    ></WujieReact>
  );
};
