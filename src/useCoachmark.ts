import { useContext, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { CoachmarkContext, CoachmarkShape } from './CoachmarkContext';

export const useCoachmark = (id: string, step: number, options?: { shape?: CoachmarkShape, radius?: number }) => {
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
          shape: options?.shape,
          radius: options?.radius,
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
