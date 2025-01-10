export interface ActivityData {
    id: number;
    name: string;
    nafCode: string;
    completed: boolean;
}

export interface SubcategoryData {
    id: number;
    name: string;
    isCollapsed: boolean;
    completed: boolean;
    indeterminate: boolean;
    activities: ActivityData[];
}

export interface CategoryData {
    id: number;
    name: string;
    isCollapsed: boolean;
    completed: boolean;
    indeterminate: boolean;
    subcategories: SubcategoryData[];
}