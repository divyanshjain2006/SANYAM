import { Microscope, ShieldAlert, Trees } from 'lucide-react';

export const WhoIsItFor = () => {
  const personas = [
    {
      icon: <Microscope className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50 border-indigo-200',
      role: 'Remote Sensing Scientists',
      goal: 'Conduct robust multi-decadal fire trend studies',
      highlight: 'Full provenance, SHA-256 hashes, IoU bipartite metrics, and raw QA flag transparency in Researcher View.',
    },
    {
      icon: <Trees className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-200',
      role: 'Fire & Forest Land Managers',
      goal: 'Understand true regional burning regimes and crop residue schedules',
      highlight: 'Plain-English burning calendars, cloud-obscured day warnings, and cluster boundaries in Story View.',
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-200',
      role: 'Emergency Responders & Policy Analysts',
      goal: 'Verify wildfire spread without confusion between satellite products',
      highlight: 'Single-source harmonized active-fire footprints ready for evacuation planning and smoke dispersion models.',
    },
  ];

  return (
    <section id="our-users" className="py-20 px-6 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-3">
            Target Users
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Who Is SANYAM Built For?
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            From climate researchers needing cryptographic data lineage to field managers requiring instant situational clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personas.map((p) => (
            <div
              key={p.role}
              className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-4 ${p.bg}`}>
                  {p.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {p.role}
                </h3>
                <div className="text-xs font-medium text-blue-600 mt-1 mb-3">
                  {p.goal}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {p.highlight}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 mt-5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Persona View Supported
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoIsItFor;
