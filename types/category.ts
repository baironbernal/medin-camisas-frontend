export type Category = {
  id: number | string;
  name: string;
  slug?: string | null;
  children_recursive?: Category[] | null;
};

