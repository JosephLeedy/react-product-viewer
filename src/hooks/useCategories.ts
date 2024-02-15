import {useEffect, useState} from 'react'
import type Category from '../types/Category'

type UseCategories = {
    isLoadingCategories: boolean
    categories: Category[]
    errorMessage: string
}

export default function useCategories(): UseCategories {
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true)
    const [categories, setCategories] = useState<Category[]>([])
    const [errorMessage, setErrorMessage] = useState<string>('')
    const loadCategories = async (): Promise<void> => {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/catalog/categories`)
            .then(async (response: Response): Promise<void> => {
                let rootCategory: Category
                let responseMessage: string | null = null

                if (!response.ok) {
                    responseMessage = (await response.json()).message ?? null

                    if (responseMessage !== null) {
                        setErrorMessage(`Could not load categories. Error: "${responseMessage}"`)
                    } else {
                        setErrorMessage(
                            `Could not load categories. Response: ${response.status} ${response.statusText}`
                        )
                    }

                    setIsLoadingCategories(false)

                    return
                }

                rootCategory = await response.json() as Category

                setCategories(rootCategory.children_data)
            }).catch((error: Error): void => {
                setErrorMessage(`Could not load categories. Error: "${error.message}"`)
            }).finally((): void => {
                setIsLoadingCategories(false)
            })
    }

    useEffect((): void => {
        loadCategories()
    }, [])

    return {
        isLoadingCategories,
        categories,
        errorMessage
    }
}
