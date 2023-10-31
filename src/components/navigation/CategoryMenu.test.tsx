import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {SpyInstance} from 'vitest'
import CategoryMenu from './CategoryMenu'
import Category from '../../types/Category'
import categories from '../../test/data/categories.json'
import {RequestInfo} from 'undici-types'

describe('Category Menu Component', (): void => {
    let fetchMock: SpyInstance<[input: RequestInfo, init?: RequestInit | undefined], Promise<Response>>

    beforeEach((): void => {
        fetchMock = vi.spyOn(global, 'fetch').mockImplementation((): Promise<Response> => {
            return Promise.resolve({
                ok: true,
                status: 200,
                json: async (): Promise<Category> => categories,
            } as Response)
        })
    })

    afterEach((): void => {
        fetchMock.mockRestore()
    })

    it('renders a loading indicator until categories are fetched', async (): Promise<void> => {
        render(<CategoryMenu/>)

        const loadingIndicator: HTMLElement = screen.getByTestId('categories-loading-indicator')

        expect(loadingIndicator).toBeInTheDocument()
        expect(screen.getByText('Loading categories...')).toBeInTheDocument()

        await waitForElementToBeRemoved((): HTMLElement => screen.getByTestId('categories-loading-indicator'))
    })

    it('renders fetched categories as menu items', async (): Promise<void> => {
        render(<CategoryMenu/>)

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