/**
 * Full-page loading spinner component.
 */
const Spinner = ({ size = 'lg', message = 'Loading...' }) => {
    const sizeClass = size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-10 h-10' : 'w-14 h-14';

    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div
                className={`${sizeClass} border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin`}
            />
            {message && <p className="text-slate-400 text-sm">{message}</p>}
        </div>
    );
};

export default Spinner;
