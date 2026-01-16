import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLaunchDataStep } from 'store/actions/launchActions';
import CubeOption from 'components/atoms/launch/cube/CubeOption';
import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { IStore } from 'interfaces/store/IStore';
import inputStyle from 'sass-boilerplate/stylesheets/components/forms/Input.module.scss';
import BracketLabel from 'components/atoms/launch/cube/BracketLabel';
import bracketStyle from 'sass-boilerplate/stylesheets/components/launch/Brackets.module.scss';
import { FormattedMessage } from 'react-intl';
import ButtonDelete from 'components/atoms/ui/ButtonDelete';
import { convertAsciiToString } from 'utils/general';
import { CUBE_SECTIONS } from 'constants/wall/launch';
import ValidateCta from 'components/atoms/launch/cube/ValidateCTA';
import cubeStyle from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';


const StarAppreciationToggle = () => {
  const { cube } = useSelector((store: IStore) => store.launchReducer);
  const sectionShouldDisplay = cube.cubeValidated.rewardPeopleManagers;
  const [acceptsStarRanking, setAcceptsStarRanking] = useState(false);
  const { cubeContent, cubeSectionWrapper, cubeFrequencyWrapper } = style;
  const dispatch = useDispatch();

  if (!sectionShouldDisplay) return null;

  return (
    <div className={`${cubeSectionWrapper} ${cubeContent} ${cubeFrequencyWrapper}`} style={{ whiteSpace: 'pre' }}>
      <DynamicFormattedMessage
        className={style.cubeSectionTitle}
        tag={HTML_TAGS.P}
        id={`launchProgram.cube.starAppreciation.title`}
      />
      <CubeOption
        handleSelection={() => setAcceptsStarRanking(true)}
        isSelected={acceptsStarRanking}
        translation="Oui"
        type={true}
      />
      <CubeOption
        handleSelection={() => {
          setAcceptsStarRanking(false);
          dispatch(setLaunchDataStep({ key: "programRanking", value: null })); // Reset stored ranking
        }}
        isSelected={!acceptsStarRanking}
        translation="Non"
        type={false}
      />
      {acceptsStarRanking && <StarAppreciation />}
    </div>
  );
};

