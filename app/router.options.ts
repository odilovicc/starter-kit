import type { RouterConfig } from "nuxt/schema";
import { RouterPaths } from "~/types/router";

export default <RouterConfig>{
    routes: (_routes) => {
        return [
            {
                path: "/",
                name: RouterPaths.DASHBOARD,
                component: () => import('~/pages/index.vue'),
            },
            {
                path: "/test",
                name: RouterPaths.DEV_TEST,
                component: () => import('~/pages/dev/test.vue'),
            },
            {
                path: '/auth/',
                component: () => import('~/pages/auth/layout.vue'),
                redirect: RouterPaths.LOGIN,
                meta: {
                    layout: "auth"
                },
                children: [
                    {
                        path: 'login',
                        component: () => import('~/pages/auth/login/index.vue'),
                        name: RouterPaths.LOGIN,
                    },
                    {
                        path: 'register',
                        component: () => import('~/pages/auth/register/index.vue'),
                        name: RouterPaths.REGISTER,
                    }
                ]
            }
        ];
    }
}