# Installation and Uninstallation Guide

Markdown Print Viewer does not need to be installed for ordinary browser use. Installing the GitHub Pages edition as a PWA (Progressive Web App) adds app-like launching. On Windows, it also enables Markdown file association so `.md` files can be opened directly from Explorer. On Android, installation adds the app to the launcher/home screen.

> These instructions follow the Google Chrome and Microsoft Edge help pages available in September 2026. Browser menu names and locations may change in later releases.

## 1. Installation is optional

You can use Markdown Print Viewer directly from GitHub Pages without installing it. The local `index.html` and `offline/index.html` editions also continue to work without installation.

Install the PWA when you want one or more of the following:

- Run Markdown Print Viewer in a standalone app window on Windows
- Double-click `.md` files in Windows Explorer to open them in Markdown Print Viewer
- Launch it directly from the Android home screen/app list
- Make the cached GitHub Pages PWA easier to launch offline after its first successful load

## 2. Windows: Install with Microsoft Edge

1. Open the GitHub Pages edition of Markdown Print Viewer in Microsoft Edge.
2. If the browser judges the PWA installable, the initial Markdown Print Viewer pane shows an **Install app** button. Select it.
3. Confirm installation in Edge's native install prompt.
4. If the in-app button is not shown, use the install icon near the address bar or `…` → **More tools** → **Apps** → **Install this site as an app**.
5. The installed app can then be opened from the Windows Start menu or `edge://apps`.

The in-app **Install app** button is shown only when the browser actually exposes an installation prompt. It remains hidden for the local `file://` edition, unsupported browsers, and when running as an already-installed standalone PWA.

### Associate `.md` files

After installing the PWA:

1. Right-click an `.md` file in Windows Explorer.
2. Choose **Open with** → **Choose another app**.
3. Select **Markdown Print Viewer**.
4. Enable the option to always use this app when desired.

After that, double-clicking an `.md` file launches Markdown Print Viewer and opens that file automatically.

If Markdown Print Viewer does not appear in the Open with list, uninstall and reinstall the PWA once. This can refresh Chromium's OS-level file-handler registration after manifest changes.

## 3. Windows: Install with Google Chrome

1. Open the GitHub Pages edition in Google Chrome.
2. If the initial pane shows **Install app**, select it and follow Chrome's native install prompt.
3. If the in-app button is not shown, use the install icon at the right side of the address bar or open `⋮` → **Cast, save, and share** → **Install page as app**.
4. Follow the on-screen installation steps.
5. Installed web apps can also be managed at `chrome://apps`.

Windows `.md` association is configured in Explorer in the same way as for Edge: use **Open with**, select Markdown Print Viewer, and make it the default when desired.

## 4. Windows: Uninstall

### If installed from Edge

1. Open `edge://apps` in Edge.
2. Open **Details** for Markdown Print Viewer.
3. Select **Uninstall**.
4. Choose whether to delete app history/data if that option is shown.

The app may also appear under Windows **Settings** → **Apps** → **Installed apps**, but `edge://apps` is the most direct method for an Edge-installed PWA.

### If installed from Chrome

Method 1:

1. Open the installed Markdown Print Viewer app.
2. Open the app-window menu and choose **Uninstall Markdown Print Viewer**.
3. Confirm removal.

Method 2:

1. Open `chrome://apps` in Chrome.
2. Select Markdown Print Viewer and uninstall it.

Chrome may offer **Also delete data from Chrome** during removal.

### What happens when app/site data is deleted

Markdown Print Viewer stores user preferences in browser `localStorage`, including:

- Font
- Font size
- Weight
- Line spacing
- Japanese compatibility on/off
- Other browser-side preferences such as UI language

Deleting app/site data resets these preferences and also removes PWA site data such as Service Worker caches. If the app is uninstalled without deleting site data, some preferences may remain when the GitHub Pages site is opened again later.

## 5. Android: Install with Chrome

1. Open the GitHub Pages edition in Chrome for Android.
2. If the initial pane shows **Install app**, tap it and follow Chrome's native installation prompt.
3. If the button is not shown, tap `⋮` to the right of the address bar and choose **Install and create shortcut** → **Install**.
4. Follow the on-screen instructions.

The installed web app appears in the Android launcher/home screen like a normal app.

### About `.md` file association on Android

The Markdown file-handler feature in this project primarily targets desktop Chrome / Edge on Windows. Android can install the PWA, but Windows-style OS association of file-manager `.md` files with Markdown Print Viewer is not part of the supported workflow.

On Android, launch Markdown Print Viewer and use **Open Markdown** to select a file.

## 6. Android: Uninstall

1. Open Android **Settings**.
2. Open **Apps** → **See all apps**.
3. Select **Markdown Print Viewer**.
4. Tap **Uninstall**.

Depending on the Android device/version, you may also be able to long-press the app icon, open App info, and uninstall from there.

## 7. Updating the installed PWA

The GitHub Pages PWA normally updates through its Service Worker when the page/app is reloaded or restarted. Routine version updates do not require uninstalling the app.

If a change to `manifest.webmanifest` does not update Windows Markdown file association correctly, uninstalling and reinstalling the PWA can refresh the OS registration.

## 8. Fully offline edition

`offline/index.html` is the self-contained, dependency-embedded HTML edition. It is intended to be opened directly in a browser and is not the target for PWA installation or Windows `.md` file-handler registration.

For Windows double-click opening of `.md` files, install the standard GitHub Pages `index.html` edition as a PWA.

## Official help

- Microsoft Edge: https://support.microsoft.com/en-us/edge/install-manage-or-uninstall-apps-in-microsoft-edge
- Google Chrome (desktop): https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DDesktop&hl=en
- Google Chrome (Android): https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&hl=en
