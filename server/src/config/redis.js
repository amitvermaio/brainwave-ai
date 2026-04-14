import { Redis } from '@upstash/redis'
import config from '../config/config.js';

const redis = new Redis({
  url: config.upstashRedisRestUrl,
  token: config.upstashRedisRestToken
})

export default redis;