import { createContext } from 'react';
import { LayoutRectangle } from 'react-native';

export type CoachmarkShape = 'rect' | 'circle';

export type BackdropBehavior = 'skip' | 'next' | 'none';

export interface CoachmarkStepConfig {
  title: string;
  description?: string;
  shape?: CoachmarkShape;
  radius?: number;
  padding?: number;
}

export interface CoachmarkElement {
  id: string;
  layout: LayoutRectangle;
  step: number;
  title: string;
  description?: string;
  shape?: CoachmarkShape;
  radius?: number;
  padding?: number;
}

export interface TooltipRenderProps {
  step: number;
  totalSteps: number;
  title: string;
  description?: string;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export interface CoachmarkProviderProps {
  children: React.ReactNode;
  onFinish?: () => void;
  onSkip?: () => void;
  onStepChange?: (step: number, totalSteps: number) => void;
  backdropBehavior?: BackdropBehavior;
  enabled?: boolean;
  overlayColor?: string;
  renderTooltip?: (props: TooltipRenderProps) => React.ReactNode;
}

export interface CoachmarkContextType {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  elements: Record<string, CoachmarkElement>;
  registerElement: (element: CoachmarkElement) => void;
  unregisterElement: (id: string) => void;
  startSequence: () => void;
  stopSequence: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const CoachmarkContext = createContext<CoachmarkContextType | undefined>(undefined);
