// ----------------------------------------------------------------------

// sublink is coming from the route.js file in the pages folder
function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/app';
const ROOTS_APP = '/app';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/app'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
};
export const PATH_DASHBOARD = {};
export const PATH_APP = {
  root: ROOTS_APP,
  kanban: path(ROOTS_APP, '/kanban'),
  calendar: path(ROOTS_APP, '/calendar'),
  fileManager: path(ROOTS_APP, '/files-manager'),
  permissionDenied: path(ROOTS_APP, '/permission-denied'),
  blank: path(ROOTS_APP, '/blank'),
  general: {
    dashboard: path(ROOTS_APP, '/dashboard'),
    feature: path(ROOTS_APP, '/feature-store'), // isse datasources page pe jana hai
    datasources: path(ROOTS_APP, '/datasources-type'), // isse upload-data vale route pe jana hai
    dataUpload: path(ROOTS_APP, '/upload-data'), // isse we'll go to connect-upload route
    connectUpload: path(ROOTS_APP, '/connect-upload'), // isse we'll go to connect db route
    connectdb: path(ROOTS_APP, '/connectdb'), //  iske baad we go to db name page
    dbname: path(ROOTS_APP, '/dbname'), // iske baad we go to date col mapping page
    datecolmapping: path(ROOTS_APP, '/date-col-mapping'), // iske baad we go to column import page
    columnimport: path(ROOTS_APP, '/col-import'), // iske baad we go to mapping page
    uploadfile: path(ROOTS_APP, '/upload-file'), // iske baad mapping page
    mapping:path(ROOTS_APP ,'/mapping'),
    variableMapping:path(ROOTS_APP ,'/variable-mapping'),
    analytics: path(ROOTS_APP, '/analytics'),
    banking: path(ROOTS_APP, '/banking'),
    booking: path(ROOTS_APP, '/booking'),
    file: path(ROOTS_APP, '/file'),
  },
  mail: {
    root: path(ROOTS_APP, '/mail'),
    all: path(ROOTS_APP, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_APP, '/chat'),
    new: path(ROOTS_APP, '/chat/new'),
    view: (name) => path(ROOTS_APP, `/chat/${name}`),
  },
  user: {
    root: path(ROOTS_APP, '/user'),
    new: path(ROOTS_APP, '/user/new'),
    list: path(ROOTS_APP, '/user/list'),
    cards: path(ROOTS_APP, '/user/cards'),
    profile: path(ROOTS_APP, '/user/profile'),
    account: path(ROOTS_APP, '/user/account'),
    edit: (name) => path(ROOTS_APP, `/user/${name}/edit`),
    demoEdit: path(ROOTS_APP, `/user/reece-chung/edit`),
  },
  eCommerce: {
    root: path(ROOTS_APP, '/e-commerce'),
    shop: path(ROOTS_APP, '/e-commerce/shop'),
    list: path(ROOTS_APP, '/e-commerce/list'),
    checkout: path(ROOTS_APP, '/e-commerce/checkout'),
    new: path(ROOTS_APP, '/e-commerce/product/new'),
    view: (name) => path(ROOTS_APP, `/e-commerce/product/${name}`),
    edit: (name) => path(ROOTS_APP, `/e-commerce/product/${name}/edit`),
    demoEdit: path(ROOTS_APP, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    demoView: path(ROOTS_APP, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  },
  invoice: {
    root: path(ROOTS_APP, '/invoice'),
    list: path(ROOTS_APP, '/invoice/list'),
    new: path(ROOTS_APP, '/invoice/new'),
    view: (id) => path(ROOTS_APP, `/invoice/${id}`),
    edit: (id) => path(ROOTS_APP, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_APP, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_APP, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
  blog: {
    root: path(ROOTS_APP, '/blog'),
    posts: path(ROOTS_APP, '/blog/posts'),
    new: path(ROOTS_APP, '/blog/new'),
    view: (title) => path(ROOTS_APP, `/blog/post/${title}`),
    demoView: path(ROOTS_APP, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
};

export const PATH_DOCS = {
  root: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
};

export const PATH_ZONE_ON_STORE = 'https://mui.com/store/items/zone-landing-page/';

export const PATH_MINIMAL_ON_STORE = 'https://mui.com/store/items/minimal-dashboard/';

export const PATH_FREE_VERSION = 'https://mui.com/store/items/minimal-dashboard-free/';

export const PATH_FIGMA_PREVIEW =
  'https://www.figma.com/file/rWMDOkMZYw2VpTdNuBBCvN/%5BPreview%5D-Minimal-Web.26.11.22?node-id=0%3A1&t=ya2mDFiuhTXXLLF1-1';
