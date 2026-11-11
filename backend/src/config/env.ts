export const env = {
  port: Number(process.env.PORT ?? 3000),
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    name: process.env.DB_NAME ?? 'stockeasy',
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
  },
  jwtSecret: process.env.JWT_SECRET ?? 'segredo_de_desenvolvimento',
  jwtExpiresIn: Number(process.env.JWT_EXPIRES_IN ?? 86400),
  anthropicKey: process.env.ANTHROPIC_API_KEY ?? '',
};
