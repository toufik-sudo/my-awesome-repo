import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

import UserDeclarationApi from 'api/UserDeclarationsApi';
import { KEY_NAMES } from 'constants/general';

const userDeclarationApi = new UserDeclarationApi();
/**
 * Hook used for declaration notes
 * @param declarationId
 * @param triggerConfirmation
 */
const useUserDeclarationNotes = (declarationId: number, triggerConfirmation) => {
  const [notes, setNotes] = useState<any>({ entries: [], isLoading: true });
  const [addingNote, setAddingNote] = useState(false);
  const intl = useIntl();
  const noteRef = useRef<any>();

  const handleAddNote = useCallback(
    async text => {
      setAddingNote(true);
      try {
        const id = await userDeclarationApi.addNote(declarationId, text);
        setNotes(state => ({
          ...state,
          entries: [...state.entries, { id, text }]
        }));
      } catch (e) {
        toast(intl.formatMessage({ id: 'wall.userDeclarations.notes.add.failed' }));
      }
      setAddingNote(false);
    },
    [declarationId, intl]
  );

  const saveNote = useCallback(async () => {
    const noteInput = noteRef.current;
    const value = noteInput && noteInput.value.trim();

    if (value) {
      await handleAddNote(value);
      noteInput.value = '';
    }
  }, [handleAddNote, noteRef]);

  const onNoteKeyUp = useCallback(
    async e => {
      if (e.key === KEY_NAMES.ENTER) {
        saveNote();
      }
    },
    [saveNote]
  );

  const handleDeleteNote = useCallback(
    async noteId => {
      try {
        await userDeclarationApi.removeNote(noteId);
        setNotes(state => ({
          ...state,
          entries: state.entries.filter(note => note.id !== noteId)
        }));
      } catch (e) {
        toast(intl.formatMessage({ id: 'wall.userDeclarations.notes.delete.failed' }));
      }
    },
    [intl]
  );

  const onDeleteNote = useCallback(
    noteId =>
      triggerConfirmation({
        question: 'wall.userDeclarations.notes.delete.confirm',
        onAccept: handleDeleteNote,
        onAcceptArgs: 'noteId',
        data: { noteId }
      }),
    [triggerConfirmation, handleDeleteNote]
  );

  useEffect(() => {
    const loadNotes = async () => {
      setNotes({ notes: [], isLoading: true });
      let entries;
      try {
        entries = await userDeclarationApi.getNotes(declarationId);
      } catch (e) {
        entries = [];
      }
      setNotes({ entries, isLoading: false });
    };

    loadNotes();
  }, [declarationId]);

  return { notes, onNoteKeyUp, saveNote, addingNote, noteRef, onDeleteNote, intl };
};

export default useUserDeclarationNotes;
