// 生成一个美观的链接组件

export const Link = (props: { to: string; children: React.ReactNode }) => {
  return (
    <a
      href={props.to.replace(/\/$/, "")}
      target="_blank"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit m-1"
    >
      {props.children}
    </a>
  );
};
