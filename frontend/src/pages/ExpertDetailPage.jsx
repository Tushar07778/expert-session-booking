import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useSocket } from '../context/SocketContext';
import TimeSlotPicker from '../components/TimeSlotPicker';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORY_COLORS = {
    Technology: 'bg-blue-500/10 text-blue-400',
    Design: 'bg-pink-500/10 text-pink-400',
    Marketing: 'bg-orange-500/10 text-orange-400',
    Finance: 'bg-green-500/10 text-green-400',
    Health: 'bg-red-500/10 text-red-400',
    Education: 'bg-yellow-500/10 text-yellow-400',
    Legal: 'bg-purple-500/10 text-purple-400',
    Business: 'bg-teal-500/10 text-teal-400',
};

/**
 * Expert Detail Page
 * Shows full expert profile and real-time updated time slots.
 */
const ExpertDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { socket } = useSocket();
    const [expert, setExpert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeDate, setActiveDate] = useState(null);
    // Track newly-booked slots in real-time (in addition to server-side isBooked)
    const realtimeBooked = useRef({}); // { "date|slot": true }
    const [realtimeState, setRealtimeState] = useState({});

    const fetchExpert = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get(`/api/experts/${id}`);
            setExpert(data.data);
            // Default to first available date
            if (data.data.availableSlots?.length) {
                setActiveDate(data.data.availableSlots[0].date);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpert();
    }, [id]);

    // ✅ Real-time Socket.io listener — disable slots as others book them
    useEffect(() => {
        if (!socket) return;

        const handleSlotBooked = ({ expertId, date, timeSlot }) => {
            if (expertId !== id) return; // Only care about this expert's bookings
            const key = `${date}|${timeSlot}`;
            realtimeBooked.current[key] = true;
            setRealtimeState({ ...realtimeBooked.current });
        };

        socket.on('slot_booked', handleSlotBooked);
        return () => socket.off('slot_booked', handleSlotBooked);
    }, [socket, id]);

    if (loading) return <div className="max-w-5xl mx-auto px-4 py-10"><Spinner message="Loading expert profile..." /></div>;
    if (error) return <div className="max-w-5xl mx-auto px-4 py-10"><ErrorMessage message={error} onRetry={fetchExpert} /></div>;
    if (!expert) return null;

    const { name, category, bio, experience, rating, photo, availableSlots } = expert;
    const categoryColor = CATEGORY_COLORS[category] || 'bg-slate-500/10 text-slate-400';
    const activeDateSlots = availableSlots.find((s) => s.date === activeDate);

    // Build disabledSlots Set from real-time events for current date
    const liveDisabledSlots = new Set();
    if (activeDate) {
        Object.keys(realtimeState).forEach((key) => {
            const [d, slot] = key.split('|');
            if (d === activeDate) liveDisabledSlots.add(slot);
        });
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    const availableCount = activeDateSlots
        ? activeDateSlots.slots.filter((s) => !s.isBooked && !liveDisabledSlots.has(s.slot)).length
        : 0;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Back */}
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-100 mb-6 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Experts
            </Link>

            {/* Profile Card */}
            <div className="card p-6 sm:p-8 mb-8">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <img
                        src={photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=120`}
                        alt={name}
                        className="w-28 h-28 rounded-2xl object-cover ring-4 ring-slate-700 shrink-0"
                    />
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-slate-100">{name}</h1>
                            <span className={`badge ${categoryColor}`}>{category}</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed mb-4">{bio}</p>
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                <span className="font-bold text-xl text-yellow-400">{rating.toFixed(1)}</span>
                                <span className="text-slate-500">rating</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-bold text-xl text-slate-200">{experience}</span>
                                <span className="text-slate-500">yrs experience</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slot Booking */}
            <div className="card p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-100">Available Sessions</h2>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-slate-400">Live updates</span>
                    </div>
                </div>

                {availableSlots.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No available slots at this time.</p>
                ) : (
                    <>
                        {/* Date Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                            {availableSlots.map(({ date }) => (
                                <button
                                    key={date}
                                    onClick={() => setActiveDate(date)}
                                    className={`shrink-0 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${activeDate === date
                                            ? 'bg-indigo-600 border-indigo-500 text-white'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-indigo-500/50'
                                        }`}
                                >
                                    {formatDate(date)}
                                </button>
                            ))}
                        </div>

                        {/* Time Slots */}
                        {activeDateSlots && (
                            <>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-slate-400 text-sm">
                                        <span className="text-slate-200 font-medium">{availableCount}</span> slots available
                                    </p>
                                    <p className="text-xs text-slate-500">Click a slot to book</p>
                                </div>
                                <TimeSlotPicker
                                    date={activeDate}
                                    slots={activeDateSlots.slots}
                                    selectedSlot={null}
                                    onSelectSlot={(slot) =>
                                        navigate(`/book/${id}?date=${activeDate}&slot=${encodeURIComponent(slot)}`)
                                    }
                                    disabledSlots={liveDisabledSlots}
                                />
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ExpertDetailPage;
