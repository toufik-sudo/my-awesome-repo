import React, { useEffect, useState } from 'react';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaste } from '@fortawesome/free-solid-svg-icons';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { getPointConversionsStatusSettings } from 'services/PointConversionServices';

import style from 'sass-boilerplate/stylesheets/components/wall/UsersDeclaration.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render table row for a point conversion
 *
 * @param index
 * @param program
 * @param platform
 * @param superplatform
 * @param status
 * @param points
 * @param firstName
 * @param lastName
 * @param paypalLink
 */
const PointConversionRow = ({ program, platform, superplatform, status, points, name, email, phone, brandName, productToken,
  amount,
  currency,
  createdAt,
  updatedAt,
  orderUuid,
  transactionRefId,
  userUuid,
  errorCode,
  errorMessage }) => {
  const { statusStyle, statusDescriptionId } = getPointConversionsStatusSettings(status, style);
  const { withBoldFont, pointer, py25, mr1, relative, displayInlineBlock } = coreStyle;
  const [copied, setCopied] = useState(false);

  const rowElements = [
    (superplatform && superplatform.name) || '',
    (platform && platform.name) || '',
    (program && program.name) || '',
    (program && program.company) || '',
    name,
    email,
    phone || '',
    brandName,
    productToken,
    points,
    amount,
    currency,    
    createdAt,
    updatedAt || '',
    orderUuid || '',
    transactionRefId,
    userUuid,
    errorCode || '',
    errorMessage || '',
    
  ];
  const { userDeclarationRowElement, payoutTooltip } = style;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <>
      {rowElements.map((element, index) => {
        return (
          <td className={`${py25} ${statusStyle}`} key={index}>
            {index === 6 ? (
              <div onClick={e => e.stopPropagation()} className={`${relative} ${displayInlineBlock}`}>
                {copied && <div className={payoutTooltip}>Copied!</div>}
                <CopyToClipboard text={element} onCopy={() => setCopied(true)}>
                  <span className={`${coreStyle['flex-center-vertical']} ${pointer}`}>
                    {element && (
                      <>
                        <FontAwesomeIcon size={'sm'} icon={faPaste} className={mr1} />
                        {element.length > 23 ? element.substr(0, 20) + '...' : element}
                      </>
                    )}
                  </span>
                </CopyToClipboard>
              </div>
            ) : (
              element
            )}
          </td>
        );
      })}
      <td className={py25}>
        <DynamicFormattedMessage
          id={statusDescriptionId}
          tag={HTML_TAGS.P}
          className={`${userDeclarationRowElement} ${statusStyle} ${withBoldFont}`}
        />
      </td>
    </>
  );
};

export default PointConversionRow;
