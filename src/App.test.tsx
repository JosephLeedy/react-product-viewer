import {Mock} from 'vitest'
import {render, screen, waitFor} from '@testing-library/react'
import useCategories from './hooks/useCategories'
import useProducts from './hooks/useProducts'
import App from './App'
import Category from './types/Category'
import Product from './types/Product'
import rootCategory from './test/data/categories.json'
import productData from './test/data/products.json'

describe("Application Component", (): void => {
    const useCategoriesMock: Mock = vi.hoisted((): Mock => vi.fn())
    const useProductsMock: Mock = vi.hoisted((): Mock => vi.fn())

    vi.mock('./hooks/useCategories', (): { default: Mock } => ({
        default: useCategoriesMock
    }))
    vi.mock('./hooks/useProducts', (): { default: Mock } => ({
        default: useProductsMock
    }))

    beforeEach((): void => {
        const useCategoriesReturnValue: {
            isLoadingCategories: boolean,
            categories: Category[]
            errorMessage: string
        } = {
            isLoadingCategories: false,
            categories: rootCategory.children_data,
            errorMessage: ''
        }
        const useProductsReturnValue: {
            isLoadingProducts: boolean,
            products: Product[],
            errorMessage: string
        } = {
            isLoadingProducts: false,
            products: productData.items as Product[],
            errorMessage: ''
        }

        vi.mocked(useCategories).mockReturnValue(useCategoriesReturnValue)
        vi.mocked(useProducts).mockReturnValue(useProductsReturnValue)
    })

    afterEach((): void => {
        vi.resetAllMocks()
    })

    it('renders a header', async (): Promise<void> => {
        render(<App/>)

        await waitFor((): void => {
            expect(screen.getByTestId('page-header')).toBeInTheDocument()
        })
    })

    it('renders a body', async (): Promise<void> => {
        render(<App/>)

        await waitFor((): void => {
            expect(screen.getByTestId('page-body')).toBeInTheDocument()
        })
    })

    it('renders a footer', async (): Promise<void> => {
        render(<App/>)

        await waitFor((): void => {
            expect(screen.getByTestId('page-footer')).toBeInTheDocument()
        })
    })

    it('renders a loading indicator until categories have been fetched', async (): Promise<void> => {
        const useCategoriesReturnValue: {
            isLoadingCategories: boolean,
            categories: Category[]
            errorMessage: string
        } = {
            isLoadingCategories: true,
            categories: rootCategory.children_data,
            errorMessage: ''
        }

        vi.mocked(useCategories)
            .mockReset()
            .mockReturnValue(useCategoriesReturnValue)

        render(<App/>)

        expect(screen.getByRole('status')).toBeInTheDocument()
        expect(screen.getByText('Loading categories...')).toBeInTheDocument()
    })

    it('renders an error if categories cannot be loaded', (): void => {
        const useCategoriesReturnValue: {
            isLoadingCategories: boolean,
            categories: Category[]
            errorMessage: string
        } = {
            isLoadingCategories: false,
            categories: [],
            errorMessage: 'Could not load categories. Error: "NetworkError when attempting to fetch resource."'
        }

        vi.mocked(useCategories)
            .mockReset()
            .mockReturnValue(useCategoriesReturnValue)

        render(<App/>)

        expect(screen.getByText(/^Could not load categories/)).toBeInTheDocument()
    })
})
