import { useEffect, useRef, useState } from "react";
import { IMessageFn, IMessageProps } from "./props";

export const useAction = () => {
  const message: IMessageFn = {
    log: (content: string) => {
      setLogMessage((prev) => [
        ...prev,
        {
          type: "log",
          content: new Date().toLocaleTimeString() + ": " + content,
        },
      ]);
    },
    error: (content: string) => {
      setLogMessage((prev) => [
        ...prev,
        {
          type: "error",
          content: new Date().toLocaleTimeString() + ": " + content,
        },
      ]);
    },
  };

  const localVideoRef = useRef<HTMLVideoElement>(null);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const peerConnection = useRef<RTCPeerConnection | null>(null);

  const socketRef = useRef<WebSocket | null>(null);

  const [isOffer, setIsOffer] = useState<boolean>(false);

  const [logMessage, setLogMessage] = useState<IMessageProps[]>([]);

  const startLive = async (offerSdp?: RTCSessionDescription) => {
    let localStream: MediaStream;

    message.log("开始获取摄像头/麦克风...");
    try {
      // 暂时仅获取麦克风
      localStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      message.log("摄像头/麦克风获取成功！");

      localVideoRef.current!.srcObject = localStream;
    } catch (error) {
      return message.error("摄像头/麦克风获取失败！");
    }

    message.log(
      `------ WebRTC ${isOffer ? "发起方" : "接收方"}流程开始 ------`
    );

    if (!peerConnection.current) {
      return;
    }

    message.log("将媒体轨道添加到轨道集");
    localStream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, localStream);
    });

    if (isOffer) {
      message.log("创建 Offer SDP");
      const offer = await peerConnection.current.createOffer();

      message.log("设置本地 Offer SDP");
      await peerConnection.current.setLocalDescription(offer);

      message.log("发送 Offer SDP");
      socketRef.current?.send(
        JSON.stringify({
          type: "offer",
          sdp: offer.sdp,
        })
      );
    } else {
      if (!offerSdp) {
        return message.error("Offer SDP 不存在！");
      }

      message.log("设置远程 Offer SDP");
      await peerConnection.current.setRemoteDescription(offerSdp);

      message.log("创建 Answer SDP");
      const answer = await peerConnection.current.createAnswer();

      message.log("设置本地 Answer SDP");
      await peerConnection.current.setLocalDescription(answer);

      message.log("发送 Answer SDP");
      socketRef.current?.send(
        JSON.stringify({
          type: "answer",
          sdp: answer.sdp,
        })
      );
    }
  };

  const handleConnect = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    message.log("信令通道（WebSocket）连接中......");
    socketRef.current = new WebSocket("ws://localhost:8080");

    socketRef.current.onopen = () => {
      message.log("信令通道（WebSocket）已连接！");
    };

    socketRef.current.onerror = () => message.error("信令通道创建失败！");

    // 监听消息，根据消息类型进行处理
    socketRef.current.onmessage = (e) => {
      if (!peerConnection.current) {
        return;
      }

      const { type, sdp, iceCandidate } = JSON.parse(e.data);

      if (type === "answer") {
        // 当接收到 Answer SDP 时，设置远程描述
        peerConnection.current.setRemoteDescription(
          new RTCSessionDescription({ type, sdp })
        );
      } else if (type === "answer_ice") {
        // 当接收到 Answer ICE 时，添加到连接中
        peerConnection.current.addIceCandidate(iceCandidate);
      } else if (type === "offer") {
        // 当接收到 Offer SDP 时，开始直播
        startLive(new RTCSessionDescription({ type, sdp }));
      } else if (type === "offer_ice") {
        // 当接收到 Offer ICE 时，添加到连接中
        peerConnection.current.addIceCandidate(iceCandidate);
      }

      if (type === "toggleVideoPause") {
        toggleVideoPause(true);
      }
    };

    // 创建 RTCPeerConnection 实例
    const peer = new RTCPeerConnection();

    peerConnection.current = peer;

    // 监听远程流数据，将远程流添加到远程视频元素
    peerConnection.current.ontrack = (e) => {
      if (e && e.streams) {
        message.log("收到对方音频/视频流数据...");
        remoteVideoRef.current!.srcObject = e.streams[0];
      }
    };

    const target = isOffer ? "offer" : "answer";
    // 监听 ICE 候选人，发送到对方
    peerConnection.current.onicecandidate = (e) => {
      if (e.candidate) {
        message.log("搜集并发送候选人");
        socketRef.current?.send(
          JSON.stringify({
            type: `${target}_ice`,
            iceCandidate: e.candidate,
          })
        );
      } else {
        message.log("候选人收集完成！");
      }
    };
  };

  const toggleVideoPause = (isReceive?: boolean) => {
    remoteVideoRef.current!.paused
      ? remoteVideoRef.current?.play()
      : remoteVideoRef.current?.pause();
    localVideoRef.current!.paused
      ? localVideoRef.current?.play()
      : localVideoRef.current?.pause();

    message.log(localVideoRef.current!.paused ? "暂停视频流" : "播放视频流");

    !isReceive &&
      socketRef.current?.send(
        JSON.stringify({
          type: "toggleVideoPause",
        })
      );
  };

  useEffect(() => {
    if (localVideoRef.current && remoteVideoRef.current) {
      localVideoRef.current.onloadeddata = () => {
        message.log("播放本地视频！");
        localVideoRef.current?.play();
      };

      remoteVideoRef.current.onloadeddata = () => {
        message.log("播放远程视频！");
        remoteVideoRef.current?.play();
      };
    }

    return () => {
      if (peerConnection) {
        peerConnection.current?.close();
      }
    };
  }, []);

  return {
    localVideoRef,
    remoteVideoRef,
    isOffer,
    setIsOffer,
    logMessage,
    startLive,
    handleConnect,
    toggleVideoPause,
  };
};
