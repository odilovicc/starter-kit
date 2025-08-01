import type { IDropdownList } from "./form";

interface IBaseNavLink {
    type: 'link' | 'button' | 'dropdown';
    label?: string;
    icon?: string;
}

type INavLink<T = {}> = IBaseNavLink & T;

type ILinkNavLink = INavLink<{ 
    type: 'link' 
}>;

type IButtonNavLink = INavLink<{ 
    type: 'button'; 
    onClick: () => void 
}>;

type IDropdownNavLink = INavLink<{ 
    type: 'dropdown';
    onClick?: () => void; 
    list: IDropdownList[] 
}>;

export interface IAnyObject {
    [key: string]: any
}

export enum NotificationType {
  SUCCESS = 'success',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface INotificationItem {
  type: NotificationType;
  message: string;
  hideTitle?: boolean;
  life?: number;
  detail?: string;
}

export type INavLinks = ILinkNavLink | IButtonNavLink | IDropdownNavLink;
