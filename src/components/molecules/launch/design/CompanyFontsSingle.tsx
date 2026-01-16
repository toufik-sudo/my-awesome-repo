import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DesignFontTextSample from 'components/atoms/launch/design/DesignFontTextSample';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { DESIGN } from 'constants/wall/launch';
import { IStore } from 'interfaces/store/IStore';

import style from 'assets/style/components/launch/Design.module.scss';

/**
 * Molecule component used to render single font sample selection
 *
 * @param font
 * @param selectedFont
 * @constructor
 */
const CompanyFontsSingle = ({ font, selectedFont }) => {
  const dispatch = useDispatch();
  let { design } = useSelector((store: IStore) => store.launchReducer);
  design = undefined === design ? {} : design;

  return (
    <>
      <div
        style={{ fontFamily: font }}
        className={`${selectedFont === font ? style.designFontsSelected : ''} ${style.designFontsItem}`}
        onClick={() => dispatch(setLaunchDataStep({ key: DESIGN, value: { ...design, font } }))}
      >
        <p className={style.designFontsTitle}>{font}</p>
        <DesignFontTextSample />
      </div>
    </>
  );
};

export default CompanyFontsSingle;
