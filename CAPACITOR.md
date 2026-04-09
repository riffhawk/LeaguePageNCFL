# Capacitor iOS Setup

This project is set up to wrap the deployed web app with Capacitor.

## Config

Capacitor reads the deployed app URL from `CAPACITOR_APP_URL`.

Example:

```bash
CAPACITOR_APP_URL=https://your-deployed-app-url.com npm run cap:sync
```

## Included scripts

```bash
npm run cap:add:ios
npm run cap:sync
npm run cap:copy
npm run cap:open:ios
npx cap doctor
```

## Typical workflow

1. Set your deployed app URL:

```bash
export CAPACITOR_APP_URL=https://your-deployed-app-url.com
```

2. Sync Capacitor:

```bash
npm run cap:sync
```

3. Open the iOS project in Xcode:

```bash
npm run cap:open:ios
```

4. In Xcode, choose a simulator or connected iPhone and run the app.

## Notes

- This setup uses the hosted web app instead of bundling the site into the native shell.
- If your deployed app URL is `http://` instead of `https://`, Capacitor will allow cleartext automatically from the config, but `https://` is strongly recommended for iPhone builds.

## Android emulator hot reload

For the Android Emulator in AVD Manager, point Capacitor at Vite using `10.0.2.2`.

1. Start the local dev server:

```bash
npm run dev
```

This project already binds Vite to `0.0.0.0:5000`.

2. Sync Capacitor to the Android emulator URL:

```bash
CAPACITOR_APP_URL=http://10.0.2.2:5000 npm run cap:sync
```

3. Open Android Studio:

```bash
npm run cap:open:android
```

4. Launch an emulator from AVD Manager and run the app.

### Why `10.0.2.2`?

Inside the Android emulator, `10.0.2.2` maps to your Mac's localhost.

### Hot reload behavior

- Frontend changes from the Vite dev server will refresh much faster in the emulator than the deployed-URL setup.
- If a change does not appear immediately, reload the app inside the emulator.
- If you change native Android settings or Capacitor plugins, run `npm run cap:sync` again.
