const Redis = require('ioredis');

const redis = new Redis({
  host: 'redis-11870.c15.us-east-1-2.ec2.redns.redis-cloud.com', // ✅ Just the hostname
  port: 11870, // ✅ Port as number, separately
  password: 'Krishhura1', // ✅ Set this to your Redis Cloud password
});

redis.on('connect', () => {
  console.log('🔌 Connected to Redis Cloud!');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

module.exports = redis;
