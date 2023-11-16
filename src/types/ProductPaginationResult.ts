import Product from './Product'

export default interface ProductPaginationResult {
    paginatedProducts: Product[]
    productCount: number
    pageCount: number
    startingProductIndex: number
    endingProductIndex: number
}
