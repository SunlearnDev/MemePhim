// cronJob.js
const cron = require('node-cron');
const crawlService = require('../services/cawlMovie.service');
const processQueue = require('../workers/queueWorker');
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

// (async () => {
//   console.log('Khởi tạo hàng đợi ngay khi khởi động server...');
//   await crawlService.populateQueue(process.env.CRAWL_API_TOTAL_PAGES);
// })();
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Bắt đầu cron job: Crawl dữ liệu từ API');

    const result = await crawlService.populateQueue();
    console.log('Dữ liệu đã được crawl và lưu thành công:', result);
  } catch (error) {
    console.error('Lỗi trong cron job crawl dữ liệu:', error);
  }
}, {
  timezone: "Asia/Ho_Chi_Minh" 
});
processQueue().catch((error) => {
  console.error('Lỗi khi khởi động worker:', error);
});
