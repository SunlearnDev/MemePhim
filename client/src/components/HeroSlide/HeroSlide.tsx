import React, { memo } from "react";
import { BsFillPlayFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { MdLiveTv } from "react-icons/md";
import Wrapper from "../Wrapper/Wrapper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import SwiperCore, { Autoplay } from "swiper";
import { Link } from "react-router-dom";
import { BiMoviePlay } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import SkeletonHeroSlice from "../Skeleton/SkeletonHeroSlice";

SwiperCore.use([Autoplay]);

type Video = {
  _id: string;
  name: string;
  quality: string;
  year: number;
  poster_url: string;
  type: string;
  category: { name: string; slug: string }[];
};

const HeroSlide = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["latest_videos"],
    queryFn: async () => {
      const response = await fetch("https://phimapi.com/v1/api/danh-sach/hoat-hinh");
      const result = await response.json();
      return result.data.items.slice(0, 7);
    },
  });

  return (
    <div className="hero-box">
      <Swiper
        slidesPerView={1}
        modules={[Pagination]}
        pagination={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
      >
        {isLoading && (
          <SwiperSlide>
            <SkeletonHeroSlice />
          </SwiperSlide>
        )}

        {data?.map((video: Video) => (
          <SwiperSlide key={video._id}>
            <Slice video={video} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

interface SliceProps {
  video: Video;
}
const Slice = memo(({ video }: SliceProps) => {
  return (
    <div
      className="hero-slide"
      style={{
        backgroundImage: `url(https://phimimg.com/${video.poster_url})`,
      }}
    >
      <Wrapper className="h-full relative z-10">
        <div className="slide-content w-full md:w-[65%] pr-6">
          <Link
            to={`/phim/${video.type}/${video._id}`}
            className="movie-name text-3xl md:text-4xl text-white font-bold drop-shadow-lg block pr-6"
          >
            {video.name}
          </Link>
          <div className="movie-info flex items-center gap-2 sm:gap-4 md:gap-6 mt-2">
            <Link className="quality px-3 py-0.5 flex items-center rounded bg-dark-teal font-medium text-white text-xl">
              <MdLiveTv />
              {video.quality}
            </Link>
            <span className="year text-white text-sm">{video.year}</span>
            <div className="cate">
              {video.category.map((item) => (
                <a
                  href="#"
                  key={item.slug}
                  className="cates inline-block mr-3 text-xs text-white/60 hover:text-white transition-colors duration-300 ease-out"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div className="buttons mt-8 flex gap-6">
            <Link
              to={`/phim/${video.type}/${video._id}`}
              className="watch-btn banner-btn border-dark-teal text-dark-teal hover:bg-dark-teal hover:text-white"
            >
              <BsFillPlayFill size={20} /> Watch now
            </Link>
            <button
              className="add-btn banner-btn border-white/50 text-white/50 hover:bg-white hover:text-black"
            >
              <BiMoviePlay size={16} /> Trailer
            </button>
          </div>
        </div>
      </Wrapper>
    </div>
  );
});

export default HeroSlide;
