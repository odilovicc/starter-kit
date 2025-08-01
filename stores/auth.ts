import { useStorageAsync } from '@vueuse/core';
import { ref, watch } from 'vue';
import { AUTH_TOKEN_COOKIE_KEY, useApi } from '~/composable/api';
import type { IAuthRegisterFields } from '~/types/auth';
import type { IAnyObject } from '~/types/helpers';
import { type IServiceError } from '~/types/api';

export const useAuthStore = defineStore('auth', () => {
    
    const t = (t: any) => t
    const { fetchDataClient } = useApi();
    const userData = ref();

    const accessToken = useStorageAsync<string | null>(
        AUTH_TOKEN_COOKIE_KEY,
        null,
    );

    const isAuthenticated = ref(true);
    const isVerified = ref(false);
    const userName = ref(t('auth.guest'));

    watch(
        accessToken,
        (newToken) => {
            isAuthenticated.value = !!newToken;
            console.log(
                'accessToken changed:',
                newToken,
                'isAuthenticated:',
                isAuthenticated.value,
            ); // Для отладки
        },
        { immediate: true },
    );

    const setToken = (new_token: string) => {
        accessToken.value = new_token;
        // isAuthenticated обновится автоматически через watch
    };

    const getToken = (prefix: string = '') => {
        return accessToken.value ? `${prefix}${accessToken.value}` : null;
    };

    const removeToken = () => {
        accessToken.value = null;
        // isAuthenticated обновится автоматически через watch
    };

    const setAuthenticated = (bol: boolean) => {
        isAuthenticated.value = bol;
    };

    const registerUser = (payload: IAuthRegisterFields) => {
        return new Promise((resolve, reject) => {
            if (payload.password !== payload.repeat_pass) {
                return reject(t('auth.error_passwords_mismatch')); // Локализованное сообщение
            }

            fetchDataClient(
                '/auth/register',
                {
                    email: payload.email,
                    password: payload.password,
                },
                'POST',
            )
                .then(async (data) => {
                    const token = data.data[0].token;

                    if (!token) {
                        return reject(t('auth.error_no_token')); // Локализованное сообщение
                    }

                    await setToken(token);
                    resolve(data);
                })
                .catch((err: IServiceError) => {
                    console.log(err);
                    let msg;

                    switch (err.messages[0]) {
                        case 'User already exists':
                            msg = t('auth.error_user_exists'); // Локализованное сообщение
                            break;
                        default:
                            msg = t('auth.error_generic'); // Локализованное сообщение по умолчанию
                            break;
                    }
                    reject(msg);
                });
        });
    };

    const loginUser = (payload: IAuthRegisterFields) => {
        return new Promise((resolve, reject) => {
            fetchDataClient('/auth/login', payload, 'POST')
                .then(async (data) => {
                    const token = data.data.access_token;
                    await setToken(token);
                    resolve(data);
                })
                .catch((err) => {
                    console.log(err.message);
                    reject(err.message);
                });
        });
    };

    function getUserData(update: boolean = false) {
        return new Promise<IAnyObject | null>((resolve, reject) => {
            fetchDataClient('/auth/profile', {}, 'GET')
                .then((res) => {
                    if (res.data.name !== null) isVerified.value = true;
                    userName.value = res.data.name || t('auth.guest');
                    userData.value = res.data;
                    resolve(userData.value); // Убираем isAuthenticated.value = true
                })
                .catch((err) => {
                    console.log(err.name);
                    reject(t('auth.error_fetch_profile')); // Локализованное сообщение
                });
        });
    }

    return {
        setToken,
        getToken,
        removeToken,
        registerUser,
        getUserData,
        loginUser,
        setAuthenticated,
        accessToken,
        userData,
        isAuthenticated,
        isVerified,
        userName,
    };
});
