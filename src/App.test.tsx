import {Mock} from 'vitest'
import {getByTestId, render} from '@testing-library/react'
import App from './App'
import useCategories from './hooks/useCategories'
import Category from './types/Category'
import rootCategory from './test/data/categories.json'

describe("App renders properly", () => {
    const useCategoriesMock: Mock = vi.hoisted((): Mock => vi.fn())

    vi.mock('./hooks/useCategories', (): { default: Mock } => ({
        default: useCategoriesMock
    }))

    beforeEach((): void => {
        const useCategoriesReturnValue: {isLoadingCategories: boolean, categories: Category[]} = {
            isLoadingCategories: false,
            categories: rootCategory.children_data
        }

        vi.mocked(useCategories).mockReturnValue(useCategoriesReturnValue)
    });

    afterEach((): void => {
        vi.resetAllMocks()
    })

    test("it has a header", () => {
        render(<App/>)

        expect(getByTestId(document.documentElement, 'page-header')).toBeInTheDocument()
    })

    test("it has a body", () => {
        render(<App/>)

        expect(getByTestId(document.documentElement, 'page-body')).toBeInTheDocument()
    })

    test("it has a footer", () => {
        render(<App/>)

        expect(getByTestId(document.documentElement, 'page-footer')).toBeInTheDocument()
    })
})
