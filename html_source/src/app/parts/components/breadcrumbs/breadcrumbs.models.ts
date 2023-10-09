export interface BreadcrumbItem {
  routerLink?: string;
  title: string | Array<string>;
}

export type BreadcrumbItems = Array<BreadcrumbItem>;
