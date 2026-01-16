import { useEffect, useState } from 'react';

import ProgramsApi from 'api/ProgramsApi';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import { redirectToRoute } from 'services/LaunchServices';
import { PROGRAMS } from 'constants/api';
import { ROOT, CHECKOUT_STRIPE } from 'constants/routes';
import React from 'react';
import style from 'sass-boilerplate/stylesheets/style.module.scss';

const programsApi = new ProgramsApi();
/**
 * Hook used to load program details
 * @param programId
 * @param onError
 */
const useProgramDetails = (programId: number, onError?) => {
  const [programDetails, setProgramDetails] = useState < any > ({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setProgramDetails({});
      setLoading(true);
      console.log('useProgramDetails');
      try {
        const program = await programsApi.getProgramDetails(programId);
        setProgramDetails(program);

      } catch (error) {
        if (error.response?.data.message?.indexOf('Active subscription, but latest invoice is not paid') >= 0 ||
          error.response?.data.message == 'No active subscription found for the specified product.' ||
          error.response?.data.message == 'Subscription is not associated with a customer.') {
          // If program is not paid, redirect to payment page
          // history.push(`${ROOT}programs`);
          return (<div>
            <FlexibleModalContainer
              fullOnMobile={false}
              className={`${style.mediaModal}`}
              closeModal={() => redirectToRoute(ROOT + PROGRAMS)}
              isModalOpen={true}
            >
              <div>
                <div className={style.modalContent}>
                  <h2 className={style.modalTitle}>Program not paid</h2>
                  <p className={style.modalText}>
                    You need to pay for the program to access it.
                  </p>
                  <button
                    className={style.buttonPrimary}
                    onClick={() => {
                      redirectToRoute(ROOT + CHECKOUT_STRIPE);
                    }}
                  >
                    Pay Now
                  </button>
                  <button
                    className={style.buttonPrimary}
                    onClick={() => {
                      redirectToRoute(ROOT + PROGRAMS);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </FlexibleModalContainer>
          </div>

          );
        } else {
          onError && onError(error);
        }
      } finally {
        setLoading(false);
      }

    };

    programId && load();

  }, [programId]);

  return { programDetails, isLoading };
};

export default useProgramDetails;
