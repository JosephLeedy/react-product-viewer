import {convertTitleToUri} from './UriConverter'
import Category from '../types/Category'

export function findCategoryByLocationHash(
    searchCategories: Category[],
    locationHashSegments: string[]
): Category | null {
    let foundCategory: Category | null = searchCategories.find(
        (currentCategory: Category): boolean => convertTitleToUri(currentCategory.name) === locationHashSegments[0]
    ) ?? null

    if (foundCategory === null) {
        return foundCategory
    }

    locationHashSegments.shift()

    if (locationHashSegments.length > 0 && foundCategory.children_data.length > 0) {
        foundCategory = findCategoryByLocationHash(foundCategory.children_data, locationHashSegments)
    }

    return foundCategory
}

export function findCategoryByName(categoryNameToFind: string, categoriesToSearch: Category[]): Category | null {
    return categoriesToSearch.find((category: Category): Category | null => {
        if (category.name === categoryNameToFind) {
            return category
        }

        if (category.children_data.length > 0) {
            return findCategoryByName(categoryNameToFind, category.children_data)
        }

        return null
    }) ?? null
}
