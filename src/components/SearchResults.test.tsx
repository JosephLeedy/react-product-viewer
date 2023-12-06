import {Mock} from 'vitest'
import {render, screen} from '@testing-library/react'
import {SearchQueryContextProvider} from '../contexts/SearchQueryContext'
import useProducts from '../hooks/useProducts'
import SearchResults from './SearchResults'
import type Product from '../types/Product'
import productData from '../test/data/products.json'

const products: Product[] = productData.items as Product[]

describe('Search Results Component', (): void => {
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

        Object.defineProperty(window, 'location', {value: {hash: '#search'}})
    })

    afterEach((): void => {
        vi.restoreAllMocks()

        if (window.location.hash !== originalLocationHash) {
            Object.defineProperty(window, 'location', {value: {hash: originalLocationHash}})
        }
    })

    it('does not render if the current page is not a search page', (): void => {
        Object.defineProperty(window, 'location', {value: {hash: '#test'}})

        render(
            <SearchQueryContextProvider>
                <SearchResults currentPage={1} setCurrentPage={setCurrentPage}/>
            </SearchQueryContextProvider>
        )

        expect(screen.queryByTestId('page-body')).not.toBeInTheDocument()
    })

    it('renders a heading with no search query', (): void => {
        render(
            <SearchQueryContextProvider>
                <SearchResults currentPage={1} setCurrentPage={setCurrentPage}/>
            </SearchQueryContextProvider>
        )

        expect(screen.getByRole('heading', {level: 2, name: 'Search Results'})).toBeInTheDocument()
    })

    it('renders a heading with the search query', (): void => {
        Object.defineProperty(window, 'location', {value: {hash: '#search?query=Test'}})

        render(
            <SearchQueryContextProvider>
                <SearchResults currentPage={1} setCurrentPage={setCurrentPage}/>
            </SearchQueryContextProvider>
        )

        expect(screen.getByRole('heading', {level: 2, name: 'Search Results for "Test"'})).toBeInTheDocument()
    })

    it('renders a loading indicator while products are loading', (): void => {
        const mockedReturnValue = structuredClone(useProductsReturnValue)
        let loadingIndicator: HTMLElement

        mockedReturnValue.isLoadingProducts = true

        vi.mocked(useProducts).mockReturnValue(mockedReturnValue)

        render(
            <SearchQueryContextProvider>
                <SearchResults currentPage={1} setCurrentPage={setCurrentPage}/>
            </SearchQueryContextProvider>
        )

        loadingIndicator = screen.getByTestId('products-loading-indicator')

        expect(loadingIndicator).toBeInTheDocument()
        expect(screen.getByText('Loading products...')).toBeInTheDocument()
    })

    it('renders and logs an error if one is thrown while products are loading', (): void => {
        const mockedReturnValue = structuredClone(useProductsReturnValue)
        const consoleMock = vi.spyOn(console, 'error').mockImplementation(() => undefined)
        let productLoadError: HTMLElement

        mockedReturnValue.errorMessage = 'Could not load products. Error: "400 Bad Request"'

        vi.mocked(useProducts).mockReturnValue(mockedReturnValue)

        render(
            <SearchQueryContextProvider>
                <SearchResults currentPage={1} setCurrentPage={setCurrentPage}/>
            </SearchQueryContextProvider>
        )

        productLoadError = screen.getByRole('alert')

        expect(screen.getByTitle('Error')).toBeInTheDocument()
        expect(productLoadError).toBeInTheDocument()
        expect(productLoadError).toHaveTextContent(/Could not load products/)
        expect(consoleMock).toBeCalledWith('Could not load products. Error: "400 Bad Request"')
    })

    it('renders an error if there are no products in the catalog', (): void => {
        const mockedReturnValue = structuredClone(useProductsReturnValue)
        let noProductsError: HTMLElement

        mockedReturnValue.products = []

        vi.mocked(useProducts).mockReturnValue(mockedReturnValue)

        render(
            <SearchQueryContextProvider>
                <SearchResults currentPage={1} setCurrentPage={setCurrentPage}/>
            </SearchQueryContextProvider>
        )

        noProductsError = screen.getByRole('alert')

        expect(screen.getByTitle('Error')).toBeInTheDocument()
        expect(noProductsError).toBeInTheDocument()
        expect(noProductsError).toHaveTextContent(/There are no products/)
    })

    it('renders a warning if no search query was entered', (): void => {
        let noSearchQueryWarning: HTMLElement

        render(
            <SearchQueryContextProvider>
                <SearchResults currentPage={1} setCurrentPage={setCurrentPage}/>
            </SearchQueryContextProvider>
        )

        noSearchQueryWarning = screen.getByRole('alert')

        expect(screen.getByTitle('Warning')).toBeInTheDocument()
        expect(noSearchQueryWarning).toBeInTheDocument()
        expect(noSearchQueryWarning).toHaveTextContent(/Please enter a query/)
    })

    it('renders a warning if no products match the search query', (): void => {
        let noMatchingProductsWarning: HTMLElement

        Object.defineProperty(window, 'location', {value: {hash: '#search?query=Test'}})

        render(
            <SearchQueryContextProvider>
                <SearchResults currentPage={1} setCurrentPage={setCurrentPage}/>
            </SearchQueryContextProvider>
        )

        noMatchingProductsWarning = screen.getByRole('alert')

        expect(screen.getByTitle('Warning')).toBeInTheDocument()
        expect(noMatchingProductsWarning).toBeInTheDocument()
        expect(noMatchingProductsWarning).toHaveTextContent(/There are no products matching your query/)
    })

    it('renders a grid containing the products that match the search query', (): void => {
        Object.defineProperty(window, 'location', {value: {hash: '#search?query=bag'}})

        render(
            <SearchQueryContextProvider>
                <SearchResults currentPage={1} setCurrentPage={setCurrentPage}/>
            </SearchQueryContextProvider>
        )

        expect(screen.getByText('Joust Duffle Bag')).toBeInTheDocument()
    })

    it('renders a product pagination toolbar', (): void => {
        Object.defineProperty(window, 'location', {value: {hash: '#search?query=bag'}})

        render(
            <SearchQueryContextProvider>
                <SearchResults currentPage={1} setCurrentPage={setCurrentPage}/>
            </SearchQueryContextProvider>
        )

        expect(screen.getByTestId('product-pagination-toolbar')).toBeInTheDocument()
    })
})
