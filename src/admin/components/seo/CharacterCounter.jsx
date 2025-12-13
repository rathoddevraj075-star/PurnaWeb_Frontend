/**
 * Character Counter Component
 */

export default function CharacterCounter({ current, min, max }) {
    const isOptimal = current >= min && current <= max;
    const isTooShort = current > 0 && current < min;
    const isTooLong = current > max;

    return (
        <div className="flex items-center justify-between mt-1">
            <span className={`text-xs ${isOptimal ? 'text-emerald-600' :
                    isTooShort ? 'text-amber-600' :
                        isTooLong ? 'text-red-600' : 'text-gray-400'
                }`}>
                {current} / {max} characters
                {isTooShort && ` (min ${min})`}
                {isTooLong && ' (too long)'}
            </span>
            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all ${isOptimal ? 'bg-emerald-500' :
                            isTooShort ? 'bg-amber-500' :
                                isTooLong ? 'bg-red-500' : 'bg-gray-300'
                        }`}
                    style={{ width: `${Math.min((current / max) * 100, 100)}%` }}
                />
            </div>
        </div>
    );
}
