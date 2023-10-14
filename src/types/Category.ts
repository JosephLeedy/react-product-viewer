export default interface Category {
    id: number;
    parent_id: number;
    name: string;
    is_active: boolean;
    position: number;
    level: number;
    product_count: number;
    children_data: Category[];
}

export const DefaultCategory: Category = {
    id: 0,
    parent_id: 0,
    name: '',
    is_active: true,
    position: 0,
    level: 1,
    product_count: 0,
    children_data: []
}
