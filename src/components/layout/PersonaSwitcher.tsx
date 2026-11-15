import { Toggle } from '../ui/Toggle';
import { usePersona } from '../../store/personaStore';

const PERSONA_OPTIONS: [{ value: string; label: string }, { value: string; label: string }] = [
  { value: 'manager', label: '🗂 Story View' },
  { value: 'scientist', label: '🔬 Researcher View' },
];

interface PersonaSwitcherProps {
  className?: string;
}

export function PersonaSwitcher({ className }: PersonaSwitcherProps) {
  const { persona, setPersona } = usePersona();

  return (
    <Toggle
      options={PERSONA_OPTIONS}
      value={persona}
      onChange={(v) => setPersona(v as 'manager' | 'scientist')}
      className={className}
    />
  );
}

export default PersonaSwitcher;
