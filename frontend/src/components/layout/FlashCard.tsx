import React from 'react';
import { FlashCardData } from '@/types/FlashCardData';

interface FlashCardProps {
  card: FlashCardData;
  isFlipped: boolean;
  onFlip: () => void;
}

const FlashCard: React.FC<FlashCardProps> = ({ card, isFlipped, onFlip }) => {
  return (
    <div 
      className="w-[22rem] sm:w-[26rem] h-56 sm:h-64 cursor-pointer perspective-1000"
      onClick={onFlip}
      title="Click para voltear"
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
        isFlipped ? 'rotate-y-180' : ''
      }`}>
        {/* Front side */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-2xl shadow-xl border border-black/5 flex items-center justify-center p-6 bg-white/70 backdrop-blur-xl"
          style={{ backgroundColor: card.front.color }}
        >
          <p className="text-lg sm:text-xl font-semibold text-center text-slate-800 leading-relaxed max-h-[9.5rem] sm:max-h-[11rem] overflow-y-auto">
            {card.front.text}
          </p>
        </div>
        
        {/* Back side */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-2xl shadow-xl border border-black/5 flex items-center justify-center p-6 rotate-y-180 bg-white/70 backdrop-blur-xl"
          style={{ backgroundColor: card.back.color }}
        >
          <p className="text-lg sm:text-xl font-medium text-center text-slate-800 leading-relaxed max-h-[9.5rem] sm:max-h-[11rem] overflow-y-auto">
            {card.back.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;