
# Migration Completion Plan

## Current Migration Status Summary

After a thorough audit comparing `old_app/src` with `src`, here is the complete migration status:

---

## Fully Migrated (100%)

| Category | Status | Notes |
|----------|--------|-------|
| API Classes | Complete | 24 API classes including AIRagApi |
| Store Action Types | Complete | All action types present |
| Store Reducers | Complete | All 8 reducers migrated |
| Config (axiosConfig, envConfig) | Complete | Core configs present |
| Intl/Languages | Complete | de, en, es, fr files present |
| Providers | Complete | AuthProvider, IntlProvider created |

---

## Missing Items to Migrate

### 1. Services (Priority: HIGH)

**Missing Services:**

| File | Location | Complexity |
|------|----------|------------|
| `AgendaServices.ts` | src/services/wall/ | Medium (needs date-fns conversion) |
| `IaServices.ts` | src/services/analytics/ | Low |
| `PricingPlanServices.ts` | src/services/payments/ | Low |
| `PointConversionServices.ts` | src/services/pointConversions/ | Low |
| `StorageServices.ts` | src/services/storage/ | Low (localStorage helpers) |
| `UsersServices.ts` | src/services/users/ | Medium |
| `VideoServices.ts` | src/services/media/ | Low |
| `PersonalInformationServices.ts` | src/services/users/ | Medium |
| `SectionsServices.ts` | src/services/wall/ | Low |
| `ProgramServices.ts` | src/services/programs/ | Medium |
| `ProgramUsersManagementServices.ts` | src/services/programs/ | Medium |

**Missing Service Directories:**
- `src/services/communications/` - EmailCampaignService, EmailUserListService

---

### 2. Store Actions (Priority: HIGH)

**Missing Actions:**

| File | Lines | Complexity |
|------|-------|------------|
| `authenticationActions.ts` | 22 lines | Low |
| `boardingActions.ts` | 103 lines | Medium |
| `campaignActions.ts` | 8 lines | Low |
| `formActions.ts` | 1183 lines | HIGH - needs splitting |
| `userActions.ts` | 8 lines | Low |

---

### 3. Constants (Priority: MEDIUM)

**Missing Constants Files:**

| File | Purpose |
|------|---------|
| `animations.ts` | Animation delay constants |
| `footer.ts` | Footer configuration |
| `landing.ts` | Landing page constants (large file) |
| `languageSwitcher.ts` | Language switcher config |
| `oldBrowser.ts` | Browser compatibility |
| `paymentMethod.ts` | Payment methods |
| `programs.ts` | Program constants |
| `slider.ts` | Slider configuration |
| `stories.ts` | Storybook config |
| `subscription.ts` | Subscription tiers |
| `tootltip.ts` | Tooltip constants |

**Missing Constants Directories:**
- `formDefinitions/` (formDeclarations.ts, genericFields.ts)
- `communications/` (campaign.ts, userList.ts)
- `reactselect/` (react-select styling)

**Missing API Constants:**
- `tokenValidation.ts`
- `communications.ts`

---

### 4. Utils (Priority: MEDIUM)

**Missing Utils:**

| File | Purpose |
|------|---------|
| `JsonUtilities.ts` | Safe JSON parsing |
| `animations.ts` | React-spring animation configs |
| `routeUtils.ts` | Route parameter parsing |
| `validationUtils.ts` | Form validation helpers |
| `getDefaultColorsCode.tsx` | Color code utilities |

---

### 5. Hooks (Priority: MEDIUM)

**Missing Root Hooks:**

| File | Purpose |
|------|---------|
| `useAdditionalPriceData.ts` | Pricing data |
| `useAdditionalToggle.ts` | Toggle state |
| `useAvatarPictureConfigurations.ts` | Avatar config |
| `useImageCropEditor.ts` | Image cropping |
| `useNavbarScroll.ts` | Scroll detection |
| `usePasswordStrengthMeter.ts` | Password validation |
| `usePriceData.ts` | Pricing data |
| `useResendActivationLink.ts` | Account activation |
| `useSubscriptionData.ts` | Subscription data |

**Missing Hook Directories:**

