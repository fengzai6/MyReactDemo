import { Button, Switch } from "antd";
import { useAction } from "./hook";
import { IMessageProps } from "./props";

export const WebRTCDemo = () => {
  const {
    localVideoRef,
    remoteVideoRef,
    isOffer,
    setIsOffer,
    logMessage,
    startLive,
    handleConnect,
    toggleVideoPause,
  } = useAction();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">WebRTC Video Chat</h1>
      <div className="flex">
        <div className="">
          <div>localVideoRef</div>
          <video
            ref={localVideoRef}
            className="w-full mb-4 border border-solid border-blue-600"
            playsInline
          ></video>
          <div>remoteVideoRef</div>
          <video
            ref={remoteVideoRef}
            className="w-full border border-solid border-blue-600"
            playsInline
          ></video>
        </div>
        <div className="p-4">
          <div className="flex gap-4 items-center mb-4">
            <Switch checked={isOffer} onChange={setIsOffer} />
            <span>{isOffer ? "发起方" : "接收方"}</span>
            <Button onClick={() => startLive()}>开始直播</Button>
            <Button onClick={handleConnect}>连接ws</Button>
            <Button onClick={() => toggleVideoPause()}>暂停/播放视频流</Button>
          </div>
          {logMessage.map((item: IMessageProps, index: number) => (
            <div
              key={index}
              className={`mb-2 ${item.type === "error" ? "text-red-500" : ""}`}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
