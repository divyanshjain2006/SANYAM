import { useState } from 'react';
import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
    <div className={clsx('flex flex-col divide-y divide-slate-200', className)}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="py-2">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 py-3 text-left cursor-pointer transition-colors"
            >
              <span className="text-slate-900 font-semibold text-base leading-snug hover:text-blue-600">
                {item.question}
              </span>
              <span className="text-slate-400 flex-shrink-0">
                {isOpen ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5" />}
              </span>
            </button>
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: isOpen ? '600px' : '0px', opacity: isOpen ? 1 : 0 }}
            >
              <p className="pb-3 text-slate-600 leading-relaxed text-sm">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
