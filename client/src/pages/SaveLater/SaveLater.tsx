import React, { useEffect, useState } from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import GridContainer from '../../components/GridContainer/GridContainer';
import Card from '../../components/Card/Card';
import SkeletonCard from '../../components/Skeleton/SkeletonCard';
import { Movie, TV } from '../../Types/Movie';

const SaveLater = () => {
    const [saveLaterMovies, setSaveLaterMovies] = useState<(Movie | TV)[]>([]);

    useEffect(() => {
        const savedMovies = JSON.parse(localStorage.getItem('saveLaterMovies') || '[]');
        setSaveLaterMovies(savedMovies);
    }, []);

    return (
        <div className='save-later bg-gray-900 mx-auto max-w-7xl p-4'>
            <div className="main-content bg-gray-800 rounded-lg p-8 space-y-12">
                <section className='py-6'>
                    <Wrapper>
                        <h2 className='text-gray-100 text-3xl font-semibold text-center hover:text-teal-400'>
                            Save Later Movies
                        </h2>
                        <GridContainer className='grid gap-4 mt-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                            {saveLaterMovies.length > 0 ? (
                                saveLaterMovies.map((movie) => (
                                    <Card key={movie.id} mediaType={movie.media_type || 'movie'} data={movie} />
                                ))
                            ) : (
                                <p className="text-gray-300 text-center">You have no movies saved to watch later.</p>
                            )}
                            {saveLaterMovies.length === 0 &&
                                Array.from({ length: 10 }, (_, i) => <SkeletonCard key={i} />)}
                        </GridContainer>
                    </Wrapper>
                </section>
            </div>
        </div>
    );
};

export default SaveLater;
