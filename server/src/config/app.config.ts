export const EnvConfiguration = () => ({
  jwtSecret: process.env.JWT_SECRET ?? 'default',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
});
