import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useTableSearchParam from '@/hooks/useTableSearchParam';
import { getAllCircles } from '../services/circles.service';
import { CIRCLES_QUERY_KEY } from './circlesData';

export default function useGetCircles() {
    const { pageNumber, pageSize, searchValue } = useTableSearchParam();

    return useQuery({
        queryKey: [...CIRCLES_QUERY_KEY, pageNumber, pageSize, searchValue],
        queryFn: () => getAllCircles(pageNumber, pageSize, searchValue),
        placeholderData: keepPreviousData,
    });
}
