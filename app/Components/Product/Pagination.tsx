'use client'

import React from 'react'
import left from '../../../public/back.png'
import right from '../../../public/right-arrow.png'
import Image from 'next/image'

interface PaginationProps {
    length: number;  
    currentPage: number; 
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({ length, currentPage, setCurrentPage }) => {
    const page: Array<number> = [];
    const totalPages = Math.ceil(length / 9);

    for (let i = 1; i <= totalPages; i++) {
        page.push(i);
    }

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleLeftPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleRightPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className='relative w-full bottom-0 p-6 px-52 gap-3 justify-center flex items-center'>
            <Image src={left} alt='left Image' width={35} height={35} onClick={handleLeftPage} />
            {
                page.map((pg: number, index: number) => (
                    <button 
                        key={index} 
                        onClick={() => handlePageChange(pg)} 
                        className={`px-3 py-2 ${currentPage === pg ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {pg}
                    </button> 
                ))
            }
            <Image src={right} alt='right Image' width={35} height={35} onClick={handleRightPage} />
        </div>
    );
}

export default Pagination;
