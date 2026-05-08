import * as React from 'react';

import { CoachmarkOnboardingViewProps } from './CoachmarkOnboarding.types';

export default function CoachmarkOnboardingView(props: CoachmarkOnboardingViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
