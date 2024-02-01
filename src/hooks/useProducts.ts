import {useEffect, useState} from 'react'
import type Product from '../types/Product'
import type {ProductsResponse} from '../types/Product'

type UseProducts = {
    isLoadingProducts: boolean
    products: Product[]
    errorMessage: string
}

export default function useProducts(categoryId: number, page: number = 1, limit: number = 30): UseProducts {
    const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true)
    const [products, setProducts] = useState<Product[]>([])
    const [errorMessage, setErrorMessage] = useState<string>('')
    const loadProducts = async (): Promise<void> => {
        const products: Product[] = []
        let currentPage: number = page
        let apiUrl: string
        let response: Response
        let productsResponse: ProductsResponse
        let totalPages: number = 1

        setErrorMessage('')
        setIsLoadingProducts(true)

        do {
            apiUrl = `${import.meta.env.VITE_BACKEND_URL}/catalog/products/`

            if (categoryId !== 0) {
                apiUrl += 'searchCriteria[filterGroups][0][filters][0][field]=category_id'
                    + `&searchCriteria[filterGroups][0][filters][0][value]=${categoryId}`
                    + '&'
            }

            apiUrl += `searchCriteria[filterGroups][1][filters][0][field]=type_id`
                + `&searchCriteria[filterGroups][1][filters][0][value]=configurable,bundle,grouped`
                + `&searchCriteria[filterGroups][1][filters][0][condition_type]=nin`
                + `&searchCriteria[pageSize]=${limit}`
                + `&searchCriteria[currentPage]=${currentPage}`

            try {
                response = await fetch(apiUrl)

                if (!response.ok) {
                    setErrorMessage(`Could not load products. Error: "${response.status} ${response.statusText}"`)

                    break
                }

                productsResponse = await response.json() as ProductsResponse

                if (productsResponse.items.length === 0) {
                    break
                }

                products.push(...productsResponse.items)

                totalPages = Math.ceil(productsResponse.total_count / limit)

                currentPage++
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setErrorMessage(`Could not load products. Error: "${error.message}"`)
                } else {
                    console.error(error)
                }

                break
            }
        } while (currentPage <= totalPages)

        if (products.length > 0 && errorMessage.length === 0) {
            setProducts(products)
        }

        setIsLoadingProducts(false)
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
