import {Mock} from 'vitest'
import {render, screen, waitFor} from '@testing-library/react'
import {CurrentCategoryContextProvider} from '../contexts/CurrentCategoryContext'
import {CurrentProductFilterContextProvider} from '../contexts/CurrentProductFilterContext'
import useProducts from '../hooks/useProducts'
import ProductGrid from './ProductGrid'
import Category from '../types/Category'
import Product from '../types/Product'
import rootCategory from '../test/data/categories.json'
import productData from '../test/data/products.json'

const categories: Category[] = rootCategory.children_data as Category[]
const products: Product[] = productData.items as Product[]

describe('Product Grid Component', (): void => {
    const originalLocationHash: string = window.location.hash
    const useProductsReturnValue: {
        isLoadingProducts: boolean,
        products: Product[],
        errorMessage: string
    } = {
        isLoadingProducts: false,
        products: products,
        errorMessage: ''
    }
    const useProductsMock: Mock = vi.hoisted((): Mock => vi.fn())
    const setCurrentPage = (): void => {}

    vi.mock('..//hooks/useProducts', (): { default: Mock } => ({
        default: useProductsMock
    }))

    beforeEach((): void => {
        vi.mocked(useProducts).mockReturnValue(useProductsReturnValue)

        Object.defineProperty(window, 'location', {value: {hash: '#women'}})
    })

    afterEach((): void => {
        vi.restoreAllMocks()

        if (window.location.hash !== originalLocationHash) {
            Object.defineProperty(window, 'location', {value: {hash: originalLocationHash}})
        }
    })

    it('renders a "select category" message if no category is selected', (): void => {
        Object.defineProperty(window, 'location', {value: {hash: ''}})

        render(
            <CurrentCategoryContextProvider categories={categories}>
                <CurrentProductFilterContextProvider>
                    <ProductGrid currentPage={1} setCurrentPage={setCurrentPage}/>
                </CurrentProductFilterContextProvider>
            </CurrentCategoryContextProvider>
        )

        expect(screen.getByText(/^Please select a category/)).toBeInTheDocument()
    })

    it(`renders an "invalid category" message if the selected category doesn't exist`, (): void => {
        Object.defineProperty(window, 'location', {value: {hash: '#invalid'}})

        render(
            <CurrentCategoryContextProvider categories={categories}>
                <CurrentProductFilterContextProvider>
                    <ProductGrid currentPage={1} setCurrentPage={setCurrentPage}/>
                </CurrentProductFilterContextProvider>
            </CurrentCategoryContextProvider>
        )

        expect(screen.getByText(/^Invalid category/)).toBeInTheDocument()
    })

    it('renders a heading with the name of the selected category', async (): Promise<void> => {
        let categoryHeading: HTMLHeadingElement

        render(
            <CurrentCategoryContextProvider categories={categories}>
                <CurrentProductFilterContextProvider>
                    <ProductGrid currentPage={1} setCurrentPage={setCurrentPage}/>
                </CurrentProductFilterContextProvider>
            </CurrentCategoryContextProvider>
        )

        categoryHeading = screen.getByRole('heading')

        await waitFor((): void => {
            expect(categoryHeading).toBeInTheDocument()
            expect(categoryHeading.textContent).toEqual('Women')
        })
    })

    it('renders a product filter form', async (): Promise<void> => {
        let productFilterForm: HTMLFormElement

        render(
            <CurrentCategoryContextProvider categories={categories}>
                <CurrentProductFilterContextProvider>
                    <ProductGrid currentPage={1} setCurrentPage={setCurrentPage}/>
                </CurrentProductFilterContextProvider>
            </CurrentCategoryContextProvider>
        )

        productFilterForm = screen.getByRole('form')

        await waitFor((): void => {
            expect(productFilterForm).toBeInTheDocument()
        })
    })

    it('renders a loading indicator while products are loading for the selected category', (): void => {
        const mockedReturnValue = structuredClone(useProductsReturnValue)
        let loadingIndicator: HTMLElement

        mockedReturnValue.isLoadingProducts = true

        vi.mocked(useProducts).mockReturnValue(mockedReturnValue)

        render(
            <CurrentCategoryContextProvider categories={categories}>
                <CurrentProductFilterContextProvider>
                    <ProductGrid currentPage={1} setCurrentPage={setCurrentPage}/>
                </CurrentProductFilterContextProvider>
            </CurrentCategoryContextProvider>
        )

        loadingIndicator = screen.getByTestId('products-loading-indicator')

        expect(loadingIndicator).toBeInTheDocument()
        expect(screen.getByText('Loading products...')).toBeInTheDocument()
    })

    it('renders and logs an error message if products cannot be loaded for a selected category', (): void => {
        const mockedReturnValue = structuredClone(useProductsReturnValue)
        const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => undefined)

        mockedReturnValue.errorMessage = 'Could not load products. Error: "400 Bad Request"'

        vi.mocked(useProducts).mockReturnValue(mockedReturnValue)

        render(
            <CurrentCategoryContextProvider categories={categories}>
                <CurrentProductFilterContextProvider>
                    <ProductGrid currentPage={1} setCurrentPage={setCurrentPage}/>
                </CurrentProductFilterContextProvider>
            </CurrentCategoryContextProvider>
        )

        expect(screen.getByText(/^Could not load products from this category/)).toBeInTheDocument()
        expect(consoleMock).toBeCalledWith('Could not load products. Error: "400 Bad Request"')
    })

    it('renders an error message if the selected category has no products in it', async (): Promise<void> => {
        Object.defineProperty(window, 'location', {value: {hash: '#what-s-new'}})

        render(
            <CurrentCategoryContextProvider categories={categories}>
                <CurrentProductFilterContextProvider>
                    <ProductGrid currentPage={1} setCurrentPage={setCurrentPage}/>
                </CurrentProductFilterContextProvider>
            </CurrentCategoryContextProvider>
        )

        await waitFor((): void => {
            expect(screen.getByText(/^There are no products in this category/)).toBeInTheDocument()
        })
    })

    it('renders a grid containing all of the products in the chosen category', async (): Promise<void> => {
        Object.defineProperty(window, 'location', {value: {hash: '#gift-cards'}})

        render(
            <CurrentCategoryContextProvider categories={categories}>
                <CurrentProductFilterContextProvider>
                    <ProductGrid currentPage={1} setCurrentPage={setCurrentPage}/>
                </CurrentProductFilterContextProvider>
            </CurrentCategoryContextProvider>
        )

        await waitFor((): void => {
            expect(screen.getByText('Luma Virtual Gift Card')).toBeInTheDocument()
        })
    })

    it('renders a pagination toolbar', async (): Promise<void> => {
        Object.defineProperty(window, 'location', {value: {hash: '#gift-cards'}})

        render(
            <CurrentCategoryContextProvider categories={categories}>
                <CurrentProductFilterContextProvider>
                    <ProductGrid currentPage={1} setCurrentPage={setCurrentPage}/>
                </CurrentProductFilterContextProvider>
            </CurrentCategoryContextProvider>
        )

        await waitFor((): void => {
            expect(screen.getByTestId('product-pagination-toolbar')).toBeInTheDocument()
        })
    })
})