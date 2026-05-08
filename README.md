# react-native-coachmark-onboarding

A lightweight, zero-dependency coachmark/onboarding library for React Native. Guide your users through your app with beautiful spotlight walkthroughs — no native modules required.

## ✨ Features

- 🎯 **Spotlight overlay** — highlights any component with a smooth animated cutout
- 🔄 **Animated transitions** — spotlight morphs fluidly between steps
- ⭕ **Multiple shapes** — rectangle, rounded rectangle, or circle
- 📝 **Rich tooltips** — custom title, description, and progress indicator per step
- ⏭ **Auto-stop** — sequence ends automatically after the last step
- 🎨 **Fully customizable** — overlay color, tooltip component, padding, radius
- 📱 **Backdrop behavior** — tap backdrop to skip, advance, or do nothing
- 🔌 **Callback hooks** — `onFinish`, `onSkip`, `onStepChange`
- 🚫 **Zero native dependencies** — works in Expo Go out of the box
- 🧩 **Custom tooltips** — pass your own tooltip component via `renderTooltip`

## 📦 Installation

```bash
npm install react-native-coachmark-onboarding
# or
yarn add react-native-coachmark-onboarding
```

## 🚀 Quick Start

### 1. Wrap your app with the Provider

```tsx
import { CoachmarkProvider } from 'react-native-coachmark-onboarding';

export default function App() {
  return (
    <CoachmarkProvider
      onFinish={() => console.log('Tour complete!')}
      onSkip={() => console.log('Tour skipped')}
      backdropBehavior="next"
    >
      <YourApp />
    </CoachmarkProvider>
  );
}
```

### 2. Register coachmark targets

```tsx
import { useCoachmark } from 'react-native-coachmark-onboarding';

function ProfileButton() {
  const { ref, onLayout } = useCoachmark('profile', 0, {
    title: 'Your Profile',
    description: 'Tap here to view and edit your profile settings.',
    shape: 'circle',
    padding: 12,
  });

  return (
    <View ref={ref} onLayout={onLayout}>
      <ProfileIcon />
    </View>
  );
}
```

### 3. Start the walkthrough

```tsx
function HomeScreen() {
  const { startSequence } = useCoachmark('trigger', -1, { title: 'Trigger' });

  return (
    <Button title="Start Tour" onPress={startSequence} />
  );
}
```

## 📖 API Reference

### `<CoachmarkProvider>`

Wrap your app to enable coachmarks.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onFinish` | `() => void` | — | Called when the user completes all steps |
| `onSkip` | `() => void` | — | Called when the user taps "Skip" |
| `onStepChange` | `(step, total) => void` | — | Called on every step change |
| `backdropBehavior` | `'skip' \| 'next' \| 'none'` | `'none'` | What happens when backdrop is tapped |
| `enabled` | `boolean` | `true` | Set to `false` to disable the tour |
| `overlayColor` | `string` | `'rgba(0,0,0,0.7)'` | Backdrop overlay color |
| `renderTooltip` | `(props: TooltipRenderProps) => ReactNode` | — | Custom tooltip component |

### `useCoachmark(id, step, config?)`

Hook to register a component as a coachmark target.

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Unique identifier for this target |
| `step` | `number` | Step number in the sequence (0-indexed) |
| `config` | `CoachmarkStepConfig` | Step configuration (see below) |

**Returns:** `{ ref, onLayout, startSequence, stopSequence, nextStep, prevStep, isActive, currentStep, totalSteps }`

### `CoachmarkStepConfig`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | `'Step N'` | Tooltip title |
| `description` | `string` | — | Tooltip description |
| `shape` | `'rect' \| 'circle'` | `'rect'` | Spotlight shape |
| `radius` | `number` | `8` | Border radius for rect shape |
| `padding` | `number` | `8` | Breathing room around the spotlight |

### `TooltipRenderProps`

Props passed to your custom tooltip component:

| Property | Type | Description |
|----------|------|-------------|
| `step` | `number` | Current step index |
| `totalSteps` | `number` | Total number of steps |
| `title` | `string` | Step title |
| `description` | `string?` | Step description |
| `onNext` | `() => void` | Advance to next step |
| `onPrev` | `() => void` | Go back to previous step |
| `onSkip` | `() => void` | Skip the tour |
| `isFirstStep` | `boolean` | Whether this is the first step |
| `isLastStep` | `boolean` | Whether this is the last step |

## 🎨 Custom Tooltip Example

```tsx
function MyTooltip({ title, description, onNext, onSkip, step, totalSteps, isLastStep }) {
  return (
    <View style={{ backgroundColor: '#1a1a2e', padding: 20, borderRadius: 16 }}>
      <Text style={{ color: '#e94560', fontWeight: '700' }}>{title}</Text>
      <Text style={{ color: '#eee', marginTop: 8 }}>{description}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
        <Text onPress={onSkip} style={{ color: '#999' }}>Skip</Text>
        <Text onPress={onNext} style={{ color: '#e94560' }}>
          {isLastStep ? 'Finish' : 'Next →'}
        </Text>
      </View>
    </View>
  );
}

// Usage
<CoachmarkProvider renderTooltip={(props) => <MyTooltip {...props} />}>
  <App />
</CoachmarkProvider>
```

## 💾 Persistent Progress

Use `AsyncStorage` with the `onFinish` callback to remember completed tours:

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  const [tourDone, setTourDone] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('tour_complete').then((val) => {
      if (val === 'true') setTourDone(true);
    });
  }, []);

  return (
    <CoachmarkProvider
      enabled={!tourDone}
      onFinish={() => {
        setTourDone(true);
        AsyncStorage.setItem('tour_complete', 'true');
      }}
    >
      <MyApp />
    </CoachmarkProvider>
  );
}
```

## 🛠 Development

```bash
# Install dependencies
npm install

# Run the example app
cd example
npm install
npx expo start

# Run type checks
npm run typecheck

# Run linter
npm run lint
```

## 📄 License

MIT
