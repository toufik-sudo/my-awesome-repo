import React from 'react';

import Button from 'components/atoms/ui/Button';
import ProgramSelector from 'components/molecules/wall/ProgramSelector';
import UserDeclarationFileDropzone from 'components/molecules/wall/declarations/upload/UserDeclarationFileDropzone';
import UserDeclarationTemplateDownload from 'components/molecules/wall/declarations/upload/UserDeclarationTemplateDownload';
import useUploadUserDeclarations from 'hooks/declarations/useUploadUserDeclarations';
import ProductListBlock from 'components/organisms/declarations/upload/ProductListBlock';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { emptyFn } from 'utils/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import buttonStyle from 'assets/style/common/Button.module.scss';
import styles from 'assets/style/components/PersonalInformation/PersonalInformation.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/wall/WallUserDeclarationsBlock.module.scss';
import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';

/**
 * Organism component used to render a User Declarations Upload
 * @param programs
 * @constructor
 */
const UploadUserDeclaration = ({ programs }) => {
  const {
    selectedProgram,
    onProgramChange,
    errors,
    fileDropProps,
    submitting,
    isValid,
    onUpload
  } = useUploadUserDeclarations();

  const allowedPrograms = programs
    .map(program => {
      if (program && program.uploadResultsFile) {
        return program;
      }
    })
    .filter(program => program);

  const programId = selectedProgram && selectedProgram.value;

  const { flexSpaceMobile1, btnCenter, mt2, mb2, pt1, flex100 } = coreStyle;

  return (
    <div className={`${styles.wrapperCenter} ${componentStyle.addDeclaration}`}>
      <div className={grid.row}>
        <div className={`${grid['col-md-6']} ${pt1}`}>
          <ProgramSelector
            {...{ selectedProgram, programs: allowedPrograms, onProgramChange, error: errors.programError }}
            className={`${flexSpaceMobile1} ${flex100}`}
          />
          {programId && (
            <>
              <UserDeclarationTemplateDownload programId={programId} />
              <UserDeclarationFileDropzone fileDropzoneProps={fileDropProps} />
              <div className={`${btnCenter} ${mt2} ${mb2}`}>
                <DynamicFormattedMessage
                  disabled={submitting}
                  tag={Button}
                  id="wall.userDeclaration.validation.accept"
                  className={buttonStyle.primaryinverted}
                  onClick={isValid ? onUpload : emptyFn}
                />
              </div>
            </>
          )}
        </div>
        <div className={grid['col-md-6']}>{programId && <ProductListBlock {...{ programId }} />}</div>
      </div>
    </div>
  );
};

export default UploadUserDeclaration;
