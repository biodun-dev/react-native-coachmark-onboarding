// Reexport the native module. On web, it will be resolved to CoachmarkOnboardingModule.web.ts
// and on native platforms to CoachmarkOnboardingModule.ts
export { default } from './CoachmarkOnboardingModule';
export { default as CoachmarkOnboardingView } from './CoachmarkOnboardingView';
export * from  './CoachmarkOnboarding.types';
