import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import PlatformApi from 'api/PlatformApi';
import { CREATE_PLATFORM_MODAL } from 'constants/modal';
import { IStore } from 'interfaces/store/IStore';
import { setModalState } from 'store/actions/modalActions';
import { extractErrorCode } from 'utils/api';
import { isValidPlatformName, isSuperPlatform } from 'services/HyperProgramService';
import { retrievePlatformsData } from 'services/PlatformSelectionServices';

/**
 *  Hook used for handling platform create data.
 * @param onPlatformCreateDone
 */
const useCreatePlatformModalData = onPlatformCreateDone => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const [platform, setPlatform] = useState({ name: '', error: undefined });
  const [isLoading, setIsLoading] = useState(false);
  const {
    active,
    data: { hierarchicType, parentPlatform }
  } = useSelector((state: IStore) => state.modalReducer[CREATE_PLATFORM_MODAL]);

  const closeModal = useCallback(
    (platformAdded = false) => {
      setPlatform({ name: '', error: undefined });
      onPlatformCreateDone(platformAdded);
      dispatch(setModalState(false, CREATE_PLATFORM_MODAL));
    },
    [dispatch, onPlatformCreateDone]
  );

  const canSubmit = !platform.error && isValidPlatformName(platform.name);

  const handlePlatformSubmit = async () => {
    setIsLoading(true);
    try {
      const { platformId } = await new PlatformApi().createPlatform({
        hierarchicType: hierarchicType,
        parentPlatformId: parentPlatform && parentPlatform.id,
        name: platform.name.trim()
      });

      // if everything was ok, refresh platforms in selector to include newly created platform
      if (platformId) {
        await retrievePlatformsData(dispatch, { platformId: platformId });
      }

      const messageId = isSuperPlatform(hierarchicType)
        ? 'create.new.superplatform.success'
        : 'create.new.subplatform.success';
      toast(
        formatMessage(
          {
            id: messageId
          },
          { value: platform.name, parent: parentPlatform && parentPlatform.name }
        )
      );
      closeModal(true);
    } catch ({ response }) {
      const code = extractErrorCode(response);
      code && setPlatform(state => ({ ...state, error: `form.validation.${code}` }));
    }
    setIsLoading(false);
  };

  const setPlatformName = name => setPlatform({ name, error: undefined });

  return {
    active,
    closeModal,
    hierarchicType,
    platform,
    setPlatformName,
    isLoading,
    canSubmit,
    handlePlatformSubmit
  };
};

export default useCreatePlatformModalData;
