import React from 'react';
import { useSelector } from 'react-redux';

import CompanyFontsSingle from 'components/molecules/launch/design/CompanyFontsSingle';
import { CUSTOMIZE_FONTS, ROBOTO } from 'constants/wall/design';
import { IStore } from 'interfaces/store/IStore';

/**
 * Organism component used to render company fonts list
 *
 * @constructor
 */
const CompanyFontsList = () => {
  const { design } = useSelector((store: IStore) => store.launchReducer);

  return (
    <div>
      {CUSTOMIZE_FONTS.map(font => (
        <CompanyFontsSingle
          key={font}
          {...{ font, selectedFont: design === undefined || design.font === undefined ? ROBOTO : design.font }}
        />
      ))}
    </div>
  );
};

export default CompanyFontsList;
