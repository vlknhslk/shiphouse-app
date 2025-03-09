export const config = {
  development: {
    enableLogging: true,
    cameraTimeout: 30000,
  },
  production: {
    enableLogging: false,
    cameraTimeout: 60000,
  },
}[__DEV__ ? 'development' : 'production'];
