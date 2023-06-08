import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
// layouts
import MainLayout from '../layouts/main';
import SimpleLayout from '../layouts/simple';
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config-global';
//
import {
  // Auth
  LoginPage,
  RegisterPage,
  VerifyCodePage,
  NewPasswordPage,
  ResetPasswordPage,
  // Dashboard: General
  GeneralAppPage,
  GeneralFilePage,
  GeneralBankingPage,
  GeneralBookingPage,
  GeneralEcommercePage,
  GeneralAnalyticsPage,
  // Dashboard: User
  UserListPage,
  UserEditPage,
  UserCardsPage,
  UserCreatePage,
  UserProfilePage,
  UserAccountPage,
  // Dashboard: Ecommerce
  EcommerceShopPage,
  EcommerceCheckoutPage,
  EcommerceProductListPage,
  EcommerceProductEditPage,
  EcommerceProductCreatePage,
  EcommerceProductDetailsPage,
  // Dashboard: Invoice
  InvoiceListPage,
  InvoiceDetailsPage,
  InvoiceCreatePage,
  InvoiceEditPage,
  // Dashboard: Blog
  BlogPostsPage,
  BlogPostPage,
  BlogNewPostPage,
  // Dashboard: FileManager
  FileManagerPage,
  // Dashboard: App
  ChatPage,
  MailPage,
  CalendarPage,
  KanbanPage,
  //
  BlankPage,
  PermissionDeniedPage,
  //
  Page500,
  Page403,
  Page404,
  HomePage,
  FaqsPage,
  AboutPage,
  Contact,
  PricingPage,
  PaymentPage,
  ComingSoonPage,
  MaintenancePage,
  //
  ComponentsOverviewPage,
  FoundationColorsPage,
  FoundationTypographyPage,
  FoundationShadowsPage,
  FoundationGridPage,
  FoundationIconsPage,
  //
  MUIAccordionPage,
  MUIAlertPage,
  MUIAutocompletePage,
  MUIAvatarPage,
  MUIBadgePage,
  MUIBreadcrumbsPage,
  MUIButtonsPage,
  MUICheckboxPage,
  MUIChipPage,
  MUIDataGridPage,
  MUIDialogPage,
  MUIListPage,
  MUIMenuPage,
  MUIPaginationPage,
  MUIPickersPage,
  MUIPopoverPage,
  MUIProgressPage,
  MUIRadioButtonsPage,
  MUIRatingPage,
  MUISliderPage,
  MUIStepperPage,
  MUISwitchPage,
  MUITablePage,
  MUITabsPage,
  MUITextFieldPage,
  MUITimelinePage,
  MUITooltipPage,
  MUITransferListPage,
  MUITreesViewPage,
  //
  DemoAnimatePage,
  DemoCarouselsPage,
  DemoChartsPage,
  DemoCopyToClipboardPage,
  DemoEditorPage,
  DemoFormValidationPage,
  DemoImagePage,
  DemoLabelPage,
  DemoLightboxPage,
  DemoMapPage,
  DemoMegaMenuPage,
  DemoMultiLanguagePage,
  DemoNavigationBarPage,
  DemoOrganizationalChartPage,
  DemoScrollbarPage,
  DemoSnackbarPage,
  DemoTextMaxLinePage,
  DemoUploadPage,
  DemoMarkdownPage,
  FeatureStorePage,
  DataSourcesPage,
  UploadDataPage,
  ConnectUploadPage,
  UploadFilePage,
  ConnectDBPage,
  DBPage,
  ColumnImportPage,
  MappingPage,
  FeatureAnalysisPage,
  ConnectFilePage,
  VariableMappingPage,
  DateColMappingPage,
  DbMethodPage,
  SuccessPage,
} from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Auth
    {
      path: 'auth',
      children: [
        { path: 'login', element: <LoginPage /> },
        { path: 'register', element: <RegisterPage /> },
        { path: 'login-unprotected', element: <LoginPage /> },
        { path: 'register-unprotected', element: <RegisterPage /> },
        {
          element: <CompactLayout />,
          children: [
            { path: 'reset-password', element: <ResetPasswordPage /> },
            { path: 'new-password', element: <NewPasswordPage /> },
            { path: 'verify', element: <VerifyCodePage /> },
          ],
        },
      ],
    },

    // Dashboard

    // 
    // 
    {

      path: 'app',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'dashboard', element: <InvoiceListPage /> },
        { path: 'feature-store', element: <FeatureStorePage /> },
        { path: 'datasources-type', element: <DataSourcesPage /> },
        { path: 'upload-data', element: <UploadDataPage /> },
        { path: 'connect-upload', element: <ConnectUploadPage /> },
        { path: 'db-method', element: <DbMethodPage /> },
        { path: 'success', element: <SuccessPage /> },
        {
          path: 'upload-file',
          element: <UploadFilePage />,
        },
        { path: 'connectdb', element: <ConnectDBPage /> },

        { path: 'dbname', element: <DBPage /> },
        { path: 'col-import', element: <ColumnImportPage /> },
        { path: 'mapping', element: <MappingPage /> },
        { path: 'feature-analysis', element: <FeatureAnalysisPage /> },
        { path: 'connect-file-upload', element: <ConnectFilePage /> },
        { path: 'variable-mapping', element: <VariableMappingPage /> },
        { path: 'date-col-mapping', element: <DateColMappingPage /> },
      ],
    },

    // Main Routes
    {
      element: <MainLayout />,
      children: [
        { element: <Navigate to="/auth/login" replace />, index: true },
      ],
    },
    { path: '*', element: <Navigate to="/auth/login" replace /> },
  ]);
}
