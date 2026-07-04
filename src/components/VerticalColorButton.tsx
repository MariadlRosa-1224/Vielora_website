import React from "react";

interface VerticalColorButtonProps {
  title: string;
  image: string;
  color?: string;
  active?: boolean;
  onClick?: () => void;
}

const VerticalColorButton: React.FC<VerticalColorButtonProps> = ({
  title,
  image,
  color = "rgba(14, 196, 255, 1)",
  active = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={
        {
          "--button-color": color,
        } as React.CSSProperties
      }
      className={[
        "flex h-[350px] w-[200px] cursor-pointer flex-col items-center justify-around border-none bg-transparent p-0",
        "bg-[linear-gradient(360deg,var(--button-color)_0%,rgba(41,54,167,0.8)_50%,rgba(0,0,0,0)_80%)]",
        "transition-opacity hover:opacity-80",
        active ? "rounded-[var(--border-radius)] bg-[var(--color-secondary)] opacity-100" : "",
      ].join(" ")}
    >
      <img
        src={image}
        alt={title}
        className="mb-[10px] h-[100px] w-[100px] object-contain"
      />

      <span className="text-center font-['Spectral_SC',serif] text-2xl font-bold text-[var(--color-text)]">
        {title}
      </span>
    </button>
  );
};

export default VerticalColorButton;