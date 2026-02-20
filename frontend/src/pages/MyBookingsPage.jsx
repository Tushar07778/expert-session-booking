import { useState } from 'react';
import api from '../api/api';
import Spinner from '../components/Spinner';

const STATUS_STYLES = {
    Pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    Confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
    Completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const STATUS_ICONS = {
    Pending: '⏳',
    Confirmed: '✅',
    Completed: '🏆',
};

/**
 * My Bookings Page
 * Search bookings by email and display them as status cards.
 */
const MyBookingsPage = () => {
    const [emailInput, setEmailInput] = useState('');
    const [searchedEmail, setSearchedEmail] = useState('');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmedEmail = emailInput.trim();
        if (!trimmedEmail) return;

        setLoading(true);
        setError(null);
        setSearched(true);
        setSearchedEmail(trimmedEmail);

        try {
            const { data } = await api.get('/api/bookings', { params: { email: trimmedEmail } });
            setBookings(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formatCreated = (isoStr) => {
        const date = new Date(isoStr);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Hero */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold gradient-text mb-3">My Bookings</h1>
                <p className="text-slate-400">Enter your email to view all your booked sessions.</p>
            </div>

            {/* Search Form */}
            <div className="card p-6 mb-8">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        placeholder="Enter your email address..."
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        required
                        className="input-field flex-1"
                    />
                    <button type="submit" disabled={loading} className="btn-primary px-8">
                        {loading ? 'Searching...' : 'Find Bookings'}
                    </button>
                </form>
            </div>

            {/* Results */}
            {loading ? (
                <Spinner message="Fetching your bookings..." />
            ) : error ? (
                <div className="text-center py-10">
                    <p className="text-red-400">{error}</p>
                </div>
            ) : searched && bookings.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-5xl mb-4">📭</div>
                    <p className="text-xl font-semibold text-slate-300">No bookings found</p>
                    <p className="text-slate-500 mt-2">We couldn't find any bookings for <span className="text-indigo-400">{searchedEmail}</span>.</p>
                </div>
            ) : bookings.length > 0 ? (
                <>
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-slate-400 text-sm">
                            Found <span className="text-slate-200 font-semibold">{bookings.length}</span> booking{bookings.length !== 1 ? 's' : ''} for{' '}
                            <span className="text-indigo-400">{searchedEmail}</span>
                        </p>
                        <div className="flex gap-2">
                            {['Pending', 'Confirmed', 'Completed'].map((s) => (
                                <span key={s} className={`badge border ${STATUS_STYLES[s]}`}>
                                    {STATUS_ICONS[s]} {bookings.filter((b) => b.status === s).length} {s}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="card p-5 hover:border-slate-700 transition-all duration-200"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                    {/* Expert Info */}
                                    <div className="flex items-center gap-3 flex-1">
                                        <img
                                            src={
                                                booking.expertId?.photo ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.expertId?.name || 'Expert')}&background=6366f1&color=fff&size=48`
                                            }
                                            alt={booking.expertId?.name}
                                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-700 shrink-0"
                                        />
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Expert</p>
                                            <p className="font-semibold text-slate-100">{booking.expertId?.name || 'Unknown Expert'}</p>
                                            <p className="text-slate-400 text-sm">{booking.expertId?.category}</p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <span className={`badge border self-start sm:self-center ${STATUS_STYLES[booking.status]}`}>
                                        {STATUS_ICONS[booking.status]} {booking.status}
                                    </span>
                                </div>

                                {/* Details Grid */}
                                <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div>
                                        <p className="text-xs text-slate-600 mb-0.5">Date</p>
                                        <p className="text-sm text-slate-300 font-medium">
                                            {new Date(booking.date + 'T00:00:00').toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-600 mb-0.5">Time Slot</p>
                                        <p className="text-sm text-slate-300 font-medium">{booking.timeSlot}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-600 mb-0.5">Booked On</p>
                                        <p className="text-sm text-slate-300 font-medium">{formatCreated(booking.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-600 mb-0.5">Your Name</p>
                                        <p className="text-sm text-slate-300 font-medium">{booking.name}</p>
                                    </div>
                                </div>

                                {booking.notes && (
                                    <div className="mt-3 px-3 py-2 bg-slate-800/50 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-0.5">Notes</p>
                                        <p className="text-sm text-slate-400">{booking.notes}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default MyBookingsPage;
