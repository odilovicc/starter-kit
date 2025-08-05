import { useStorageAsync } from '@vueuse/core';
import { useMainStore } from '~/stores/main';
import { type IApiOptions, type IServiceResponse, type IServiceError} from '~/types/api';
import { generateUniqueKey, getField } from '~/utils/helpers';

export const AUTH_TOKEN_COOKIE_KEY = "USER_TOKEN"

export const useApi = (options?: IApiOptions) => {
  const getActiveBaseUrl = () => process.env.NUXT_API_URL;
  const accessToken = useStorageAsync<string | null>(
    AUTH_TOKEN_COOKIE_KEY,
    null,
  );

  const onResponse = ({ response }) => {
    return response._data;
  };

  async function fetchDataClient<
    RData = IServiceResponse,
    RError = IServiceError,
  >(
    endpoint: string,
    params: Record<string, any> = {},
    method: 'GET' | 'POST' | 'DELETE' = 'GET',
  ): Promise<RData> {
    return new Promise(async (resolve, reject) => {
      await accessToken.ready;
      const token = `Bearer ${accessToken.value}`;
      const headers: Record<string, string> = {};
      if (token) {
        headers.authorization = token;
      }
      const key = generateUniqueKey();
      $fetch(endpoint, {
        key,
        baseURL: getActiveBaseUrl(),
        method,
        params: method === 'GET' ? params : undefined,
        body: method === 'POST' ? params : undefined,
        headers,
        onResponse,
      })
        .then((response) => {
          resolve(response as RData);
        })
        .catch((err) => {
          console.error('fetchDataClient', err);
          reject(err.data as RError);
        });
    });
  }

  return {
    fetchDataClient,
  };
};
