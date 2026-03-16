import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCreditCard, FiLock, FiCheckCircle, FiShield, FiZap, FiArrowLeft, FiCpu, FiDribbble, FiGlobe, FiActivity } from 'react-icons/fi';
import { planAPI, subscriptionAPI, couponAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { downloadInvoice } from '../utils/downloadHelper';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Checkout = () => {
    const { planId } = useParams();
    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState(1); // 1: Card, 2: Activation, 3: Success
    const [activationProgress, setActivationProgress] = useState(0);
    const [activationStatus, setActivationStatus] = useState('');

    const [cardData, setCardData] = useState({
        name: '',
        number: '',
        expiry: '',
        cvv: ''
    });

    const [couponCode, setCouponCode] = useState('');
    const [coupon, setCoupon] = useState(null);
    const [validatingCoupon, setValidatingCoupon] = useState(false);
    const [receiptId] = useState(`TRX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);

    const handleCouponValidation = async () => {
        if (!couponCode) return;
        setValidatingCoupon(true);
        try {
            const response = await couponAPI.validate(couponCode);
            setCoupon(response.data.coupon);
            toast.success(`Campaign Voucher Accepted: ${response.data.coupon.discountPercentage}% Discount Applied`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid Voucher code');
            setCoupon(null);
        } finally {
            setValidatingCoupon(false);
        }
    };

    const discountedPrice = plan ? (coupon ? (plan.price * (1 - coupon.discountPercentage / 100)).toFixed(2) : plan.price) : 0;

    const autoFill = () => {
        setCardData({
            name: 'ELITE CITIZEN',
            number: '4242 4242 4242 4242',
            expiry: '12/28',
            cvv: '999'
        });
        toast.info('Test credentials synchronized');
    };

    useEffect(() => {
        fetchPlan();
    }, [planId]);

    const fetchPlan = async () => {
        try {
            const response = await planAPI.getById(planId);
            setPlan(response.data.plan);
        } catch (error) {
            toast.error('Plan identification failed');
            navigate('/plans');
        } finally {
            setLoading(false);
        }
    };

    const startActivationProtocol = async () => {
        setStep(2);
        const statuses = [
            'Establishing Secure Uplink...',
            'Verifying Financial Tokens...',
            'Decrypting Stream Keys...',
            'Synchronizing Identity Nodes...',
            'Finalizing Tier Permissions...'
        ];

        for (let i = 0; i < statuses.length; i++) {
            setActivationStatus(statuses[i]);
            // Simulate work for each step
            await new Promise(r => setTimeout(r, 1200));
            setActivationProgress((i + 1) * 20);
        }

        try {
            await subscriptionAPI.subscribe(planId, { couponCode: coupon?.code });
            await refreshUser();
            setStep(3);
            toast.success('Protocol Successful: Access Granted');
        } catch (error) {
            toast.error('Transaction Terminated: Request Denied');
            setStep(1);
            setProcessing(false);
        }
    };

    const handlePayment = (e) => {
        e.preventDefault();
        setProcessing(true);
        startActivationProtocol();
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div className="min-h-screen py-20 px-4 bg-[#050505]">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate('/plans')}
                    className="flex items-center space-x-2 text-gray-600 hover:text-white transition-colors mb-12 uppercase text-[10px] font-black tracking-[4px]"
                >
                    <FiArrowLeft />
                    <span>ABORT PROTOCOL</span>
                </button>

                {step === 1 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-fade-in">
                        {/* Left: Financial Credentials */}
                        <div className="space-y-10">
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white leading-none">
                                    SECURE <span className="text-red-600">UNITS</span>
                                </h1>
                                <p className="text-gray-500 font-bold uppercase tracking-[3px] text-xs">Initialize tier synchronization</p>
                            </div>

                            <form onSubmit={handlePayment} className="glass-card p-10 space-y-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <FiCreditCard className="text-[120px] text-white" />
                                </div>

                                <div className="space-y-6 relative z-10">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Identity / Cardholder</label>
                                            <button
                                                type="button"
                                                onClick={autoFill}
                                                className="text-[9px] font-black text-red-600 hover:text-white transition-colors tracking-widest uppercase border border-red-600/20 px-2 py-0.5 rounded"
                                            >
                                                Auto-Fill Test Data
                                            </button>
                                        </div>
                                        <input
                                            type="text" required value={cardData.name}
                                            onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                                            className="input-premium bg-white/5 border-white/10" placeholder="JOHN CITIZEN"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Card Matrix</label>
                                        <div className="relative">
                                            <input
                                                type="text" required value={cardData.number}
                                                onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                                                className="input-premium pl-12 bg-white/5 border-white/10" placeholder="XXXX XXXX XXXX XXXX"
                                            />
                                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Validity</label>
                                            <input
                                                type="text" required value={cardData.expiry}
                                                onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                                                className="input-premium bg-white/5 border-white/10" placeholder="MM/YY"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Security Node</label>
                                            <input
                                                type="password" required value={cardData.cvv}
                                                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                                                className="input-premium bg-white/5 border-white/10" placeholder="•••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn-premium w-full py-6 flex items-center justify-center space-x-4 group/btn"
                                >
                                    <FiZap className="group-hover:animate-bounce" />
                                    <span className="tracking-[4px]">EXECUTE UPGRADE</span>
                                </button>
                            </form>

                            <div className="flex items-center justify-center space-x-8 text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <FiShield />
                                    <span className="text-[10px] font-black tracking-widest uppercase">AES-256</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FiDribbble />
                                    <span className="text-[10px] font-black tracking-widest uppercase">SSL SECURE</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Asset Confirmation */}
                        <div className="space-y-8">
                            <div className="glass-card p-12 border-red-600/30 bg-gradient-to-br from-red-600/5 to-transparent relative">
                                <div className="absolute -top-4 left-6 px-4 py-1 bg-red-600 text-white text-[9px] font-black tracking-widest uppercase">Selected Operation</div>

                                <div className="mb-10">
                                    <h3 className="text-5xl font-black italic tracking-tighter uppercase text-white mb-2">{plan?.name}</h3>
                                    <div className="flex items-baseline space-x-3">
                                        <span className={`text-3xl font-bold ${coupon ? 'text-gray-500 line-through text-xl' : 'text-red-600'}`}>₹{plan?.price}</span>
                                        {coupon && (
                                            <span className="text-3xl font-bold text-green-500">₹{discountedPrice}</span>
                                        )}
                                        <span className="text-gray-500 uppercase text-xs font-black tracking-widest">/ {plan?.duration}</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Coupon Section */}
                                    <div className="pt-4 border-t border-white/5 space-y-4">
                                        <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Campaign Voucher</label>
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                placeholder="ENTER TOKEN"
                                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs font-bold text-white outline-none focus:border-red-600/50 flex-grow"
                                            />
                                            <button
                                                onClick={handleCouponValidation}
                                                disabled={validatingCoupon || !couponCode}
                                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-[10px] font-black tracking-widest uppercase rounded-lg transition-all disabled:opacity-50"
                                            >
                                                {validatingCoupon ? 'SYNC' : 'APPLY'}
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-sm font-light uppercase tracking-wider">{plan?.description}</p>
                                    <div className="h-px w-full bg-white/5"></div>
                                    <ul className="space-y-4">
                                        {plan?.features?.map((f, i) => (
                                            <li key={i} className="flex items-center space-x-3 text-[11px] font-black tracking-widest uppercase text-gray-500 group">
                                                <FiCheckCircle className="text-red-600 group-hover:scale-125 transition-transform" />
                                                <span className="group-hover:text-white transition-colors">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="max-w-2xl mx-auto py-20 space-y-12 animate-pulse">
                        <div className="text-center space-y-4">
                            <FiCpu className="text-7xl text-red-600 mx-auto animate-spin-slow mb-8" />
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white">ACTIVATION <span className="text-red-600">PROTOCOL</span></h2>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-[4px]">{activationStatus}</p>
                        </div>

                        <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div
                                className="absolute inset-0 bg-red-600 shadow-[0_0_20px_rgba(229,9,20,0.8)] transition-all duration-700 ease-out"
                                style={{ width: `${activationProgress}%` }}
                            ></div>
                            {/* Scanning Light */}
                            <div
                                className="absolute h-full w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
                                style={{ left: `${activationProgress - 10}%` }}
                            ></div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            {[FiActivity, FiGlobe, FiCpu].map((Icon, i) => (
                                <div key={i} className="glass-card p-6 flex items-center justify-center">
                                    <Icon className={`text-2xl ${activationProgress > (i + 1) * 30 ? 'text-red-600' : 'text-gray-800'}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="max-w-2xl mx-auto py-20 text-center space-y-12 animate-fade-in">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-500/20 blur-[100px] animate-pulse"></div>
                            <div className="w-40 h-40 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-green-500/20 relative z-10">
                                <FiCheckCircle className="text-7xl text-green-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-6xl font-black italic tracking-tighter uppercase text-white leading-none">
                                ACCESS <span className="text-green-500">GRANTED</span>
                            </h2>
                            <p className="text-gray-500 font-bold uppercase tracking-[5px] text-sm">Welcome to the {plan?.name} Elite Circle</p>
                        </div>

                        {/* Digital Receipt */}
                        <div className="glass-card p-8 max-w-sm mx-auto bg-white/5 border-white/10 text-left space-y-6 animate-fade-in delay-500">
                            <div className="flex justify-between items-start border-b border-white/5 pb-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-1">Receipt ID</p>
                                    <p className="text-xs font-mono text-white">{receiptId}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-1">Date</p>
                                    <p className="text-xs font-mono text-white">{new Date().toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400 font-bold uppercase">{plan?.name} Tier Plan</span>
                                    <span className="text-white font-black">₹{plan?.price}</span>
                                </div>
                                {coupon && (
                                    <div className="flex justify-between text-xs">
                                        <span className="text-green-500 font-bold uppercase tracking-tighter italic">Promotion Applied ({coupon.code})</span>
                                        <span className="text-green-500 font-black">-₹{(plan.price * coupon.discountPercentage / 100).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-white tracking-widest uppercase">Total Charged</span>
                                    <span className="text-xl font-black text-green-500">₹{discountedPrice}</span>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <div className="flex items-center space-x-2 opacity-50">
                                    <FiShield className="text-green-500 text-xs" />
                                    <span className="text-[8px] font-black tracking-widest uppercase text-gray-500">Verified</span>
                                </div>
                                <button
                                    onClick={() => downloadInvoice({
                                        id: receiptId,
                                        date: new Date().toLocaleDateString(),
                                        planName: plan?.name,
                                        price: plan?.price,
                                        discount: coupon ? (plan.price * coupon.discountPercentage / 100).toFixed(2) : 0,
                                        total: discountedPrice
                                    })}
                                    className="text-[8px] font-black tracking-widest uppercase text-red-600 hover:text-white transition-colors"
                                >
                                    DOWNLOAD INVOICE
                                </button>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={() => navigate('/browse')}
                                className="btn-premium py-6 px-16 bg-green-600 hover:bg-green-700 shadow-green-600/20 group relative overflow-hidden text-xs font-black tracking-widest uppercase"
                            >
                                <span className="relative z-10 flex items-center space-x-3">
                                    <span>INITIALIZE HUB</span>
                                    <FiArrowLeft className="rotate-180" />
                                </span>
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Checkout;
