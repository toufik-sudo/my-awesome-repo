import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useMultiStep } from 'hooks/launch/useMultiStep';
import React, { useContext, useEffect, useState } from 'react';
import Button from 'components/atoms/ui/Button';

import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import buttonStyle from 'assets/style/common/Button.module.scss';
import coreStyle from '../../sass-boilerplate/stylesheets/style.module.scss';
import AiPersoApi from 'api/IA API/AiPersoApi';
import { IaiPersoGetResponseApi, IaiPersoGetResponseData } from './AiInterface';
import { UserContext } from 'components/App';
import { useDispatch, useSelector } from 'react-redux';
import { IStore } from 'interfaces/store/IStore';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { AI_SELECTED_LIST, ECARD_SELECTED_LIST } from 'constants/wall/launch';
import { IaiTrainingCompanyProgram, IaiCompanyProgram } from 'components/pages/programs/ia/AiInterface';
import Multiselect from 'multiselect-react-dropdown';
import { PointsOption } from 'interfaces/components/wall/Ipoints';
import eCardStyle from 'sass-boilerplate/stylesheets/components/launch/Ecard.module.scss';
import { FormattedMessage, useIntl } from 'react-intl';



import style4 from 'assets/style/components/Ai/AiRagComponent.module.scss'
import { INPUT_TYPE } from 'constants/forms';
import { CheckboxButton } from 'components/molecules/forms/fields/CheckboxButton';
import { AirVent } from 'lucide-react';
const courses: IaiTrainingCompanyProgram[] = [
  {
    iaTrainingName: "Pas de formation",
    iaStatus: "",
    iaTrainingDueDate: "",
    iaTrainingExpireDate: "",
    iaComment: "",
    iaTrainingType: ""
  },
  {
    iaTrainingName: "Les séquences de la vente",
    iaStatus: "",
    iaTrainingDueDate: "",
    iaTrainingExpireDate: "",
    iaComment: "",
    iaTrainingType: "quizz"
  },
  {
    iaTrainingName: "formation 2",
    iaStatus: "",
    iaTrainingDueDate: "",
    iaTrainingExpireDate: "",
    iaComment: "",
    iaTrainingType: "quizz"
  },
  {
    iaTrainingName: "formation 3",
    iaStatus: "",
    iaTrainingDueDate: "",
    iaTrainingExpireDate: "",
    iaComment: "",
    iaTrainingType: "quizz"
  }
];

const noAi: IaiCompanyProgram = {
  iaName: "Pas d'\ia"
}

