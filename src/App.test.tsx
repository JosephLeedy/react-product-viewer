import {Mock} from 'vitest'
import {render, screen} from '@testing-library/react'
import useCategories from './hooks/useCategories'
import App from './App'
import Category from './types/Category'
import rootCategory from './test/data/categories.json'

describe("Application Component", (): void => {
    const useCategoriesMock: Mock = vi.hoisted((): Mock => vi.fn())

    vi.mock('./hooks/useCategories', (): { default: Mock } => ({
        default: useCategoriesMock
    }))

    beforeEach((): void => {
        const useCategoriesReturnValue: {
            isLoadingCategories: boolean,
            categories: Category[]
        } = {
            isLoadingCategories: false,
            categories: rootCategory.children_data
        }

        vi.mocked(useCategories).mockReturnValue(useCategoriesReturnValue)
    })

    afterEach((): void => {
        vi.resetAllMocks()
    })

    it('renders a header', (): void => {
        render(<App/>)

        expect(screen.getByTestId('page-header')).toBeInTheDocument()
    })

    it('renders a body', (): void => {
        render(<App/>)

        expect(screen.getByTestId('page-body')).toBeInTheDocument()
    })

    it('renders a footer', (): void => {
        render(<App/>)

        expect(screen.getByTestId('page-footer')).toBeInTheDocument()
    })
})
