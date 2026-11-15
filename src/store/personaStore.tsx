import { createContext, useContext, useState, ReactNode } from 'react';
export type Persona = 'manager' | 'scientist';

interface PersonaContextType {
  persona: Persona;
  setPersona: (p: Persona) => void;
}

const PersonaContext = createContext<PersonaContextType>({
  persona: 'manager',
  setPersona: () => {},
});

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<Persona>('manager');
  return (
    <PersonaContext.Provider value={{ persona, setPersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  return useContext(PersonaContext);
}
