import Product, {CategoryLink, ProductStatus, ProductTypeId} from '../types/Product'

export function filterEnabledProducts(productsToFilter: Product[]): Product[] {
    return productsToFilter.filter((product: Product): boolean => product.status === ProductStatus.Enabled)
}

export function filterUncomplexProducts(productsToFilter: Product[]): Product[] {
    const uncomplexProductTypes: ProductTypeId[] = [
        ProductTypeId.Simple,
        ProductTypeId.Virtual,
        ProductTypeId.Downloadable,
        ProductTypeId.GiftCard
    ]

    return productsToFilter.filter((product: Product): boolean => uncomplexProductTypes.includes(product.type_id))
}

export function filterComplexProducts(productsToFilter: Product[]): Product[] {
    const complexProductTypes: ProductTypeId[] = [
        ProductTypeId.Configurable,
        ProductTypeId.Grouped,
        ProductTypeId.Bundle
    ]

    return productsToFilter.filter((product: Product): boolean => complexProductTypes.includes(product.type_id))
}

export function filterProductsByCategoryId(productsToFilter: Product[], categoryId: number): Product[] {
    return productsToFilter.filter((product: Product): boolean => {
        let categoryLink: CategoryLink | undefined

        if (!product.extension_attributes.category_links?.length) {
            return false
        }

        categoryLink = product.extension_attributes.category_links.find(
            (categoryLink: CategoryLink): boolean => parseInt(categoryLink.category_id, 10) === categoryId
        )

        return categoryLink !== undefined;
    })
}

export function filterProductsByName(productsToFilter: Product[], name: string): Product[] {
    return productsToFilter.filter(
        (product: Product): boolean => product.name.toLowerCase().includes(name.toLowerCase())
    )
}

export function filterProductsBySku(productsToFilter: Product[], sku: string): Product[] {
    return productsToFilter.filter((product: Product): boolean => product.sku.toLowerCase().includes(sku.toLowerCase()))
}

export function filterProductsByNameOrSku(productsToFilter: Product[], nameOrSku: string): Product[] {
    const productsFilteredByName: Product[] = filterProductsByName(productsToFilter, nameOrSku)
    const productsFilteredBySku: Product[] = filterProductsBySku(productsToFilter, nameOrSku)

    return [
        ...productsFilteredByName.filter(
            (product0: Product): boolean => !productsFilteredBySku.some(
                (product1: Product): boolean => product0.id === product1.id
            )
        ),
        ...productsFilteredBySku
    ]
}
