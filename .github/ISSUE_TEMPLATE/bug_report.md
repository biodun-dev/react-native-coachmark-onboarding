name: Bug report
description: Create a report to help us improve
labels: ["bug"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!
  - type: textarea
    id: bug-description
    attributes:
      label: Describe the bug
      description: A clear and concise description of what the bug is.
    validations:
      required: true
  - type: textarea
    id: reproduction-steps
    attributes:
      label: Steps To Reproduce
      description: Steps to reproduce the behavior.
      placeholder: |
        1. Open the app
        2. Navigate to...
        3. See error
    validations:
      required: true
  - type: textarea
    id: expected-behavior
    attributes:
      label: Expected Behavior
      description: A clear and concise description of what you expected to happen.
    validations:
      required: true
  - type: input
    id: environment
    attributes:
      label: Environment
      description: Expo version, React Native version, Device, OS, etc.
    validations:
      required: true
  - type: textarea
    id: additional-context
    attributes:
      label: Additional context
      description: Add any other context about the problem here.
