import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-scroll/modules';

import FooterGroupConditionalWrapper from 'components/atoms/footer/FooterGroupConditionalWrapper';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BECOME_PARTNER } from 'constants/footer';
import { TAILOR_SECTION_ID } from 'constants/general';
import { RESELLER_MODAL } from 'constants/modal';
import { setModalState } from 'store/actions/modalActions';

import style from 'assets/style/components/landing/Footer.module.scss';

/**
 * Molecule component used to render link group column
 *
 * @param list
 * @param index
 * @constructor
 *
 * @see FooterStory
 */
const LinkGroupColumn = ({ list }) => {
  const dispatch = useDispatch();
  const openResellerModal = () => setTimeout(() => dispatch(setModalState(true, RESELLER_MODAL)), 1000);

  return (
    <ul>
      {list.map((item, index) => {
        if (item.title == BECOME_PARTNER) {
          return (
            <DynamicFormattedMessage
              to={TAILOR_SECTION_ID}
              spy
              smooth
              tag={Link}
              key={item.title}
              className={style.link}
              id={`footer.${item.title}`}
              onClick={openResellerModal}
            />
          );
        }

        return (
          <FooterGroupConditionalWrapper
            key={item.title}
            condition={item.link && item.link !== ''}
            wrapper={children => (
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            )}
          >
            <DynamicFormattedMessage
              tag="li"
              key={item.title}
              className={index === 0 ? style.title : ''}
              id={`footer.${item.title}`}
            />
          </FooterGroupConditionalWrapper>
        );
      })}
    </ul>
  );
};

export default LinkGroupColumn;
