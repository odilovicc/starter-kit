<template>
    <div class="app-dropdown-container">
        <button :class="[{'app-dropdown-button': true, 'app-focus': isOpen}, `app-dropdown-${dropType}`]" @click="openDropdown">
            <span class="app-dropdown-label">{{ props.label }}</span>
            <AppIcon :icon="defineDropdownIcon"/>
        </button>
        <div class="app-dropdown-options" id="appDropdownOptions"></div>
    </div>
    <Teleport to="#appDropdownOptions">
        <div class="app-dropdown-content" v-if="isOpen">
            <div class="app-dropdown-option" v-for="el in props.list" @click="onClickOption(el.value)">
                <span class="app-dropdown-option-label">{{ el.label }}</span>
            </div>
        </div>
    </Teleport>
</template>
<script setup lang="ts">
import type { IDropdownList } from '~/types/form';

const props = defineProps<{
    label?: string,
    arrowIcon?: string,
    list?: IDropdownList[]
    dropType?: 'no-border' | any,
}>()
const emits = defineEmits(["clickOption"])

const isOpen = ref<boolean>(false)
const defineDropdownIcon = computed(() => {
    if (!isOpen.value) return !!props.arrowIcon ? props.arrowIcon : 'chevron-up'
    return "chevron-down"
})

function onClickOption(value: any) {
    emits("clickOption", value)
    console.log(value)
    isOpen.value = false
}

function openDropdown() {
    isOpen.value = !isOpen.value
}
</script>
<style src="~/assets/stylus/components/ui/dropdown.styl"></style>