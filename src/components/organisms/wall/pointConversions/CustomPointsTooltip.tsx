import React, { useEffect, useMemo, useState } from 'react';
// import { CustomTooltipProps } from 'ag-grid-react';
// import { CopyToClipboard } from 'react-copy-to-clipboard';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPaste } from '@fortawesome/free-solid-svg-icons';
// import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
// import { HTML_TAGS } from 'constants/general';
// import { getPointConversionsStatusSettings } from 'services/PointConversionServices';

// import style from 'sass-boilerplate/stylesheets/components/wall/UsersDeclaration.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import { BUTTON_MAIN_VARIANT, BUTTON_MAIN_TYPE } from 'constants/ui';
import pointsStyle from 'sass-boilerplate/stylesheets/components/launch/Points.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaste } from '@fortawesome/free-solid-svg-icons';
import { error } from 'console';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
/**
 * Molecule component used to render table row for a point conversion
 *
 * @param index

 */
const CustomPointsTooltip = ({ data, position, isVisible, setIsVisible, dataToCopy, setDataToCopy, colFiledData }) => {

  const { withBoldFont, pointer, py25, mr1, relative, displayInlineBlock } = coreStyle;
  const [copied, setCopied] = useState(false);
  const { formatMessage } = useIntl();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setCopied(false);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, [copied]);
  // const data = useMemo(
  //   () => props.api.getDisplayedRowAtIndex(props.rowIndex!)!.data,
  //   []
  // );
  // const inputEl = useRef<HTMLInputElement>(null);

  // const onFormSubmit = (e: any) => {
  //   e.preventDefault();
  //   const { node } = props;
  //   const target = inputEl.current as HTMLInputElement;

  //   if (target.value && node) {
  //     node.setDataValue('athlete', target.value);
  //     if (props.hideTooltipCallback) {
  //       props.hideTooltipCallback();
  //     }
  //   }
  // };

  // This is the function we wrote earlier
  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const onCopyClicked = (isColData?: boolean) => {
    let copiedData = "";
    if (isColData) {
      // e.preventDefault();
      setDataToCopy(colFiledData);
      copiedData = colFiledData;
    } else {
      setDataToCopy(JSON.stringify(data));
      copiedData = JSON.stringify(data);
    }
    copyTextToClipboard(copiedData)
      .then(resp => {
        setCopied(true);
        closeTooltip();
      },
        error => {
          toast(formatMessage({ id: error.msg.copyToClipborad }));
        }
      )
  };
  const closeTooltip = () => {
    // e.preventDefault();
    setIsVisible(false);
  };
  const width = document.body.clientWidth;
  const diffWidth = width - parseInt(position.x);
  let transX = '0%';
  if (diffWidth <= 250) {
    transX = '-55%';
  } else if (diffWidth <= 350 && diffWidth > 250) {
    transX = '-30%';
  } else if (diffWidth > 350 && diffWidth <= 500){
    transX = '-10%'
  }

  return (
    <div className={pointsStyle.tooltipContainer}>
      {isVisible &&
        <div className={pointsStyle.tooltip} style={{ top: position.y, left: position.x, transform : `translate(${transX}, 25%)` }} onMouseLeave={closeTooltip}>
          <span className={pointsStyle.textCell}>
            {colFiledData}
          </span>
          <ButtonFormatted
            onClick={() => onCopyClicked(true)}
            variant={BUTTON_MAIN_VARIANT.INVERTED}
            type={BUTTON_MAIN_TYPE.PRIMARY}
            buttonText="btn.label.copy"
            isLoading={false}
            className={pointsStyle.btnCell}
          ></ButtonFormatted>
          <ButtonFormatted
            onClick={onCopyClicked}
            variant={BUTTON_MAIN_VARIANT.INVERTED}
            type={BUTTON_MAIN_TYPE.PRIMARY}
            buttonText="btn.label.copyRow"
            isLoading={false}
            className={pointsStyle.btnRow}
          ></ButtonFormatted>
        </div>
      }

      {/* <div className={'panel panel-' + (props.type || 'primary')}>
        <div className="panel-heading">
          <h3 className="panel-title">{data.country}</h3>
        </div>
        <form className="panel-body" onSubmit={onFormSubmit}>
          <div className="form-group">
            <input
              type="text"
              ref={inputEl}
              className="form-control"
              id="name"
              placeholder="Name"
              autoComplete="off"
              defaultValue={data.athlete}
              onFocus={(e) => e.target.select()}
            />
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p>Total: {data.total}</p>
        </form>
      </div> */}
    </div>
  );
};

export default CustomPointsTooltip;
