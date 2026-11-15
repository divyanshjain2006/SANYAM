import { useState } from 'react';
import type { CaseStudy } from '../types';

export function useCaseStudy() {
  const [activeCaseStudy, setActiveCaseStudy] = useState<CaseStudy | null>(null);
  return { activeCaseStudy, setActiveCaseStudy, clearCaseStudy: () => setActiveCaseStudy(null) };
}
