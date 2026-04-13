import { useEffect, useRef, useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';

interface ColorPickerPopoverProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}

export function ColorPickerPopover({ label, value, onChange }: ColorPickerPopoverProps) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={popoverRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
        }}
        className="flex items-center gap-2 text-sm"
      >
        <span
          className="block h-7 w-7 rounded border border-slate-300 shadow-sm"
          style={{ backgroundColor: value }}
        />
        <span className="text-slate-700">{label}</span>
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-2 flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
          <HexColorPicker color={value} onChange={onChange} style={{ width: 200, height: 160 }} />
          <div className="flex items-center gap-1 text-sm">
            <span className="text-slate-400">#</span>
            <HexColorInput
              color={value}
              onChange={onChange}
              className="w-full rounded border border-slate-300 px-2 py-1 text-sm font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
}
