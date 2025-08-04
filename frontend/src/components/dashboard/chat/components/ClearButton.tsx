import React from "react";

interface ClearButtonProps {
  show: boolean;
  onClick: () => void;
}

const ClearButton: React.FC<ClearButtonProps> = ({ show, onClick }) => {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-[#D0D0D0] hover:text-red-400 transition-all duration-300 p-1.5 rounded-xl hover:bg-red-500/10 hover:shadow-md hover:shadow-red-500/20 hover:scale-110 active:scale-95 group"
      title="Clear message"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3 lg:h-4 lg:w-4 transition-all duration-300 group-hover:drop-shadow-[0_0_4px_rgba(248,113,113,0.6)]"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

export default ClearButton;
