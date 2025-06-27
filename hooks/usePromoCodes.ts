import { useState, useCallback } from 'react';
import { FetchParams, PromoCode } from '@/types/product';
import { useUser } from '@clerk/nextjs';
import { deletePromo, fetchPromos, savePromo } from '@/components/Functions/promocode';

const usePromoCodes = () => {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [totalPromos, setTotalPromos] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const userId: string = useUser()?.user?.id;
  const { user } = useUser();
  let userId: string | undefined;


  const loadPromos = useCallback(async (params: FetchParams) => {
    setLoading(true);
    const data = await fetchPromos(params);
    if (typeof data === 'string') {
      setError(data);
      setPromos([]);
      setTotalPromos(0);
    } else {
      setPromos(data.promos);
      setTotalPromos(data.total);
      setError(null);
    }
    setLoading(false);
  }, []);

  const removePromo = useCallback(async (_id: string) => {
    if (user && user.id) {
      userId = user.id;

      await deletePromo(_id, userId);
      setPromos((prev) => prev.filter((p) => p._id !== _id));
      setTotalPromos((prev) => prev - 1);
    }
  }, []);

  const saveOrUpdatePromo = useCallback(
    async (promo: PromoCode, reloadParams?: FetchParams) => {
      if (user && user.id) {
        userId = user.id;
        await savePromo(promo, userId);
        if (reloadParams) {
          await loadPromos(reloadParams);
        }
      }
    },[loadPromos]);

  return {
    promos,
    totalPromos,
    loading,
    error,
    loadPromos,
    removePromo,
    saveOrUpdatePromo,
  };
};

export default usePromoCodes