import React from 'react';

import Loading from 'components/atoms/ui/Loading';
import UserDeclarationNote from 'components/atoms/declarations/UserDeclarationNote';
import useUserDeclarationNotes from 'hooks/declarations/useUserDeclarationNotes';
import useUserDeclarationViewDetailsNotes from 'hooks/declarations/useUserDeclarationViewDetailsNotes';
import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { LOADER_TYPE } from 'constants/general';
import { INPUT_TYPE } from 'constants/forms';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import inputStyle from 'assets/style/common/Input.module.scss';
import style from 'sass-boilerplate/stylesheets/components/wall/UsersDeclarationDetail.module.scss';

/**
 * Molecule component used to render User Declaration notes
 * @param props
 * @param props.declarationId
 * @param props.triggerConfirmation
 * @param isBeneficiary
 * @constructor
 */
const UserDeclarationNotes = ({ declarationId, triggerConfirmation, isBeneficiary }) => {
  const {
    userDeclarationsDetailBigInputWrapper,
    userDeclarationsDetailInputWrapper,
    userDeclarationsDetailNoteList
  } = style;
  const { defaultInputStyle, container } = inputStyle;
  const { mb3, flex, mr15, flexAlignItemsCenter } = coreStyle;
  const {
    notes: { entries, isLoading },
    onNoteKeyUp,
    saveNote,
    addingNote,
    noteRef,
    onDeleteNote,
    intl
  } = useUserDeclarationNotes(declarationId, triggerConfirmation);
  const { currentUserId } = useUserDeclarationViewDetailsNotes(isBeneficiary);

  if (isLoading) {
    return <Loading type={LOADER_TYPE.DROPZONE} />;
  }

  return (
    <div>
      {!isBeneficiary && (
        <div className={`${userDeclarationsDetailBigInputWrapper} ${mb3} ${flex} ${flexAlignItemsCenter}`}>
          <div className={`${container} ${userDeclarationsDetailInputWrapper} ${mr15}`}>
            <input
              type={INPUT_TYPE.TEXT}
              className={defaultInputStyle}
              onKeyUp={onNoteKeyUp}
              disabled={addingNote}
              placeholder={intl.formatMessage({ id: 'wall.userDeclarations.detail.addNote' })}
              ref={noteRef}
            />
          </div>
          <ButtonFormatted type={BUTTON_MAIN_TYPE.PRIMARY} onClick={saveNote} buttonText="add.note.cta" />
        </div>
      )}

      <div className={`${userDeclarationsDetailBigInputWrapper} ${userDeclarationsDetailNoteList}`}>
        {entries.map(note => {
          let showNote = true;

          if (isBeneficiary && note.createdBy !== currentUserId) {
            showNote = false;
          }
          return showNote && <UserDeclarationNote key={note.id} {...note} onDelete={onDeleteNote} />;
        })}
      </div>
    </div>
  );
};

export default UserDeclarationNotes;
