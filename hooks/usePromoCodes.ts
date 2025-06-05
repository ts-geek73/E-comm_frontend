import { useState, useCallback } from 'react';
import { FetchParams, PromoCode } from '@/types/product';
import { deletePromo, fetchPromos, savePromo } from '@/components/Functions/function';

const usePromoCodes = () => {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [totalPromos, setTotalPromos] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    await deletePromo(_id);
    setPromos((prev) => prev.filter((p) => p._id !== _id));
    setTotalPromos((prev) => prev - 1);
  }, []);

  const saveOrUpdatePromo = useCallback(
    async (promo: PromoCode, reloadParams?: FetchParams) => {
      await savePromo(promo);
      if (reloadParams) {
        await loadPromos(reloadParams);
      }
    },
    [loadPromos]
  );

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