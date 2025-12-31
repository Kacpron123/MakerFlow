import { useEffect } from 'react';

export const useTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | MakerFlow`;
    
    return () => {
      document.title = 'MakerFlow';
    };
  }, [title]);
};