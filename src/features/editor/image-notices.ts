import { create } from "zustand";

interface Notice {
  id: number;
  message: string;
  role: "alert" | "status";
}
let nextId = 0;
export const useImageNotices = create<{ notices: Notice[] }>(() => ({
  notices: [],
}));
export function dismissImageNotice(id: number) {
  useImageNotices.setState((state) => ({
    notices: state.notices.filter((notice) => notice.id !== id),
  }));
}
export function showImageNotice(
  message: string,
  role: Notice["role"] = "alert"
) {
  if (!message) {
    return;
  }
  nextId += 1;
  const id = nextId;
  useImageNotices.setState((state) => ({
    notices: [...state.notices, { id, message, role }],
  }));
  setTimeout(() => dismissImageNotice(id), 6000);
}
