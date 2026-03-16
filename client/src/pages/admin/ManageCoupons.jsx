import { useState, useEffect } from 'react';
import { couponAPI } from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiPlus, FiTrash2, FiTag, FiClock, FiActivity, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ManageCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountPercentage: '',
        expiryDate: '',
        usageLimit: -1,
        isActive: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await couponAPI.getAll();
            setCoupons(res.data.coupons);
        } catch (error) {
            toast.error('Failed to synchronize vouchers');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await couponAPI.create(formData);
            toast.success('Campaign Voucher Established');
            setShowModal(false);
            setFormData({ code: '', discountPercentage: '', expiryDate: '', usageLimit: -1, isActive: true });
            fetchCoupons();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create voucher');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Terminate this campaign voucher?')) return;
        try {
            await couponAPI.delete(id);
            toast.success('Voucher Nullified');
            fetchCoupons();
        } catch (error) {
            toast.error('Failed to remove voucher');
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div className="py-10 space-y-12 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link to="/admin" className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors uppercase text-[10px] font-black tracking-widest mb-4">
                        <FiArrowLeft />
                        <span>Back to Command</span>
                    </Link>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase text-white leading-none">
                        Voucher <span className="text-red-600">Architect</span>
                    </h1>
                    <p className="text-gray-500 font-light mt-2 text-sm uppercase tracking-widest">Protocol Promo Management</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-premium py-4 px-8 flex items-center space-x-3"
                >
                    <FiPlus />
                    <span>Establish Voucher</span>
                </button>
            </div>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coupons.length === 0 ? (
                    <div className="lg:col-span-3 text-center py-20 glass-card">
                        <FiTag className="text-6xl text-gray-800 mx-auto mb-4" />
                        <p className="text-gray-500 uppercase tracking-widest font-black text-xs">No active campaigns detected</p>
                    </div>
                ) : (
                    coupons.map((coupon) => (
                        <div key={coupon._id} className="glass-card group hover:border-red-600/30 transition-all duration-500">
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                                        <FiTag className="text-xl" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase ${coupon.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {coupon.isActive ? 'Active' : 'Offline'}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase group-hover:text-red-600 transition-colors">{coupon.code}</h3>
                                    <p className="text-4xl font-black text-white mt-1">{coupon.discountPercentage}% <span className="text-xs font-bold text-gray-500 uppercase tracking-widest italic">Discount</span></p>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-white/5">
                                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                                        <FiClock className="text-red-600" />
                                        <span>Expires: {format(new Date(coupon.expiryDate), 'MMM dd, yyyy')}</span>
                                    </div>
                                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                                        <FiActivity className="text-red-600" />
                                        <span>Usage: {coupon.usedCount} / {coupon.usageLimit === -1 ? '∞' : coupon.usageLimit}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(coupon._id)}
                                    className="w-full py-3 bg-red-600/5 hover:bg-red-600 text-red-600 hover:text-white rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2"
                                >
                                    <FiTrash2 />
                                    <span>Nullify Voucher</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowModal(false)}></div>
                    <div className="glass-card w-full max-w-lg relative z-10 animate-fade-in border-red-600/20">
                        <div className="p-10">
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white mb-8">Establish New <span className="text-red-600">Voucher</span></h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Voucher Code</label>
                                    <input
                                        type="text" required
                                        className="input-premium"
                                        placeholder="E.G. SUMMER50"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Discount %</label>
                                        <input
                                            type="number" required min="1" max="100"
                                            className="input-premium"
                                            placeholder="25"
                                            value={formData.discountPercentage}
                                            onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Usage Limit</label>
                                        <input
                                            type="number" required
                                            className="input-premium"
                                            placeholder="-1 for infinite"
                                            value={formData.usageLimit}
                                            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Expiry Date</label>
                                    <input
                                        type="date" required
                                        className="input-premium"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    />
                                </div>
                                <div className="pt-6 flex gap-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary">Abeyance</button>
                                    <button type="submit" className="flex-1 btn-premium">Establish</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCoupons;
