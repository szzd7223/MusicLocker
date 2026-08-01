import { useState, useEffect } from "react";

export interface NoticeState {
  message: string;
  type: "success" | "error";
  duration: number;
}

export function useNotice() {
  const [notice, setNoticeState] = useState<NoticeState | null>(null);

  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => {
        setNoticeState(null);
      }, notice.duration);
      return () => clearTimeout(timer);
    }
  }, [notice]);

  const setNotice = (message: string, type: "success" | "error" = "success", duration: number = 3000) => {
    if (!message) {
      setNoticeState(null);
    } else {
      setNoticeState({ message, type, duration });
    }
  };

  return { notice, setNotice };
}
