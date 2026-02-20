import { Link, NavLink } from 'react-router-dom';

/**
 * Sticky navigation bar for the Expert Session Booking app.
 */
const Navbar = () => {
    const linkClass = ({ isActive }) =>
        isActive
            ? 'text-indigo-400 font-semibold border-b-2 border-indigo-400 pb-0.5'
            : 'text-slate-400 hover:text-slate-100 transition-colors duration-200';

    return (
        <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold gradient-text">ExpertConnect</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="flex items-center gap-6 sm:gap-8">
                        <NavLink to="/" end className={linkClass}>
                            Experts
                        </NavLink>
                        <NavLink to="/my-bookings" className={linkClass}>
                            My Bookings
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
