import axios from 'axios';

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import TokenService from '../services/TokenService';
import { API_PUBLIC_ROUTES } from '../constants/api-routes';
import { RESPONSE_SERVICE_UNAVAILABLE, RESPONSE_UNAUTHORIZED } from '../constants/messages';
import AuthService from '../services/AuthService';
import { env } from '../config';

const apiClient: AxiosInstance = axios.create({
  baseURL: env.api.url,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = TokenService.getAuthToken();
    const isLoggedIn = TokenService.getAuthToken() ? true : false;
    if (config.headers) {
      if (isLoggedIn) config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['Accept'] = 'application/json';
    }
    return config as any;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (res: AxiosResponse) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    // Added false in the condition to disable refresh token temporarily
    // TODO: remove refreshTokenEnabled in the condition to enable refresh access token
    const refreshTokenEnabled = false;
    if (!API_PUBLIC_ROUTES.includes(originalConfig.url) && err.response) {
      if (err.response.status === RESPONSE_SERVICE_UNAVAILABLE) {
        // Handle maintenance mode
      } else if (err.response.status === RESPONSE_UNAUTHORIZED && !originalConfig._retry) {
        // Access Token was expired
        originalConfig._retry = true;
        if (refreshTokenEnabled) {
          try {
            const { data } = await AuthService.refreshToken({
              refreshToken: TokenService.getRefreshToken()
            });

            TokenService.setAuthToken(data.token);

            return apiClient(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
        return AuthService.logout(false);
      }
    }

    return Promise.reject(err);
  }
);

export default apiClient;
