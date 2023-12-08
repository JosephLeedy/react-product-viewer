import {filterComplexProducts} from './productFilter'
import type Product from '../types/Product'
import type {
    BundleProductLink,
    BundleProductOption,
    CustomProductAttribute,
    MediaGalleryEntry,
    ProductLink
} from '../types/Product'
import {
    MediaGalleryEntryType,
    LinkType,
    ProductTypeId,
    ProductVisibility
} from '../types/Product'
import type ProductPaginationResult from '../types/ProductPaginationResult'

export function getCustomAttribute(product: Product, attributeCode: string): string | string[] {
    const customAttribute: CustomProductAttribute | undefined = product.custom_attributes.find(
        (customAttribute: CustomProductAttribute): boolean => customAttribute.attribute_code === attributeCode
    )

    return customAttribute?.value ?? ''
}

export function getProductName(product: Product): string {
    return new DOMParser().parseFromString(product.name, 'text/html').documentElement.textContent ?? product.name
}

export function getProductDescription(product: Product): string {
    let productDescription: string = getCustomAttribute(product, 'description') as string;

    // Get the first paragraph from the product description
    productDescription = productDescription.replace(/^<p>([^<]+)<\/p>.*$/s, '$1')
    // Strip HTML tags from the first paragraph
    productDescription = new DOMParser().parseFromString(productDescription, 'text/html').documentElement.textContent
        || productDescription

    return productDescription
}

export function getProductImageUrl(product: Product): string {
    const baseImageUrl: string = import.meta.env.VITE_MAGENTO_IMAGE_URL.replace(/\/$/, '')
    const mediaGalleryEntry: MediaGalleryEntry | undefined = product.media_gallery_entries.find(
        (mediaGalleryEntry: MediaGalleryEntry): boolean =>
            mediaGalleryEntry.media_type === MediaGalleryEntryType.Image && !mediaGalleryEntry.disabled
    )

    if (mediaGalleryEntry === undefined) {
        return import.meta.env.VITE_MAGENTO_PLACEHOLDER_IMAGE_URL
    }

    return baseImageUrl + mediaGalleryEntry.file
}

export function getProductUrl(product: Product, products: Product[]): string {
    const baseProductUrl: string = import.meta.env.VITE_MAGENTO_BASE_URL.replace(/\/$/, '')
    const urlExtension: string = import.meta.env.VITE_MAGENTO_URI_SUFFIX
    let productUrlKey: string = ''
    let parentProduct: Product | undefined

    if (product.visibility !== ProductVisibility.NotVisibleIndividually) {
        productUrlKey = getCustomAttribute(product, 'url_key') as string
    } else {
        parentProduct = getParentProduct(product, products)

        if (parentProduct !== undefined) {
            productUrlKey = getCustomAttribute(parentProduct, 'url_key') as string
        }
    }

    if (productUrlKey === '') {
        return baseProductUrl
    }

    return baseProductUrl + '/' + productUrlKey + urlExtension
}

export function getParentProduct(product: Product, products: Product[]): Product | undefined {
    const complexProducts: Product[] = filterComplexProducts(products)

    return complexProducts.find((complexProduct: Product): boolean => {
        if (complexProduct.type_id === ProductTypeId.Configurable) {
            return complexProduct.extension_attributes.configurable_product_links!.includes(product.id)
        }

        if (complexProduct.type_id === ProductTypeId.Grouped) {
            return complexProduct.product_links.some(
                (productLink: ProductLink): boolean => (
                    productLink.link_type === LinkType.Associated && productLink.linked_product_sku === product.sku
                )
            )
        }

        if (complexProduct.type_id === ProductTypeId.Bundle) {
            return complexProduct.extension_attributes.bundle_product_options!.flatMap(
                (bundleProductOption: BundleProductOption): BundleProductLink[] => bundleProductOption.product_links
            ).some((productLink: BundleProductLink): boolean => productLink.sku === product.sku)
        }

        return false
    })
}

export function getSalePrice(product: Product): number | undefined {
    let specialPrice: string = getCustomAttribute(product, 'special_price') as string

    if (specialPrice === '') {
        return undefined
    }

    return parseFloat(specialPrice)
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat(
        'en-US',
        {
            style: 'currency',
            currency: 'USD'
        }
    ).format(price)
}

export function paginateProducts(products: Product[], currentPage: number): ProductPaginationResult {
    const productsPerPage: number = 30
    const productCount: number = products.length
    let startingProductIndex: number = (currentPage - 1) * productsPerPage
    let endingProductIndex: number = currentPage * productsPerPage

    return {
        paginatedProducts: products.slice(startingProductIndex, endingProductIndex),
        productCount: productCount,
        pageCount: Math.ceil(productCount / productsPerPage),
        startingProductIndex: startingProductIndex,
        endingProductIndex: endingProductIndex
    }
}
