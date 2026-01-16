import React from 'react';

import GeneralBlock from 'components/molecules/block/GeneralBlock';
import Loading from 'components/atoms/ui/Loading';
import ProgramJoinHeader from 'components/molecules/programs/ProgramJoinHeader';
import ProgramJoinUserDataFormWrapper from 'components/organisms/form-wrappers/joinProgram/ProgramJoinUserDataFormWrapper';
import ProgramJoinNewsletterFormWrapper from 'components/organisms/form-wrappers/joinProgram/ProgramJoinNewsletterFormWrapper';
import ProgramJoinValidationPending from 'components/molecules/programs/ProgramJoinValidationPending';
import useJoinProgramJourney from 'hooks/programs/useJoinProgramSteps';
import useProgramDetails from 'hooks/programs/useProgramDetails';
import { PROGRAM_JOIN_STEPS } from 'constants/programs';
import { LOADER_TYPE } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/wall/ProgramJoin.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render the program join page
 * @constructor
 */
const ProgramJoinPage = () => {
  const { programId, step, steps, moveToNext } = useJoinProgramJourney();
  const { programDetails, isLoading } = useProgramDetails(programId);
  const { name, design, type } = programDetails;

  const { mt2, textCenter, disabled } = coreStyle;
  const { programJoin, programJoinWrapper, programJoinStep } = style;

  if (isLoading) {
    return <Loading type={LOADER_TYPE.DROPZONE} />;
  }

  let StepComponent = ProgramJoinUserDataFormWrapper;
  if (step === PROGRAM_JOIN_STEPS.NEWSLETTER) {
    StepComponent = ProgramJoinNewsletterFormWrapper;
  }

  if (step === PROGRAM_JOIN_STEPS.PENDING_VALIDATION) {
    StepComponent = ProgramJoinValidationPending;
  }

  return (
    <GeneralBlock className={programJoin}>
      <div className={programJoinWrapper}>
        <ProgramJoinHeader {...{ logo: design && design.companyLogoUrl, programName: name, programType: type }} />
        <div className={mt2}>
          <StepComponent programDetails={{ ...programDetails, programId }} onNext={moveToNext} />
        </div>
        <div className={`${mt2} ${textCenter}`}>
          {steps.map(s => (
            <span className={`${programJoinStep} ${s > step ? disabled : ''}`} key={`step_${s}`}></span>
          ))}
        </div>
      </div>
    </GeneralBlock>
  );
};

export default ProgramJoinPage;
