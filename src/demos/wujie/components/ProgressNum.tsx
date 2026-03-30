import { useState } from "react";
import { useWujieState } from "../store/useWujieStore";

export const ProgressNum = () => {
  const [num, setNum] = useState(0);
  const { plugins } = useWujieState();
  const number = plugins.find((p) => p.name === "wujie-child")?.comp?.number;

  if (number) {
    const { num: newNum, callback } = number(num);
    return (
      <div
        onClick={() => {
          callback?.();
          setNum(newNum);
        }}
        className="cursor-pointer"
      >
        {newNum}
      </div>
    );
  }
  return null;
};
