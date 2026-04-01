import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME,
    },
    app: {
      port: process.env.PORT || 8080,
      globalPrefix: 'vantora/api',
    },
    jwt:{
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
  };
});