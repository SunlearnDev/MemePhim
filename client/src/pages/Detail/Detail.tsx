import React, { useEffect, useRef, useState } from 'react'
import Wrapper from '../../components/Wrapper/Wrapper'
import { BsClockHistory } from 'react-icons/bs'
import { AiFillStar } from 'react-icons/ai'
import { SlArrowRight } from 'react-icons/sl'
import tmdbApi, { TmdbMediaType } from '../../services/tmdbApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation, useParams } from 'react-router-dom'
import { DetailMovie, DetailTV, Movie, TV, TrendingVideo } from '../../Types/Movie'
import { originalImage } from '../../services/apiConfigs'
import { Cast, Crew } from '../../Types/Cast'
import ListMovieHorizontal from '../../components/ListMovieHorizontal/ListMovieHorizontal'
import { VideoResult } from '../../Types/Video'
import Error404Page from '../Error/Error404Page'
import axios, { AxiosError } from 'axios'
import Error500Page from '../Error/Error500Page'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import SkeletonDetail from '../../components/Skeleton/SkeletonDetail'
import { MdOutlineFavorite, MdOutlineFavoriteBorder, MdPlayArrow, MdPause, MdVolumeUp, MdVolumeOff } from 'react-icons/md';
import withAuth from '../../HOC/withAuth'
import { AuthState } from '../../context/auth/auth.context'
import authServices from '../../services/axiosBackend/auth/auth.services'
import { useForm } from '../../context/form/form.context'
import { useRotatingLoader } from '../../context/RotatingLoader/RotatingLoader.context'
import FBComment from '../../components/FBComment/FBComment'
import { useVideoModal } from '../../context/VideoModal/VideoModal.context'
import { siteMap } from '../../Types/common'

type Props = {
    mediaType: TmdbMediaType
}
type Detail = {
    _id: string;
    name: string;
    origin_name: string;
    slug: string;
    year: number;
    episode_current: string;
    episode_total: string;
    poster_url: string;
    type: string;
    category: { name: string; slug: string }[];
    content: string;
    time: string;
};

type Episodes = {
    server_data: { slug: string; link_embed: string; name: string }[];
};
  
