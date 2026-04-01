import { layout, prepare } from "@chenglou/pretext";
import { Button, Input, Slider } from "antd";
import { useState } from "react";

export const Pretext = () => {
  const [width, setWidth] = useState(500);
  const [text, setText] = useState(
    "`prepare()` does the expensive work: it segments text and measures each segment via canvas. For 500 texts, this takes ~19ms. `layout()` is pure arithmetic on cached widths — the same 500 texts take ~0.09ms. Call `prepare()` once when text arrives. Call `layout()` on every resize.",
  );
  const [collapsible, setCollapsible] = useState(false);

  const prepared = prepare(text, "16px ui-sans-serif");

  const { height, lineCount } = layout(prepared, width, 24);

  return (
    <div>
      <Input.TextArea value={text} onChange={(e) => setText(e.target.value)} />

      <Slider
        defaultValue={width}
        value={width}
        onChange={(value) => setWidth(value)}
        min={100}
        max={700}
        className="ml-[100px] w-[600px]"
      />
      <div className="space-y-2">
        <p>height: {height}</p>
        <p>lineCount: {lineCount}</p>
        <Button onClick={() => setCollapsible(!collapsible)}>
          {collapsible ? "Expand" : "Collapse"}
        </Button>
        <div
          style={{
            width,
            height: collapsible ? height : 0,
            lineHeight: `${24}px`,
            fontSize: "16px",
          }}
          className="overflow-hidden border border-gray-300 transition-all duration-300 ease-in-out"
        >
          {text}
        </div>
      </div>
    </div>
  );
};
