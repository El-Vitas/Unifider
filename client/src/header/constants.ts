export const menuType = {
  Dropdown: 'Dropdown',
  Link: 'Link',
} as const;

export type MenuTypeEnum = typeof menuType[keyof typeof menuType];
