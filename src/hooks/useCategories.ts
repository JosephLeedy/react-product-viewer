import {useEffect, useState} from 'react'
import Category from '../types/Category'

interface UseCategories {
    isLoadingCategories: boolean;
    rootCategory: Category
}

export default function useCategories(): UseCategories {
    const defaultCategory: Category = {
        id: 0,
        parent_id: 0,
        name: '',
        is_active: true,
        position: 0,
        level: 1,
        product_count: 0,
        children_data: []
    };
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false)
    const [rootCategory, setRootCategory] = useState<Category>(defaultCategory)
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
