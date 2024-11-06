import axios from 'axios';
import axiosInstance from "./axiosInstance";

export type MediaType = "phim-le" | "phim-bo" | "hoat-hinh" | "tv-shows";

const phimApi = {
   // Lấy danh sách phim theo MediaType
  getMoviesByType: (mediaType: MediaType, page = 1) => {
    const url = `/v1/api/danh-sach/${mediaType}`;
    return axiosInstance.get(url, { params: { page } });
  },

  // Lấy thông tin chi tiết phim và danh sách tập phim
  getMovieDetails: (slug: string) => {
    const url = `/phim/${slug}`;
    return axiosInstance.get(url);
  },

  // Tìm kiếm phim theo từ khóa
  searchMovies: (keyword: string, limit = 10) => {
    const url = `/v1/api/tim-kiem`;
    return axiosInstance.get(url, {
      params: { keyword, limit },
    });
  },
};

export default phimApi;
