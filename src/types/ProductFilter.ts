export default interface ProductFilter {
    type: ProductFilterType
    value: string
    isUpdated: boolean
}

export enum ProductFilterType {
    Name = 'name',
    SKU = 'sku'
}
