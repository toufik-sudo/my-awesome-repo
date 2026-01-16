import { useWallSelection } from 'hooks/wall/useWallSelection';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { forceActiveProgram } from 'store/actions/wallActions';
import { WALL_ROUTE } from 'constants/routes';
import { useEffect } from 'react';

/**
 * Handles the display of selected ranking in list
 */
export const useBeneficiaryRankingList = () => {
  const {
    selectedPlatform: { role, id: platformId },
    userRankings: { programRankings, selectedRanking }
  } = useWallSelection();
  const history = useHistory();
  const dispatch = useDispatch();

  const handleSelectProgram = async (programId, unBlur?) => {
    await dispatch(forceActiveProgram({ programId, unlockSelection: true }));
    if (!unBlur) return history.push(WALL_ROUTE);
  };

  useEffect(() => {
    if (selectedRanking.name) {
      scrollElement(selectedRanking.name + selectedRanking.id);
    }
  }, [selectedRanking]);

  const scrollElement = elementName => {
    const myElement = document.getElementById(elementName);
    const topPos = myElement && myElement.offsetTop;

    window.scrollTo({
      top: topPos - 100,
      behavior: 'smooth'
    });
  };

  return { role, programRankings, selectedRanking, history, platformId, handleSelectProgram };
};
