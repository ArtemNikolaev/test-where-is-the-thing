import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Where is the thing?',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
