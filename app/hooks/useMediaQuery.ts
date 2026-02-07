import { useEffect, useState } from 'react';
import { useHasMounted } from './useHasMounted';

export function useMediaQuery(query: string = '(max-width: 767px)') {
  const mounted = useHasMounted();

  const [matches, setMatches] = useState<boolean>(() => {
    if (!mounted) return false;
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);

    media.addEventListener('change', listener);
    setMatches(media.matches);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
