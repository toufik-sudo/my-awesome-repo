import React, { useState, useEffect, useContext } from 'react';
import HeadingAtom from 'components/atoms/ui/Heading';
import style from 'assets/style/components/launch/Launch.module.scss';
import style2 from 'assets/style/components/Ai/AiPersonnalisationComponent.module.scss'
import style3 from 'assets/style/common/VericalTabs.module.scss';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import Button from 'components/atoms/ui/Button';
import AiPersoApi from 'api/IA API/AiPersoApi';
import { IaiPersoGetResponseApi, IaiPersoGetResponseData } from './AiInterface';
import { UserContext } from 'components/App';
import { usePointConversionsPage } from 'hooks/pointConversions/usePointConversionsPage';
import { FormattedMessage, useIntl } from 'react-intl';
import Multiselect from 'multiselect-react-dropdown';
import eCardStyle from 'sass-boilerplate/stylesheets/components/launch/Ecard.module.scss';
import TextInput from 'components/atoms/ui/TextInput';
import inputStyle from 'assets/style/common/Input.module.scss';
import AreaInput from 'components/atoms/ui/AreaInput';
import { toast } from 'react-toastify';
import style4 from 'assets/style/components/Ai/AiRagComponent.module.scss'
import AIRAGApi from 'api/IA API/AIRagApi';

const initialFormData = {
  id: null,
  iaType: null,
  iaName: '',
  tone: '',
  theValues: '',
  favoriteDishes: '',
  rhythm: '',
  favoriteColor: '',
  socialActivities: '',
  favoriteMusicStyle: '',
  favoriteSport: '',
  sportsTeam: '',
  petName: '',
  entertainmentPreferences: '',
  topThreeFavoriteBooks: '',
  favoriteDestination: '',
  shortBiography: '',
  introductions: '',
  universe: '',
  expressions: '',
};