const StarIcon = ({ filled = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill={filled ? '#78bb7bc0' : "none"}
    stroke="#78bb7bc0"
    strokeWidth="2"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const StarAppreciation = () => {
  const { cubeContent, cubeSectionWrapper, cubeFrequencyWrapper } = style;
  const dispatch = useDispatch();
  const [bracketsData, setBracketsData] = useState([
    { min: '', max: '', value: 1, errors: {} },
    { min: '', max: '', value: 2, errors: {} },
    { min: '', max: '', value: 3, errors: {} },
  ]);

  const [isBracketsSeted, setIsBracketsSeted] = useState(false)

  const validateBrackets = (updatedBrackets) => {
    setIsBracketsSeted(false);
    return updatedBrackets.map((bracket, index) => {
      const errors = {};
      const prevBracket = updatedBrackets[index - 1];

      if (
        (index !== updatedBrackets.length - 1 || index == updatedBrackets.length - 1 && updatedBrackets.max != "") &&
        bracket.max !== '' &&
        bracket.min !== '' &&
        parseInt(bracket.max, 10) <= parseInt(bracket.min, 10)
      ) {
        errors.max = "doit être strictement supérieur à 'min'";
        errors.min = "doit être strictement inférieur à 'max'";
      }

      if (prevBracket && parseInt(bracket.min, 10) <= parseInt(prevBracket.max, 10)) {
        errors.min = "doit être supérieur";
        prevBracket.errors.max = "doit être inférieur";
      }

      return { ...bracket, errors };
    });
  };

  const handleBracketChange = (index, field, value) => {
    const updatedBrackets = [...bracketsData];
    updatedBrackets[index][field] = value;
    setBracketsData(validateBrackets(updatedBrackets));
  };

  const handleAddBracket = () => {
    if (bracketsData.length < 5) {
      const newValue = bracketsData.length + 1;
      const updatedBrackets = [
        ...bracketsData,
        { min: '', max: '', value: newValue, errors: {} },
      ];
      setBracketsData(validateBrackets(updatedBrackets));
    }
  };

  const handleDeleteBracket = (index) => {
    if (bracketsData.length > 3) {
      const updatedBrackets = bracketsData.filter((_, i) => i !== index);
      setBracketsData(validateBrackets(updatedBrackets));
    }
  };

  const saveProgramRanking = () => {
    const rankingKeys = [
      "firstStar",
      "secondStar",
      "thirdStar",
      "fourthStar",
      "fifthStar",
    ];

    const programRanking = bracketsData.reduce((acc, bracket, index) => {
      const key = rankingKeys[index];
      acc[key] = {
        min: parseInt(bracket.min, 10),
        max: bracket.max === '' && index === bracketsData.length - 1 ? null : parseInt(bracket.max, 10),
      };
      return acc;
    }, {});

    dispatch(setLaunchDataStep({ key: "programRanking", value: programRanking }));
    console.log("Saved Program Ranking:", programRanking);
    setIsBracketsSeted(!isBracketsSeted);
  };
  const allInputsFilled = bracketsData.every(
    (bracket, index) =>
      bracket.min !== '' &&
      (index === bracketsData.length - 1 || bracket.max !== '') &&
      Object.keys(bracket.errors).length === 0
  );
  const { bracketError, bracketInputGroupWrapper, bracketInputGroup, inputHasError, bracketWrapper, bracketLabel, bracketLabelWrapper, bracketDisabled } = bracketStyle;
  const { cubeSectionDisabled } = cubeStyle;
  return (
    <div>
      <div style={{ marginBottom: '2rem' }} className={`${isBracketsSeted ? cubeSectionDisabled : ''}`} >
        {bracketsData.map((bracket, index) => (
          <div key={index} >
            <div className={`${bracketWrapper}`} style={{ marginBottom: '0' }}>
              <span className={bracketLabelWrapper}>
                <DynamicFormattedMessage
                  className={bracketLabel}
                  tag={HTML_TAGS.SPAN}
                  id={`launchProgram.cube.rating.label`}
                  values={{ value: convertAsciiToString(index) }}
                />
              </span>

              <span className={bracketInputGroupWrapper}>
                <span className={`${bracketInputGroup} ${bracket.errors.min ? inputHasError : ''}`}>
                  <input
                    type="number"
                    value={bracket.min}
                    onChange={(e) => handleBracketChange(index, 'min', e.target.value)}
                    placeholder=""
                    className={inputStyle.cubeBracketInput}
                    style={{ minWidth: '15rem' }}
                  />

                  <span className={style.bracketLabel} style={{ marginLeft: '5px' }}>
                    Wins
                  </span>

                  <span className={bracketError}>
                    {bracket.errors.min && <FormattedMessage id={'bracket.errors.min'} />}
                  </span>
                </span>
              </span>

              <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id="label.to" className={bracketLabel} />

              <span className={bracketInputGroupWrapper}>
                <span className={`${bracketInputGroup} ${bracket.errors.max ? inputHasError : ''}`}>
                  <input
                    type="number"
                    value={bracket.max}
                    onChange={(e) => handleBracketChange(index, 'max', e.target.value)}
                    placeholder={index === bracketsData.length - 1 ? "Vide : pas de max" : ""}
                    className={inputStyle.cubeBracketInput}
                    style={{ minWidth: '15rem' }}
                  />
                  <span className={bracketError}>
                    {bracket.errors.max && <FormattedMessage id={'bracket.errors.max'} />}
                  </span>
                </span>
              </span>

              <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id="label.equals" className={bracketLabel} />

              <span style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                <h4>

                  {[...Array(bracket.value)].map((_, starIndex) => (
                    <StarIcon key={starIndex} filled={true} />
                  ))}
                  {[...Array(bracketsData.length - bracket.value)].map((_, starIndex) => (
                    <StarIcon key={starIndex} filled={false} />
                  ))}
                </h4>
              </span>

              {index == bracketsData.length - 1 && index > 2 && (
                <ButtonDelete onclick={() => handleDeleteBracket(index)} className={bracketStyle.btnDelete} />
                // <button onClick={() => handleDeleteBracket(index)} style={{ marginTop: '5px' }}>
                //   Supprimer tranche
                // </button>
              )}

            </div>
          </div>
        ))}

        <span>
          {bracketsData.length < 5 && (
            <button onClick={handleAddBracket}><FormattedMessage id={'bracket.add'} /></button>
          )}
        </span>

      </div>
      {allInputsFilled && (
        <ValidateCta handleItemValidation={saveProgramRanking}
          targetName={CUBE_SECTIONS.STARS}
          targetValue={isBracketsSeted}
        />

        // <button onClick={saveProgramRanking} style={{ marginTop: '15px' }}>
        //   Sauvegarder
        // </button>
      )}
    </div>
  );
};

export default StarAppreciationToggle;
