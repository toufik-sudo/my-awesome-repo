import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const BannerPreview = ({ highlightedIndex }) => {
  const { formatMessage } = useIntl();
  return (
    <div style={{ zIndex: 999, backgroundColor: 'white', padding: '2.2rem', border: '2px solid #00063a', marginTop: '2rem', alignItems: 'center', borderRadius: '15px', width: '100%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h4 style={{ textAlign: 'center', fontWeight: 'bold', margin: '1.2rem', fontSize: '2.2rem' }}>{formatMessage({ id: 'launchProgram.content.preview.banner'})}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: '150px', borderRadius: "10px", height: '60px', backgroundColor: highlightedIndex === 0 ? '#EC407A' : 'gray', margin: '8px', border: highlightedIndex === 0 ? '2px solid black' : '1px solid transparent', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <p style={{ color: highlightedIndex === 0 ? 'white' : 'white', fontWeight: highlightedIndex === 0 ? 'bold' : 'normal', textAlign: 'center' }}>{formatMessage({ id: 'launchProgram.content.banner'})} 1</p>
          </div>
          <div style={{ width: '150px', borderRadius: "10px", height: '60px', backgroundColor: highlightedIndex === 1 ? '#EC407A' : 'gray', margin: '8px', border: highlightedIndex === 1 ? '2px solid black' : '1px solid transparent', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <p style={{ color: highlightedIndex === 1 ? 'white' : 'white', fontWeight: highlightedIndex === 1 ? 'bold' : 'normal', textAlign: 'center' }}>{formatMessage({ id: 'launchProgram.content.banner'})} 2</p>
          </div>
        </div>
        <hr style={{ width: '70%', backgroundColor: '#00063a', margin: '8px 20px', height: '0.3rem' }} />{/* Vertical gray line */}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
          <div style={{ width: '150px', borderRadius: "10px", height: '60px', backgroundColor: highlightedIndex === 2 ? '#EC407A' : 'gray', margin: '8px', border: highlightedIndex === 2 ? '2px solid black' : '1px solid transparent', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <p style={{ color: highlightedIndex === 2 ? 'white' : 'white', fontWeight: highlightedIndex === 2 ? 'bold' : 'normal', textAlign: 'center' }}>{formatMessage({ id: 'launchProgram.content.banner'})} 3</p>
          </div>
          {/* <div style={{ width: '150px', borderRadius: "10px",  height: '60px', visibility: 'hidden' }}></div> Invisible rectangle to adjust position */}
          <div style={{ width: '150px', borderRadius: "10px", height: '60px', backgroundColor: highlightedIndex === 3 ? '#EC407A' : 'gray', margin: '8px', border: highlightedIndex === 3 ? '2px solid black' : '1px solid transparent', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <p style={{ color: highlightedIndex === 3 ? 'white' : 'white', fontWeight: highlightedIndex === 3 ? 'bold' : 'normal', textAlign: 'center' }}>{formatMessage({ id: 'launchProgram.content.banner'})} 4</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerPreview;
