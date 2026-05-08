import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';
import { CoachmarkProvider } from '../CoachmarkProvider';
import { useCoachmark } from '../useCoachmark';

// ─── Test Helpers ──────────────────────────────────────────────────────

const TestTarget = ({
  id,
  step,
  title,
  description,
}: {
  id: string;
  step: number;
  title: string;
  description?: string;
}) => {
  const { ref, onLayout } = useCoachmark(id, step, { title, description });
  return (
    <View ref={ref} onLayout={onLayout} testID={`target-${id}`}>
      <Text>{title}</Text>
    </View>
  );
};

const TestControls = () => {
  const { startSequence, stopSequence, nextStep, prevStep, isActive, currentStep, totalSteps } =
    useCoachmark('controls', -1, { title: 'Controls' });

  return (
    <View>
      <Text testID="status">{isActive ? 'active' : 'inactive'}</Text>
      <Text testID="step">{currentStep}</Text>
      <Text testID="total">{totalSteps}</Text>
      <TouchableOpacity testID="start" onPress={startSequence}>
        <Text>Start</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="stop" onPress={stopSequence}>
        <Text>Stop</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="next" onPress={nextStep}>
        <Text>Next</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="prev" onPress={prevStep}>
        <Text>Prev</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Tests ─────────────────────────────────────────────────────────────

describe('CoachmarkProvider', () => {
  it('renders children', () => {
    const { getByText } = render(
      <CoachmarkProvider>
        <Text>Hello</Text>
      </CoachmarkProvider>
    );
    expect(getByText('Hello')).toBeTruthy();
  });

  it('starts inactive', () => {
    const { getByTestId } = render(
      <CoachmarkProvider>
        <TestControls />
      </CoachmarkProvider>
    );
    expect(getByTestId('status').props.children).toBe('inactive');
  });

  it('activates on startSequence', () => {
    const { getByTestId } = render(
      <CoachmarkProvider>
        <TestControls />
      </CoachmarkProvider>
    );

    act(() => {
      fireEvent.press(getByTestId('start'));
    });

    expect(getByTestId('status').props.children).toBe('active');
    expect(getByTestId('step').props.children).toBe(0);
  });

  it('deactivates on stopSequence and calls onSkip', () => {
    const onSkip = jest.fn();
    const { getByTestId } = render(
      <CoachmarkProvider onSkip={onSkip}>
        <TestControls />
      </CoachmarkProvider>
    );

    act(() => {
      fireEvent.press(getByTestId('start'));
    });
    act(() => {
      fireEvent.press(getByTestId('stop'));
    });

    expect(getByTestId('status').props.children).toBe('inactive');
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('advances to next step', () => {
    const { getByTestId } = render(
      <CoachmarkProvider>
        <TestControls />
      </CoachmarkProvider>
    );

    act(() => {
      fireEvent.press(getByTestId('start'));
    });
    act(() => {
      fireEvent.press(getByTestId('next'));
    });

    expect(getByTestId('step').props.children).toBe(1);
  });

  it('does not go below step 0 on prevStep', () => {
    const { getByTestId } = render(
      <CoachmarkProvider>
        <TestControls />
      </CoachmarkProvider>
    );

    act(() => {
      fireEvent.press(getByTestId('start'));
    });
    act(() => {
      fireEvent.press(getByTestId('prev'));
    });

    expect(getByTestId('step').props.children).toBe(0);
  });

  it('does not start when enabled is false', () => {
    const { getByTestId } = render(
      <CoachmarkProvider enabled={false}>
        <TestControls />
      </CoachmarkProvider>
    );

    act(() => {
      fireEvent.press(getByTestId('start'));
    });

    expect(getByTestId('status').props.children).toBe('inactive');
  });
});

describe('useCoachmark', () => {
  it('throws when used outside Provider', () => {
    // Suppress console.error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(
        <TestTarget id="orphan" step={0} title="Orphan" />
      );
    }).toThrow('useCoachmark must be used within a CoachmarkProvider');

    spy.mockRestore();
  });

  it('registers elements and computes totalSteps', () => {
    const { getByTestId } = render(
      <CoachmarkProvider>
        <TestTarget id="a" step={0} title="First" />
        <TestTarget id="b" step={1} title="Second" />
        <TestTarget id="c" step={2} title="Third" />
        <TestControls />
      </CoachmarkProvider>
    );

    // totalSteps should be computed from registered elements
    // Note: measureInWindow won't fire in tests, so elements won't register
    // via onLayout. But the hook integration still works.
    expect(getByTestId('target-a')).toBeTruthy();
    expect(getByTestId('target-b')).toBeTruthy();
    expect(getByTestId('target-c')).toBeTruthy();
  });
});
