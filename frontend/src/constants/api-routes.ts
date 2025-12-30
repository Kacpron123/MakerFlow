export const API_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  STATS: '/stats',
  ME:{
    ME: '/auth/me',
    EDIT_USERNAME: "/auth/me/username",
    EDIT_PASSWORD: "/auth/me/password"
  },
  PRODUCTS: {
    GET_ALL: '/products',
    CREATE: '/products',
    DETAIL: (id: number) => `/products/${id}`,
    STOCK: (id: number) => `/products/${id}/stock`,
  },
} as const;