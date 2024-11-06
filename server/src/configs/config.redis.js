const { createClient } = require('redis');
require('dotenv').config();

const client = createClient({
    password: process.env.REDIS_PASSWORD || 'E3PFZhFnsc33WbuHjF4QtQhBxmBUFYCv' ,
    socket: {
        host: process.env.REDIS_HOST || 'redis-10227.c299.asia-northeast1-1.gce.redns.redis-cloud.com',
        port: process.env.REDIS_PORT || 10227
    }
});

client.connect().catch((err) => {
    console.error('Lỗi khi kết nối Redis:', err);
});

client.on('connect', () => {
    console.log('Kết nối tới Redis thành công!');
});

client.on('error', (err) => {
    console.error('Lỗi kết nối tới Redis:', err);
});

module.exports = client;
