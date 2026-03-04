import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, X } from "lucide-react";
import httpService from "../services/httpService";
import toast from 'react-hot-toast';

export default function SchemeRegistration() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [nric, setNric] = useState('');
    const [showNric, setShowNric] = useState(false);
    const [isNricFocused, setIsNricFocused] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    const [blockNo, setBlockNo] = useState('');
    const [floorNo, setFloorNo] = useState('');
    const [street, setStreet] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [anniversary, setAnniversary] = useState('');
    const [amount, setAmount] = useState('100');
    const [agreeTerm, setAgreeTerm] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatNric = (val: string) => {
        if (!val) return '';
        if (showNric || isNricFocused) return val;
        if (val.length <= 4) return val;
        return '*'.repeat(val.length - 4) + val.slice(-4);
    };

    const handleNricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Since we only allow typing when focused, the input value should be the actual string.
        setNric(e.target.value.toUpperCase());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreeTerm) {
            toast.error("Please agree to the terms.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                name, nric, blockNo, floorNo, street, postalCode, country: 'Singapore',
                phone, dob, anniversary, period: 12, amount: Number(amount)
            };

            await httpService.post('/api/schemes/apply', payload);
            toast.success("Scheme application submitted successfully!");
            navigate('/scheme');
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to apply");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-10">
            {/* Top Bar */}
            <div className="flex items-center space-x-4 p-6 relative bg-white shadow-sm z-10">
                <Link to="/scheme" className="text-gray-900 hover:scale-110 transition-transform">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-xl font-bold font-serif text-gray-900">Registration Form</h1>
            </div>

            <div className="px-5 mt-6 flex-grow">
                {/* Form Card */}
                <div className="card shadow-lg border border-gray-100 p-6 rounded-2xl bg-white">
                    <h2 className="text-primary-gold text-lg font-bold text-center mb-6 border-b border-gray-100 pb-2">Apply for Gold Scheme</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>

                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-800">Full Name (Capital Letters)</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. ROBERT JOE" className="input-field py-2.5 uppercase placeholder:normal-case font-medium w-full border border-gray-200 rounded-lg px-3 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-800">NRIC No</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formatNric(nric)}
                                    onChange={handleNricChange}
                                    onFocus={() => setIsNricFocused(true)}
                                    onBlur={() => setIsNricFocused(false)}
                                    required
                                    placeholder="e.g. S1234567A"
                                    className="input-field py-2.5 font-medium w-full border border-gray-200 rounded-lg px-3 pr-10 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] outline-none"
                                />
                                <button type="button" onClick={() => setShowNric(!showNric)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    {showNric ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-800">Block No</label>
                                <input type="text" value={blockNo} onChange={(e) => setBlockNo(e.target.value)} required placeholder="e.g. 104" className="input-field py-2.5 w-full border border-gray-200 rounded-lg px-3 font-medium text-sm focus:border-[#C9A84C] focus:ring-1 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-800">Unit / Floor No</label>
                                <input type="text" value={floorNo} onChange={(e) => setFloorNo(e.target.value)} required placeholder="e.g. #10-123" className="input-field py-2.5 w-full border border-gray-200 rounded-lg px-3 font-medium text-sm focus:border-[#C9A84C] focus:ring-1 outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-800">Street Name</label>
                            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} required placeholder="e.g. Orchard Road" className="input-field py-2.5 font-medium border border-gray-200 rounded-lg px-3 w-full focus:border-[#C9A84C] focus:ring-1 outline-none" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-800">Country</label>
                                <input type="text" value="Singapore" readOnly className="input-field py-2.5 w-full font-medium text-sm bg-gray-100 text-gray-600 border border-gray-200 rounded-lg px-3 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-800">Postal Code</label>
                                <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required placeholder="e.g. 123456" className="input-field py-2.5 w-full font-medium text-sm border border-gray-200 rounded-lg px-3 focus:border-[#C9A84C] focus:ring-1 outline-none" />
                            </div>
                        </div>

                        <div className="flex space-x-2 w-full pt-1">
                            <div className="w-1/3">
                                <label className="block text-sm font-semibold mb-1 text-gray-800">Code</label>
                                <select className="input-field py-2.5 w-full text-center appearance-none font-medium border border-gray-200 rounded-lg outline-none bg-gray-50">
                                    <option>+65</option>
                                </select>
                            </div>
                            <div className="w-2/3">
                                <label className="block text-sm font-semibold mb-1 text-gray-800">Phone</label>
                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="12345 67890" className="input-field py-2.5 w-full font-medium border border-gray-200 rounded-lg px-3 focus:border-[#C9A84C] outline-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-1">
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-800">DOB</label>
                                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required className="input-field py-2.5 w-full border border-gray-200 rounded-lg px-3 text-gray-700 text-sm font-medium focus:border-[#C9A84C] outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-800">Anniversary</label>
                                <input type="date" value={anniversary} onChange={(e) => setAnniversary(e.target.value)} className="input-field py-2.5 w-full border border-gray-200 rounded-lg px-3 text-gray-700 text-sm font-medium focus:border-[#C9A84C] outline-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-1">
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-800">Period</label>
                                <select className="input-field py-2.5 w-full appearance-none text-center font-medium border border-gray-200 bg-gray-50 rounded-lg outline-none cursor-not-allowed">
                                    <option value="12">12 Months</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-800">Amount Per Month (S$)</label>
                                <select value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field py-2.5 w-full appearance-none font-bold text-primary-gold text-lg border border-gray-200 rounded-lg px-3 text-center focus:border-[#C9A84C] outline-none cursor-pointer">
                                    {[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(val => (
                                        <option key={val} value={val}>S$ {val}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-center items-center mt-3 pt-4">
                            <label className="flex items-center space-x-2 text-xs text-gray-800 font-medium cursor-pointer">
                                <input type="checkbox" checked={agreeTerm} onChange={(e) => setAgreeTerm(e.target.checked)} className="form-checkbox h-4 w-4 text-black border-gray-300 rounded-sm focus:ring-black accent-black" />
                                <span>Agree to <span onClick={(e) => { e.preventDefault(); setShowTerms(true); }} className="font-bold underline underline-offset-2 text-[#C9A84C] hover:text-black transition-colors">Terms & Conditions</span></span>
                            </label>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white py-4 mt-6 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg disabled:opacity-70 focus:outline-none">
                            {isSubmitting ? 'Applying...' : 'Apply'}
                        </button>
                    </form>
                </div>
            </div>

            {/* T&C Modal */}
            {showTerms && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in cursor-default">
                    <div className="bg-white rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#FAFAFA]">
                            <h2 className="text-lg font-bold text-gray-900 font-serif">Terms & Conditions</h2>
                            <button onClick={() => setShowTerms(false)} className="text-gray-400 hover:text-black transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-5 overflow-y-auto font-inter text-sm text-gray-700 space-y-4 max-h-[60vh] leading-relaxed">
                            <p className="font-semibold text-black mb-2">Please read carefully</p>
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
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <button
                                onClick={() => { setAgreeTerm(true); setShowTerms(false); }}
                                className="w-full py-3 rounded-xl bg-black text-white font-bold transition-transform active:scale-[0.98]">
                                I Agree
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
