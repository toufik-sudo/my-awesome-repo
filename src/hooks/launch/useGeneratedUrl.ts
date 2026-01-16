import { useState, useEffect } from 'react';
import { generateProgramURL } from 'store/actions/formActions';

/**
 * Hook used to handle URL updates depending on the type of Program
 * @param isFree
 */
export const useGeneratedUrl = isFree => {
  const [generatedUrl, setGeneratedUrl] = useState(null);

  useEffect(() => {
    async function caller() {
      const res = await generateProgramURL();
      setGeneratedUrl(res.data);
    }
    isFree ? caller() : setGeneratedUrl({ customUrl: '' });
  }, [isFree]);

  return generatedUrl;
};
