import api from '@/utils/axoins'; 

interface ICategory {
  _id: string;
  name: string;
}


let cachedCategories: ICategory[] | null = null;
let isFetching = false;
export const getCategories = async (): Promise<ICategory[]> => {
  if (cachedCategories) {
    return cachedCategories;
  }

  if(isFetching){
    while(isFetching){
      await new Promise(resolve => setTimeout(resolve, 100)); // wait for fetching to complete
    }
    return cachedCategories || [];
  }

  isFetching = true;

  try {
    const response = await api.get('/category');
    cachedCategories = response.data as ICategory[];
    isFetching = false;
    return cachedCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    isFetching = false;
    return [];
  }
};