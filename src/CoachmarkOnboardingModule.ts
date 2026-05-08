import { NativeModule, requireNativeModule } from 'expo';

import { CoachmarkOnboardingModuleEvents } from './CoachmarkOnboarding.types';

declare class CoachmarkOnboardingModule extends NativeModule<CoachmarkOnboardingModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<CoachmarkOnboardingModule>('CoachmarkOnboarding');
