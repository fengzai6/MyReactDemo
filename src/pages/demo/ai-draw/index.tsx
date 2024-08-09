import { Button, Input } from "antd";
import { useState } from "react";

export const AiDraw = () => {
  const baseUrl = "https://api-flux1.api4gpt.com/?prompt=";

  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageStatus, setImageStatus] = useState<string>("");

  const handleGenerate = () => {
    setImageUrl(`${baseUrl}${prompt}`);
    setImageStatus("loading");
  };

  const handleImageLoad = () => {
    setImageStatus("loaded");
  };

  const handleImageError = () => {
    setImageStatus("error");
  };

  return (
    <div className="p-4">
      <h1>AI Draw</h1>
      <div className="flex gap-4 items-center">
        prompt:
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter prompt"
          onPressEnter={handleGenerate}
        />
        <Button type="primary" onClick={handleGenerate}>
          Generate
        </Button>
      </div>
      <div className="w-3/5 aspect-square p-8 mx-auto">
        {imageStatus === "loading" && <p>Loading...</p>}
        {imageStatus === "error" && <p>Error loading image</p>}
        <img
          src={imageUrl}
          alt="AI Draw"
          className={`w-full h-full object-fill ${
            imageStatus === "loaded" ? "block" : "hidden"
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
    </div>
  );
};
