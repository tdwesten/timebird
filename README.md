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

## Installation

You can download the latest version of Timebird for **macOS**, **Windows**, and **Linux** from the [GitHub Releases page](https://github.com/thomasvanderwesten/timebird/releases).

### How to Install

#### macOS
1. Go to the [Releases](https://github.com/thomasvanderwesten/timebird/releases) section.
2. Download the `.dmg` or `.app` file for macOS.
3. Open the downloaded file and drag Timebird to your Applications folder.
4. **Because this app is not signed, you may see a security warning.**
   - The first time you try to open Timebird, you may see a message that it "cannot be opened because the developer cannot be verified".
   - To open the app, go to **System Settings > Privacy & Security**.
   - Scroll down to the bottom and you will see a message about Timebird being blocked. Click **Open Anyway**.
   - In the dialog that appears, click **Open** again. This will allow you to run the app in the future by double-clicking it.
5. Open Timebird from Applications as usual. If you see a security warning, right-click the app and choose "Open".

#### Windows
1. Go to the [Releases](https://github.com/thomasvanderwesten/timebird/releases) section.
2. Download the `.msi` or `.exe` installer for Windows.
3. Run the installer and follow the prompts.
4. Launch Timebird from the Start menu or desktop shortcut.

#### Linux
1. Go to the [Releases](https://github.com/thomasvanderwesten/timebird/releases) section.
2. Download the `.AppImage`, `.deb`, or `.tar.gz` file for Linux.
3. For `.AppImage`: Make it executable (`chmod +x Timebird-x.x.x.AppImage`) and run it.
4. For `.deb`: Install with `sudo dpkg -i Timebird-x.x.x.deb`.
5. For `.tar.gz`: Extract and run the binary inside.

## Configuration
- On first launch, you'll be guided through onboarding to enter your Moneybird administration ID, API token, and select your user.
- You can update these settings anytime via the settings button in the bottom right corner.

## Contributing

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


## About
Made by [Thomas van der Westen](https://github.com/thomasvanderwesten), Fullstack developer at Codesmiths.

## License
MIT
