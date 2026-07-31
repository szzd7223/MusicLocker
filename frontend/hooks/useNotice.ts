import { useState, useEffect } from "react";

export interface NoticeState {
  message: string;
  type: "success" | "error";
}

export function useNotice() {
  const [notice, setNoticeState] = useState<NoticeState | null>(null);

  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => {
        setNoticeState(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notice]);

  const setNotice = (message: string, type: "success" | "error" = "success") => {
    if (!message) {
      setNoticeState(null);
    } else {
      setNoticeState({ message, type });
    }
  };

  return { notice, setNotice };
}
