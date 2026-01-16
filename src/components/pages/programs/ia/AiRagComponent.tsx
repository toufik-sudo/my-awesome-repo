import React, { useState, useRef, useEffect, useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import HeadingAtom from 'components/atoms/ui/Heading';
// import style from 'assets/style/components/launch/Launch.module.scss';
// import style2 from 'assets/style/components/wall/GeneralWallStructure.module.scss';
// import style3 from 'assets/style/common/VericalTabs.module.scss';
import style4 from 'assets/style/components/Ai/AiRagComponent.module.scss';
// import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
// import Button from 'components/atoms/ui/Button';
import AIRAGApi from 'api/IA API/AIRagApi';
import Multiselect from 'multiselect-react-dropdown';
// import UserApi from 'api/UsersApi';
import { IUserProgramsSearchCriteria } from 'interfaces/api/IUserProgramsSearchCriteria';
import { UserContext } from 'components/App';
import { IadminProgram, IGetRagIndexDocsApi } from './AiInterface';
import eCardStyle from 'sass-boilerplate/stylesheets/components/launch/Ecard.module.scss';
import { toast } from 'react-toastify';
import AiPersoApi from 'api/IA API/AiPersoApi';
// import { type } from 'os';
// import { HTML_TAGS, UUID } from 'constants/general';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import { faTimesCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import Button from 'components/atoms/ui/Button';
import { width } from '@fortawesome/free-regular-svg-icons/faCreditCard';
import { useHistory } from 'react-router-dom';
import { WALL } from 'constants/routes';

const questionsArray = [
  { id: 'ai.question1', disabled: false, catName: 'products', isActivatedReset: false },
  { id: 'ai.question2', disabled: false, catName: 'prices', isActivatedReset: false },
  { id: 'ai.question3', disabled: false, catName: 'technical_manuals', isActivatedReset: false },
  { id: 'ai.question4', disabled: false, catName: 'legals', isActivatedReset: false },
  { id: 'ai.question5', disabled: false, catName: 'compititions', isActivatedReset: false },
  { id: 'ai.question6', disabled: false, catName: 'history', isActivatedReset: false },
  { id: 'ai.question7', disabled: false, catName: 'values', isActivatedReset: false },
  { id: 'ai.question8', disabled: false, catName: 'news', isActivatedReset: false },
];

const questionsCOMMONArray = [
  { id: 'ai.common.question1', disabled: false, catName: 'common_company', isActivatedReset: false },
  { id: 'ai.common.iaStar', disabled: false, catName: 'common_ia_star', isActivatedReset: false },
];

const AiRagComponent = ({ isHyperAdmin, companyName }) => {
  const [uploadedFiles, setUploadedFiles] = useState(Array(questionsArray.length).fill(null));
  const [questions, setQuestions] = useState(questionsArray);
  const [questionsCOMMON, setQuestionsCOMMON] = useState(questionsCOMMONArray);
  const [uploadedCommonFiles, setUploadedCommonFiles] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const fileInputRefs = useRef([]);
  const commonFileInputRefs = useRef([]);
  const { formatMessage } = useIntl();
  const [programOptions, setProgramOptions] = useState < IadminProgram[] > ([]);
  const [uploadTypesOptions, setUploadTypesOptions] = useState < any[] > ([]);
  const [actionsOptions, setActionsOptions] = useState < any[] > ([]);
  const [selectedProgram, setSelectedProgram] = useState < IadminProgram[] | null > (null);
  const [selectedUploadType, setSelectedUploadType] = useState < any > (null);
  const [selectedLink, setSelectedLink] = useState < string > ("");
  const { userData } = useContext(UserContext);
  const [showPopup, setShowPopup] = useState < boolean > (false);
  const [isToResetIndex, setIsToResetIndex] = useState < boolean > (false);
  const [isCommon, setIsCommon] = useState < boolean > (false);
  const [isAlmostOneBlockedIndex, setIsAlmostOneBlockedIndex] = useState < boolean > (false);
  const [isToActivateRagIndex, setIsToActivateRagIndex] = useState < boolean > (false);
  const [catName, setCatName] = useState < string > ("");
  const [ragIndexDocs, setRagIndexDocs] = useState < IGetRagIndexDocsApi[] > ([]);
  const inputRef = useRef({});
  const history = useHistory();


  const getIaPrograms = (data) => {
    let programs: IadminProgram[] = [];
    if (data && data.length) {
      data.forEach(element => {
        const programName = element.programName?.trim() + '_' + element.programId;
        const name = element.programName?.trim() + " ( " + element.iaName?.trim() + " )";
        const iaName = element.iaName?.trim().replaceAll(" ", "_");
        const iaType = element.iaType?.trim();
        programs.push({
          id: element.programId,
          name: name,
          companyName: element.companyName,
          programName: programName,
          iaName: iaName,
          iaType: iaType
        });
      });
    }
    return programs;
  }

  useEffect(() => {
    const fetchProgramOptions = async () => {
      if (!userData?.uuid) return;
      try {
        const response = await AiPersoApi.getIaCompany();
        const result = getIaPrograms(response.data);
        setProgramOptions(result);
      } catch (error) {
        console.error('Error fetching user programs:', error);
      }
    };
    fetchProgramOptions();
    const uploadTypes = [
      { name: formatMessage({ id: 'ai.uploadType.uploads' }), value: 'uploads' },
      { name: formatMessage({ id: 'ai.uploadType.links' }), value: 'links' },
      // { name: formatMessage({ id: 'ai.uploadType.apis' }), value: 'apis' },
    ];
    setUploadTypesOptions(uploadTypes);
    // Set default selected upload type
    const defaultUploadType = uploadTypes.find(type => type.value === 'uploads');
    setSelectedUploadType(defaultUploadType);
  }, [userData]);

  // const updateActionsOptions = () => {
  //   const actionsOptions = [
  //     { name: formatMessage({ id: 'ai.uploadType.uploads' }), value: 'uploads' },
  //     { name: formatMessage({ id: 'ai.uploadType.links' }), value: 'links' },
  //     // { name: formatMessage({ id: 'ai.uploadType.apis' }), value: 'apis' },
  //   ];
  //   setActionsOptions(actionsOptions);
  //   // Set default selected upload type
  //   const defaultActionsOptions = actionsOptions.find(type => type.value === 'uploads');
  //   setSelectedUploadType(defaultUploadType);
  // }

  const getRagIndexation = async (userUuid, programId) => {
    try {
      setIsAlmostOneBlockedIndex(false);
      const response = await AIRAGApi.getRagIndex(userUuid, programId);
      const data: IGetRagIndexDocsApi[] = response?.data || [];
      setRagIndexDocs(data);
      if (data?.length > 0) {
        const updatedQuestions = [];
        questionsArray.forEach(q => {
          const filtredData = data.filter((e) => e.categoryToIndex == q.catName && e.programId == programId) || [];
          const bool = filtredData?.length > 0 ? filtredData[0].isIndexBlocked : false;
          const boolRset = filtredData?.length > 0 ? filtredData[0].status == 'ACTIVATED_RESET' : false;
          if (bool) {
            setIsAlmostOneBlockedIndex(true);
          }
          updatedQuestions.push({ id: q.id, disabled: bool, catName: q.catName, isActivatedReset: boolRset });
        });
        setQuestions(prev => []);
        setQuestions(prev => updatedQuestions);

        const updatedQuestionsCOMMON = [];
        questionsCOMMONArray.forEach(q => {
          const filtredData = data.filter((e, i) => e.categoryToIndex == q.catName && e.programId == programId) || [];
          const bool = filtredData?.length > 0 ? filtredData[0].isIndexBlocked : false;
          const boolRset = filtredData?.length > 0 ? filtredData[0].status == 'ACTIVATED_RESET' : false;
          if (bool && i == 0) {
            setIsAlmostOneBlockedIndex(true);
          }
          updatedQuestionsCOMMON.push({ id: q.id, disabled: bool, catName: q.catName, isActivatedReset: boolRset });
        });
        setQuestionsCOMMON(prev => []);
        setQuestionsCOMMON(prev => updatedQuestionsCOMMON);
      } else {
        setQuestions(prev => []);
        setQuestions(questionsArray);
        setQuestionsCOMMON(prev => []);
        setQuestionsCOMMON(questionsCOMMONArray);
      }
      setShowPopup(false);
    } catch (error) {
      toast(formatMessage({ id: 'toast.message.ai.error.getIndextionFailled' }));
      setShowPopup(false);
    }
  }

  useEffect(() => {
    console.log('questions updated');
    console.log(questions);
    console.log(questionsCOMMON);
  }, [questions, questionsCOMMON])

  const setRagIndexation = async (isToBlockCat, userUuid, programId, status, comment, errorCode, errorMsg, isCommon, catName, originalFilename, iaType, link) => {
    try {
      const filename = originalFilename;
      setShowPopup(false);
      await AIRAGApi.setRagIndex(isToBlockCat, userUuid, programId, status, comment, errorCode, errorMsg, isCommon, catName, originalFilename, iaType, link);
      await getRagIndexation(userUuid, programId);
      const id = !isToBlockCat ? 'toast.message.ai.cat.setRagIndex' : 'ai.rag.indexation.popup.blocked.' + catName;
      toast(formatMessage({ id: id }, { filename }));
    } catch (error) {
      const id = !isToBlockCat ? 'toast.message.ai.error.setRagIndexFailled' : 'ai.rag.indexation.popup.blocked.failled.' + catName;
      toast(formatMessage({ id: id }, { filename }));
      setShowPopup(false);
    } finally {
      await getRagIndexation(userUuid, programId);
    }
  }

  const resetRagIndexation = async (catName = '', isCommon = false, isToActivateRagIndexParam = false) => {
    if (selectedProgram) {
      try {
        if (!isToActivateRagIndexParam) {
          const programName = selectedProgram[0].programName?.trim().replaceAll(' ', '_');
          const companyName = selectedProgram[0].companyName?.trim().replaceAll(' ', '_');
          const iaId = selectedProgram[0].iaName?.trim().replaceAll(' ', '_');
          const iaType = selectedProgram[0].iaType;
          await AIRAGApi.resetRagNamespace(programName, companyName, iaId, iaType, catName, isCommon);
        }
        await AIRAGApi.resetRagIndex(userData.uuid, selectedProgram[0].id, catName, isToActivateRagIndexParam, isCommon);
        await getRagIndexation(userData.uuid, selectedProgram[0].id);
        setShowPopup(false);
        const id = !isToActivateRagIndexParam ? "ai.rag.indexation.popup.reset." + catName : "ai.rag.indexation.popup.reset";
        toast(formatMessage({ id: id }));
      } catch (error) {
        console.error(error);
        const id = !isToActivateRagIndexParam ? "ai.rag.indexation.popup.reset.failled." + catName : "ai.rag.indexation.popup.reset.failled";
        toast(formatMessage({ id: id }));
        setShowPopup(false);
      } finally {
        await getRagIndexation(userData.uuid, selectedProgram[0].id);
      }
    } else {
      toast(formatMessage({ id: 'toast.message.ai.noProgramSelected' }));
    }
  }

  const confirmResetRagIndexation = (elem, event, isCommonParam) => {
    event.stopPropagation();
    if (selectedProgram) {
      setIsCommon(isCommonParam);
      if (elem && elem.catName && elem.catName != '') {
        // setCatName('');
        setCatName(prev => elem.catName);
      } else {
        setCatName('');
      }
      setIsToResetIndex(true);
      setShowPopup(true);
    } else {
      toast(formatMessage({ id: 'toast.message.ai.noProgramSelected' }));
    }
  }

  const handleFileChange = async (index, isCommon, event, question, isLink = false, url = "") => {
    // console.log('File index :', index);
    const files = event.target.files;
    let filename = '';
    let programName = "";
    let companyName = "";
    let iaName = "";
    let iaType = "";
    let userEmail = "";
    let fileName = "";
    let link = "";
    let file = null;
    let catNameStr = "";
    if (files?.length > 0 || isLink) {
      if (isLink) {
        link = url;
      } else {
        file = files[0];
        let newUploadedFiles = [];
        if (isCommon) {
          if (!uploadedCommonFiles.length) {
            newUploadedFiles.push(file?.name);
            setUploadedCommonFiles(newUploadedFiles);
          } else {
            newUploadedFiles = [...uploadedCommonFiles];
            newUploadedFiles[index] = file?.name;
            setUploadedCommonFiles(newUploadedFiles);
          }
        } else {
          if (!uploadedFiles.length) {
            newUploadedFiles.push(file?.name);
            setUploadedFiles(newUploadedFiles);
          } else {
            newUploadedFiles = [...uploadedFiles];
            newUploadedFiles[index] = file?.name;
            setUploadedFiles(newUploadedFiles);
          }
        }
      }

      if (selectedProgram && (!isLink || isLink && url && url?.trim() !== "")) {
        programName = selectedProgram[0].programName?.trim().replaceAll(' ', '_');
        companyName = selectedProgram[0].companyName?.trim().replaceAll(' ', '_');
        iaName = selectedProgram[0].iaName;
        iaType = selectedProgram[0].iaType;
        userEmail = userData.email;
        filename = isLink ? "link" : file?.name;
        let ext = isLink ? "text" : filename?.split('.')?.pop();
        ext = isLink ? ".txt" : "." + ext;
        fileName = question + ext;

        switch (question) {
          case questions[0].id:
            setCatName('products');
            catNameStr = 'products';
            fileName = 'products' + ext;
            break;
          case questions[1].id:
            setCatName('prices');
            catNameStr = 'prices';
            fileName = 'prices' + ext;
            break;
          case questions[2].id:
            setCatName('technical_manuals');
            catNameStr = 'technical_manuals';
            fileName = 'technical_manuals' + ext;
            break;
          case questions[3].id:
            setCatName('legals');
            catNameStr = 'legals';
            fileName = 'legals' + ext;
            break;
          case questions[4].id:
            setCatName('compititions');
            catNameStr = 'compititions';
            fileName = 'compititions' + ext;
            break;
          case questions[5].id:
            setCatName('history');
            catNameStr = 'history';
            fileName = 'history' + ext;
            break;
          case questions[6].id:
            setCatName('values');
            catNameStr = 'values';
            fileName = 'values' + ext;
            break;
          case questions[7].id:
            setCatName('news');
            catNameStr = 'news';
            fileName = 'news' + ext;
            break;
          default: break;
        }

        if (companyName?.toUpperCase() == "FFBS" || isCommon) {
          if (isLink) {
            fileName = "common.txt";
          } else {
            let filenameArr = file?.name.split(".");
            filenameArr.pop();
            fileName = filenameArr.join("_").replaceAll(" ", "_") + ext;
          }
        }
        if (isCommon) {
          if (iaType == 'IA_STAR' && index == 1) {
            setCatName('common_ia_star');
            catNameStr = 'common_ia_star';
          } else {
            setCatName('common_company');
            catNameStr = 'common_company';
          }
        }

        try {
          setIsToResetIndex(false);
          setIsToActivateRagIndex(false);

          const fileReq = isLink ? null : [file];
          await AIRAGApi.uploadFiles(fileReq, companyName, programName, isCommon, fileName, userEmail, iaName, iaType, isLink, link);
          await setRagIndexation(false, userData.uuid, selectedProgram[0].id, 'OK', '', null, '', isCommon, catNameStr, filename, iaType, link);
          toast(formatMessage({ id: 'toast.message.ai.fileSavedForIndexation' }, { filename }));
          setShowPopup(true);
        } catch (error) {
          toast(formatMessage({ id: 'toast.message.ai.error.indextionFailled' }, { filename }));
          setShowPopup(false);
        }
      } else {
        toast(formatMessage({ id: 'toast.message.ai.noProgramSelected' }));
      }
    }
  };

  const blockRagIndexCat = async () => {
    try {
      await setRagIndexation(true, userData.uuid, selectedProgram[0].id, 'BLOCKED', '', null, '', null, catName, '', '', '');
      // toast(formatMessage({ id: 'toast.message.ai.blockIndexation' }, { catName }));
      setShowPopup(false);
    } catch (error) {
      // toast(formatMessage({ id: 'toast.message.ai.error.indextionFailled' }, { filename }));
      setShowPopup(false);
    }
  }

  const onLinkChange = (event) => {
    const link = event.target.value;
    if (link) {
      setSelectedLink(link);
      // Handle the link change logic here
      console.log('Link changed:', link);
    }
  }

  const onClickInputBtn = async (index, isCommon, event, question, isLink = false) => {
    event.stopPropagation();
    event.preventDefault();
    if (isCommon) {
      if (isLink) {
        handleFileChange(index, true, event, question, true, selectedLink);
      } else {
        commonFileInputRefs.current[index].click();
      }
    } else {
      if (isLink) {
        handleFileChange(index, false, event, question, true, selectedLink);
      } else {
        fileInputRefs.current[index].click();
      }
    }
  }

  const closeModal = () => {
    setShowPopup(false);
    if (!isToResetIndex && !isToActivateRagIndex && selectedUploadType?.length && selectedUploadType[0].value == "links") {
      const refElem = inputRef.current[catName];
      if (refElem) {
        refElem.value = "";
        setSelectedLink("");
      }
    }
  }

  const handleProgramSelect = (selectedProgramParam) => {
    setSelectedProgram(selectedProgramParam);
    if (selectedProgramParam?.length > 0) {
      getRagIndexation(userData.uuid, selectedProgramParam[0].id);
    }
    // console.log(selectedProgram);
  };

  const handleUploadTypesSelect = (selectedType) => {
    setSelectedUploadType(selectedType);
  };

  const confirmActivateResetNamespace = async () => {
    if (selectedProgram) {
      if (isHyperAdmin) {
        setIsToActivateRagIndex(true);
        setShowPopup(true);
      }
    } else {
      toast(formatMessage({ id: 'toast.message.ai.noProgramSelected' }));
    }
  }

  const demandResetNamespace = async () => {
    if (selectedProgram) {
      try {
        const programName = selectedProgram[0].programName?.trim();
        const companyName = selectedProgram[0].companyName?.trim();
        const name = selectedProgram[0].name?.trim();
        const iaName = selectedProgram[0].iaName?.trim();
        const programId = selectedProgram[0].id;
        const subject = formatMessage({ id: 'ai.rag.indexation.email.subject' });
        const body = formatMessage({ id: 'ai.rag.indexation.email.body' }, { programName, companyName, iaName, programId });
        await AIRAGApi.sendEmailActivateResetNamespace(programName, companyName, body, subject);
        toast(formatMessage({ id: 'ai.rag.indexation.email.sent' }));
        setShowPopup(false);
      } catch (error) {
        console.error(error);
        toast(formatMessage({ id: 'ai.rag.indexation.email.sent.failled' }));
        // toast(formatMessage({ id: 'toast.message.ai.error.indextionFailled' }, { filename }));
        setShowPopup(false);
      }
    } else {
      toast(formatMessage({ id: 'toast.message.ai.noProgramSelected' }));
    }
  }

  return (
    <>
      <React.Fragment>
        <div style={{ marginLeft: '50px' }}>
          <HeadingAtom className={style4.title} size="3" textId="ai.title.label" />
        </div>
        <div className={`aiSubmitText ${style4.contentWrapper} ${style4.textIntro}`}>
          <FormattedMessage id="ai.submit.text" />
        </div>
        <div className={style4.flashySlogan}>
          <FormattedMessage id="rewardzai.slogan" />
        </div>

        <form>
          <div className={style4.multiContainer}>
            <Multiselect
              key="course-select"
              options={programOptions}
              onSelect={handleProgramSelect}
              onRemove={() => setSelectedProgram(null)}
              selectedValues={selectedProgram}
              displayValue="name"
              placeholder={formatMessage({ id: 'aiTunnel.ai.placeholder' })}
              className={`input-group ${eCardStyle.customMultiselect}`}
              showCheckbox={false}
              showArrow={true}
              customArrow={true}
              singleSelect={true}
              customCloseIcon={<FontAwesomeIcon icon={faTimes} />}
            />
          </div>
          <br />
          <div className={style4.multiContainer} style={{ display: 'flex', gap: '30px', alignItems: `${selectedUploadType && selectedUploadType[0]?.value == 'links' ? 'flex-start' : 'center'}` }}>
            <div style={{ width: '70%' }}>
              <Multiselect
                key="course-select"
                options={uploadTypesOptions}
                onSelect={handleUploadTypesSelect}
                onRemove={() => setSelectedUploadType(null)}
                selectedValues={selectedUploadType}
                displayValue="name"
                placeholder={formatMessage({ id: 'aiTunnel.ai.placeholder.uploadType' })}
                className={`input-group ${eCardStyle.customMultiselect}`}
                showCheckbox={false}
                showArrow={true}
                customArrow={true}
                singleSelect={true}
                customCloseIcon={<FontAwesomeIcon icon={faTimes} />}
              />
              {selectedUploadType && selectedUploadType[0]?.value == "links" &&
                <div style={{ marginTop: "1rem" }}>
                  ⚠️  Pour des raisons de sécurité ou de confidentialité, certains sites peuvent bloquer le chargement de leurs données.
                </div>}
            </div>
            <div style={{ width: '30%' }}>
              <DynamicFormattedMessage
                onClick={() => isHyperAdmin ? confirmActivateResetNamespace() : demandResetNamespace()}
                tag={Button}
                className={`${coreStyle.mxAuto} ${style4.width100} ${style4.buttonPrimary}`}
                id={isHyperAdmin ? "ai.rag.indexation.activateResetNamespace" : "ai.rag.indexation.demandResetNamespace"}
                disabled={!isAlmostOneBlockedIndex}
              />
            </div>


          </div>

          <div>
            <div className={style4.questionsWrapper}>
              {isHyperAdmin && selectedUploadType?.length && questionsCOMMON.map((elem, index) => (
                <div key={elem.id}>
                  <FormattedMessage id={elem.id} >
                    {(text) => (
                      <>
                        <div className={`${style4.questionContainer} ${selectedProgram && ((selectedProgram[0].iaType == "IA_STAR") && index == 0 || selectedProgram[0].iaType !== "IA_STAR" && index == 1) ? coreStyle.disabledAll : ''}`} >
                          <label className={`${style4.label} ${index == 1 ? coreStyle.withThirdColor : ''}`}>
                            <p style={{ width: index == 0 ? '81%' : '90%' }}>
                              {text}
                            </p>
                            <input type='button' value={`↻`}
                              onClick={(event) => confirmResetRagIndexation(elem, event, true)}
                              style={{ marginLeft: '10px', width: '15%' }}
                              disabled={!elem.isActivatedReset || selectedProgram && selectedProgram && ((selectedProgram[0].iaType == "IA_STAR") && index == 0 || selectedProgram[0].iaType !== "IA_STAR" && index == 1)}
                              className={`${style4.buttonPrimary} ${coreStyle.withPrimaryColor}`}
                            />
                          </label>
                          {
                            (selectedUploadType?.length && selectedUploadType[0].value == "uploads" || !selectedUploadType) &&
                            <>
                              <input
                                type="file"
                                onChange={(event) => handleFileChange(index, true, event, 'common')}
                                ref={(el) => (commonFileInputRefs.current[index] = el)}
                                className={style4.inputFile}
                                style={{ display: 'none' }}
                                disabled={selectedProgram && selectedProgram && ((selectedProgram[0].iaType == "IA_STAR") && index == 0 || selectedProgram[0].iaType !== "IA_STAR" && index == 1) || elem.disabled} // Disable if not IA_STAR
                              />
                              <button
                                className={`${style4.customButton} ${index == 1 ? coreStyle.withThirdColor : ''}`}
                                onClick={(event) => onClickInputBtn(index, true, event, 'common')}
                                disabled={selectedProgram && selectedProgram && ((selectedProgram[0].iaType == "IA_STAR") && index == 0 || selectedProgram[0].iaType !== "IA_STAR" && index == 1) || elem.disabled}
                              >
                                {formatMessage({ id: 'ai.uploads.go' })}
                              </button>
                              <span className={coreStyle.withPrimaryColor} >
                                {uploadedCommonFiles[index] || formatMessage({ id: 'ai.noCommonFileUploaded' })}
                              </span>
                            </>
                          }
                          {
                            selectedUploadType?.length && selectedUploadType[0].value == "links" &&
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
                              <input
                                ref={(catName) => inputRef.current[elem.catName] = catName}
                                type="text"
                                onChange={onLinkChange}
                                placeholder={formatMessage({ id: 'ai.linkInput.placeholder' })}
                                className={style4.inputText}
                                style={{ flex: 1, height: '32px', padding: '4px 8px' }}
                                disabled={selectedProgram && selectedProgram && ((selectedProgram[0].iaType == "IA_STAR") && index == 0 || selectedProgram[0].iaType !== "IA_STAR" && index == 1) || elem.disabled}
                              />
                              <button
                                className={`${style4.customButton} ${index == 1 ? coreStyle.withThirdColor : ''}`}
                                onClick={(event) => onClickInputBtn(index, true, event, 'common', true)}
                                disabled={selectedProgram && selectedProgram && ((selectedProgram[0].iaType == "IA_STAR") && index == 0 || selectedProgram[0].iaType !== "IA_STAR" && index == 1) || elem.disabled}
                              >
                                {formatMessage({ id: 'ai.uploadType.links.go' })}
                              </button>
                            </div>
                          }
                        </div>
                        <hr style={{ border: 'none', height: '2px' }} className={coreStyle.withBackgroundPrimary} />
                      </>
                    )}
                  </FormattedMessage>
                </div>
              ))}
            </div>

            <div className={style4.questionsColumns}>
              <div className={style4.leftColumn}>
                {selectedProgram && selectedUploadType?.length && questions.slice(0, Math.ceil(questions.length / 2)).map((elem, index) => (
                  <div key={elem.id}>
                    <FormattedMessage id={elem.id}>
                      {(text) => (
                        <>
                          <div className={style4.questionContainer}>
                            <label className={`${style4.label}`}>
                              <p style={{ width: '85%' }}>
                                {text}
                              </p>
                              <input type='button' value={`↻`}
                                onClick={(event) => confirmResetRagIndexation(elem, event, false)}
                                style={{ marginLeft: '10px', width: '15%' }}
                                disabled={!elem.isActivatedReset}
                                className={`${style4.buttonPrimary} ${coreStyle.withPrimaryColor}`}
                              />
                            </label>

                            {
                              (selectedUploadType?.length && selectedUploadType[0].value == "uploads" || !selectedUploadType) &&
                              <>
                                <input
                                  type="file"
                                  onChange={(event) => handleFileChange(index, false, event, elem.id)}
                                  ref={(el) => (fileInputRefs.current[index] = el)}
                                  className={style4.inputFile}
                                  style={{ display: 'none' }}
                                  disabled={elem.disabled}
                                />
                                <button
                                  className={style4.customButton}
                                  onClick={(event) => onClickInputBtn(index, false, event, elem.id)}
                                  disabled={elem.disabled}
                                >
                                  {formatMessage({ id: 'ai.uploads.go' })}
                                </button>
                                <span className={coreStyle.withPrimaryColor}>
                                  {uploadedFiles[index] || formatMessage({ id: `ai.noFileUploaded.${index + 1}` })}
                                </span>
                              </>
                            }
                            {
                              selectedUploadType?.length && selectedUploadType[0].value == "links" &&
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
                                <input
                                  ref={(catName) => inputRef.current[elem.catName] = catName}
                                  type="text"
                                  onChange={onLinkChange}
                                  placeholder={formatMessage({ id: 'ai.uploadType.links.placeholder' })}
                                  className={style4.inputFile}
                                  style={{ flex: 1, height: '32px', padding: '4px 8px' }}
                                  disabled={elem.disabled}
                                />
                                <button
                                  className={style4.customButton}
                                  onClick={(event) => onClickInputBtn(index, false, event, elem.id, true)}
                                  disabled={elem.disabled}
                                >
                                  {formatMessage({ id: 'ai.uploadType.links.go' })}
                                </button>
                              </div>
                            }

                          </div>
                          <hr style={{ border: 'none', height: '2px' }} className={coreStyle.withBackgroundPrimary} />
                        </>
                      )}
                    </FormattedMessage>
                  </div>
                ))}
              </div>

              <div className={style4.rightColumn}>
                {selectedProgram && selectedUploadType?.length && questions.slice(Math.ceil(questions.length / 2)).map((elem, index) => (
                  <div key={elem.id}>
                    <FormattedMessage id={elem.id}>
                      {(text) => (
                        <>
                          <div className={style4.questionContainer}>
                            <label className={`${style4.label}`}>
                              <p style={{ width: '85%' }}>
                                {text}
                              </p>
                              <input type='button' value={`↻`}
                                onClick={(event) => confirmResetRagIndexation(elem, event, false)}
                                style={{ marginLeft: '10px', width: '15%' }}
                                disabled={!elem.isActivatedReset}
                                className={`${style4.buttonPrimary} ${coreStyle.withPrimaryColor}`}
                              />
                            </label>
                            {
                              (selectedUploadType?.length && selectedUploadType[0].value == "uploads" || !selectedUploadType) &&
                              <>
                                <input
                                  type="file"
                                  onChange={(event) => handleFileChange(index + Math.ceil(questions.length / 2), false, event, elem.id)}
                                  ref={(el) => (fileInputRefs.current[index + Math.ceil(questions.length / 2)] = el)}
                                  className={style4.inputFile}
                                  style={{ display: 'none' }}
                                  disabled={elem.disabled}
                                />
                                <button
                                  className={style4.customButton}
                                  onClick={(event) => onClickInputBtn(index + Math.ceil(questions.length / 2), false, event, elem.id)}
                                  disabled={elem.disabled}
                                >
                                  {formatMessage({ id: 'ai.uploads.go' })}
                                </button>
                                <span className={coreStyle.withPrimaryColor}>
                                  {uploadedFiles[index + Math.ceil(questions.length / 2)] || formatMessage({ id: `ai.noFileUploaded.${index + Math.ceil(questions.length / 2) + 1}` })}
                                </span>
                              </>
                            }
                            {
                              selectedUploadType?.length && selectedUploadType[0].value == "links" &&
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
                                <input
                                  ref={(catName) => inputRef.current[elem.catName] = catName}
                                  type="text"
                                  onChange={onLinkChange}
                                  placeholder={formatMessage({ id: 'ai.linkInput.placeholder' })}
                                  className={style4.inputFile}
                                  style={{ flex: 1, height: '32px', padding: '4px 8px' }}
                                  disabled={elem.disabled}
                                />
                                <button
                                  className={style4.customButton}
                                  onClick={(event) => onClickInputBtn(index + Math.ceil(questions.length / 2), false, event, elem.id, true)}
                                  disabled={elem.disabled}
                                >
                                  {formatMessage({ id: 'ai.uploadType.links.go' })}
                                </button>
                              </div>
                            }
                          </div>
                          <hr style={{ border: 'none', height: '2px' }} className={coreStyle.withBackgroundPrimary} />
                        </>
                      )}
                    </FormattedMessage>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </React.Fragment>
      <FlexibleModalContainer
        fullOnMobile={false}
        className={`${style.mediaModal}`}
        closeModal={() => closeModal}
        isModalOpen={showPopup}
      >
        <div className={style.mediaModalContent}>
          {/* <p>
            {formatMessage({ id: `ai.rag.indexation.popup.${isToResetIndex ? 'reset.' + catName : 'block.' + catName}` })}
          </p> */}
          {
            (catName && catName != '' || isToActivateRagIndex) &&
            <span style={{ whiteSpace: 'pre-line' }}>
              {formatMessage({ id: `ai.rag.indexation.popup.${isToResetIndex ? 'reset.' + catName + '.warning' : (isToActivateRagIndex ? 'activateReset.warning' : 'block.' + catName + '.warning')}` })}
            </span>
          }
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <DynamicFormattedMessage
              onClick={() => {
                if (isToResetIndex) {
                  resetRagIndexation(catName, isCommon, false)
                } else if (isToActivateRagIndex) {
                  resetRagIndexation('', isCommon, isToActivateRagIndex)
                } else {
                  // blockRagIndexCat()
                  history.push(WALL);
                  return;
                }
              }}
              tag={Button}
              className={`${coreStyle.mxAuto} ${style4.widthMaxContent}`}
              id={!isToResetIndex && !isToActivateRagIndex ? "ai.rag.indexation.popup.final.validate" : "response.yes"}
            />
            <DynamicFormattedMessage
              onClick={closeModal}
              tag={Button}
              className={`${coreStyle.mxAuto} ${style4.widthMaxContent}`}
              id={!isToResetIndex && !isToActivateRagIndex ? "ai.rag.indexation.popup.continu" : "response.no"}
            />
          </div>
        </div>
      </FlexibleModalContainer>
    </>
  );
}

export default AiRagComponent;