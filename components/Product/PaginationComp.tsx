'use client';

import React, { useEffect, useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PaginationProps } from '@/types/components';

const PaginationComp: React.FC<PaginationProps> = ({ length, currentPage, setCurrentPage }) => {
  const [items, setItems] = useState<number[]>([]);
  const totalPages = Math.ceil(length / 12);

  useEffect(() => {
    const generateItems = () => {
      const itemSet: number[] = [];

      itemSet.push(1);

      if (currentPage > 3 && totalPages > 3) {
        itemSet.push(-1);
      }

      const start = Math.max(2, currentPage - 1); // Start at least from 2
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!itemSet.includes(i)) {
          itemSet.push(i);
        }
      }

      if (currentPage < totalPages - 2 && totalPages > 3) {
        itemSet.push(-1);
      }

      if (totalPages > 1 && !itemSet.includes(totalPages)) {
        itemSet.push(totalPages);
      }


      setItems(itemSet);
    };

    generateItems();
  }, [currentPage, totalPages]);

  return (
    <div className="flex justify-center p-6">
      <Pagination>
        <PaginationContent>
          {currentPage === 1 ? <PaginationPrevious
            className='opacity-50 cursor-pointer'
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          >
            per
          </PaginationPrevious>
            :
            <PaginationPrevious
              className='cursor-pointer'
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            >
              Previous
            </PaginationPrevious>
          }

          {items.map((item, idx) => {
            if (item === -1) {
              return <PaginationEllipsis key={`ellipsis-${idx}`} />;
            }

            return (
              <PaginationItem key={item}>
                <PaginationLink
                  onClick={() => setCurrentPage(Number(item))}
                  className={currentPage === item ? 'bg-blue-500 text-white' : ''}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {currentPage == totalPages ?

            <PaginationNext
            className='opacity-50'
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            >
              Next
            </PaginationNext>
            :
            <PaginationNext
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            >
              Next
            </PaginationNext>
          }
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationComp;
