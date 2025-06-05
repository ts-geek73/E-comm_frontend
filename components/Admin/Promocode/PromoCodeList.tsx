import ConfirmDelete from '@/components/Header/ConfirmDelete';
import { usePromoCodes } from '@/hooks';
import { PromoCode } from '@/types/product';
import { useEffect, useState } from 'react';
import { LiaEdit } from 'react-icons/lia';
import { MdDeleteOutline } from 'react-icons/md';
import PaginationComp from '../../Product/PaginationComp';
import PromoCodeDialog from './promoDialogBox';
import { usePermission } from '@/hooks/usePermission';

const PromoCodeList: React.FC = () => {
    const [sortField, setSortField] = useState<string>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [productPerPage] = useState(12);
    const {
        promos,
        totalPromos,
        loading,
        error,
        loadPromos,
        removePromo,
        saveOrUpdatePromo,
    } = usePromoCodes();

    const { hasPermission } = usePermission();

    const columns = [
        { label: '', field: '', sortable: false },
        { label: 'Code', field: 'code', sortable: true },
        { label: 'Type', field: 'type', sortable: true },
        { label: 'Amount', field: 'amount', sortable: true },
        { label: 'Expiry', field: 'expiryDate', sortable: false },
        { label: 'Actions', field: '', sortable: false },
    ];

    useEffect(() => {
        loadPromos({ page: currentPage, limit: productPerPage, sortField, sortOrder });
    }, [currentPage, productPerPage, sortField, sortOrder, loadPromos, refreshTrigger]);

    const handleDelete = async (id: string) => {
        try {
            await removePromo(id);
            setRefreshTrigger(1)
        } catch (e) {
            console.error('Delete failed', e);
        }
    };

    const handleSave = async (promo: PromoCode) => {
        try {
            await saveOrUpdatePromo(promo, { page: currentPage, limit: productPerPage, sortField, sortOrder });
        } catch (e) {
            console.error('Save failed', e);
        }
    };

    return (
        <div className="w-full space-y-6">
            <h1 className="text-3xl font-semibold text-center text-gray-800">Promo Code Management</h1>
            {loading ? (
                <p className="text-center text-blue-500">Loading promo codes...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <table className="min-w-full table-auto">
                    <thead className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={`px-4 py-3 text-left ${col.sortable ? 'cursor-pointer select-none' : ''}`}
                                    onClick={() => {
                                        if (!col.sortable || !col.field) return;
                                        if (sortField === col.field) {
                                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                        } else {
                                            setSortField(col.field);
                                            setSortOrder('asc');
                                        }
                                    }}
                                >
                                    {col.label} {col.sortable && sortField === col.field && (sortOrder === 'asc' ? '▲' : '▼')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {promos?.map((promo, index) => (
                            <tr key={promo._id} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{(currentPage - 1) * productPerPage + index + 1}</td>
                                <td className="px-4 py-2">{promo.code}</td>
                                <td className="px-4 py-2 capitalize">{promo.type}</td>
                                <td className="px-4 py-2">{promo.amount}</td>
                                <td className="px-4 py-2">{new Date(promo.expiryDate).toLocaleDateString()}</td>
                                <td className="px-4 py-2 flex space-x-3">
                                    {hasPermission('promo.edit') &&
                                        <button
                                            onClick={() => {
                                                setEditingPromo(promo);
                                                setDialogOpen(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <LiaEdit size={20} />
                                        </button>
                                    }

                                    {hasPermission('promo.delete') &&
                                        <ConfirmDelete
                                            title="Delete Promo Code"
                                            description="Are you sure you want to delete this promo code?"
                                            onConfirm={() => handleDelete(promo._id)}
                                            trigger={
                                                <button className="text-red-600 hover:text-red-800">
                                                    <MdDeleteOutline size={20} />
                                                </button>
                                            }
                                        />
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {hasPermission('promo.delete') &&

                <button
                    onClick={() => {
                        setEditingPromo({ _id: '', code: '', type: 'flat', amount: 0, expiryDate: '' });
                        setDialogOpen(true);
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                    Create Promo Code
                </button>
            }

            <PaginationComp
                length={totalPromos}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

            <PromoCodeDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                promo={editingPromo}
                setPromo={setEditingPromo}
                onSave={handleSave}
            />

        </div>
    );
};

export default PromoCodeList;
