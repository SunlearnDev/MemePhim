import React, { useMemo, useState } from 'react';
import { MdKeyboardArrowRight, MdLiveTv } from 'react-icons/md';
import Wrapper from '../../components/Wrapper/Wrapper';
import GridContainer from '../../components/GridContainer/GridContainer';
import tmdbApi, { TmdbMediaType } from '../../services/tmdbApi';
import { Movie, TV } from '../../Types/Movie';
import ListMovieHorizontal from '../../components/ListMovieHorizontal/ListMovieHorizontal';
import Card from '../../components/Card/Card';
import { useQuery } from '@tanstack/react-query';
import { AiFillPlayCircle } from 'react-icons/ai';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { VideoResult } from '../../Types/Video';
import HeroSlide from '../../components/HeroSlide/HeroSlide';
import { siteMap } from '../../Types/common';
import SkeletonCard from '../../components/Skeleton/SkeletonCard';
import { useVideoModal } from '../../context/VideoModal/VideoModal.context';

type Props = {}

const Home = (props: Props) => {
    const [topRatingSelect, setTopRatingSelect] = useState<"movie" | "tv">("movie");
    const [popularSelect, setPopularSelect] = useState<"movie" | "tv">("movie");
    const videoModal = useVideoModal();

    const trendingQuery = useQuery({
        queryKey: ["trending"],
        queryFn: () => tmdbApi.getTrendingMovies()
    });

    const topRatedQuery = useQuery({
        queryKey: ["top_rated", topRatingSelect],
        queryFn: () => tmdbApi.getList<Movie | TV>(topRatingSelect, "top_rated"),
        keepPreviousData: true
    });

    const popularQuery = useQuery({
        queryKey: ["popular", popularSelect],
        queryFn: () => tmdbApi.getList<Movie | TV>(popularSelect, "popular"),
        keepPreviousData: true
    });

    const latestMovieQuery = useQuery({
        queryKey: ["latest_movie", { page: 1 }],
        queryFn: () => tmdbApi.getDiscoverList<Movie>("movie")
    });

    const latestTVQuery = useQuery({
        queryKey: ["latest_tv", { page: 1 }],
        queryFn: () => tmdbApi.getDiscoverList<TV>("tv")
    });

    const trendingData = useMemo(() => {
        return trendingQuery.data?.data.results.slice(0, 5);
    }, [trendingQuery.data]);

    const handleClickTrailer = (media_type: TmdbMediaType, id: number) => {
        tmdbApi.getVideo<VideoResult>(media_type, id)
            .then(res => {
                videoModal?.open(`${res.data.results[0].site === "YouTube" ? siteMap.YouTube : siteMap.Vimeo || ""}${res.data.results[0].key || ""}`);
            })
            .catch(() => {
                videoModal?.open(`https://www.youtube.com`);
            });
    }

    return (
        <div className='home bg-black mx-auto max-w-7xl p-4'>
            <HeroSlide onClickTrailer={handleClickTrailer} />

            <div className="main-content bg-black rounded-lg p-8 space-y-12">
                
                <section>
                    <Wrapper className='mt-4'>
                        <h2 className='text-gray-100 text-3xl font-semibold relative hover:text-red-400'>
                            Top Trending 
                        </h2>
                        {trendingQuery.data && 
                            <ListMovieHorizontal mediaType='all' className='py-6' data={trendingData || []} />}
                        {trendingQuery.isLoading && 
                            <ListMovieHorizontal mediaType='all' className='py-6' data={[]} skeleton />}
                    </Wrapper>
                </section>

                <section>
                    <Wrapper>
                        <h2 className='text-gray-100 text-3xl font-semibold flex gap-4 items-center relative hover:text-red-400'>
                            Top Rating
                            <div className='flex space-x-4'>
                                <button 
                                    onClick={() => setTopRatingSelect("movie")} 
                                    className={classNames('text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition', { 
                                        'bg-red-500 text-white': topRatingSelect === 'movie', 
                                        'bg-gray-700 text-gray-300': topRatingSelect !== 'movie' 
                                    })}>
                                    <AiFillPlayCircle className='text-xl' /> Movies
                                </button>
                                <button 
                                    onClick={() => setTopRatingSelect("tv")} 
                                    className={classNames('text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition', { 
                                        'bg-red-500 text-white': topRatingSelect === 'tv', 
                                        'bg-gray-700 text-gray-300': topRatingSelect !== 'tv' 
                                    })}>
                                    <MdLiveTv className='text-xl' /> TV-Series
                                </button>
                            </div>
                        </h2>
                        {topRatedQuery.data && 
                            <ListMovieHorizontal mediaType={topRatingSelect} className='py-6' data={topRatedQuery.data.data.results || []} />}
                        {topRatedQuery.isLoading && 
                            <ListMovieHorizontal mediaType='all' className='py-6' data={[]} skeleton />}
                    </Wrapper>
                </section>

                <section>
                    <Wrapper>
                        <h2 className='text-gray-100 text-3xl font-semibold flex gap-4 items-center relative hover:text-red-400'>
                            Popular
                            <div className='flex space-x-4'>
                                <button 
                                    onClick={() => setPopularSelect("movie")} 
                                    className={classNames('text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition', { 
                                        'bg-red-500 text-white': popularSelect === 'movie', 
                                        'bg-gray-700 text-gray-300': popularSelect !== 'movie' 
                                    })}>
                                    <AiFillPlayCircle className='text-xl' /> Movies
                                </button>
                                <button 
                                    onClick={() => setPopularSelect("tv")} 
                                    className={classNames('text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition', { 
                                        'bg-red-500 text-white': popularSelect === 'tv', 
                                        'bg-gray-700 text-gray-300': popularSelect !== 'tv' 
                                    })}>
                                    <MdLiveTv className='text-xl' /> TV-Series
                                </button>
                            </div>
                        </h2>
                        {popularQuery.data && 
                            <ListMovieHorizontal mediaType={popularSelect} className='py-6' data={popularQuery.data.data.results || []} />}
                        {popularQuery.isLoading && 
                            <ListMovieHorizontal mediaType='all' className='py-6' data={[]} skeleton />}
                    </Wrapper>
                </section>

                <section className='latest-movies py-6 bg-black rounded-lg'>
                    <Wrapper>
                        <h2 className='text-gray-100 text-3xl font-semibold flex items-center relative hover:text-red-400'>
                            Movies
                            <Link to={"/movies"} className='ml-auto text-sm text-red-400 hover:text-red-500 transition'>View all<MdKeyboardArrowRight /></Link>
                        </h2>
                        <GridContainer className='gap-4 mt-6'>
                            {latestMovieQuery.data && latestMovieQuery.data.data.results.map((movie) => (
                                <Card key={movie.id} mediaType='movie' data={movie} />
                            ))}
                            {latestMovieQuery.isLoading && Array.from({ length: 14 }, (_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </GridContainer>
                    </Wrapper>
                </section>

                <section className='latest-tv-series py-6 bg-black rounded-lg'>
                    <Wrapper>
                        <h2 className='text-gray-100 text-3xl font-semibold flex items-center relative hover:text-red-400'>
                            TV-Series
                            <Link to={"/tv-series"} className='ml-auto text-sm text-red-400 hover:text-red-500 transition'>View all<MdKeyboardArrowRight /></Link>
                        </h2>
                        <GridContainer className='gap-4 mt-6'>
                            {latestTVQuery.data && latestTVQuery.data.data.results.map((tv) => (
                                <Card key={tv.id} mediaType='tv' data={tv} />
                            ))}
                            {latestTVQuery.isLoading && Array.from({ length: 14 }, (_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </GridContainer>
                    </Wrapper>
                </section>
            </div>
        </div>
    );
};

export default Home;
