import React, { useState, useRef, useEffect } from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  label?: string;
  showValue?: boolean;
  showMinMaxLabels?: boolean; // new: allow hiding numeric min/max labels
}

const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value = 50,
  onChange,
  label,
  showValue = true,
  showMinMaxLabels = true
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const percentage = ((currentValue - min) / (max - min)) * 100;

  const updateValue = (clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const newPercentage = Math.max(0, Math.min(100, (x / width) * 100));
    const newValue = min + (newPercentage / 100) * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    const finalValue = Math.max(min, Math.min(max, steppedValue));

    setCurrentValue(finalValue);
    onChange?.(finalValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateValue(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updateValue(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    updateValue(e.clientX);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <div className="w-full">
      {/* Label y valor actual */}
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-3">
          {label && (
            <label className="text-sm font-medium text-gray-700">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              {currentValue}
            </span>
          )}
        </div>
      )}

      {/* Slider container */}
      <div 
        ref={sliderRef}
        className="relative h-8 cursor-pointer"
        onClick={handleClick}
      >
        {/* Track */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full transform -translate-y-1/2">
          {/* Progress fill */}
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Thumb */}
        <div 
          className="absolute top-1/2 w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 cursor-pointer hover:scale-110 transition-all duration-200 group"
          style={{ left: `${percentage}%` }}
          onMouseDown={handleMouseDown}
        >
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 -left-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {currentValue}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>

        {/* Input invisible para accesibilidad */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            setCurrentValue(newValue);
            onChange?.(newValue);
          }}
          className="absolute top-1/2 left-0 w-full h-2 -translate-y-1/2 opacity-0 cursor-pointer"
        />
      </div>

      {/* Min/Max labels */}
      {showMinMaxLabels && (
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">{min}</span>
          <span className="text-xs text-gray-500">{max}</span>
        </div>
      )}
    </div>
  );
};

export default Slider;