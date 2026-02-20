import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
    Technology: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Design: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    Marketing: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Finance: 'bg-green-500/10 text-green-400 border-green-500/20',
    Health: 'bg-red-500/10 text-red-400 border-red-500/20',
    Education: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    Legal: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Business: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
};

/**
 * Card component showing expert summary info with a Book button.
 */
const ExpertCard = ({ expert }) => {
    const { _id, name, category, experience, rating, photo, bio } = expert;
    const categoryColor = CATEGORY_COLORS[category] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';

    return (
        <div className="card p-6 flex flex-col gap-4 hover:border-slate-700 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 group">
            {/* Header */}
            <div className="flex items-start gap-4">
                <div className="relative">
                    <img
                        src={photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=80`}
                        alt={name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-700 group-hover:ring-indigo-500/50 transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full px-1.5 py-0.5 flex items-center gap-0.5 border border-slate-700">
                        <svg className="w-3 h-3 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        <span className="text-xs font-bold text-yellow-400">{rating.toFixed(1)}</span>
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-100 text-lg leading-tight truncate">{name}</h3>
                    <span className={`badge border mt-1 ${categoryColor}`}>{category}</span>
                </div>
            </div>

            {/* Bio */}
            <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{bio}</p>

            {/* Experience + CTA */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{experience} yrs exp.</span>
                </div>
                <Link
                    to={`/experts/${_id}`}
                    className="btn-primary text-sm py-2 px-4"
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
};

export default ExpertCard;
