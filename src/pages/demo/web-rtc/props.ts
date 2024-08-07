export interface IMessageProps {
  type: "log" | "error";
  content: string;
}

export interface IMessageFn {
  log: (content: string) => void;
  error: (content: string) => void;
}
