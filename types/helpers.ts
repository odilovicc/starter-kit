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

export type INavLinks = ILinkNavLink | IButtonNavLink | IDropdownNavLink;
