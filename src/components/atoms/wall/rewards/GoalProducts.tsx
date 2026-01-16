// import React from 'react';

// import GoalMoreProducts from 'components/atoms/wall/rewards/GoalMoreProducts';
// import ArrayUtilities from 'utils/ArrayUtilities';
// import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
// import { HTML_TAGS } from 'constants/general';
// import { GOAL_PRODUCTS_TO_DISPLAY } from 'constants/wall/launch';

// /**
//  * Component used to render products linked to goal
//  * @param productNamesById
//  * @param productIds
//  * @constructor
//  */
// const GoalProducts = ({ productNamesById, productIds }) => {
//   if (!ArrayUtilities.isNonEmptyArray(productIds)) {
//     return null;
//   }

//   const productsToDisplay = productIds.slice(0, GOAL_PRODUCTS_TO_DISPLAY + 1);
//   const productsCount = productsToDisplay.length;

//   return (
//     <DynamicFormattedMessage
//       tag={HTML_TAGS.P}
//       id="wall.intro.rewards.products.layout"
//       values={{
//         products: productsToDisplay.map((id, index) => (
//           <DynamicFormattedMessage
//             key={`goal_product_${id}_${index}`}
//             id="wall.intro.rewards.products"
//             tag={HTML_TAGS.SPAN}
//             values={{
//               product:
//                 index === GOAL_PRODUCTS_TO_DISPLAY ? (
//                   <GoalMoreProducts moreProductsCount={productIds.length - GOAL_PRODUCTS_TO_DISPLAY} />
//                 ) : (
//                   <strong>{productNamesById[id]}</strong>
//                 ),
//               position: index === productsCount - 1 && productsCount > 1 ? 'last' : index === 0 ? 'first' : 'inner'
//             }}
//           />
//         ))
//       }}
//     />
//   );
// };

// export default GoalProducts;


import React, { useState } from 'react';
import GoalMoreProducts from 'components/atoms/wall/rewards/GoalMoreProducts';
import ArrayUtilities from 'utils/ArrayUtilities';
import { HTML_TAGS } from 'constants/general';
import { GOAL_PRODUCTS_TO_DISPLAY } from 'constants/wall/launch';
import style from 'sass-boilerplate/stylesheets/components/wall/Dashboard.module.scss' 
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
/**
 * Component used to render product names and images linked to goal
 * @param productNamesById
 * @param productImagesUrls
 * @param productIds
 * @constructor
 */
const GoalProducts = ({ productNamesById, productImagesUrls, productIds }) => {
  if (!ArrayUtilities.isNonEmptyArray(productIds)) {
    return null;
  }

  const productsToDisplay = productIds.slice(0, GOAL_PRODUCTS_TO_DISPLAY + 1);
  const productsCount = productsToDisplay.length;
  const {goalsStyle,productImage,productName,productItem} = style;
  const [openModal, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl); // Set the clicked image
    setModalOpen(true); // Open the modal
  };

  return (
    <div>
    <DynamicFormattedMessage
    id="wall.intro.rewards.products.layout"
    tag={HTML_TAGS.P}>
    
    </DynamicFormattedMessage>
    
    <div className={goalsStyle}>
      
      {productsToDisplay.map((id, index) => (
        <div key={`goal_product_${id}_${index}`} className={productItem}>
          {/* Display Product Name */}
          {index === GOAL_PRODUCTS_TO_DISPLAY ? (
            <GoalMoreProducts moreProductsCount={productIds.length - GOAL_PRODUCTS_TO_DISPLAY} />
          ) : (
            <>
              <strong className={productName}>
                {productNamesById[id]} {/* Product name */}
              </strong>
                {productImagesUrls && productImagesUrls[index] && 
                  <img 
                    src={productImagesUrls[index]} 
                    alt={`Product ${id}`} 
                    className={productImage}
                    onClick={() => handleImageClick(productImagesUrls[index])}
                    // Open modal on click                
                  />
                }
            </>
          )}
        </div>
      ))}

{selectedImage && (
        <FlexibleModalContainer
          fullOnMobile={false}
          closeModal={() => setModalOpen(false)} // Close modal on action
          isModalOpen={openModal} // Control modal visibility
        >
          <img 
            src={selectedImage} 
            alt="Enlarged product" 
            style={{ maxWidth: '100%', maxHeight: '80vh' }} // Ensure the image fits within the modal
          />
        </FlexibleModalContainer>
      )}

    </div>
    </div>
  );
};


export default GoalProducts;