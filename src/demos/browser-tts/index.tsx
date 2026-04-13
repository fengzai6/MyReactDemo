import { cn } from "@/utils/cn";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

const DEFAULT_TEXT =
  "你好，这是一段浏览器原生 TTS 的测试语音。欢迎使用 Demo Lab。";

const getUserLanguage = () => {
  if (typeof navigator === "undefined") {
    return "";
  }

  return navigator.language.toLowerCase();
};

const getVoiceLanguagePriority = (
  voice: SpeechSynthesisVoice,
  userLanguage: string,
) => {
  const voiceLanguage = voice.lang.toLowerCase();

  if (!userLanguage) {
    return 2;
  }

  if (voiceLanguage === userLanguage) {
    return 0;
  }

  const userPrimaryLanguage = userLanguage.split("-")[0];

  if (
    voiceLanguage === userPrimaryLanguage ||
    voiceLanguage.startsWith(`${userPrimaryLanguage}-`)
  ) {
    return 1;
  }

  return 2;
};

const sortVoicesByUserLanguage = (
  voiceList: SpeechSynthesisVoice[],
  userLanguage: string,
) => {
  return voiceList
    .map((voice, index) => ({
      voice,
      index,
      priority: getVoiceLanguagePriority(voice, userLanguage),
    }))
    .toSorted((left, right) => {
      if (left.priority !== right.priority) {
        return left.priority - right.priority;
      }

      return left.index - right.index;
    })
    .map((item) => item.voice);
};

const getPreferredVoice = (
  voiceList: SpeechSynthesisVoice[],
  userLanguage: string,
) => {
  const sortedVoices = sortVoicesByUserLanguage(voiceList, userLanguage);

  return sortedVoices[0] ?? null;
};

const getVoiceLabel = (voice: SpeechSynthesisVoice) => {
  const localServiceLabel = voice.localService ? "本地" : "远程";
  const defaultLabel = voice.default ? "默认" : "可用";

  return `${voice.name} (${voice.lang}) · ${localServiceLabel} · ${defaultLabel}`;
};

type TSupportStatus = "checking" | "ready" | "unsupported";

