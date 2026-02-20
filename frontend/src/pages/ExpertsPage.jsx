import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import ExpertCard from '../components/ExpertCard';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';

const CATEGORIES = ['All', 'Technology', 'Design', 'Marketing', 'Finance', 'Health', 'Education', 'Legal', 'Business'];

/**
 * Expert Listing Page
 * Displays paginated experts with search and category filter.
 */
const ExpertsPage = () => {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [category, setCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});

    const fetchExperts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = { page: currentPage, limit: 6, category };
            if (search) params.search = search;
            const { data } = await api.get('/api/experts', { params });
            setExperts(data.data);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [currentPage, search, category]);

    useEffect(() => {
        fetchExperts();
    }, [fetchExperts]);

    // Reset to page 1 on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, category]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearch(searchInput);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Hero Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text mb-3">
                    Find Your Expert
                </h1>
                <p className="text-slate-400 text-lg max-w-xl mx-auto">
                    Book 1-on-1 sessions with world-class professionals across tech, design, finance, and more.
                </p>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col gap-4 mb-8">
                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search experts by name..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="input-field flex-1"
                    />
                    <button type="submit" className="btn-primary px-6">
                        Search
                    </button>
                    {search && (
                        <button
                            type="button"
                            onClick={() => { setSearch(''); setSearchInput(''); }}
                            className="btn-secondary"
                        >
                            Clear
                        </button>
                    )}
                </form>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${category === cat
                                    ? 'bg-indigo-600 border-indigo-500 text-white'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-indigo-500/50 hover:text-slate-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Active Filters Badge */}
            {(search || category !== 'All') && (
                <div className="flex items-center gap-2 mb-6">
                    <span className="text-slate-500 text-sm">Showing results for:</span>
                    {search && (
                        <span className="badge bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            "{search}"
                        </span>
                    )}
                    {category !== 'All' && (
                        <span className="badge bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            {category}
                        </span>
                    )}
                    {pagination.totalExperts !== undefined && (
                        <span className="text-slate-500 text-sm ml-auto">
                            {pagination.totalExperts} expert{pagination.totalExperts !== 1 ? 's' : ''} found
                        </span>
                    )}
                </div>
            )}

            {/* Content */}
            {loading ? (
                <Spinner message="Finding experts for you..." />
            ) : error ? (
                <ErrorMessage message={error} onRetry={fetchExperts} />
            ) : experts.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-xl font-semibold text-slate-300">No experts found</p>
                    <p className="text-slate-500 mt-2">Try adjusting your search or filter.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {experts.map((expert) => (
                            <ExpertCard key={expert._id} expert={expert} />
                        ))}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
};

export default ExpertsPage;
