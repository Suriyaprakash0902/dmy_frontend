import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import httpService from "../services/httpService";
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export default function Scheme() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [hasScheme, setHasScheme] = useState(false);
    const [schemeData, setSchemeData] = useState<any>(null);
    const [showTerms, setShowTerms] = useState(false);
    const [agreeChecked, setAgreeChecked] = useState(false);
    const [confirmBuyModal, setConfirmBuyModal] = useState(false);

    const [buyMonth, setBuyMonth] = useState('');
    const [currentGoldRate, setCurrentGoldRate] = useState<number>(175.30);
    const [isBuying, setIsBuying] = useState(false);

    const fetchSchemeData = () => {
        setIsLoading(true);
        httpService.get('/api/schemes/my-scheme')
            .then((data: any) => {
                if (data.hasScheme) {
                    setHasScheme(true);
                    setSchemeData(data.scheme);
                    // auto-select next month
                    if (data.scheme.payments) {
                        setBuyMonth(String(data.scheme.payments.length + 1));
                    }
                } else {
                    setHasScheme(false);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    };

    const fetchGoldRate = () => {
        httpService.get('/api/gold-rates/today')
            .then((data: any) => {
                if (data.rate && data.rate.rate22k) {
                    setCurrentGoldRate(data.rate.rate22k);
                }
            })
            .catch(console.error);
    };

    useEffect(() => {
        fetchGoldRate();
        fetchSchemeData();
    }, []);

    const handleApplyNow = () => {
        setShowTerms(true);
    };

    const handleBuy = () => {
        if (!buyMonth) {
            toast.error('Please select a valid month.');
            return;
        }
        setConfirmBuyModal(true);
    };

    const processBuy = async () => {
        setConfirmBuyModal(false);
        setIsBuying(true);
        const amount = schemeData.amount;
        const gramAccumulated = Number((amount / currentGoldRate).toFixed(4));

        try {
            await httpService.post('/api/schemes/buy', {
                schemeId: schemeData.id,
                monthIndex: Number(buyMonth),
                goldRate: currentGoldRate,
                gramAccumulated: gramAccumulated,
                amountPaid: amount
            });
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#DAA520', '#B8860B', '#F0E68C', '#FFF8DC'] // Gold palette
            });
            toast.success('Gold successfully bought and accumulated!', { duration: 4000, style: { background: '#1a1a1a', color: '#fff', border: '1px solid #C9A84C' }, iconTheme: { primary: '#C9A84C', secondary: '#fff' } });
            fetchSchemeData(); // Refreshes the vault data natively via endpoint
        } catch (error: any) {
            toast.error(error.message || 'Failed to complete transaction', { duration: 5000 });
        } finally {
            setIsBuying(false);
        }
    };

    if (isLoading) {
        return <div className="p-10 text-center flex-grow font-sans pt-20">Loading...</div>;
    }

    if (hasScheme && schemeData) {
        // Calculate totals dynamically purely from actual API payments
        const totalGrams = schemeData.payments?.reduce((acc: number, p: any) => acc + (Number(p.gramAccumulated) || 0), 0) || 0;
        const monthsCompleted = schemeData.payments?.length || 0;

        return (
            <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#FFFDF0] to-white pb-32 font-sans">
                {/* Header */}
                <div className="flex items-center space-x-4 p-6 relative">
                    <Link to="/home" className="text-gray-900 hover:scale-110 transition-transform">
                        <ArrowLeft size={24} />
                    </Link>
                    <div className="flex justify-between w-full pr-2 items-center">
                        <h1 className="text-xl font-bold font-sans">Vault</h1>
                        <h2 className="text-2xl font-serif text-primary-gold italic drop-shadow-sm font-light">
                            Easy 12 Gold Scheme
                        </h2>
                    </div>
                </div>

                <div className="px-5 mt-2 flex-grow">
                    {/* Buy 22K Gold Panel */}
                    <div className="mb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-3xl font-black text-[#C9A84C] tracking-tight">Buy 22K Gold</h2>
                                <p className="text-gray-800 font-medium text-sm mt-1">12 Month Saving Scheme</p>
                            </div>
                            <div className="bg-white px-4 py-2 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col items-center">
                                <span className="text-xl mb-1 mt-0.5" role="img" aria-label="Singapore">🇸🇬</span>
                                <span className="text-[10px] font-bold text-gray-800">Per gram / S $ {currentGoldRate.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div>
                                <label className="text-xs font-bold font-inter text-gray-900 block text-center mb-2">Month</label>
                                <select
                                    className="w-full text-center text-sm font-inter text-gray-600 bg-white border border-gray-200 rounded-lg py-2.5 outline-none focus:border-[#C9A84C] px-1 disabled:opacity-50 disabled:bg-gray-50"
                                    value={buyMonth}
                                    onChange={(e) => setBuyMonth(e.target.value)}
                                >
                                    <option value="" disabled>Select</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
                                        const nextExpectedMonth = (schemeData?.payments?.length || 0) + 1;
                                        const isPaidOrFuture = m !== nextExpectedMonth;
                                        return (
                                            <option key={m} value={m} disabled={isPaidOrFuture}>
                                                Month {m} {m < nextExpectedMonth ? '(Paid)' : ''}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold font-inter text-gray-900 block text-center mb-2">Gram</label>
                                <div className="w-full text-center text-sm font-inter text-gray-500 bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-1 cursor-not-allowed select-none">
                                    {(schemeData.amount / currentGoldRate).toFixed(4)}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold font-inter text-gray-900 block text-center mb-2">Price</label>
                                <div className="w-full text-center text-sm font-inter text-gray-500 bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-1 cursor-not-allowed select-none">
                                    {schemeData.amount}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleBuy}
                            disabled={isBuying}
                            className={`w-full py-4 text-white rounded-xl font-bold font-inter tracking-wide transition-all shadow-md ${isBuying ? 'bg-gray-400 cursor-wait' : 'bg-[#1a1a1a] shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-black active:scale-[0.98]'}`}
                        >
                            {isBuying ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                "Buy"
                            )}
                        </button>
                    </div>

                    <div className="border-t border-gray-200 w-full mb-8 absolute left-0"></div>
                    <div className="pt-8"></div>

                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-bold font-sans px-1">Vault</h1>
                        <h2 className="text-2xl font-serif text-[#C9A84C] italic drop-shadow-sm font-light px-1">
                            Easy 12 Gold Scheme
                        </h2>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden border border-gray-100 p-5 flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-primary-gold mb-1">{totalGrams.toFixed(4)} Grams</h3>
                            <p className="text-gray-600 text-sm font-medium">Total Gold Savings</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-900 font-bold text-sm mb-1">Months Completed</p>
                            <h3 className="text-2xl font-black text-primary-gold">{monthsCompleted}</h3>
                        </div>
                    </div>

                    {/* Table */}
                    <h3 className="text-xl font-bold mb-4 px-1">History</h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-sm font-inter">
                            <thead className="bg-[#FAFAFA] border-b border-gray-200">
                                <tr>
                                    <th className="py-4 font-bold text-gray-900 px-2 text-center border-r border-gray-100">Date</th>
                                    <th className="py-4 font-bold text-gray-900 px-2 text-center border-r border-gray-100 min-w-[3rem]">Month</th>
                                    <th className="py-4 font-bold text-gray-900 px-2 text-center border-r border-gray-100">Gold Rate</th>
                                    <th className="py-4 font-bold text-gray-900 px-2 text-center border-r border-gray-100">Gram</th>
                                    <th className="py-4 font-bold text-gray-900 px-2 text-center">Amount paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schemeData.payments?.map((p: any, i: number) => {
                                    const rawDate = new Date(p.createdAt || p.paymentDate);
                                    const ddmmyy = `${rawDate.getDate().toString().padStart(2, '0')}/${(rawDate.getMonth() + 1).toString().padStart(2, '0')}/${String(rawDate.getFullYear()).slice(-2)}`;
                                    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                                    const monthLabel = p.monthIndex ? `Month ${p.monthIndex}` : monthNames[rawDate.getMonth()];
                                    return (
                                        <tr key={p.id || i} className="border-b border-gray-100 last:border-0 text-gray-600 bg-white">
                                            <td className="py-4 px-2 text-center border-r border-gray-100 text-xs font-semibold whitespace-nowrap"><span className="bg-[#b9d3db] text-black px-1 py-0.5 bg-opacity-70">{ddmmyy}</span></td>
                                            <td className="py-4 px-2 text-center border-r border-gray-100 text-xs font-medium">{monthLabel}</td>
                                            <td className="py-4 px-2 text-center border-r border-gray-100 text-xs font-medium">${Number(p.goldRate).toFixed(2)}</td>
                                            <td className="py-4 px-2 text-center border-r border-gray-100 text-xs font-medium">{Number(p.gramAccumulated).toFixed(4)}</td>
                                            <td className="py-4 px-2 text-center text-xs font-medium">${p.amountPaid}</td>
                                        </tr>
                                    )
                                })}
                                {Array(Math.max(0, 5 - (schemeData.payments?.length || 0))).fill(0).map((_, i) => (
                                    <tr key={'empty' + i} className="border-b border-gray-100 last:border-0 h-12">
                                        <td className="border-r border-gray-100"></td>
                                        <td className="border-r border-gray-100"></td>
                                        <td className="border-r border-gray-100"></td>
                                        <td className="border-r border-gray-100"></td>
                                        <td></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Confirmation Buy Modal */}
                {confirmBuyModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
                            <button onClick={() => setConfirmBuyModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-900">
                                ✕
                            </button>
                            <h2 className="text-xl font-bold font-serif text-gray-900 mb-2 mt-2">Confirm Payment</h2>
                            <p className="text-gray-600 font-inter text-sm mb-6">
                                Are you sure you want to process the payment of <strong>S$ {schemeData.amount}</strong> for <strong>Month {buyMonth}</strong>?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmBuyModal(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl active:bg-gray-200 transition-colors"
                                >
                                    No, Cancel
                                </button>
                                <button
                                    onClick={processBuy}
                                    className="flex-1 py-3 bg-[#C9A84C] text-white font-bold rounded-xl active:bg-[#B39340] transition-colors shadow-md"
                                >
                                    Yes, Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#FFFDF0] to-white pb-32 font-sans relative">
            {/* Top Bar */}
            <div className="flex items-center space-x-4 p-6 relative">
                <Link to="/home" className="text-gray-900 hover:scale-110 transition-transform">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-xl font-bold font-serif">Gold Saving Scheme</h1>
            </div>

            <div className="px-5 mt-2 flex-grow">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-yellow-100">
                    <div className="p-8 pb-10">
                        {/* Title */}
                        <h2 className="text-4xl font-serif text-primary-gold italic mb-6 text-center shadow-sm drop-shadow-sm font-light">
                            Easy 12 Gold Scheme
                        </h2>

                        <div className="mb-6 border-b border-gray-100 pb-4">
                            <h3 className="text-2xl font-bold text-primary-gold mb-1 tracking-tight">Buy 22K Gold</h3>
                            <p className="text-gray-800 font-medium">12 Month Saving Scheme</p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-900 text-sm">DMY JEWELLERS EASY Gold Twelve Scheme</h4>

                            <p className="text-gray-700 text-[15px] leading-relaxed">
                                This is a special savings scheme which facilitates the purchase of gold jewellery at an affordable cost. Under this plan you are required to make 12 monthly installments in advance payments. Post the 12th month, you can utilise the accumulated weight to purchase the jewellery of your choice without making charges within the weight.
                            </p>

                            <p className="text-gray-700 text-[15px] leading-relaxed">
                                <strong className="text-gray-900">Note:</strong> You cannot purchase special items like diamond, platinum, ruby, emerald, uncut diamonds, pooja items, ethnic or vintage jewelry, Gold-bullion bars & coins, silver or silver articles. And also, scheme members not eligible to purchase under all special sales promotion.
                            </p>
                        </div>

                        <div className="mt-10">
                            <button onClick={handleApplyNow} className="block w-full text-center bg-[#1a1a1a] text-white py-4 rounded-xl font-bold hover:bg-black transition-colors shadow-lg shadow-black/20">
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* T&C Modal */}
            {showTerms && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-900">Terms & Conditions</h2>
                            <button onClick={() => setShowTerms(false)} className="text-gray-400 hover:text-black transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-5 overflow-y-auto font-inter text-sm text-gray-600 space-y-4 max-h-[50vh]">
                            <p className="font-semibold text-black">Terms and Conditions</p>
                            <p>1) Members must complete all monthly payments promptly for 12 months as scheduled in the Gold Savings Scheme in order to be eligible for the 13th month bonus. Members who fail to do so will not be eligible for the 13th month bonus.</p>
                            <p>2) Members who fail to make a payment in a given month will have their scheme period extended for the number of months they have not paid. i.e., When a member, who joins the scheme on 1st January 2024, fails to make their monthly instalment for any one month, their scheme will lapse by 1 month causing the scheme period to end on 1st February 2025. Such members can redeem jewellery worth their savings and 13th month bonus after 1st March 2025 or 30 days after their last timely payment.</p>
                            <p>3) Members who make their monthly payments ahead of time will only receive their 13th month bonus at the end of their plan period. Members who wish to redeem their jewellery at an earlier date will not be eligible for the 13th month bonus.</p>
                            <p>4) Members discontinuing or pre-closing halfway through the scheme will not be eligible for any benefits.</p>
                            <p>5) All monthly payments are only redeemable as gold and/or diamond jewellery. No cash refunds or reimbursements will be made under any circumstances.</p>
                            <p>6) The gold price, at the time of redemption, would be based on the prevailing gold price at DMY Jewellery on the day of purchase.</p>
                            <p>7) The 13th month bonus cannot be used in conjunction with any special offers or promotions at the time of redemption. Members who wish to redeem jewellery in conjunction with any special offers or promotions will have to forgo their 13th month bonus.</p>
                            <p>8) Workmanship and other relevant charges will be levied additionally, according to the type of jewellery purchased.</p>
                            <p>9) Goods and Services Tax (GST) will be applicable on all purchases.</p>
                            <p>10) Purchase of Pure Gold Bars and 916 Gold Coins are not permitted under this scheme.</p>
                            <p>11) Members must produce both their active GSS Page on MyDMY App and photo ID (NRIC, Driving Licence) for verification purpose during redemption.</p>
                            <p>12) DMY Jewellery Pte Ltd gives full guarantee to members for all funds deposited in the Gold Saving Scheme.</p>
                            <p>13) DMY Jewellery Pte Ltd may, at its sole discretion, with or without prior notice at any time, amend or revise the terms and conditions which will supersede the previous terms and conditions. All members hereby accept the terms and conditions as amended from time to time.</p>
                            <p>14) Please visit dmyjewellery.com to view updated term and conditions.</p>
                            <p>15) Any instalment payments made via Debit Cards or Credit Cards will incur 4% administrative charges.</p>
                            <p>16) ATM transfer not accepted.</p>
                        </div>
                        <div className="p-5 border-t border-gray-100 bg-gray-50">
                            <label className="flex items-center gap-2 cursor-pointer mb-4">
                                <input type="checkbox" checked={agreeChecked} onChange={(e) => setAgreeChecked(e.target.checked)} className="w-4 h-4 rounded text-black border-gray-300 focus:ring-black accent-black" />
                                <span className="font-medium text-gray-800 text-sm">I agree to the Terms & Conditions</span>
                            </label>
                            <div className="flex gap-3">
                                <button onClick={() => setShowTerms(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold bg-white focus:outline-none">
                                    Cancel
                                </button>
                                <button
                                    onClick={() => { if (agreeChecked) navigate('/scheme/apply') }}
                                    disabled={!agreeChecked}
                                    className="flex-1 py-3 rounded-xl bg-black text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition-colors">
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
