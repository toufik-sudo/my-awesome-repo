import { useState } from 'react';

/**
 * Hook used to manipulate userDeclaration data.
 */
export const useUserDeclarationsDetailData = () => {
  const [isOpen, setIsOpen] = useState(false);

  return { isOpen, setIsOpen };
};
