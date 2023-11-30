import {render, screen} from '@testing-library/react'
import CategoryMenu from './CategoryMenu'
import {CategoriesContextProvider} from '../../contexts/CategoriesContext'
import Category from '../../types/Category'
import categories from '../../test/data/categories.json'

describe('Category Menu Component', (): void => {
    it('renders a loading indicator until categories are fetched', async (): Promise<void> => {
        render(
            <CategoriesContextProvider isLoadingCategories={true} categories={[]}>
                <CategoryMenu/>
            </CategoriesContextProvider>
        )

        const loadingIndicator: HTMLElement = screen.getByTestId('categories-loading-indicator')

        expect(loadingIndicator).toBeInTheDocument()
        expect(screen.getByText('Loading categories...')).toBeInTheDocument()
    })

    it('renders fetched categories as menu items', async (): Promise<void> => {
        render(
            <CategoriesContextProvider isLoadingCategories={false} categories={categories.children_data}>
                <CategoryMenu/>
            </CategoriesContextProvider>
        )

        const categoryMenu: HTMLElement = await screen.findByTestId('category-menu')
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
        let categoryName: string

        filteredCategories.forEach(getCategoryNames)

        expect(categoryMenu).toBeInTheDocument()
        expect(categoryMenu.children).toHaveLength(filteredCategories.length)

        for (categoryName of categoryNames) {
            expect(screen.getByText(categoryName)).toBeInTheDocument()
        }
   })
})