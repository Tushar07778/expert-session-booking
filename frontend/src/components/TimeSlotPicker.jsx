/**
 * TimeSlotPicker — renders a grid of time slots for a given date.
 * Slots that are already booked are shown as disabled.
 * Supports real-time booked state updates via parent component.
 */
const TimeSlotPicker = ({ date, slots, selectedSlot, onSelectSlot, disabledSlots = new Set() }) => {
    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {slots.map(({ slot, isBooked }) => {
                const isDisabled = isBooked || disabledSlots.has(slot);
                const isSelected = selectedSlot === slot;

                return (
                    <button
                        key={slot}
                        onClick={() => !isDisabled && onSelectSlot(slot)}
                        disabled={isDisabled}
                        className={`
              py-2.5 px-3 rounded-xl text-sm font-medium border transition-all duration-200
              ${isDisabled
                                ? 'bg-slate-800/50 border-slate-700/50 text-slate-600 cursor-not-allowed line-through'
                                : isSelected
                                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-indigo-300'
                            }
            `}
                    >
                        {isDisabled && (
                            <span className="block text-xs text-slate-600 mb-0.5">Booked</span>
                        )}
                        {slot}
                    </button>
                );
            })}
        </div>
    );
};

export default TimeSlotPicker;
