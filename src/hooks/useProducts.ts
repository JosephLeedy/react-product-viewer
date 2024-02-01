import {useEffect, useState} from 'react'
import type Product from '../types/Product'
import type {ProductsResponse} from '../types/Product'

type UseProducts = {
    isLoadingProducts: boolean
    products: Product[]
    errorMessage: string
}

export default function useProducts(categoryId: number): UseProducts {
    const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true)
    const [products, setProducts] = useState<Product[]>([])
    const [errorMessage, setErrorMessage] = useState<string>('')
    const loadProducts = async (): Promise<void> => {
        let apiUrl: string = `${import.meta.env.VITE_BACKEND_URL}/catalog/products/`

        if (categoryId !== 0) {
            apiUrl += 'searchCriteria[filterGroups][0][filters][0][field]=category_id'
                + `&searchCriteria[filterGroups][0][filters][0][value]=${categoryId}`
                + '&'
        }

        apiUrl += `searchCriteria[filterGroups][1][filters][0][field]=type_id`
            + `&searchCriteria[filterGroups][1][filters][0][value]=configurable,bundle,grouped`
            + `&searchCriteria[filterGroups][1][filters][0][condition_type]=nin`

        await fetch(apiUrl)
            .then(async (response: Response): Promise<void> => {
                if (!response.ok) {
                    throw new Error(`${response.status} ${response.statusText}`)
                }

                setProducts(((await response.json()) as ProductsResponse).items)
            }).catch((error: Error): void => {
                setErrorMessage(`Could not load products. Error: "${error.message}"`)
            }).finally((): void => {
                setIsLoadingProducts(false)
            })
    }

    useEffect((): void => {
        if (categoryId === -1) {
            return
        }

        loadProducts()
    }, [categoryId])

    return {
        isLoadingProducts,
        products,
        errorMessage
    }
}
