import { Button, Skeleton } from "antd";
import { useState } from "react";
import WujieReact from "wujie-react";
import { ChildComponent } from "./components/ChildComponent";
import { LinksPanel } from "./components/LinksPanel";
import { LoadWujiePlugins } from "./components/LoadWujiePlugins";
import { ModalBox } from "./components/ModalBox";
import { ProgressLink } from "./components/ProgressLink";
import { ProgressNum } from "./components/ProgressNum";
import { DEFAULT_LINKS } from "./constants";
import { useWujieState, useWujieStore } from "./store/useWujieStore";

const LINK_DATA = DEFAULT_LINKS[0];

export const WujieDemo = () => {
  const { bus } = WujieReact;
  const { loading, plugins, contextLinks } = useWujieState();
  const appendLink = useWujieStore((s) => s.appendLink);
  const registerPluginComponents = useWujieStore((s) => s.registerPluginComponents);
  const [count, setCount] = useState(0);

  const showMessage = (msg: string) => {
    console.log("showMessage", msg);
  };

  const showMsgWithParentData = (callback: (msg: string) => string) => {
    const msg = callback(`hello wujie with parent data ${count} | `);
    console.log("showMsgWithParentData", msg);
  };

  const register = (childName: string, comps: Parameters<typeof registerPluginComponents>[1]) => {
    console.log("register", childName, comps);
    registerPluginComponents(childName, comps);
  };

  const api = {
    getLinks: () => contextLinks,
  };

  const handlePushLink = () => {
    const newLink = {
      url: "https://github.com/" + contextLinks.length,
      name: "github-" + contextLinks.length,
    };
    appendLink(newLink);
    bus.$emit("contextUpdated", [...contextLinks, newLink]);
  };

  return (
    <div className="space-y-6">
      {/* 顶部说明区 */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h1 className="text-xl font-bold text-white">WuJie 微前端 Demo</h1>
        <p className="mt-1 text-sm text-slate-400">
          演示主子应用通信、组件扩展注册、动态 links 更新、弹窗承载等能力
        </p>
      </div>

      {/* 操作区 + 状态区 */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 p-4">
        <Button onClick={() => setCount((prev) => prev + 1)}>
          count: {count}
        </Button>
        <Button onClick={handlePushLink}>Push Link</Button>
        <div className="ml-auto flex gap-4 text-sm text-slate-400">
          <span>插件数：<span className="text-white">{plugins.length}</span></span>
          <span>Links 数：<span className="text-white">{contextLinks.length}</span></span>
          {loading && <span className="text-yellow-400">加载中...</span>}
        </div>
      </div>

      {/* 主内容区 */}
      <Skeleton loading={loading} active>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* 左侧：扩展能力展示 */}
          <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-900 p-4">
            <h2 className="text-sm font-semibold text-slate-300">替换原组件</h2>
            <ProgressLink data={LINK_DATA} />
            <ProgressNum />
            <h2 className="text-sm font-semibold text-slate-300">Links 扩展</h2>
            <LinksPanel api={api} />
          </div>
          {/* 右侧：子应用渲染区 */}
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
            <h2 className="mb-2 text-sm font-semibold text-slate-300">子应用</h2>
            <LoadWujiePlugins props={{ showMessage, showMsgWithParentData, register, api }} />
          </div>
        </div>
      </Skeleton>

      {/* 辅助区 */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-300">Modal 演示</h2>
        <ModalBox data={LINK_DATA} />
        <h2 className="mt-4 mb-2 text-sm font-semibold text-slate-300">Bus 消息演示</h2>
        <ChildComponent />
      </div>
    </div>
  );
};
