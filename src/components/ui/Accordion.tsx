import { useState } from 'react';
import clsx from 'clsx';

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={clsx('flex flex-col divide-y', className)} style={{ borderColor: 'rgba(148,163,184,0.14)' }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} style={{ borderColor: 'rgba(148,163,184,0.14)' }}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 py-4 text-left cursor-pointer"
            >
              <span className="text-[#F8FAFC] font-medium leading-snug">{item.question}</span>
              <span
                className="text-[#F59E0B] text-lg flex-shrink-0 transition-transform duration-200"
                style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
              >
                +
              </span>
            </button>
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: isOpen ? '600px' : '0px', opacity: isOpen ? 1 : 0 }}
            >
              <p className="pb-4 text-[#CBD5E1] leading-relaxed">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
