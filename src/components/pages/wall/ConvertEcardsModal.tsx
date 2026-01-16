import React from 'react';
import coreStyle from "sass-boilerplate/stylesheets/style.module.scss";
import EcardPage from '../EcardPage';
import postTabStyle from 'sass-boilerplate/stylesheets/components/wall/PostTabs.module.scss';
import pointsStyle from 'sass-boilerplate/stylesheets/components/launch/Points.module.scss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import BdcWinsDemand from './bdcWinsDemand/BdcWinsDemand';
import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import { WALL_TYPE } from 'constants/general';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import Button from 'components/atoms/ui/Button';
import eCardStyle from 'sass-boilerplate/stylesheets/components/launch/Ecard.module.scss';
import { useUserRole } from 'hooks/user/useUserRole';
import { getUserAuthorizations, isAnyKindOfAdmin } from 'services/security/accessServices';
import { FormattedMessage } from 'react-intl';
import BdcInvoiceCompanyHistory from 'components/organisms/wall/BdcInvoiceCompany/BdcInvoiceCompanyHistory';

const ConvertEcardsModal = ({ isConversionEcard, onRewardsRedirectClick, canConvert=null }) => {
    const {
        postTab,
        postTabList,
        postTabItem,
        postTabItemSelected,
        postTabItemPost,
        postTabItemTask,
        postTabBaseBlock,
        postTabBaseBlockOpen,
        postTabBaseBlockClosed,
        postIcon,
        postLine
    } = postTabStyle;

    const role = useUserRole();
    const userRights = getUserAuthorizations(role);
    const isAnyAdmin = isAnyKindOfAdmin(userRights);
    const isSuperAdmin = userRights.isSuperAdmin;

    return (
        <div>
            {isSuperAdmin && (
            <Tabs>
                <TabList className={`${pointsStyle.pointsTabList} ${eCardStyle.cardTabList}`}
                        style={{ cursor: 'pointer' }}>
                    <Tab key='0' selectedClassName={postTabItemSelected} style={{ color: '#78bb7bcf' }}>
                        <FormattedMessage id="conversion.conversionPage" defaultMessage="Conversion page" />
                    </Tab>
                    <Tab key='1' selectedClassName={postTabItemSelected} style={{ color: '#EC407A' }}>
                        <FormattedMessage id="conversion.demandPage" defaultMessage="Demand page" />
                    </Tab>
                    <Tab key = '2'
                        selectedClassName={postTabItemSelected}
                        style={{ color: coreStyle.secondaryColor }}
                    >
                        Historique des BDC
                    </Tab>
                </TabList>
                <TabPanel>
                    <EcardPage isConversionEcard={true}  canConvert={canConvert}></EcardPage>
                </TabPanel>
                <TabPanel>
                    <BdcWinsDemand onRewardsRedirectClick={onRewardsRedirectClick}></BdcWinsDemand>
                </TabPanel>
                <TabPanel>
                    <BdcInvoiceCompanyHistory isDisplayModal={true} />
                </TabPanel>
                <DynamicFormattedMessage
                    onClick={() => onRewardsRedirectClick(false)}
                    tag={Button}
                    className={`${coreStyle.mxAuto} ${eCardStyle.marginTopRem1}`}
                    id="label.close.modal"
                />
            </Tabs>
            )}

            {!isSuperAdmin && (
                <div>
                    <EcardPage isConversionEcard={true} canConvert={canConvert}></EcardPage>
                    <DynamicFormattedMessage
                        onClick={() => onRewardsRedirectClick(false)}
                        tag={Button}
                        className={`${coreStyle.mxAuto} ${eCardStyle.marginTopRem1}`}
                        id="label.close.modal"
                    />
                </div>
            )}
        </div>
    )
}

export default ConvertEcardsModal;