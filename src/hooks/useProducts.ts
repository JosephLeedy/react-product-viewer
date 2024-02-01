import {useEffect, useState} from 'react'
import type Product from '../types/Product'
import type {ProductsResponse} from '../types/Product'

type UseProducts = {
    isLoadingProducts: boolean
    products: Product[]
    errorMessage: string
}

export default function useProducts(): UseProducts {
    const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true)
    const [products, setProducts] = useState<Product[]>([])
    const [errorMessage, setErrorMessage] = useState<string>('')
    const loadProducts = async (): Promise<void> => {
        await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/catalog/products/`
                + 'searchCriteria[filterGroups][0][filters][0][field]=type_id'
                + '&searchCriteria[filterGroups][0][filters][0][value]=configurable,bundle,grouped'
                + '&searchCriteria[filterGroups][0][filters][0][condition_type]=nin'
            ).then(async (response: Response): Promise<void> => {
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
        loadProducts()
    }, [])

    return {
        isLoadingProducts,
        products,
        errorMessage
    }
}
