export type UIInputItem<T = any> = {
  id: string;
  label: string;
  value: T;
  disabled?: boolean;
};
