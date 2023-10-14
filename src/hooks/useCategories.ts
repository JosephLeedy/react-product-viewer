import {useEffect, useState} from 'react'
import Category, {DefaultCategory} from '../types/Category'

interface UseCategories {
    isLoadingCategories: boolean;
    rootCategory: Category
}

export default function useCategories(): UseCategories {
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false)
    const [rootCategory, setRootCategory] = useState<Category>(DefaultCategory)
    const loadCategories = async (): Promise<void> => {
        setIsLoadingCategories(true)

        const response: Response = await fetch('/data/categories.json')

        setIsLoadingCategories(false)

        if (!response.ok) {
            throw new Error(`Could not load categories. Response: ${response.status} ${response.statusText}`);
        }

        setRootCategory(await response.json())
    }

    useEffect((): void => {
        loadCategories().catch(console.log)
    }, [])

    return {
        isLoadingCategories,
        rootCategory
    }
}
