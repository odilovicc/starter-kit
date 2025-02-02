<template>
    <div class="app-navbar-container">
        <div class="app-navbar-logo">KinoNuxt</div>

        <div class="app-navbar-link-container">
            <template v-for="el in navLinks">
                <div class="app-navbar-link" v-if="el.type === 'link'">
                    <AppIcon v-if="!!el.icon" :icon="el.icon"/>
                    <span class="app-navbar-link-label">{{ el.label }}</span>
                </div>
                <AppButton
                    v-else-if="el.type === 'button'"
                    @click="el.onClick"
                    :prefix-icon="el.icon"
                    :label="el.label"
                    class="app-navbar-link-button"
                />
                <AppDropdown
                    v-else-if="el.type === 'dropdown'"
                    :list="el.list"
                    :label="el.label"
                    v-model="selectedMovieType"
                    drop-type="no-border"
                    class="app-navbar-link-dropdown"
                />
            </template>
        </div>
    </div>
</template>
<script setup lang="ts" generic="T">
import { type IDropdownList } from '~/types/form';
import { type INavLinks } from '~/types/helpers';
import type { RouterPaths } from '~/types/router';

const { $router } = useNuxtApp()

const selectedMovieType = ref<IDropdownList>()
const onClickOption = (val: RouterPaths) => $router.push({name: val})

const navLinks = ref<INavLinks[]>([
    {
        type: "link",
        label: "Link",
        icon: "link"
    },
    {
        type: "dropdown",
        label: "123",
        list: [
            {label: "123", value: "123"},
            {label: "123", value: "123"},
        ]
    },
    {
        type: "button",
        label: "123",
        onClick: () => console.log("big dick")
    }
])
</script>
<style src="~/assets/stylus/components/client/navbar.styl"></style>