const SelectAiPage = () => {
  const { section, centerSectionWrapper } = style;
  const [selectedAi, setSelectedAi] = useState < IaiPersoGetResponseApi | null > (null);
  const [selectedCourse, setSelectedCourse] = useState < IaiTrainingCompanyProgram | null > (null);
  const { stepSet: { setNextStep } } = useMultiStep();
  const [aiProfiles, setAiProfiles] = useState < IaiPersoGetResponseApi[] > ([]);

  const [aiOptions, setAiOptions] = useState < PointsOption[] > ([]);
  const [aiTrainingOptions, setAiTrainingOptions] = useState < PointsOption[] > ([]);

  const { userData } = useContext(UserContext);
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const userIdString = String(userData.uuid);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  const fetchAiProfiles = async () => {
    try {
      const profiles: IaiPersoGetResponseData = await AiPersoApi.getIaPersoCompany({ userUuid: userIdString });
      setAiProfiles([noAi, ...profiles.data]);
      renderAIOptions(profiles.data);
    } catch (error) {
      console.error('Error fetching AI profiles:', error);
    }
  };

  useEffect(() => {
    fetchAiProfiles();
  }, []);

  const handleNextStep = async () => {
    let isLoading = true;
    if (selectedAi) {
      if (selectedCourse) {
        try {
          const aiTrainingSelected: IaiTrainingCompanyProgram = selectedCourse;
          const aiSelected: IaiCompanyProgram = {
            iaName: selectedAi.iaName,
            iaProjectId: selectedAi.iaProjectId,
            iaType: selectedAi.iaType,
            iaComment: "",
            iaExpireDate: "",
            iaDueDate: "",
            iaStatus: "",
            iaTrainingCompany: [aiTrainingSelected],
            iaAudioOn: isVoiceEnabled
          };
          dispatch(setLaunchDataStep({ key: AI_SELECTED_LIST, value: aiSelected }));
        } catch (e) {
          throw new Error(e);
        }
      } else {
        try {
          const aiSelected: IaiCompanyProgram = {
            iaName: selectedAi.iaName,
            iaProjectId: selectedAi.iaProjectId,
            iaType: "",
            iaComment: "",
            iaExpireDate: "",
            iaDueDate: "",
            iaStatus: "",
            iaTrainingCompany: [],
            iaAudioOn: isVoiceEnabled
          };
          dispatch(setLaunchDataStep({ key: AI_SELECTED_LIST, value: aiSelected }));
        } catch (e) {
          throw new Error(e);
        }
      }
    } else {
      try {
        const aiSelected: IaiCompanyProgram = {};
        dispatch(setLaunchDataStep({ key: AI_SELECTED_LIST, value: aiSelected }));
      } catch (e) {
        throw new Error(e);
      }
    }
    console.log(selectedAi)
    isLoading = false;
    setNextStep();
  };

  const handleAiChange = (selectedList: PointsOption[], selectedItem: PointsOption) => {
    const selectedId = selectedItem.value;
    if (selectedId === 0) {
      setSelectedAi(null);
      setSelectedCourse(null);
      return;
    }
    const selectedProfile = aiProfiles.find(profile => profile.id === selectedId) || null;
    console.log("id ai : " + selectedProfile.iaName)
    setSelectedAi(selectedProfile);
    setSelectedCourse(null); // Reset selected course when AI changes
  };

  const handleCourseChange = (selectedList: PointsOption[], selectedItem: PointsOption) => {
    const selectedId = selectedItem.value;
    const courseobject = courses.find(course => course.iaTrainingName === selectedId);
    console.log("id course : " + courseobject.iaTrainingName)
    setSelectedCourse(courseobject);
  };

  const renderAIOptions = (profiles) => {
    const aiArr = [{
      value: 0,
      label: formatMessage({ id: 'aiTunnel.ai.noSelection' }),
      color: ""
    }];
    
    profiles.map(profile => {
      aiArr.push({
        value: profile.id,
        label: profile.iaName,
        color: ""
      })
    });
    setAiOptions(aiArr);

    const aiTrainingArr = courses.map(course => ({
      value: course.iaTrainingName,
      label: course.iaTrainingName,
      color: ""
    }));
    setAiTrainingOptions(aiTrainingArr);
  };

  return (
    <div className="App">
      <h1>{formatMessage({ id: "aiTunnel.ai.step"})}</h1>
      <div className={`ai-submit-text ${style.contentWrapper} ${style4.textintro} margin-bottom:  20px`}
        style={{ marginBottom: '5rem', whiteSpace: 'pre-line', textAlign: 'center' }}>
        <FormattedMessage id="ai.perso.text" />
      </div>
      <div className={style4.multiContainer}>
        <Multiselect
          key="ai-select"
          options={aiOptions} // Options to display in the dropdown
          onSelect={handleAiChange}
          onRemove={() => setSelectedAi(null)} // Function will trigger on select event
          selectedValues={selectedAi ? [aiOptions.find(option => option.value === selectedAi.id)] : []}
          displayValue="label" // Property name to display in the dropdown options
          placeholder={formatMessage({ id: 'aiTunnel.ai.placeholder' })}
          className={`input-group ${eCardStyle.customMultiselect}`}
          showCheckbox={false}
          showArrow={true}
          customArrow={true}
          singleSelect={true}
        />
      </div>

      {selectedAi && (selectedAi.iaType === "IA_STAR_ACADEMY" || selectedAi.iaType === "OLYMPE_ACADEMY") && (
        <div className={style4.multiContainer}>
          <Multiselect
            key="course-select"
            options={aiTrainingOptions} // Options to display in the dropdown
            onSelect={handleCourseChange}
            onRemove={() => setSelectedCourse(null)}// Function will trigger on select event
            selectedValues={selectedCourse ? [aiTrainingOptions.find(option => option.value === selectedCourse.iaTrainingName)] : []}
            displayValue="label" // Property name to display in the dropdown options
            placeholder={formatMessage({ id: 'aiTunnel.courses.placeholder' })}
            className={`input-group ${eCardStyle.customMultiselect}`}
            showCheckbox={false}
            showArrow={true}
            customArrow={true}
            singleSelect={true}
          />
        </div>
      )}
      {selectedAi && (
        <div className={style4.multiContainer} style={{ marginTop: '2.3rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={isVoiceEnabled}
              onChange={() => setIsVoiceEnabled(prev => !prev)}
            />
            <span>Activer la voix pour l'IA </span>
          </label>
        </div>
      )}
      <div className={`${section} ${centerSectionWrapper}`}>
        <DynamicFormattedMessage
          tag={Button}
          onClick={() => handleNextStep()}
          id="form.submit.next"
        />
      </div>
    </div>
  );
}

export default SelectAiPage;
