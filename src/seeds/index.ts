import * as path from 'path';
import * as dotenv from 'dotenv';

import { createConnection, ConnectionOptions } from 'typeorm';

import { ParameterFactory } from './parameters.seed';

const NODE_ENV = process.env.NODE_ENV || 'local';
const envPath = path.resolve(__dirname, `../../.env.${NODE_ENV}`);

dotenv.config({ path: envPath });

const opt = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT ? +process.env.DATABASE_PORT : 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [ParameterFactory.entity],
  synchronize: false,
  logging: true
};

(async () => {
  const connection = await createConnection(opt as ConnectionOptions);

  console.info('--- PARAMETERS START ---');

  await ParameterFactory.handle(connection);

  console.info('--- PARAMETERS END ---');

  connection.close();
})()
  .catch(err => console.error(err))
  .finally(() => process.exit(0));
