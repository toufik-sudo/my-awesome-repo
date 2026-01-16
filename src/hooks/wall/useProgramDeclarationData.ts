import { useEffect, useState } from 'react';

import { useWallSelection } from 'hooks/wall/useWallSelection';
import { findProgramById } from 'services/ProgramServices';

/**
 * Hook used to check and retrieve information regarding declaration creation for selected program
 */
export const useProgramDeclarationData = () => {
  const { programs, selectedProgramIndex, selectedProgramId } = useWallSelection();

  const [declarationForm, setDeclarationForm] = useState(true);
  const [excelFileImport, setExcelFileImport] = useState(true);

  useEffect(() => {
    if (programs[selectedProgramIndex]) {
      setDeclarationForm(programs[selectedProgramIndex].resultsDeclarationForm);
      setExcelFileImport(programs[selectedProgramIndex].uploadResultsFile);
    }
  }, [selectedProgramId]);

  return {
    declarationForm,
    excelFileImport,
    beneficiaryCanDeclare: !(excelFileImport && !declarationForm),
    program: findProgramById(programs, selectedProgramId)
  };
};
