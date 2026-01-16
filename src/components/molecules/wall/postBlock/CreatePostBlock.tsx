import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import CreatePostTab from './CreatePostTab';
import CreatePostWrapper from './CreatePostWrapper';
import { POST, TASK } from 'constants/wall/posts';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { getDefaultColorsCode } from 'utils/getDefaultColorsCode';
import { CONTENT } from 'constants/wall/design';

import postTabStyle from 'sass-boilerplate/stylesheets/components/wall/PostTabs.module.scss';
import style from 'sass-boilerplate/stylesheets/components/wall/WallPostBaseBlock.module.scss';

/**
 * Molecule component used to render Create Post block
 *
 * @constructor
 */
const CreatePostBlock = () => {
  const [showPostBlock, setShowPostBlock] = useState(false);
  const {
    postTab,
    postTabList,
    postTabItem,
    postTabItemSelected,
    postTabItemPost,
    postTabItemTask,
    postTabBaseBlock,
    postTabBaseBlockOpen,
    postTabBaseBlockClosed,
    postIcon,
    postLine
  } = postTabStyle;
  const { wallPostPublishPost, wallPostPublishTask } = style;

  const { programs: storePrograms, selectedProgramIndex } = useWallSelection();

  const selectedProgram = storePrograms[selectedProgramIndex];
  const defaultColor = getDefaultColorsCode(CONTENT);
  const defaultColorTask = getDefaultColorsCode(TASK);

  let contentColor = '';
  let colorTask = '';

  if (selectedProgram && selectedProgram.design) {
    contentColor = selectedProgram.design.colorContent;
    colorTask = selectedProgram.design.colorTask;
  }

  const contentColorOrDefault = contentColor ? contentColor : defaultColor;
  const taskColorOrDefault = colorTask ? colorTask : defaultColorTask;

  return (
    <div className={`${postTabBaseBlock} ${!showPostBlock ? postTabBaseBlockClosed : postTabBaseBlockOpen}`}>
      <Tabs className={postTab}>
        <TabList className={postTabList} onClick={() => setShowPostBlock(true)}>
          <Tab
            className={`${postTabItem} ${postTabItemPost}`}
            selectedClassName={postTabItemSelected}
            style={{ color: contentColorOrDefault }}
          >
            <CreatePostTab textId="postTab" />
            <div className={postIcon} />
            <div className={postLine} style={{ backgroundColor: contentColorOrDefault }} />
          </Tab>
          <Tab
            className={`${postTabItem}  ${postTabItemTask}`}
            selectedClassName={postTabItemSelected}
            style={{ color: taskColorOrDefault }}
          >
            <CreatePostTab textId="taskTab" />
            <div className={postIcon} />
            <div className={postLine} style={{ backgroundColor: taskColorOrDefault }} />
          </Tab>
        </TabList>
        <TabPanel>
          <CreatePostWrapper
            {...{ className: wallPostPublishPost, postType: POST, setShowPostBlock, color: contentColor }}
          />
        </TabPanel>
        <TabPanel>
          <CreatePostWrapper
            {...{ className: wallPostPublishTask, postType: TASK, setShowPostBlock, color: colorTask }}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default CreatePostBlock;
