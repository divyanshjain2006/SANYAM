import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Why does '0 hotspots' not always mean '0 fire'?",
    answer:
      "A detection count of zero can arise from three distinct situations: (1) genuine fire-free conditions, " +
      "(2) cloud obscuration blocking the sensor's view — cloud_obscured_fraction may be near 1.0 even when " +
      "fire is burning vigorously below the cloud deck, or (3) orbital swath gaps where the satellite simply " +
      "did not pass over the area during that overpass (outside_swath). SANYAM's observation-opportunity layer " +
      "tracks and reports the observation state for every granule, ensuring that valid non-detections are never " +
      "mistaken for true fire-free periods.",
  },
  {
    question: "What's the difference between Active-Fire and Burned-Area products?",
    answer:
      "Active fire (AF) products — such as MODIS MOD14/MYD14 and VIIRS VNP14IMG/VJ114IMG — detect thermal anomalies " +
      "(hotspots) in real-time as the satellite passes overhead, capturing active combustion and fire radiative power. " +
      "In contrast, Burned area (BA) products — like MODIS MCD64A1 and VIIRS VNP64A1 — use post-fire surface reflectance " +
      "changes to map the cumulative spatial extent of scorched vegetation, usually published with a latency of 1 to 2 " +
      "months. SANYAM focuses on harmonizing multi-sensor AF observations while supporting linkage to BA validation datasets.",
  },
  {
    question: "Why are Candidate Matches not Confirmed Physical Fires?",
    answer:
      "A candidate match means two detections (one MODIS, and one or more VIIRS) are spatially coincident and temporally " +
      "correlated within the valid overpass window, with overlapping ground footprints. While this indicates a high likelihood " +
      "of observing the same event, it is not physical confirmation: multiple small, distinct fires may occur within a single " +
      "1-km² MODIS pixel, or thermal diffraction and atmospheric scattering may broaden the signature. Scientific confirmation " +
      "requires supplementary lines of evidence, such as coincident burn scars in BA products or ground-truth field data.",
  },
  {
    question: "What is the MODIS detection limit?",
    answer:
      "MODIS detects thermal anomalies within 1 km × 1 km pixels at nadir. Because of this footprint size, daytime detection " +
      "requires an active fire to emit approximately 5.7 MW of Fire Radiative Power (FRP) against typical solar-heated backgrounds. " +
      "At night, lower background surface temperatures allow detection down to ~1–2 MW. By contrast, the 375-m VIIRS pixels have a daytime " +
      "detection threshold of only ~1.5 MW, enabling VIIRS to consistently register small agricultural fires and low-intensity flaming " +
      "fronts that remain completely invisible to MODIS.",
  },
  {
    question: "What do IoU and Os mean?",
    answer:
      "IoU (Intersection over Union) measures the spatial overlap area divided by the union area of the two sensor footprint " +
      "polygons. Because a MODIS pixel is roughly 7× larger than a VIIRS pixel (~1,000,000 m² vs. ~140,625 m²), even a VIIRS pixel " +
      "completely enclosed within a MODIS footprint produces an IoU of only ~0.14. To overcome this structural limitation, SANYAM uses " +
      "Os (Smaller-Footprint Overlap): the intersection area divided specifically by the smaller footprint (usually VIIRS). An Os of 1.0 " +
      "signifies 100% containment of the VIIRS footprint inside the MODIS polygon, providing an intuitive, normalized metric of spatial agreement.",
  },
  {
    question: "What is the FRP Observation Operator?",
    answer:
      "The FRP Observation Operator is a sensor-aware mathematical transfer function that maps raw satellite Fire Radiative " +
      "Power into an unbiased, harmonized radiative flux scale. It accounts for three crucial physical effects: (1) pixel point " +
      "spread function and ground footprint area differences (1 km vs. 375 m), (2) instrument-specific detection thresholds Dp (5.7 MW " +
      "for MODIS vs. 1.5 MW for VIIRS), and (3) solar illumination differences between day and night overpasses. Applying this operator " +
      "allows researchers to conduct rigorous, apples-to-apples fire energy budget and emission analyses across mixed sensor constellations.",
  },
];

const FAQRow: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void }> = ({
  item,
  isOpen,
  onToggle,
}) => (
  <div
    className="rounded-xl overflow-hidden transition-colors duration-200"
    style={{
      background: '#192234',
      border: isOpen ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(148, 163, 184, 0.14)',
    }}
  >
    <button
      type="button"
      className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left transition-colors duration-200 hover:bg-slate-800/30"
      style={{ background: 'transparent', cursor: 'pointer', border: 'none' }}
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      <span className="font-semibold text-base md:text-lg" style={{ color: isOpen ? '#F59E0B' : '#F8FAFC' }}>
        {item.question}
      </span>
      <ChevronDown
        className="w-5 h-5 shrink-0 transition-transform duration-300"
        style={{
          color: isOpen ? '#F59E0B' : '#94A3B8',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      />
    </button>
    <div
      className="transition-all duration-300 ease-in-out overflow-hidden"
      style={{
        maxHeight: isOpen ? '1000px' : '0px',
        opacity: isOpen ? 1 : 0,
        transition: 'max-height 0.35s ease-in-out, opacity 0.25s ease-in-out',
      }}
    >
      <div
        className="px-7 pb-6 pt-1 text-sm md:text-base border-t border-slate-800/60"
        style={{ color: '#CBD5E1', lineHeight: 1.65 }}
      >
        {item.answer}
      </div>
    </div>
  </div>
);

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 px-6" style={{ background: 'rgba(25,34,52,0.4)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: '#A78BFA' }}>
            Knowledge Base
          </p>
          <h2 className="text-4xl font-bold" style={{ color: '#F8FAFC' }}>Scientific FAQ</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: '#CBD5E1', lineHeight: 1.65 }}>
            Comprehensive explanations of the physical, optical, and mathematical principles behind MODIS–VIIRS harmonization.
          </p>
        </div>

        <div className="flex flex-col gap-3.5">
          {faqs.map((faq, idx) => (
            <FAQRow
              key={idx}
              item={faq}
              isOpen={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
