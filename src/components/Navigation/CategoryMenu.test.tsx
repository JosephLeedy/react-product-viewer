import {render, screen} from '@testing-library/react'
import CategoryMenu from './CategoryMenu'
import {CategoriesContextProvider} from '../../contexts/CategoriesContext'
import type Category from '../../types/Category'
import categories from '../../test/data/categories.json'

describe('Category Menu Component', (): void => {
    it('renders fetched categories as menu items', async (): Promise<void> => {
        const filterCategories = (unfilteredCategories: Category[]) => unfilteredCategories.filter(
            (category: Category): boolean => {
                if (!category.is_active) {
                    return false
                }

                if (category.children_data.length > 0) {
                    category.children_data = filterCategories(category.children_data)
                }

                if (!(category.children_data.length > 0) && category.product_count === 0) {
                    return false
                }

                return true
            }
        )
        const filteredCategories: Category[] = filterCategories(categories.children_data)
        const categoryNames: string[] = []
        const getCategoryNames = (category: Category): void => {
            categoryNames.push(category.name)

            if (category.children_data.length > 0) {
                category.children_data.forEach(getCategoryNames)
            }
        }
        let categoryMenu: HTMLElement
        let categoryName: string

        render(
            <CategoriesContextProvider isLoadingCategories={false} categories={categories.children_data}>
                <CategoryMenu/>
            </CategoriesContextProvider>
        )

        categoryMenu = await screen.findByTestId('category-menu')

        filteredCategories.forEach(getCategoryNames)

        expect(categoryMenu).toBeInTheDocument()
        expect(categoryMenu.children).toHaveLength(filteredCategories.length)

        for (categoryName of categoryNames) {
            expect(screen.getByText(categoryName)).toBeInTheDocument()
        }
   })
})