const AiPersonnalisationComponent = () => {
  const [aiProfiles, setAiProfiles] = useState < IaiPersoGetResponseApi[] > ([]);
  const [formData, setFormData] = useState < IaiPersoGetResponseApi > (initialFormData);
  const [selectedAiStyle, setSelectedAiStyle] = useState < IaiPersoGetResponseApi | null > (null);
  const [selectedAiType, setSelectedAiType] = useState(null)
  const { formatMessage } = useIntl();
  const { userData } = useContext(UserContext);
  const userIdString = String(userData.uuid);
  let preAiType = [{ Name: "OLYMPE", Value: "Olympe" }, { Name: "IA_STAR", Value: "IA Star" }, { Name: "OLYMPE_ACADEMY", Value: "Olympe Academy" }, { Name: "IA_STAR_ACADEMY", Value: "IA Star Academy" }, { Name: "THEMIS", Value: "Thémis" }];
  let AiTypes = null
  // if(process.env.REACT_APP_IA_TYPES){
  //   AiTypes=JSON.parse(process.env.REACT_APP_IA_TYPES)
  // }
  // else{}
  AiTypes = preAiType;
  // const AiTypes = preAiType;
  // console.log("test : " + process.env.REACT_APP_IA_TYPES)
  // console.log(process.env.REACT_APP_IA_TYPES)

  const {
    pointsConversions,
    hasMore,
    isLoading,
    loadMore,
    scrollRef,
    listCriteria,
    onSort,
    onValidateSuccess
  } = usePointConversionsPage();

  const fetchAiProfiles = async () => {
    try {
      const profiles: IaiPersoGetResponseData = await AiPersoApi.getIaPersoCompany({ userUuid: userIdString });
      setAiProfiles(profiles.data);
    } catch (error) {
      console.error('Error fetching AI profiles:', error);
    }
  };

  useEffect(() => {
    fetchAiProfiles();
  }, []);

  const formFields = [
    { name: 'iaName', label: 'IA Name', type: 'text', placeholder: 'IA Name' },
    { name: 'tone', label: 'Ton', type: 'text', placeholder: 'Ton' },
    { name: 'expressions', label: 'Expressions', type: 'textarea', placeholder: 'Expressions' },
    { name: 'theValues', label: 'Valeurs', type: 'textarea', placeholder: 'Valeurs' },
    { name: 'rhythm', label: 'Rythme', type: 'text', placeholder: 'Rythme' },
    { name: 'favoriteColor', label: 'Couleur Préférée', type: 'text', placeholder: 'Couleur Préférée' },
    { name: 'favoriteDishes', label: 'Plats Préféré', type: 'textarea', placeholder: 'Plats Préféré' },
    { name: 'socialActivities', label: 'Activités Sociales', type: 'textarea', placeholder: 'Activités Sociales' },
    { name: 'favoriteMusicStyle', label: 'Style de Musique Préféré', type: 'text', placeholder: 'Style de Musique Préféré' },

    { name: 'favoriteSport', label: 'Sport Préféré', type: 'text', placeholder: 'Sport Préféré' },
    { name: 'sportsTeam', label: 'Équipe Sportive', type: 'text', placeholder: 'Équipe Sportive' },
    { name: 'entertainmentPreferences', label: 'Préférences de Divertissement', type: 'textarea', placeholder: 'Préférences de Divertissement' },
    { name: 'topThreeFavoriteBooks', label: '3 Livres Préférés', type: 'textarea', placeholder: '3 Livres Préférés' },
    { name: 'petName', label: 'Nom de l\'Animal de Compagnie', type: 'text', placeholder: 'Nom de l\'Animal de Compagnie' },
    { name: 'favoriteDestination', label: 'Destination Préférée', type: 'text', placeholder: 'Destination Préférée' },
    { name: 'shortBiography', label: 'Courte Biographie', type: 'textarea', placeholder: 'Courte Biographie' },
    { name: 'introductions', label: 'Introductions', type: 'textarea', placeholder: 'Introductions' },
    { name: 'universe', label: 'Univers', type: 'text', placeholder: 'Univers' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || '', // Ensure the value is never undefined or null
    }));
  };

  const handleInputChangeForTextInput = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || '', // Ensure the value is never undefined or null
    }));
  };

  const handleSelectAI = (selectedList) => {
    if (selectedList.length > 0) {
      const selectedAI = selectedList[0];
      setFormData({
        ...initialFormData,
        ...selectedAI,
      });
      setSelectedAiStyle(selectedAI);
      setSelectedAiType(AiTypes.find(type => type.Name === selectedAI.iaType));
    } else {
      setFormData(initialFormData);
      setSelectedAiStyle(null);
      setSelectedAiType(null)
    }
  };

  const handleDeleteAI = (iaId) => {
    const updatedProfiles = aiProfiles.filter((profile) => profile.id !== iaId);
    setAiProfiles(updatedProfiles);

    if (formData.id === iaId) {
      setFormData(initialFormData);
    }
  };

  const handleSelectAiType = (selectedList) => {
    if (selectedList.length > 0) {
      setSelectedAiType(selectedList[0]);
    } else {
      setSelectedAiType(null);
    }
  };

  const handleRemoveAiType = () => {
    setSelectedAiType(null);
  };

  const resetDDLists = () => {
    setSelectedAiType(null);
    setSelectedAiStyle(null);
    handleInputChangeForTextInput("iaProjectId", '');
  }

  const handleAddAI = async () => {
    if (!formData.iaName) {
      alert('Please fill in AI Name');
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        iaId: formData.id,
        iaType: selectedAiType ? selectedAiType.Name : null, // Send the `Name` (uppercase format)
        isIaPersoUpdate: !!selectedAiStyle, // true if updating
        userUuid: userIdString,
      };

      await AiPersoApi.setOrUpdateIaPersoCompany(dataToSubmit);


      fetchAiProfiles();
      setFormData(initialFormData);
      resetDDLists()
      toast(formatMessage({ id: 'toast.message.aiAdd.success' }));
    } catch (error) {
      console.error('Error adding/updating AI profile:', error);
      toast(formatMessage({ id: 'toast.message.aiAdd.error' }));
    }
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length > 0 && selectedAiStyle.iaType == 'IA_STAR') {
      const file = files[0];
      const userEmail = userData.email;
      let filename = file.name;
      let filenameArr = filename.split(".");
      const ext = filenameArr?.pop();
      let fileName = filenameArr.join("_");
      fileName = fileName?.replaceAll(" ", "_");
      fileName = fileName + '.' + ext;

      let iaName = selectedAiStyle?.iaName;
      iaName = iaName?.trim()?.replaceAll(' ', '_');
      const iaType = selectedAiStyle?.iaType;

      if (ext == 'pdf' || ext == "txt") {
        try {
          const response = await AIRAGApi.uploadFiles([file], "", "", true, fileName, userEmail, iaName, iaType);
          toast(formatMessage({ id: 'toast.message.ai.fileSavedForIndexation' }, { filename: filename }));
        } catch (error) {
          toast(formatMessage({ id: 'toast.message.ai.error.indextionFailled' }, { filename: filename }));
        }
      } else {
        toast(formatMessage({ id: 'toast.message.ai.fileTypeNotSupportedYet' }));
      }
    } else {
      toast(formatMessage({ id: 'toast.message.ai.noProgramSelected' }));
    }
  }

  return (
    <React.Fragment>
      <div className={style2.aiPersonalisationContainer}>
        <div style={{ marginLeft: '50px' }}>
          <HeadingAtom className={style.title} size="3" textId="ai.star.title" />
        </div>
        <div className={style2.aiDdl}>
          <Multiselect
            key="style-ai-select"
            options={aiProfiles}
            onSelect={handleSelectAI}
            onRemove={() => handleSelectAI([])}
            selectedValues={selectedAiStyle ? [selectedAiStyle] : []}
            displayValue="iaName"
            placeholder={formatMessage({ id: 'aiTunnel.ai.placeholder' })}
            className={`input-group ${eCardStyle.customMultiselect}`}
            showCheckbox={false}
            showArrow={true}
            customArrow={true}
            singleSelect={true}
            
          />
        </div>
        <br />
        <div className={style2.aiFormGroup} key={"iaProjectId"}>
          {/* <input  
                type={"text"}
                name={"iaProjectId"}
                value={formData["iaProjectId"] || ''}
                onChange={handleInputChange}
                placeholder={"ProjectId"}
              />
        </div> */}
          <div className={style2.aiDdl}>
            <Multiselect
              key="type-ai-select"
              options={AiTypes}
              onSelect={handleSelectAiType}
              onRemove={() => { setSelectedAiType(null) }}
              selectedValues={selectedAiType ? [selectedAiType] : []}
              displayValue="Value"
              placeholder={formatMessage({ id: 'aiTunnel.aiType.placeholder' })}
              className={`input-group ${eCardStyle.customMultiselect}`}
              showCheckbox={false}
              showArrow={false}
              customArrow={false}
              singleSelect={true}
              disable={!!selectedAiStyle}             

            />
          </div>

          <label> </label>
          <TextInput
            value={formData["iaProjectId"]}
            disabled={!!selectedAiStyle}
            onChange={(e) => handleInputChangeForTextInput("iaProjectId", e.target.value)}
            wrapperClass={`${inputStyle.container} ${inputStyle.floating} ${eCardStyle.customTextInput}`}
            hasLabel={true}
            labelId={"ai.perso.projectId"}
          />

        </div>


        <div className={style2.gridLeft}>
          {formFields.map((field, index) => {
            const isDisabled = !!selectedAiStyle && ['iaName'].includes(field.name); // Disable these fields when an AI style is selected

            return index <= 8 && (
              <div className={style2.aiFormGroup} key={field.name}>
                <label></label>
                {field.type === 'textarea' ? (
                  <AreaInput
                    value={formData[field.name]}
                    onChange={(e) => handleInputChangeForTextInput(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    wrapperClass={`${inputStyle.container} ${inputStyle.floating} ${eCardStyle.customTextInput} ${isDisabled ? inputStyle.disabledField : ''}`}
                    hasLabel={false}
                    labelId={"ai.perso." + field.name}
                    disabled={isDisabled} // Disable the input for specific fields
                  />
                ) : (
                  <TextInput
                    value={formData[field.name] || ""}
                    disabled={isDisabled} // Disable the input for specific fields
                    onChange={(e) => handleInputChangeForTextInput(field.name, e.target.value)}
                    wrapperClass={`${inputStyle.container} ${inputStyle.floating} ${eCardStyle.customTextInput} ${isDisabled ? inputStyle.disabledField : ''}`} // Apply the grayed-out style
                    hasLabel={true}
                    labelId={"ai.perso." + field.name}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className={style2.gridRight}>
          {formFields.map((field, index) => {
            return index > 8 && (<div className={style2.aiFormGroup} key={field.name}>
              <label></label>
              {field.type === 'textarea' ? (
                <AreaInput
                  value={formData[field.name]}
                  onChange={(e) => handleInputChangeForTextInput(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  wrapperClass={`${inputStyle.container} ${inputStyle.floating} ${eCardStyle.customTextInput}`}
                  hasLabel={false} // Set to true if you need a label
                  labelId={"ai.perso." + field.name}
                  disabled={false} // Set to true if you need to disable the textarea
                />
              ) : (
                // <input
                //   type={field.type}
                //   name={field.name}
                //   value={formData[field.name] || ''}
                //   onChange={handleInputChange}
                //   placeholder={field.placeholder}
                // />

                <TextInput
                  value={formData[field.name] || ""}
                  disabled={false}
                  onChange={(e) => handleInputChangeForTextInput(field.name, e.target.value)}
                  wrapperClass={`${inputStyle.container} ${inputStyle.floating} ${eCardStyle.customTextInput}`}
                  hasLabel={true}
                  labelId={"ai.perso." + field.name}
                />

              )}
            </div>)
          })}
        </div>
        {selectedAiStyle && selectedAiStyle?.iaType == "IA_STAR" && false &&
         <div className={style4.questionContainer}>
          <label style={{ width: 'max-content', marginBottom: '10px !important' }}>
            <FormattedMessage id="ai.common.iaStar"></FormattedMessage>
          </label>
          {/* <label className={style4.label}>'ai.question1' </label> */}
          <input
            type="file"
            onChange={(event) => handleFileChange(event)}
            className={style4.inputFile}
          />
        </div>}
        <div className={style3.productsWrapperSubmitBtn} style={{ marginBottom: 10 }}>
          <DynamicFormattedMessage tag={Button} onClick={handleAddAI} id="ai.perso.addAi" />
        </div>

      </div>
    </React.Fragment>
  );
};

export default AiPersonnalisationComponent;
