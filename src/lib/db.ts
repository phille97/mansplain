"use server";

import { createClient } from 'redis';
import type { RedisClientType } from 'redis';


let client: RedisClientType | null = null;

const getClient = async () => {
  if (client === null) {
    client = createClient({
      url: process.env.REDIS_URL,
    });

    client.on('error', err => console.log('redis client error', err));

    await client.connect();
  }
  return client
}

export const set = async (key: string, value: any) => {
  const c = await getClient();

  await c.json.set(key, "$", value)
}

export const get = async (key: string) => {
  const c = await getClient();

  return await c.json.get(key)
}