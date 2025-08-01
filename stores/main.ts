import { useStorageAsync } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { INotificationItem } from '~/types/helpers';

export const useMainStore = defineStore('main', () => {
  const notifications = ref<any>([]);

  function setNotification(item: INotificationItem) {
    if (!item.life) {
      item.life = 5000;
    }
    item.hideTitle = true;
    notifications.value.push(item);
  }

  function clearNotifications() {
    notifications.value = [];
  }

  return {
    setNotification,
    clearNotifications,
    notifications,
  };
});
