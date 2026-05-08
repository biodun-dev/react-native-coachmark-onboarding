import { createContext } from 'react';
import { LayoutRectangle } from 'react-native';

export type CoachmarkShape = 'rect' | 'circle';

export interface CoachmarkElement {
  id: string;
  layout: LayoutRectangle;
  step: number;
  shape?: CoachmarkShape;
  radius?: number;
}

export interface CoachmarkContextType {
  isActive: boolean;
  currentStep: number;
  elements: Record<string, CoachmarkElement>;
  registerElement: (element: CoachmarkElement) => void;
  unregisterElement: (id: string) => void;
  startSequence: () => void;
  stopSequence: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const CoachmarkContext = createContext<CoachmarkContextType | undefined>(undefined);