| Directory | Files | Priority |
|-----------|-------|----------|
| `communication/` | 7 hooks | Medium |
| `contents/` | 4 hooks | Medium |
| `landing/` | 3 hooks | Low |
| `pointConversions/` | 1 hook | Medium |
| `iAScripts/` | AI hooks | Low |
| `nav/` | Navigation hooks | Low |
| `others/` | Misc hooks | Low |

**Partially Migrated:**
- `wall/` - ~20 hooks still missing
- `launch/` - Multiple subdirectories need migration

---

### 6. Config (Priority: LOW)

**Missing Configs:**

| File | Purpose |
|------|---------|
| `paymentConfig.ts` | Stripe API key |
| `validationSchemas.ts` | Yup validation schemas |

---

### 7. API - Third Party (Priority: LOW)

**Missing:**

| Directory | Purpose |
|-----------|---------|
| `api/huuray/` | Huuray gift card integration |
| `api/IA API/AiPersoApi.ts` | AI personalization API |

---

### 8. Containers → Providers/Components (Priority: LOW)

**Containers to migrate:**

| Container | Target |
|-----------|--------|
| `ConnectedIntlProvider.tsx` | Already exists in providers |
| `LanguageSwitcherContainer.tsx` | src/features/settings/ |
| `FlexibleModalContainer.tsx` | src/components/organisms/modals/ |
| `ZoneSwitcherContainer.tsx` | src/features/settings/ |
| `ResellerModalContainer.tsx` | src/components/organisms/modals/ |

---

## Recommended Migration Order

### Phase 1: Foundation (Services + Actions)
1. Create missing services (AgendaServices, StorageServices, UsersServices, etc.)
2. Create missing store actions (authenticationActions, boardingActions, campaignActions)
3. Split formActions.ts into feature-specific modules

### Phase 2: Supporting Code (Constants + Utils)
1. Create constants/animations.ts
2. Create constants/landing.ts
3. Create missing API constants
4. Create utils/JsonUtilities.ts, validationUtils.ts, routeUtils.ts
5. Create utils/animations.ts

### Phase 3: Business Logic (Hooks)
1. Migrate root-level hooks (usePasswordStrengthMeter, useNavbarScroll, etc.)
2. Migrate communication hooks
3. Migrate contents hooks
4. Complete wall hooks migration
5. Complete launch hooks migration

### Phase 4: Config + Third Party
1. Create config/paymentConfig.ts
2. Create config/validationSchemas.ts
3. Migrate Huuray API if needed
4. Migrate AiPersoApi

### Phase 5: Containers → Modern Patterns
1. Convert remaining containers to hooks or provider patterns
2. Integrate modal containers into existing modal system

---

## Technical Considerations

### Moment.js → date-fns
All services using `MomentUtilities` should use `src/utils/dateUtils.ts` instead.

### Dependencies to Add (if needed for full migration)
- `draft-js`, `html-to-draftjs`, `draftjs-to-html` - for WysiwygService
- `@fortawesome/react-fontawesome` - for landing page icons (if landing.ts is migrated)

### formActions.ts Strategy
This 1183-line file should be split into:
- `src/store/actions/auth/loginActions.ts`
- `src/store/actions/auth/registerActions.ts`
- `src/store/actions/user/profileActions.ts`
- `src/store/actions/launch/programActions.ts`
- `src/store/actions/form/contactActions.ts`

---

## Estimated Remaining Work

| Phase | Files | Estimated Effort |
|-------|-------|------------------|
| Phase 1 | ~20 files | 4-6 hours |
| Phase 2 | ~20 files | 2-3 hours |
| Phase 3 | ~30 hooks | 4-5 hours |
| Phase 4 | ~5 files | 1 hour |
| Phase 5 | ~5 files | 1-2 hours |

**Total: ~80 files, ~12-17 hours of work**

---

## Files That Can Be Skipped

1. `sass-boilerplate/` - Using Tailwind CSS instead
2. `StoriesServices.ts` - Storybook-related, optional
3. `e2e/` - E2E tests, migrate separately if needed
4. `react-app-env.d.ts` - CRA-specific
5. `setupProxy.js` - CRA proxy config
6. `setupTests.ts` - Test setup, handle separately
