// filepath: hooks/useScrollDirection.ts
import { useEffect, useState } from 'react';

const useScrollDirection = () => {
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
    const [lastScrollY, setLastScrollY] = useState(0);

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
            setScrollDirection('down');
        } else {
            setScrollDirection('up');
        }

        setLastScrollY(currentScrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return scrollDirection;
};

export default useScrollDirection;