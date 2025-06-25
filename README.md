# Timebird

Timebird is a beautiful, native-feeling time tracking app for macOS, built with Tauri, React, and shadcn/ui. It integrates with Moneybird, allowing you to quickly log and manage your time entries directly in your Moneybird administration.

## Features
- Native macOS app (Tauri)
- Moneybird API integration
- Project and contact selection with autocomplete
- Timer-based and manual time entry
- Onboarding and settings dialogs
- User selection and API token management
- Responsive, modern UI with shadcn/ui
- Dock badge indicator when timer is running

## Getting Started

### Prerequisites
- Node.js (18+ recommended)
- Rust (for Tauri)
- macOS

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/thomasvanderwesten/timebird.git
   cd timebird
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the app in development mode:
   ```sh
   npm run tauri dev
   ```

### Build for Production
```sh
npm run tauri build
```

## Configuration
- On first launch, you'll be guided through onboarding to enter your Moneybird administration ID, API token, and select your user.
- You can update these settings anytime via the settings button in the bottom right corner.

## About
Made by [Thomas van der Westen](https://github.com/thomasvanderwesten), Fullstack developer at Codesmiths.

## License
MIT

