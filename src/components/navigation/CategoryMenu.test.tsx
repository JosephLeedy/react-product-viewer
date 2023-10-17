import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {SpyInstance} from 'vitest'
import CategoryMenu from './CategoryMenu'
import Category from '../../types/Category'
import categories from '../../test/data/categories.json'

describe('Category Menu Component', (): void => {
    let fetchMock: SpyInstance<[input: RequestInfo | URL, init?: RequestInit | undefined], Promise<Response>>

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
        const filterInactiveCategories = (unfilteredCategories: Category[]) => unfilteredCategories.filter(
            (category: Category): boolean => {
                if (!category.is_active) {
                    return false
                }

                if (category.children_data.length > 0) {
                    category.children_data = filterInactiveCategories(category.children_data)
                }

                return true
            }
        )
        const filteredCategories: Category[] = filterInactiveCategories(categories.children_data)
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