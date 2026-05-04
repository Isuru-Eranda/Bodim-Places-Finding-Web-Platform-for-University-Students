import { Pannellum } from "pannellum-react";
import { X, RotateCcw, ChevronLeft } from "lucide-react";

export function Viewer360({ image }) {
  return (
    <Pannellum
      width="100%"
      height="400px"
      image={image}
      pitch={10}
      yaw={180}
      hfov={110}
      autoLoad
      showZoomCtrl={true}
      mouseZoom={true}
    />
  );
}

export function Modal360({ image, onClose }) {
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
      onClick={handleBackdrop}
    >
      <div
        className="relative w-full max-w-4xl bg-[#111] rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          {/* Back button */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm font-medium px-2 py-1 rounded-lg hover:bg-white/10"
            aria-label="Back"
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <span className="text-white font-semibold text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
            360° Virtual Tour
          </span>

          <div className="flex items-center gap-3">
            <span className="text-white/40 text-xs hidden sm:block">
              <RotateCcw size={12} className="inline mr-1" />
              Click &amp; drag to look around
            </span>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
              aria-label="Close 360° viewer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Pannellum viewer */}
        <Viewer360 image={image} />
      </div>
    </div>
  );
}
