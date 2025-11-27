// src/lib/rollbar.ts
import Rollbar from 'rollbar';

const rollbarConfig: Rollbar.Configuration = {
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
  environment: process.env.NODE_ENV,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        code_version: '0.1.3',
        source_map_enabled: true,
      },
    },
  },
};

// Only initialize Rollbar if token is available
const rollbar = rollbarConfig.accessToken
  ? new Rollbar(rollbarConfig)
  : null;

export default rollbar;
