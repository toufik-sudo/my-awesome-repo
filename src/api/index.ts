// -----------------------------------------------------------------------------
// API Barrel Export
// Central export point for all API services
// -----------------------------------------------------------------------------

// Types
export * from './types';

// Core API Services
export { usersApi, default as UsersApi } from './UsersApi';
export { programsApi, default as ProgramsApi, type IProgramSearchCriteria } from './ProgramsApi';
export { declarationsApi, default as DeclarationsApi } from './DeclarationsApi';
export { platformsApi, default as PlatformsApi, type IPlatformSearchCriteria } from './PlatformsApi';
export { filesApi, default as FilesApi } from './FilesApi';

// Account & Auth APIs
export { accountApi, default as AccountApi } from './AccountApi';

// Communication APIs
export { commentsApi, default as CommentsApi } from './CommentsApi';
export { communicationsApi, default as CommunicationsApi } from './CommunicationsApi';
export { notificationsApi, default as NotificationsApi } from './NotificationsApi';
export { postsApi, default as PostsApi } from './PostsApi';

// Program & Launch APIs
export { launchApi, default as LaunchApi } from './LaunchApi';
export { wallSettingsApi, default as WallSettingsApi } from './WallSettingsApi';
export { inviteUsersApi, default as InviteUsersApi } from './InviteUsersApi';

// Points & Conversions APIs
export { pointsApi, default as PointsApi } from './PointsApi';
export { pointConversionsApi, default as PointConversionsApi } from './PointConversionsApi';

// Payment APIs
export { paymentApi, default as PaymentApi, type IPaymentDTO } from './PaymentApi';

// Products & KPIs APIs
export { productsApi, default as ProductsApi, type IProduct, type IProductParams } from './ProductsApi';
export { kpisApi, default as KPIsApi, type IKPIParams } from './KPIsApi';

// Contact & Admin APIs
export { contactUsApi, default as ContactUsApi } from './ContactUsApi';
export { hyperAdminApi, default as HyperAdminApi } from './HyperAdminApi';

// BDC & Growth APIs
export { bdcDemandApi, default as BdcDemandApi, type IBdcDemandModel, type IBdcInvoiceParams } from './BdcDemandApi';
export { userGrowthRefApi, default as UserGrowthRefApi, type IGrowthRefFile } from './UserGrowthRefApi';

// AI APIs
export { aiPersoApi, default as AiPersoApi } from './AiPersoApi';
export { aiRagApi, default as AIRagApi } from './AIRagApi';

// ECard APIs
export { eCardApi, default as ECardApi } from './ECardApi';
export type { IECardProduct, ICatalogueResponse, IECardCategory } from './ECardApi';
