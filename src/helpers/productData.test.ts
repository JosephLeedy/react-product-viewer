import {
    formatPrice,
    getCustomAttribute,
    getParentProduct,
    getProductDescription,
    getProductImageUrl,
    getProductName,
    getProductUrl,
    getSalePrice,
    paginateProducts
} from './productData'
import type Product from '../types/Product'
import type ProductPaginationResult from '../types/ProductPaginationResult'
import productData from '../test/data/products.json'

const products: Product[] = productData.items as Product[]

describe('Product Data Helpers', (): void => {
    describe('Get Custom Attribute', (): void => {
        it('returns a value for a given custom attribute', (): void => {
            const product: Product = products.find((product: Product): boolean => product.id === 126) as Product
            const expectedCustomAttributeValue: string = '158,38,37'
            const actualCustomAttributeValue: string = getCustomAttribute(product, 'material') as string

            expect(actualCustomAttributeValue).not.toBeEmpty()
            expect(actualCustomAttributeValue).toEqual(expectedCustomAttributeValue)
        })
    })

    describe('Get Product Name', (): void => {
        it('returns the name of a given product', (): void => {
            const product: Product = products.find((product: Product): boolean => product.id === 126) as Product
            const expectedProductName: string = product.name
            const actualProductName: string = getProductName(product)

            expect(actualProductName).toEqual(expectedProductName)
        })
    })

    describe('Get Product Description', (): void => {
        it('returns the description of a given product', (): void => {
            const product: Product = products.find((product: Product): boolean => product.id === 126) as Product
            const expectedProductDescription: string = "Kick off your weekend in the Hollister Backyard Sweatshirt. "
                 + "Whether you're raking leaves or flipping burgers, this comfy layer blocks the bite of the crisp "
                 + "autumn air. Puffy thick from hood to hem, it traps heat against your core."
            const actualProductDescription: string = getProductDescription(product)

            expect(actualProductDescription).toEqual(expectedProductDescription)
        })
    })

    describe('Get Product Image URL', (): void => {
        it('returns the image URL for a given product', (): void => {
            const product: Product = products.find((product: Product): boolean => product.id === 126) as Product
            const expectedProductImageUrl: string = import.meta.env.VITE_MAGENTO_IMAGE_URL.replace(/\/$/, '')
                + '/m/h/mh05-white_main_1.jpg'
            const actualProductImageUrl: string = getProductImageUrl(product)

            expect(actualProductImageUrl).toEqual(expectedProductImageUrl)
        })

        it("returns the placeholder image URL if a given product doesn't have an image", (): void => {
            const product: Product = products.find((product: Product): boolean => product.id === 2043) as Product
            const expectedProductImageUrl: string = import.meta.env.VITE_MAGENTO_PLACEHOLDER_IMAGE_URL
            const actualProductImageUrl: string = getProductImageUrl(product)

            expect(actualProductImageUrl).toEqual(expectedProductImageUrl)
        })
    })

    describe('Get Product URL', (): void => {
        it('returns the URL for a given visible product', (): void => {
            const product: Product = products.find((product: Product): boolean => product.id === 2042) as Product
            const expectedProductUrl: string = import.meta.env.VITE_MAGENTO_BASE_URL.replace(/\/$/, '')
                + '/luma-virtual-gift-card' + import.meta.env.VITE_MAGENTO_URI_SUFFIX
            const actualProductUrl: string = getProductUrl(product, products)

            expect(actualProductUrl).toEqual(expectedProductUrl)
        })

        it('returns the parent product URL for a given invisible product', (): void => {
            const product: Product = products.find((product: Product): boolean => product.id === 123) as Product
            const expectedProductUrl: string = import.meta.env.VITE_MAGENTO_BASE_URL.replace(/\/$/, '')
                + '/hollister-backyard-sweatshirt' + import.meta.env.VITE_MAGENTO_URI_SUFFIX
            const actualProductUrl: string = getProductUrl(product, products)

            expect(actualProductUrl).toEqual(expectedProductUrl)
        })

        it("returns the base Magento URL if a given product doesn't have a URL key", (): void => {
            const product: Product = products.find((product: Product): boolean => product.id === 1) as Product
            const expectedProductUrl: string = import.meta.env.VITE_MAGENTO_BASE_URL.replace(/\/$/, '')
            let actualProductUrl: string

            product.custom_attributes[4].value = ''

            actualProductUrl = getProductUrl(product, products)

            expect(actualProductUrl).toEqual(expectedProductUrl)
        })
    })

    describe('Get Parent Product', (): void => {
        it.each([
            {
                childId: 123,
                parentId: 126,
                parentType: 'configurable'
            },
            {
                childId: 35,
                parentId: 45,
                parentType: 'grouped'
            },
            {
                childId: 22,
                parentId: 46,
                parentType: 'bundle'
            }
        ])('returns the parent $parentType product of a given product', ({childId, parentId}): void => {
            const product: Product = products.find((product: Product): boolean => product.id === childId) as Product
            const expectedParentProduct: Product = products.find(
                (product: Product): boolean => product.id === parentId
            ) as Product
            const actualParentProduct: Product | undefined = getParentProduct(product, products)

            expect(actualParentProduct).toEqual(expectedParentProduct)
        })

        it(`returns undefined if the given product doesn't have a parent product`, (): void => {
            const product: Product = products.find((product: Product): boolean => product.id === 2042) as Product
            const parentProduct: Product | undefined = getParentProduct(product, products)

            expect(parentProduct).toBeUndefined()
        })
    })

    describe('Get Sale Price', (): void => {
        it('returns the special price for a given product', (): void => {
            const product: Product = products.find((product: Product): boolean => product.id === 1) as Product
            const expectedSalePrice: number = 29.99
            const actualSalePrice: number | undefined = getSalePrice(product)

            expect(actualSalePrice).toEqual(expectedSalePrice)
        })

        it(`returns undefined if a given product doesn't have a sale price`, (): void => {
            const product: Product = products.find((product: Product): boolean => product.id === 2044) as Product
            const salePrice: number | undefined = getSalePrice(product)

            expect(salePrice).toBeUndefined()
        })
    })

    describe('Format Product Price', (): void => {
        it('returns a given product price formatted as US currency', (): void => {
            const product: Product = products.find((product: Product): boolean => product.id === 29) as Product
            const expectedFormattedProductPrice: string = '$27.00'
            const actualFormattedProductPrice: string = formatPrice(product.price)

            expect(actualFormattedProductPrice).toEqual(expectedFormattedProductPrice)
        })
    })

    describe('Paginate Products', (): void => {
        it('returns pagination data for the first page of a given set of products', (): void => {
            const expectedProductPaginationResult: ProductPaginationResult = {
                paginatedProducts: products.slice(0, 30),
                productCount: 37,
                pageCount: 2,
                startingProductIndex: 0,
                endingProductIndex: 30
            }
            const actualProductPaginationResult: ProductPaginationResult = paginateProducts(products, 1)

            expect(actualProductPaginationResult).toEqual(expectedProductPaginationResult)
        })
    })
})
