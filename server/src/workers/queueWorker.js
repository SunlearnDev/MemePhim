const client = require("../configs/config.redis");
const crawlService = require("../services/cawlMovie.service");
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askToStart() {
    return new Promise((resolve) => {
        rl.question("Bạn có muốn bắt đầu chạy không? (y/n): ", (answer) => {
            resolve(answer.toLowerCase() === 'y');
        });
    });
}

async function processQueue() {
    const start = await askToStart();

    if (!start) {
        console.log("Bạn đã chọn không chạy chương trình.");
        rl.close();
        return;
    }

    console.log("Bắt đầu xử lý hàng đợi...");
    while (true) {
        const page = await client.lPop("urlQueue");

        if (page === '201') {
            console.log(`Dừng vòng lặp vì page là 201`);
            break;
        }

        if (!page) {
            console.log(`Không có link nào trong hàng đợi, chờ 5 giây...`);
            await new Promise(resolve => setTimeout(resolve, 5000)); // Chờ 5 giây
            continue;
        }

        try {
            console.log(`Đang xử lý link ${page}`);
            const items = await crawlService.fetchData(parseInt(page));
            await crawlService.fetchDetail(items);
            console.log(`Đã xử lý xong link ${page}`);
        } catch (e) {
            console.log(`Lỗi khi xử lý link ${page}:`, e);
        }
    }

    rl.close();
}


module.exports = processQueue;
