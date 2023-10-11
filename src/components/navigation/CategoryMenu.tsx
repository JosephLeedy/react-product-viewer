import React, {useEffect, useState} from 'react'
import Spinner from 'react-bootstrap/Spinner'
import {convertTitleToUri} from '../../utilites/UriConverter'

export interface Category {
    id: number;
    parent_id: number;
    name: string;
    is_active: boolean;
    position: number;
    level: number;
    product_count: number;
    children_data: Category[];
}

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

export default function CategoryMenu(): React.JSX.Element {
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
    const renderCategoryMenuItems = (
        category: Category,
        isDropdownItem: boolean = false,
        uriSegments: string[] = []
    ) => {
        const hasChildren: boolean = category.children_data.length > 0

        uriSegments.push(convertTitleToUri(category.name))

        return (
            <li key={category.id} className={`nav-item` + (hasChildren ? ' dropdown' : '')}>
                <a href={`#${uriSegments.join('/')}`}
                   className={
                       `nav-link` + (hasChildren ? ' dropdown-toggle' : '') + (isDropdownItem ? ' dropdown-item' : '')
                   }
                   {...(hasChildren && {
                       "role": "button",
                       "data-bs-toggle": "dropdown",
                       "aria-expanded": false
                   })}
                >{category.name}</a>
                {hasChildren &&
                    <ul className="dropdown-menu">
                        {
                            category.children_data.map((childCategory: Category) => {
                                const categorySubMenu: React.JSX.Element = renderCategoryMenuItems(
                                    childCategory,
                                    true,
                                    uriSegments
                                )

                                uriSegments.splice(-1)

                                return categorySubMenu
                            })
                        }
                    </ul>
                }
            </li>
        )
    }

    useEffect((): void => {
        loadCategories().catch(console.log)
    }, [])

    return (
        <>
            {
                isLoadingCategories ?
                    <Spinner animation="border" role="status" data-testid="categories-loading-indicator">
                        <span className="visually-hidden">Loading categories...</span>
                    </Spinner>
                    :
                    <ul className="navbar-nav me-auto" data-testid="category-menu">
                        {rootCategory.children_data.map((category: Category) => renderCategoryMenuItems(category))}
                    </ul>
            }
        </>
    )
}
