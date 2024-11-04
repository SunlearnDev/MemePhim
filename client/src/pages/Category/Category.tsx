import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import tmdbApi from '../../services/tmdbApi';
import ListMovieHorizontal from '../../components/ListMovieHorizontal/ListMovieHorizontal';
import Wrapper from '../../components/Wrapper/Wrapper';
import SkeletonCard from '../../components/Skeleton/SkeletonCard';
import { Link } from 'react-router-dom';

const categories = [
    { slug: "khoa-hoc", name: "Khoa Học" },
    { slug: "vien-tuong", name: "Viễn Tưởng" },
    { slug: "bi-an", name: "Huyền Bí" },
    { slug: "phieu-luu", name: "Phiêu Lưu" },
    { slug: "chinh-kich", name: "Chính Kịch" },
    { slug: "hai-huoc", name: "Hài Hước" },
    { slug: "tre-em", name: "Trẻ Em" },
];

const countries = [
    { slug: "trung-quoc", name: "Trung Quốc" },
    { slug: "nhat-ban", name: "Nhật Bản" },
];

const Category = () => {
    const [selectedCategory, setSelectedCategory] = useState(categories[0].slug);
    const [selectedCategoryName] = useState(categories[0].name);
    const [selectedCountry, setSelectedCountry] = useState(countries[0].slug);
    const [selectedCountryName] = useState(categories[0].name);

    const categoryQuery = useQuery({
        queryKey: ["category", selectedCategory, selectedCountry],
        queryFn: () => tmdbApi.getMoviesByCategoryAndCountry(selectedCategory, selectedCountry),
    });

    return (
        <div className='category bg-gray-900 mx-auto max-w-7xl p-4'>
            <Wrapper>
                <h2 className='text-gray-100 text-3xl font-semibold'>Chọn Thể Loại và Quốc Gia</h2>
                
                <div className='my-4'>
                    <h3 className='text-gray-200 text-xl'>Thể Loại</h3>
                    <div className='flex gap-4'>
                        {categories.map(cat => (
                            <button
                                key={cat.slug}
                                onClick={() => setSelectedCategory(cat.slug)}
                                className={`px-4 py-2 rounded-lg ${selectedCategory === cat.slug ? 'bg-teal-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='my-4'>
                    <h3 className='text-gray-200 text-xl'>Quốc Gia</h3>
                    <div className='flex gap-4'>
                        {countries.map(country => (
                            <button
                                key={country.slug}
                                onClick={() => setSelectedCountry(country.slug)}
                                className={`px-4 py-2 rounded-lg ${selectedCountry === country.slug ? 'bg-teal-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                            >
                                {country.name}
                            </button>
                        ))}
                    </div>
                </div>

                <h2 className='text-gray-100 text-3xl font-semibold mt-8'>Phim {selectedCategoryName} - {selectedCountryName}</h2>
                {categoryQuery.isLoading && <ListMovieHorizontal mediaType='all' data={[]} skeleton />}
                {categoryQuery.data && <ListMovieHorizontal mediaType='all' data={categoryQuery.data.data.results} />}
            </Wrapper>
        </div>
    );
};

export default Category;
