import { useState, useEffect } from 'react';

// Custom hook for debouncing a value
// Returns the latest value only after the specified delay has passed without changes
export function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set up a timer to update debouncedValue after delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup timer if value or delay changes before timeout
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}