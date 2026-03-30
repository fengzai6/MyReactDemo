import { LoadingOutlined } from "@ant-design/icons";
import { Button, Input, Spin } from "antd";
import { useEffect, useState } from "react";

export const AiDrawDemo = () => {
  const baseUrl = "https://api-flux1.api4gpt.com/?prompt=";
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageStatus, setImageStatus] = useState<string>("");

  const handleGenerate = () => {
    setImageStatus("loading");
    setImageUrl(`${baseUrl}${prompt}?time=${Date.now()}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (imageStatus === "loading") setImageStatus("error");
    }, 30000);
    return () => clearTimeout(timer);
  }, [imageStatus]);

  return (
    <div className="p-4">
      <h1>AI Draw 画图</h1>
      <h2>提示词需要英文且越详细越好～ <a href="https://www.deepl.com/zh/translator/l/en/en">👉🏻Deepl翻译</a></h2>
      <div className="flex gap-4">
        <span className="h-[2rem] leading-8 text-nowrap">prompt(提示词):</span>
        <Input.TextArea value={prompt} className="max-h-[10rem]" onChange={(e) => setPrompt(e.target.value)} placeholder="Enter prompt" onPressEnter={handleGenerate} />
        <Button type="primary" onClick={handleGenerate}>生成图片</Button>
      </div>
      <div className="w-3/5 aspect-square p-8 mx-auto">
        {imageStatus !== "loaded" && (
          <div className="size-full shadow-xl rounded-2xl p-4 flex flex-col items-center justify-center">
            {imageStatus === "loading" && (<><Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} /><p>Loading...</p></>)}
            {imageStatus === "error" && (<><div>暂无图片数据</div><div>请输入prompt生成图片或更换prompt</div><div>或者等待一会再试试</div></>)}
          </div>
        )}
        <img src={imageUrl} alt="AI Draw" className={`w-full h-full object-fill ${imageStatus === "loaded" ? "block" : "hidden"}`} onLoad={() => setImageStatus("loaded")} onError={() => setImageStatus("error")} />
      </div>
    </div>
  );
};
