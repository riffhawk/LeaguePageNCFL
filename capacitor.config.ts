import type { CapacitorConfig } from '@capacitor/cli';

const serverUrl = process.env.CAPACITOR_APP_URL;

const config: CapacitorConfig = {
  appId: 'com.riffhawk.ncfl',
  appName: 'NCFL',
  webDir: 'build',
  bundledWebRuntime: false,
  ...(serverUrl
    ? {
        server: {
          url: serverUrl,
          cleartext: serverUrl.startsWith('http://')
        }
      }
    : {})
};

export default config;
