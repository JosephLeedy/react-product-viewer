import {useEffect, useState} from 'react'
import Category, {DefaultCategory} from '../types/Category'

interface UseCategories {
    isLoadingCategories: boolean;
    rootCategory: Category
}

export default function useCategories(): UseCategories {
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true)
    const [rootCategory, setRootCategory] = useState<Category>(DefaultCategory)
    const loadCategories = async (): Promise<void> => {
        await fetch('/data/categories.json')
            .then(async (response: Response): Promise<void> => {
                if (!response.ok) {
                    throw new Error(`Could not load categories. Response: ${response.status} ${response.statusText}`);
                }

                setRootCategory(await response.json())
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
        rootCategory
    }
}
