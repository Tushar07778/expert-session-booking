import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Booking Page
 * Form to book a session with a selected expert.
 * Pre-fills date + time slot from URL query params (set by ExpertDetailPage).
 */
const BookingPage = () => {
    const { expertId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const preDate = searchParams.get('date') || '';
    const preSlot = searchParams.get('slot') || '';

    const [expert, setExpert] = useState(null);
    const [expertLoading, setExpertLoading] = useState(true);

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        date: preDate,
        timeSlot: preSlot,
        notes: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);

    // Fetch expert to know available dates
    useEffect(() => {
        const fetchExpert = async () => {
            try {
                const { data } = await api.get(`/api/experts/${expertId}`);
                setExpert(data.data);
                setAvailableDates(data.data.availableSlots || []);
            } catch (err) {
                // Expert not found — navigate back
            } finally {
                setExpertLoading(false);
            }
        };
        fetchExpert();
    }, [expertId]);

    // When date changes, get available (unbooked) slots for that date
    const slotsForDate = availableDates
        .find((d) => d.date === form.date)
        ?.slots.filter((s) => !s.isBooked) || [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Clear field error on change
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!form.email.trim()) newErrors.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Invalid email address';
        if (!form.phone.trim()) newErrors.phone = 'Phone is required';
        else if (!/^\d{10}$/.test(form.phone)) newErrors.phone = 'Phone must be exactly 10 digits';
        if (!form.date) newErrors.date = 'Please select a date';
        if (!form.timeSlot) newErrors.timeSlot = 'Please select a time slot';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSubmitting(true);
        setApiError(null);
        try {
            await api.post('/api/bookings', { expertId, ...form });
            setSuccess(true);
        } catch (err) {
            setApiError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (expertLoading) return <div className="max-w-2xl mx-auto px-4 py-10"><Spinner message="Loading booking form..." /></div>;

    // Success State
    if (success) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-10">
                <div className="card p-10 text-center">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-100 mb-2">Booking Confirmed! 🎉</h2>
                    <p className="text-slate-400 mb-2">
                        Your session with <span className="text-indigo-400 font-semibold">{expert?.name}</span> has been booked.
                    </p>
                    <p className="text-slate-500 text-sm mb-8">
                        📅 {form.date} &nbsp;⏰ {form.timeSlot}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/my-bookings" className="btn-primary">
                            View My Bookings
                        </Link>
                        <Link to="/" className="btn-secondary">
                            Browse More Experts
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
            {/* Back */}
            <Link
                to={`/experts/${expertId}`}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-100 mb-6 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Expert
            </Link>

            <div className="card p-6 sm:p-8">
                {/* Header */}
                {expert && (
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
                        <img
                            src={expert.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=6366f1&color=fff&size=60`}
                            alt={expert.name}
                            className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-700"
                        />
                        <div>
                            <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">Booking with</p>
                            <h2 className="text-xl font-bold text-slate-100">{expert.name}</h2>
                            <p className="text-slate-400 text-sm">{expert.category}</p>
                        </div>
                    </div>
                )}

                <h3 className="text-lg font-semibold text-slate-200 mb-6">Your Details</h3>

                {/* API Error */}
                {apiError && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-300 text-sm">{apiError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name *</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={handleChange}
                            className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number *</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="10-digit phone number"
                            value={form.phone}
                            onChange={handleChange}
                            maxLength={10}
                            className={`input-field ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Session Date *</label>
                        <select
                            name="date"
                            value={form.date}
                            onChange={(e) => {
                                setForm((prev) => ({ ...prev, date: e.target.value, timeSlot: '' }));
                                if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
                            }}
                            className={`input-field ${errors.date ? 'border-red-500 focus:ring-red-500' : ''}`}
                        >
                            <option value="">Select a date</option>
                            {availableDates.map(({ date }) => (
                                <option key={date} value={date}>{date}</option>
                            ))}
                        </select>
                        {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
                    </div>

                    {/* Time Slot */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Time Slot *</label>
                        {form.date ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {slotsForDate.length === 0 ? (
                                    <p className="text-slate-500 text-sm col-span-full py-3 text-center">No slots available for this date.</p>
                                ) : (
                                    slotsForDate.map(({ slot }) => (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => {
                                                setForm((prev) => ({ ...prev, timeSlot: slot }));
                                                if (errors.timeSlot) setErrors((prev) => ({ ...prev, timeSlot: '' }));
                                            }}
                                            className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all duration-200 ${form.timeSlot === slot
                                                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-indigo-300'
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))
                                )}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm py-3">Please select a date first.</p>
                        )}
                        {errors.timeSlot && <p className="text-red-400 text-xs mt-1">{errors.timeSlot}</p>}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Notes (optional)</label>
                        <textarea
                            name="notes"
                            placeholder="Anything you'd like to discuss or share with the expert..."
                            value={form.notes}
                            onChange={handleChange}
                            rows={3}
                            className="input-field resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full py-3 text-base mt-2"
                    >
                        {submitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Booking...
                            </span>
                        ) : (
                            'Confirm Booking'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingPage;
