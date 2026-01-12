import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  datasource: {
    // Para o CLI (migrações), usamos a DIRECT_URL
    url: process.env.DIRECT_URL as string,
  },
}); 