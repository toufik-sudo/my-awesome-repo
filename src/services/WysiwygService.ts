import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';

/**
 * Transforms the given Wysiwyg editor state to a html string
 *
 * @param editorState
 */
export const getHtmlFromEditorState = (editorState: EditorState) => {
  return draftToHtml(convertToRaw(editorState.getCurrentContent()));
};
/**
 * Transforms the given Wysiwyg editor blocks to a html string
 *
 * @param editorState
 */
export const getHtmlFromEditorBlocks = (editorBlocks) => {
  const blocks = JSON.parse(editorBlocks);
  return draftToHtml(blocks);
};

/**
 * Transforms the given html string to a Wysiwyg editor state
 *
 * @param html
 */
export const getEditorStateFromHtml = (html: string) => {
  const initialDraft = htmlToDraft(html);
  const contentState = ContentState.createFromBlockArray(initialDraft.contentBlocks);

  return EditorState.createWithContent(contentState);
};

/**
 * Validates if given editor text contains any custom user input
 *
 * @param editorState
 */
export const hasUserInput = (editorState: EditorState) => {
  return !!editorState
    .getCurrentContent()
    .getPlainText()
    .trim();
};
