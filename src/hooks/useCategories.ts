import {useEffect, useState} from 'react'
import type Category from '../types/Category'

type UseCategories = {
    isLoadingCategories: boolean
    categories: Category[]
}

export default function useCategories(): UseCategories {
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true)
    const [categories, setCategories] = useState<Category[]>([])
    const loadCategories = async (): Promise<void> => {
        await fetch('/data/categories.json')
            .then(async (response: Response): Promise<void> => {
                let rootCategory: Category

                if (!response.ok) {
                    throw new Error(`Could not load categories. Response: ${response.status} ${response.statusText}`);
                }

                rootCategory = await response.json() as Category

                setCategories(rootCategory.children_data)
            }).catch((error: Error): void => {
                console.log(error)
            }).finally((): void => {
                setIsLoadingCategories(false)
            })
    }

    useEffect((): void => {
        loadCategories()
    }, [])

    return {
        isLoadingCategories,
        categories
    }
}