const Detail = ({ mediaType, auth }:  Props & { auth: AuthState | null }) => {
    const [episodeList, setEpisodeList] = useState<Episodes['server_data']>([]);
    const [currentEpisode, setCurrentEpisode] = useState<number>(1);
    const [movieData, setMovieData] = useState<Detail | null>(null);
    const videoModal = useVideoModal()
    const [showPlayer, setShowPlayer] = useState(false);
    const [showLimit, setShowLimit] = useState(10);
    const [showEpisodes, setShowEpisodes] = useState(false);// Thêm biến để kiểm soát hiển thị danh sách tập
    const videoPlayerRef = useRef<HTMLDivElement | null>(null) // Đã thêm kiểu cho ref
    
    const handleShowMore = () => {
        setShowLimit(prevLimit => prevLimit + 7); // Tăng số tập được hiển thị mỗi lần nhấn
    };

    // Khi showPlayer bật, cuộn trang đến video player
    useEffect(() => {
        if (showPlayer) {
            videoPlayerRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [showPlayer])
    const { id } = useParams()
    const location = useLocation()
    const formLogin = useForm()
    const queryClient = useQueryClient()
    const rotatingLoader = useRotatingLoader()

    if (!id || !Number(id)) return <Error404Page />

    const { data, status, error, isFetching, isFetched } = useQuery({
        queryKey: ["detail", mediaType, id],
        queryFn: () => tmdbApi.getDetail<DetailMovie | DetailTV>(mediaType, +id),
        enabled: id !== undefined
    })
    const handleSelectEpisode = (episodeNumber: number) => {
        setCurrentEpisode(episodeNumber);  // Cập nhật tập hiện tại
        setShowPlayer(true);               // Mở player
        setShowEpisodes(true); // Hiển thị danh sách tập
    };
    const handleShowPlayer = () => {
        setCurrentEpisode(1); // Mặc định tập 1 khi xem lần đầu
        setShowPlayer(true); // Hiển thị player
        setShowEpisodes(true); // Hiển thị danh sách tập
    };
    const queryCast = useQuery({
        queryKey: ["cast", mediaType, id],
        queryFn: () => tmdbApi.getCast<{ cast: Cast[], crew: Crew[] }>(mediaType, +id),
        enabled: id !== undefined
    })

    const recommendsQuery = useQuery({
        queryKey: ["recommends", mediaType, id],
        queryFn: () => tmdbApi.getRecommendations<Movie | TV | TrendingVideo>(mediaType, +id),
        enabled: id !== undefined
    })

    const handleClickTrailer = (media_type: TmdbMediaType, id: number) => {
        tmdbApi.getVideo<VideoResult>(mediaType, id)
            .then(res => {
                videoModal?.open(`${res.data.results[0].site === "YouTube" ? siteMap.YouTube : siteMap.Vimeo || ""}${res.data.results[0].key || ""}`)
            })
            .catch(error => {
                videoModal?.open(`https://www.youtube.com`)
            })
    }

    if (!data && isFetched || error) {
        if (axios.isAxiosError(error) && (error as AxiosError).response?.status === 404) {
            return <Error404Page />
        }
        return <Error500Page />
    }

    const checkAddedToFavorite = useQuery({
        queryKey: ["detail", { id, mediaType }, "check-favorite"],
        queryFn: () => authServices.checkAddedToFavorite({ id: id + "", type: mediaType }),
        enabled: auth !== null && auth?.isLogged
    })

    const toggleFavoriteMutation = useMutation({
        mutationFn: ({ id, type }: { type: TmdbMediaType; id: string }) => {
            rotatingLoader?.showLoader()
            if (checkAddedToFavorite.data?.data.added) {
                return authServices.removeFavorite({ id, type })
            }
            return authServices.addFavorite({ id, type })
        },
        onSuccess(data, variables, context) {
            if (!checkAddedToFavorite.data) return
            const newData = { ...checkAddedToFavorite.data }
            if (newData.data.added) {
                newData.data.added = false
            }
            else {
                newData.data.added = true
            }
            queryClient.setQueryData(["detail", { id, mediaType }, "check-favorite"], newData)
            queryClient.invalidateQueries({ queryKey: ["favorites"] })
            rotatingLoader?.hiddenLoader()
            return data

        },
        onError(error, variables, context) {
            console.log(error)
            rotatingLoader?.hiddenLoader()
            return error;
        },
    })

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location])


    const handleToggleFavorite = () => {
        if (!auth?.isLogged) {
            formLogin?.requestOpenForm()
            return
        }
        toggleFavoriteMutation.mutate({ id, type: mediaType })
    }
    const handleClosePlayer = () => {
        setCurrentEpisode(1); // Đặt lại tập hiện tại
        setShowPlayer(false);    // Ẩn player
        setShowEpisodes(false);  // Ẩn danh sách tập
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://phimapi.com/phim/bai-hat-cho-cong-dan-nhi'); 
                const result = await response.json();
                console.log(result.movie)
                setMovieData(result.movie as Detail);
                setEpisodeList(result.episodes[0].server_data as Episodes['server_data']);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);


    return (
         <div className='detail-page' >
        {showPlayer && (
                <div ref={videoPlayerRef} className="video-player-container mt-5 relative mb-10">
                    <iframe
                        // src={`https://player.phimapi.com/player/?url=https://s4.phim1280.tv/20241101/qHp14hPo/${currentEpisode}.m3u8`}
                        src={`${episodeList[currentEpisode - 1].link_embed}`}
                        width="100%"
                        height="650px"
                        allowFullScreen
                        title={`Video Player - Episode ${currentEpisode}`}
                        className="video-iframe rounded-lg"
                    ></iframe>
                    <button
                        onClick={() => handleClosePlayer()}
                        className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full cursor-pointer text-lg"
                    >
                        ✕
                    </button>
                </div>
            )}
            
            
             
                {                  
                  movieData &&  <div className="detail" style={{ backgroundImage: `url(${movieData.poster_url})` }}>
                  <Wrapper className='relative z-[1] flex flex-col md:flex-row gap-8 md:gap-16 py-5 '>
                           <div className="detail-card overflow-hidden self-center rounded-2xl w-60">
                               <img src={movieData?.poster_url} alt={movieData?.name} />
                           </div>
                           <div className="detail-content text-white md:flex-1">
                               <div className="name text-white text-4xl tracking-widest font-extrabold">{movieData.name}</div>
                               <div className="info flex items-center gap-2 md:gap-4 text-sm mt-4">
                                  
                                   <div className="origin-name text-lg italic">{movieData.time}</div>
                                   <div className="episode-info text-lg ">{movieData.episode_current} / {movieData.episode_total}</div>
                                   <button  className='flex items-center gap-4 uppercase tracking-[4px] group'>Trailer <SlArrowRight className='text-xl group-hover:translate-x-1 transition-transform duration-300' /></button>
                               </div>
                               <div className='flex items-center gap-6 flex-wrap mt-6'>
                               {
                                 movieData.category && movieData.category.map((category: { name: string; slug: string }, index: number) => {
                                       return (
                                           <span key={index} className='genre-items text-sm border border-white rounded-3xl py-1 px-2'>
                                               {category.name}
                                           </span>
                                       );
                                   })
                               }
                        </div>
                        
                        <div className='mt-6 text-white text-sm lg:w-[80%]'>
                         {movieData?.content}
                        </div>
                         {/* danh sách tập  */}
             
                       {/* data && <div className="detail" style={{ backgroundImage: `url(${originalImage(data.data.backdrop_path)})` }}>
                     <Wrapper className='relative z-[1] flex flex-col md:flex-row gap-8 md:gap-16 py-5 '>
                         <div className="detail-card overflow-hidden self-center rounded-2xl w-60">
                             <LazyLoadImage src={originalImage(data.data.poster_path)} loading='lazy' alt={(data.data as DetailMovie).title || (data.data as DetailTV).name || ''} />
                         </div>
                         <div className="detail-content text-white md:flex-1">
                             <div className="name text-white text-4xl tracking-widest font-extrabold">{(data.data as DetailMovie).title || (data.data as DetailTV).name || ''}</div>
                             <div className="info flex items-center gap-2 md:gap-4 text-sm mt-4">
                                 <span className='tracking-widest'>{new Date((data.data as DetailMovie).release_date || (data.data as DetailTV).first_air_date).getFullYear() || "N/A"}</span>
                                 <span className='flex items-center gap-2'><BsClockHistory className='text-xl' />{(data.data as DetailMovie).runtime || (data.data as DetailTV).episode_run_time[0] || 'N/A'}</span>
                                 <span className='flex items-center text-sm'><AiFillStar className='text-xl mr-1' /> {data.data.vote_average.toFixed(2)}<span className='text-xs font-sans italic opacity-70'>/10</span></span>
                                 <button onClick={() => handleClickTrailer(mediaType, data.data.id)} className='flex items-center gap-4 uppercase tracking-[4px] group'>Trailer <SlArrowRight className='text-xl group-hover:translate-x-1 transition-transform duration-300' /></button>
                             </div>
                             <div className='flex items-center gap-6 flex-wrap mt-6'>
                                 {
                                     data.data.genres.map((genre, index) => {
                                         return (
                                             <span key={genre.id.toString()} className='genre-items text-sm border border-white rounded-3xl py-1 px-2'>{genre.name}</span
                                         )
                                     })
                                 }
                             </div>
                      
                             <div className='mt-6 text-white text-xs lg:w-[80%]'>
                                 {data.data.overview} 
                             </div> */}

                            <div className='mt-4 flex'>
                                <button className='flex items-center gap-1 rounded-3xl bg-white/10
                                px-4 py-2 transition-all duration-200 ease-in-out hover:bg-white/20' onClick={handleToggleFavorite}>
                                    {
                                        checkAddedToFavorite.data?.data.added ? <MdOutlineFavorite size={26} /> : <MdOutlineFavoriteBorder size={26} />
                                    }
                                    <span className='text-sm'>Lưu phim</span>
                                </button>
                                <button className='flex items-center gap-1 rounded-3xl bg-red-500/70
                                   px-4 py-2 transition-all duration-200 ease-in-out hover:bg-white/20 ml-5'
                                   onClick={handleShowPlayer} // Khi bấm, mặc định xem tập 1 và hiện danh sách tập
                               >
                                   <MdPlayArrow size={26} />
                                   <span className='text-sm'>Xem phim</span>
                               </button>
               
                            </div>
          
                        </div>
                    </Wrapper>
                </div>
            }
            {isFetching && <SkeletonDetail />}
            {showEpisodes && (
                <Wrapper className='episode-list'>
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className='text-xl text-white'>Danh sách tập</h2>
                        <button onClick={handleShowMore} className='text-primary text-white hover:text-red-600'>
                            Xem thêm
                        </button>
                    </div>
                    <div className='grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4'>
                        {episodeList.slice(0, showLimit).map((episode, index) => (
                            <button
                                key={index}
                                onClick={() => handleSelectEpisode(index + 1)}
                                className={`p-2 text-center rounded-md border transition-colors duration-300 ${
                                    currentEpisode === index + 1 
                                        ? 'bg-red-600 text-white font-bold'        // Màu đỏ cho nút đang được chọn
                                        : 'border-white/20 text-white hover:bg-red-600 hover:text-white' // Màu đỏ khi hover
                                }`}
                            >
                                {episode.name}
                            </button>
                        ))}
                    </div>
                </Wrapper>
            )}

            <div className='bg-black-2 py-5'>
                <Wrapper>
                    {/* recommend video */}
                    {
                        recommendsQuery.data && recommendsQuery.data.data.results.length > 0 && <h2 className='text-light-gray text-2xl relative'>Phim đề xuất </h2>
                    }

                    {
                        recommendsQuery.data && recommendsQuery.data.data.results.length > 0 && <div className='list-movie-horizontal'>

                            {
                                <ListMovieHorizontal className='pb-8 pt-6' data={(recommendsQuery.data.data.results as Movie[]) || (recommendsQuery.data.data.results as TV[]) || []} mediaType={mediaType} />
                            }

                        </div>
                    }

                    {
                        recommendsQuery.isFetching && <ListMovieHorizontal skeleton data={[]} mediaType='all' />
                    }



                </Wrapper>
            </div>
{/*             
            <div className='bg-black-2 py-5 '>
                <Wrapper>
                    <h2 className='text-light-gray text-2xl relative'>Comments</h2>
                    <FBComment key={new Date().getTime()} />
                </Wrapper>
            </div> */}
        </div >
    )
}
const WithAuthDetail = withAuth(Detail)

const DetailWrapper = (props: Props) => (<> <WithAuthDetail {...props} /> </>)
export default DetailWrapper

function setCurrentEpisode(episodeNumber: number) {
    throw new Error('Function not implemented.')
}
function setEpisodeList(episodes: any) {
    throw new Error('Function not implemented.')
}

