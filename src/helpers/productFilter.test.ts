import {
    filterComplexProducts,
    filterEnabledProducts,
    filterProductsByCategoryId,
    filterProductsByName,
    filterProductsByNameOrSku,
    filterProductsBySku,
    filterUncomplexProducts
} from './productFilter'
import Product, {ProductStatus, ProductTypeId} from '../types/Product'
import productData from '../test/data/products.json'

const products: Product[] = productData.items as Product[]

describe('Product Filtering Helpers', (): void => {
    describe('Filter Enabled Products', (): void => {
        it('returns only enabled products', (): void => {
            const enabledProducts: Product[] = filterEnabledProducts(products)

            enabledProducts.forEach((product: Product): void => {
                expect(product).toEqual(
                    expect.objectContaining({
                        status: ProductStatus.Enabled
                    })
                )
            })
        })
    })

    describe('Filter Uncomplex Products', (): void => {
        it('returns only simple, virtual, downloadable and gift card products', (): void => {
            const uncomplexProducts: Product[] = filterUncomplexProducts(products)
            const uncomplexProductTypes: ProductTypeId[] = [
                ProductTypeId.Simple,
                ProductTypeId.Virtual,
                ProductTypeId.Downloadable,
                ProductTypeId.GiftCard
            ]

            uncomplexProducts.forEach((product: Product): void => {
                expect(product.type_id).toBeOneOf(uncomplexProductTypes)
            })
        })
    })

    describe('Filter Complex Products', (): void => {
        it('returns only configurable, grouped and bundle products', (): void => {
            const complexProducts: Product[] = filterComplexProducts(products)
            const complexProductTypes: ProductTypeId[] = [
                ProductTypeId.Configurable,
                ProductTypeId.Grouped,
                ProductTypeId.Bundle
            ]

            complexProducts.forEach((product: Product): void => {
                expect(product.type_id).toBeOneOf(complexProductTypes)
            })
        })
    })

    describe('Filter Products by Category ID', (): void => {
        it('returns products within the given category', (): void => {
            const categoryProducts: Product[] = filterProductsByCategoryId(products, 5)

            categoryProducts.forEach((product: Product): void => {
                expect(product.extension_attributes.category_links).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            category_id: "5"
                        })
                    ])
                )
            })
        })
    })

    describe('Filter Products by Name', (): void => {
        it.each([
            {
                matchType: 'fully',
                name: 'Luma Virtual Gift Card',
                matchingIds: [2042]
            },
            {
                matchType: 'partially',
                name: 'Yoga',
                matchingIds: [
                    21,
                    33,
                    34,
                    35,
                    45,
                    46,
                    2044
                ]
            },
        ])('returns products $matchType matching name "$name"', ({name, matchingIds}): void => {
            const expectedProducts: Product[] = products.filter((product: Product) => matchingIds.includes(product.id))
            const matchedProducts: Product[] = filterProductsByName(products, name)

            expect(matchedProducts).not.toBeEmpty()
            expect(matchedProducts).toEqual(expectedProducts)
        })
    })

    describe('Filter Products by SKU', (): void => {
        it.each([
            {
                matchType: 'fully',
                sku: '243-MB09',
                matchingIds: [2042]
            },
            {
                matchType: 'partially',
                sku: '24-WG083',
                matchingIds: [
                    30,
                    31,
                    32
                ]
            },
        ])('returns products $matchType matching SKU "$sku"', ({sku, matchingIds}): void => {
            const expectedProducts: Product[] = products.filter((product: Product) => matchingIds.includes(product.id))
            const matchedProducts: Product[] = filterProductsBySku(products, sku)

            expect(matchedProducts).not.toBeEmpty()
            expect(matchedProducts).toEqual(expectedProducts)
        })
    })

    describe('Filter Products by Name or SKU', (): void => {
        it.each([
            {
                matchType: 'name',
                nameOrSku: 'Luma',
                matchingIds: [
                    2042
                ]
            },
            {
                matchType: 'SKU',
                nameOrSku: '24-WG083',
                matchingIds: [
                    30,
                    31,
                    32
                ]
            },
            {
                matchType: 'name or SKU',
                nameOrSku: 'bl',
                matchingIds: [
                    2045,
                    26,
                    29,
                    32
                ]
            },
        ])('returns products matching the $matchType "$nameOrSku"', ({nameOrSku, matchingIds}): void => {
            const expectedProducts: Product[] = products.filter((product: Product) => matchingIds.includes(product.id))
            const matchedProducts: Product[] = filterProductsByNameOrSku(products, nameOrSku)

            matchedProducts.sort((product0: Product, product1: Product) => product0.id - product1.id)

            expect(matchedProducts).not.toBeEmpty()
            expect(matchedProducts).toEqual(expectedProducts)
        })
    })
})
