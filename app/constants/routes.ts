export const ROUTES = {
  STYLES_INDEX: '/management/styles',
  STYLES_CREATE: '/management/styles/create',
  STYLES_EDIT: '/management/styles/edit',
  DEPARTMENT_INDEX: '/management/departments',
  DEPARTMENT_CREATE: '/management/departments/create',
  DEPARTMENT_EDIT: '/management/departments/edit',
  USERS: {
    INDEX: '/administration/users',
    CREATE: '/administration/users/create',
    EDIT: '/administration/users/edit'
  },
  PROCESS: {
    INDEX: '/management/processes',
    CREATE: '/management/processes/create',
    EDIT: '/management/processes/edit'
  },
  BUYER: {
    INDEX: '/management/buyers',
    CREATE: '/management/buyers/create',
    EDIT: '/management/buyers/edit'
  },
  OPERATORS: {
    INDEX: '/management/operators',
    CREATE: '/management/operators/create',
    EDIT: '/management/operators/edit'
  },
  SECTION: {
    INDEX: '/management/sections',
    CREATE: '/management/sections/create',
    EDIT: '/management/sections/edit'
  },
  DEPARTMENTS: {
    INDEX: '/management/departments',
    CREATE: '/management/departments/create',
    EDIT: '/management/departments/edit'
  },
  PROCESS_OFFSETS: {
    INDEX: '/management/process-offset',
    CREATE: '/management/process-offset/create',
    EDIT: '/management/process-offset/edit'
  },
  SHIFTS: {
    INDEX: '/management/shifts',
    CREATE: '/management/shifts/create',
    EDIT: '/management/shifts/edit'
  },
  BUNDLES: {
    INDEX: '/operations/bundles',
    CREATE: '/operations/bundles/create',
    EDIT: '/operations/bundles/edit'
  },
  PRODUCTION_OPERATION: {
    INDEX: 'production-operations'
  },
  ROUTE_PATH_LOGIN: '/login',

  REPORTS: {
    PRODUCTION_DAILY_OUTPUT: {
      INDEX: 'daily-production-output'
    },
    SYSTEM_AUDIT: {
      INDEX: 'system-audit'
    },
    SECTION_HOURLY_EFFICIENCY: {
      INDEX: 'section-hourly-efficiency'
    }
  },
  BUNDLE_FLOW: {
    INDEX: 'bundle-flow'
  }
};

export const PUBLIC_ROUTES = ['/', '/login', '/kiosk'];
