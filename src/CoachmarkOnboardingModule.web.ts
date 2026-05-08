import { registerWebModule, NativeModule } from 'expo';

import { CoachmarkOnboardingModuleEvents } from './CoachmarkOnboarding.types';

class CoachmarkOnboardingModule extends NativeModule<CoachmarkOnboardingModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(CoachmarkOnboardingModule, 'CoachmarkOnboardingModule');
