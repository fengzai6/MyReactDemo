import { Input } from "antd";
import { useEffect, useRef, useState } from "react";

export const WebSocketDemo = () => {
  interface message {
    role: "client" | "server" | "system";
    content: string;
  }

  const [message, setMessage] = useState<message[]>([]);

  const [inputUrl, setInputUrl] = useState<string>("wss://echo.websocket.org");

  const [input, setInput] = useState<string>("");

  const [status, setStatus] = useState<number>();

  const socketRef = useRef<WebSocket | null>(null);

  const handleConnect = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setStatus(WebSocket.CONNECTING);

    message.push({
      role: "system",
      content: "连接中",
    });

    socketRef.current = new WebSocket(inputUrl);

    socketRef.current.onopen = () => {
      setStatus(socketRef.current?.readyState);

      message.push({
        role: "system",
        content: "已连接",
      });
    };

    socketRef.current.onmessage = (event) => {
      setMessage((prev) => [
        ...prev,
        {
          role: "server",
          content: event.data,
        },
      ]);
    };

    socketRef.current.onclose = () => {
      setStatus(socketRef.current?.readyState);
    };
  };

  const handleDisconnect = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      setStatus(WebSocket.CLOSING);

      message.push({
        role: "system",
        content: "关闭",
      });

      socketRef.current.close();
    }
  };

  const handleSendMessage = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(input);
      setMessage((prev) => [
        ...prev,
        {
          role: "client",
          content: input,
        },
      ]);
    }
  };

  useEffect(() => {
    return () => {
      socketRef.current?.close();
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">WebSocket Demo</h1>
      <div className="mb-4 flex items-center">
        <Input
          placeholder="输入 WebSocket URL"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          className="w-[20rem] mr-2"
        />
        <div>
          status:
          {status === WebSocket.CONNECTING
            ? "连接中"
            : status === WebSocket.OPEN
            ? "已连接"
            : status === WebSocket.CLOSING
            ? "关闭中"
            : status === WebSocket.CLOSED
            ? "已关闭"
            : "未连接"}
        </div>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        onClick={handleConnect}
      >
        连接
      </button>
      <input
        className="border border-gray-300 rounded py-2 px-4 mr-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
        onClick={handleSendMessage}
      >
        发送
      </button>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleDisconnect}
      >
        断开连接
      </button>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
        onClick={() => setMessage([])}
      >
        清空消息
      </button>
      <ul className="mt-4 border border-solid border-blue-500">
        {message.map((msg, index) => (
          <li key={index} className="mb-2">
            <span className="font-bold">{msg.role}:</span> {msg.content}
          </li>
        ))}
      </ul>
    </div>
  );
};
