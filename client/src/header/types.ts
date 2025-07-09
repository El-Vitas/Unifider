import type { MenuTypeEnum } from "./constants";
import { menuType } from "./constants";

export type BaseMainMenuItem = {
  name: string;
  route: string;
};

export type LinkMainMenuItem = BaseMainMenuItem & {
  type?: Exclude<MenuTypeEnum, 'Dropdown'>;
  dropdownItems?: never;
};

export type DropdownParentMainMenuItem = BaseMainMenuItem & {
  type: typeof menuType.Dropdown;
  dropdownItems: ProfileDropdownItem[];
};

export type MainMenuItem = LinkMainMenuItem | DropdownParentMainMenuItem;

export type BaseDropdownItem = {
  to: string;
  name: string;
};

export type ProfileDropdownItem = BaseDropdownItem & {
  icon?: React.ReactElement;
};

export type RoleType = 'admin' | 'user';