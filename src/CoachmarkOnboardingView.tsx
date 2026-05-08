import { requireNativeView } from 'expo';
import * as React from 'react';

import { CoachmarkOnboardingViewProps } from './CoachmarkOnboarding.types';

const NativeView: React.ComponentType<CoachmarkOnboardingViewProps> =
  requireNativeView('CoachmarkOnboarding');

export default function CoachmarkOnboardingView(props: CoachmarkOnboardingViewProps) {
  return <NativeView {...props} />;
}
