"use strict";
const axios = require("axios");
const client = require("../configs/config.redis");
const Movie = require("./movie.service");

class CawlerService {
  static async fetchData(page) {
    try {
      const url = `${process.env.CRAWL_API_URL}?page=${page}`;
      const response = await axios.get(url);
      return response.data.data.items;
    } catch (error) {
      console.error(`Lỗi khi fetch dữ liệu từ trang ${page}:`, error);
      throw error;
    }
  }
  static async fetchDetail(items) {
    try {
      for (const item of items) {
        const url = `${process.env.CRAWL_DETAIL_API_URL}/${item.slug}`;
        const response = await axios.get(url);
        const fetchDetail = await Movie.createMovie(response.data.episodes, response.data.movie);
        return fetchDetail;
      }
    } catch (error) {
      console.error(`Lỗi khi fetch chi tiết từ trang ${items}:`, error);
      throw error;
    }
  }
  static async populateQueue(pages) {
    for (let page = 1; page <= pages; page++) {
      const fetchPage = await client.rPush("urlQueue", String(page));
      if (!fetchPage) break;
    }
  }
}
module.exports = CawlerService;
