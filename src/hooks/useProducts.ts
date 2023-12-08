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
        await fetch('/data/products.json')
            .then(async (response: Response): Promise<void> => {
                if (!response.ok) {
                    throw new Error(`${response.status} ${response.statusText}`);
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