export const BrowserTtsDemo = () => {
  const isSpeechSynthesisSupported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;
  const userLanguage = getUserLanguage();
  const initialVoices = isSpeechSynthesisSupported
    ? sortVoicesByUserLanguage(window.speechSynthesis.getVoices(), userLanguage)
    : [];
  const initialPreferredVoice = getPreferredVoice(initialVoices, userLanguage);
  const initialStatusMessage = !isSpeechSynthesisSupported
    ? "当前浏览器不支持 Web Speech API 语音合成。"
    : initialVoices.length > 0
      ? `已加载 ${initialVoices.length} 个语音，可以开始播放。`
      : "浏览器支持 TTS，但语音列表暂未返回，可稍后点击“刷新语音列表”。";

  const [text, setText] = useState<string>(DEFAULT_TEXT);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(initialVoices);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(
    initialPreferredVoice?.voiceURI ?? "",
  );
  const [supportStatus, setSupportStatus] = useState<TSupportStatus>(
    isSpeechSynthesisSupported ? "ready" : "unsupported",
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>(initialStatusMessage);

  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const syncVoices = useEffectEvent(() => {
    const synthesis = speechSynthesisRef.current;

    if (!synthesis) {
      setSupportStatus("unsupported");
      setStatusMessage("当前浏览器不支持 Web Speech API 语音合成。");
      return;
    }

    const nextVoices = sortVoicesByUserLanguage(synthesis.getVoices(), userLanguage);
    const preferredVoice = getPreferredVoice(nextVoices, userLanguage);

    setVoices(nextVoices);
    setSupportStatus("ready");
    setSelectedVoiceURI((currentVoiceURI) => {
      const hasCurrentVoice = nextVoices.some((voice) => voice.voiceURI === currentVoiceURI);

      if (hasCurrentVoice) {
        return currentVoiceURI;
      }

      return preferredVoice?.voiceURI ?? "";
    });
    setStatusMessage(
      nextVoices.length > 0
        ? `已加载 ${nextVoices.length} 个语音，可以开始播放。`
        : "浏览器支持 TTS，但语音列表暂未返回，可稍后点击“刷新语音列表”。",
    );
  });

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleVoiceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoiceURI(event.target.value);
  };

  const handlePlay = () => {
    const synthesis = speechSynthesisRef.current;
    const nextText = text.trim();

    if (!synthesis) {
      setSupportStatus("unsupported");
      setStatusMessage("当前浏览器不支持 Web Speech API 语音合成。");
      return;
    }

    if (!nextText) {
      setStatusMessage("请输入要播放的文本内容。");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(nextText);
    const selectedVoice = voices.find((voice) => voice.voiceURI === selectedVoiceURI);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    utterance.onstart = () => {
      if (utteranceRef.current !== utterance) {
        return;
      }

      setIsSpeaking(true);
      setIsPaused(false);
      setStatusMessage(`正在播放：${selectedVoice?.name ?? "系统默认语音"}`);
    };

    utterance.onpause = () => {
      if (utteranceRef.current !== utterance) {
        return;
      }

      setIsPaused(true);
      setStatusMessage("语音已暂停。");
    };

    utterance.onresume = () => {
      if (utteranceRef.current !== utterance) {
        return;
      }

      setIsPaused(false);
      setStatusMessage("语音已继续播放。");
    };

    utterance.onend = () => {
      if (utteranceRef.current !== utterance) {
        return;
      }

      utteranceRef.current = null;
      setIsSpeaking(false);
      setIsPaused(false);
      setStatusMessage("播放完成。");
    };

    utterance.onerror = (event) => {
      if (utteranceRef.current !== utterance) {
        return;
      }

      utteranceRef.current = null;
      setIsSpeaking(false);
      setIsPaused(false);
      setStatusMessage(`播放失败：${event.error}`);
    };

    synthesis.cancel();
    utteranceRef.current = utterance;
    synthesis.speak(utterance);
  };

  const handlePause = () => {
    const synthesis = speechSynthesisRef.current;

    if (!synthesis || !synthesis.speaking || synthesis.paused) {
      return;
    }

    synthesis.pause();
  };

  const handleResume = () => {
    const synthesis = speechSynthesisRef.current;

    if (!synthesis || !synthesis.paused) {
      return;
    }

    synthesis.resume();
  };

  const handleStop = () => {
    const synthesis = speechSynthesisRef.current;

    if (!synthesis) {
      return;
    }

    utteranceRef.current = null;
    synthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setStatusMessage("已停止播放。");
  };

  const handleRefreshVoices = () => {
    const synthesis = speechSynthesisRef.current;

    if (!synthesis) {
      setSupportStatus("unsupported");
      setStatusMessage("当前浏览器不支持 Web Speech API 语音合成。");
      return;
    }

    const nextVoices = sortVoicesByUserLanguage(synthesis.getVoices(), userLanguage);
    const preferredVoice = getPreferredVoice(nextVoices, userLanguage);

    setVoices(nextVoices);
    setSupportStatus("ready");
    setSelectedVoiceURI((currentVoiceURI) => {
      const hasCurrentVoice = nextVoices.some((voice) => voice.voiceURI === currentVoiceURI);

      if (hasCurrentVoice) {
        return currentVoiceURI;
      }

      return preferredVoice?.voiceURI ?? "";
    });
    setStatusMessage(
      nextVoices.length > 0
        ? `已加载 ${nextVoices.length} 个语音，可以开始播放。`
        : "浏览器支持 TTS，但语音列表暂未返回，可稍后点击“刷新语音列表”。",
    );
  };

  useEffect(() => {
    if (!isSpeechSynthesisSupported) {
      return;
    }

    const synthesis = window.speechSynthesis;
    speechSynthesisRef.current = synthesis;

    synthesis.addEventListener("voiceschanged", syncVoices);

    return () => {
      utteranceRef.current = null;
      synthesis.cancel();
      synthesis.removeEventListener("voiceschanged", syncVoices);
    };
  }, [isSpeechSynthesisSupported]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <span className="inline-flex w-fit rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
              Browser TTS
            </span>
            <h1 className="text-2xl font-semibold text-gray-900">
              浏览器原生语音合成测试
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-gray-500">
              基于 Web Speech API 的简易语音播放 demo，可快速验证当前浏览器是否支持中文播报与基础控制能力。
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefreshVoices}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 transition-colors hover:border-blue-300 hover:text-blue-600"
          >
            刷新语音列表
          </button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">播放面板</h2>
            <p className="text-sm text-gray-500">
              输入一段文本，选择语音后点击播放即可测试。
            </p>
          </div>

          <div className="mt-5 space-y-5">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">测试文本</span>
              <textarea
                value={text}
                onChange={handleTextChange}
                rows={7}
                className={cn(
                  "min-h-36 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors",
                  "focus:border-blue-400 focus:ring-4 focus:ring-blue-100",
                )}
                placeholder="请输入要进行 TTS 播放的文本"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">语音列表</span>
              <select
                value={selectedVoiceURI}
                onChange={handleVoiceChange}
                disabled={voices.length === 0}
                className={cn(
                  "h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-colors",
                  "focus:border-blue-400 focus:ring-4 focus:ring-blue-100",
                  "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
                )}
              >
                {voices.length === 0 ? (
                  <option value="">暂无可用语音</option>
                ) : (
                  voices.map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {getVoiceLabel(voice)}
                    </option>
                  ))
                )}
              </select>
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handlePlay}
                disabled={supportStatus !== "ready"}
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-medium text-white transition-colors",
                  "bg-blue-600 hover:bg-blue-700",
                  "disabled:cursor-not-allowed disabled:bg-gray-300",
                )}
              >
                播放
              </button>
              <button
                type="button"
                onClick={handlePause}
                disabled={!isSpeaking || isPaused}
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 px-5 text-sm font-medium text-gray-700 transition-colors",
                  "hover:border-blue-300 hover:text-blue-600",
                  "disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300",
                )}
              >
                暂停
              </button>
              <button
                type="button"
                onClick={handleResume}
                disabled={!isPaused}
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 px-5 text-sm font-medium text-gray-700 transition-colors",
                  "hover:border-blue-300 hover:text-blue-600",
                  "disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300",
                )}
              >
                继续
              </button>
              <button
                type="button"
                onClick={handleStop}
                disabled={!isSpeaking && !isPaused}
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 px-5 text-sm font-medium text-gray-700 transition-colors",
                  "hover:border-red-300 hover:text-red-600",
                  "disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300",
                )}
              >
                停止
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">当前状态</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between gap-3">
                <span>浏览器支持</span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    supportStatus === "unsupported"
                      ? "bg-red-50 text-red-600"
                      : supportStatus === "checking"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-emerald-50 text-emerald-600",
                  )}
                >
                  {supportStatus === "unsupported"
                    ? "不支持"
                    : supportStatus === "checking"
                      ? "检测中"
                      : "可用"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>语音数量</span>
                <span className="font-medium text-gray-900">{voices.length}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>播放状态</span>
                <span className="font-medium text-gray-900">
                  {isPaused ? "已暂停" : isSpeaking ? "播放中" : "空闲"}
                </span>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm leading-6 text-gray-600">
              {statusMessage}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">使用提示</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
              <li>首次加载时，部分浏览器的语音列表会稍晚返回，可以点击“刷新语音列表”。</li>
              <li>如果没有中文语音，页面会回退到浏览器当前可用的第一个语音。</li>
              <li>浏览器语音能力依赖本机环境，不同系统返回的 voice 名称会不同。</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
};
