"use client";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}

export function TabButton({ active, onClick, label, icon }: TabButtonProps) {
  return (
    <button onClick={onClick} className={active ? "tab active" : "tab"}>
      <span>{icon}</span>
      {label}
    </button>
  );
}
