import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'what-is-harmonization',
    q: 'What is satellite active-fire harmonization?',
    a: 'Harmonization is the scientific process of reconciling active-fire observations from different satellite sensors (MODIS at 1 km and VIIRS at 375 m) into a physically consistent, comparable climate data record. It resolves spatial resolution mismatches, observation-opportunity gaps caused by clouds or orbit swaths, and Fire Radiative Power (FRP) calibration differences so cross-sensor comparisons reflect real fire behavior rather than sensor artifacts.',
  },
  {
    id: 'where-data-comes-from',
    q: 'Where does the satellite data come from?',
    a: 'All data originates from official NASA Earth Science Data Systems (ESDS), NASA LANCE, and FIRMS repositories. This includes MODIS Collection 6.1 active fire products (MOD14 for Terra, MYD14 for Aqua) and VIIRS Collection 2 375 m products (VNP14IMG for Suomi-NPP, VJ114IMG for NOAA-20, and VJ214IMG for NOAA-21), complete with quality assurance masks, view zenith geometry, and verifiable SHA-256 granule checksums.',
  },
  {
    id: 'zero-hotspots',
    q: 'Why does "0 hotspots detected" not always mean zero fire?',
    a: 'Active-fire satellite sensors rely on clear mid-infrared atmospheric windows (~3.9 µm). When thick cloud decks, storm systems, or orbital swath gaps coincide with an overpass, active fires remain obscured from space. SANYAM tracks the Observation-Opportunity state for every pass so you can always distinguish true fire-free periods from unobserved cloudy conditions.',
  },
  {
    id: 'applications-use',
    q: 'Can this tool be used for wildfire response and carbon accounting?',
    a: 'Yes. For emergency response, SANYAM provides single-source harmonized active-fire footprints suitable for evacuation perimeter mapping and smoke dispersion modeling. For carbon accountants and climate scientists, it normalizes multi-decadal Fire Radiative Power (FRP) and burning activity calendars to eliminate artificial trend jumps caused by transitioning from MODIS to VIIRS.',
  },
  {
    id: 'contribute-explore',
    q: 'How can I contribute or explore more?',
    a: 'You can explore all interactive capabilities in our Analytical Dashboard—including the Hotspot Footprint Map, Burning Activity Calendar, FRP Studio, and Sensitivity Lab. All harmonized datasets can be exported directly into GIS-ready GeoJSON, CSV, or JSON formats with complete data provenance manifests. Developers and researchers can connect their own PostGIS backends via the ISKHRepository interface.',
  },
];

export const FAQ = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="conclusion" className="py-24 px-6 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/60 border-t border-slate-100">
      <div className="max-w-4xl mx-auto">
        {/* Top Header Section */}
        <div className="text-center mb-12">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-slate-800 border border-slate-300/80 bg-white shadow-sm mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            <span className="uppercase text-[11px] tracking-widest font-semibold">
              Frequently Asked Questions
            </span>
          </div>

          {/* Headline with Two-Tone Styling: "Common Questions" in navy, "Answered" in blue */}
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Common Questions <span className="text-[#0080DF]">Answered</span>
          </h2>
        </div>

        {/* Separated Floating Accordion Cards */}
        <div className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full text-left px-7 py-5 flex items-center justify-between gap-6 font-medium text-slate-900 hover:text-blue-600 transition-colors cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] sm:text-base font-medium text-slate-800 leading-snug">
                    {faq.q}
                  </span>
                  <span
                    className={`shrink-0 text-2xl font-light leading-none select-none transition-transform duration-200 ${
                      isOpen ? 'text-blue-600 rotate-45' : 'text-[#38BDF8] hover:text-blue-500'
                    }`}
                    style={{ fontSize: '24px', lineHeight: '1' }}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="px-7 pb-6 pt-1 text-sm sm:text-[14.5px] text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
