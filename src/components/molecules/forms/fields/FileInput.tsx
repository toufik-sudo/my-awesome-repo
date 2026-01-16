import React, { useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import Button from 'components/atoms/ui/Button';
import { FILE } from 'constants/files';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { FILE_EXTENSION } from 'constants/validation';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

const FileInput = ({
  field: { name },
  setFieldValue,
  setFieldTouched,
  values,
  hasExplanation = false,
  explanationClassName = '',
  constraints = {}
}) => {
  const accepts = constraints[FILE_EXTENSION] || [];
  const fileRef = useRef<any>();

  const handleChange = useCallback(
    e => {
      const chosenFile = e.target.files[0];
      setFieldTouched(name, true);
      if (chosenFile) {
        setFieldValue(name, chosenFile);
      }
    },
    [name, setFieldValue, setFieldTouched]
  );

  const onRemove = useCallback(() => {
    setFieldValue(name, undefined);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  }, [name, setFieldValue]);

  return (
    <div className="customInputField">
      <DynamicFormattedMessage onClick={() => fileRef.current.click()} tag={Button} id="form.label.import" />
      {hasExplanation && <span className={explanationClassName}>{accepts.join(', ')}</span>}
      <input
        name={name}
        type={FILE}
        onChange={handleChange}
        ref={fileRef}
        className={coreStyle.displayNone}
        accept={accepts.map(ext => `.${ext}`)}
      />
      {values[name] && (
        <p>
          <FontAwesomeIcon icon={faTimes} onClick={onRemove} /> {values[name].name}
        </p>
      )}
    </div>
  );
};

export default FileInput;
