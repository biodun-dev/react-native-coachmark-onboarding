import { useContext, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { CoachmarkContext, CoachmarkStepConfig } from './CoachmarkContext';

export const useCoachmark = (
  id: string,
  step: number,
  config?: CoachmarkStepConfig
) => {
  const context = useContext(CoachmarkContext);
  const ref = useRef<View>(null);

  if (!context) {
    throw new Error('useCoachmark must be used within a CoachmarkProvider');
  }

  const { registerElement, unregisterElement } = context;

  const onLayout = () => {
    if (ref.current) {
      ref.current.measureInWindow((x, y, width, height) => {
        registerElement({
          id,
          step,
          layout: { x, y, width, height },
          title: config?.title ?? `Step ${step + 1}`,
          description: config?.description,
          shape: config?.shape,
          radius: config?.radius,
          padding: config?.padding,
        });
      });
    }
  };

  useEffect(() => {
    return () => {
      unregisterElement(id);
    };
  }, [id, unregisterElement]);

  return {
    ref,
    onLayout,
    ...context,
  };
};
