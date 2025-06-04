const Redis = require('ioredis');

const redis = new Redis({
  host: 'redis-14951.c10.us-east-1-2.ec2.redns.redis-cloud.com', // ✅ Just the hostname
  port: 14951, // ✅ Port as number, separately
  password: 'a7fHdP1Os0nxS0u63RhTA4QSCxFZLQMt', // ✅ Set this to your Redis Cloud password
});

redis.on('connect', () => {
  console.log('🔌 Connected to Redis Cloud!');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

module.exports = redis;
