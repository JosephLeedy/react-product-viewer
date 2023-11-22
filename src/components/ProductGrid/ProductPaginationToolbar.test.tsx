import {fireEvent, render, screen} from '@testing-library/react'
import {paginateProducts} from '../../helpers/productData'
import {filterProductsByCategoryId} from '../../helpers/productFilter'
import ProductPaginationToolbar from './ProductPaginationToolbar'
import Product from '../../types/Product'
import ProductPaginationResult from '../../types/ProductPaginationResult'
import productData from '../../test/data/products.json'

const products: Product[] = productData.items as Product[]

describe('Product Pagination Toolbar Component', (): void => {
    let currentPage: number = 1
    const setCurrentPage = (newCurrentPage: number): void => {
        currentPage = newCurrentPage
    }

    it('renders the current and total product counts', (): void => {
        const productPaginationResult: ProductPaginationResult = paginateProducts(products, 2)
        let productCountMessage: HTMLElement

        render(<ProductPaginationToolbar currentPage={2} setCurrentPage={setCurrentPage} {...productPaginationResult}/>)

        productCountMessage = screen.getByTestId('pagination-product-count')

        expect(productCountMessage).toBeInTheDocument()
        expect(productCountMessage.textContent).toEqual('Showing 31-37 of 37 products.')
    })

    it('renders a pager with page number and first, last, next and previous page links', (): void => {
        const productPaginationResult: ProductPaginationResult = paginateProducts(products, 2)
        const expectedPaginationLinkLabels: string[] = ['«First', '‹Previous', '1', '2(current)', '›Next', '»Last']
        let pager: HTMLElement
        let actualPaginationLinkLabels: string[]

        render(<ProductPaginationToolbar currentPage={2} setCurrentPage={setCurrentPage} {...productPaginationResult}/>)

        pager = screen.getByRole('navigation')
        actualPaginationLinkLabels = screen.getAllByRole('listitem')
            .map((listItem: HTMLElement): string => listItem.textContent as string)

        expect(pager).toBeInTheDocument()
        expect(actualPaginationLinkLabels).toEqual(expectedPaginationLinkLabels)
    })

    it('does not render a pager if there is only one page', (): void => {
        const giftCardProducts: Product[] = filterProductsByCategoryId(products, 41);
        const productPaginationResult: ProductPaginationResult = paginateProducts(giftCardProducts, 1)

        render(<ProductPaginationToolbar currentPage={1} setCurrentPage={setCurrentPage} {...productPaginationResult}/>)

        expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    })

    it.each([
        {
            currentPageNumber: 2,
            newPageNumber: 1,
            newPageName: 'First'
        },
        {
            currentPageNumber: 2,
            newPageNumber: 1,
            newPageName: 'Previous'
        },
        {
            currentPageNumber: 1,
            newPageNumber: 2,
            newPageName: '2'
        },
        {
            currentPageNumber: 1,
            newPageNumber: 2,
            newPageName: 'Next'
        },
        {
            currentPageNumber: 1,
            newPageNumber: 2,
            newPageName: 'Last'
        },
    ])('updates the current page when a pagination link is clicked (page: $newPageName)',
        ({currentPageNumber, newPageNumber, newPageName}): void => {
        const productPaginationResult: ProductPaginationResult = paginateProducts(products, currentPageNumber)
        let pageLink: HTMLAnchorElement

        // Fix "Not implemented" error thrown by JSDOM
        Object.defineProperty(window, 'scrollTo', {value: (): void => {}, writable: true});

        render(
            <ProductPaginationToolbar
                currentPage={currentPageNumber}
                setCurrentPage={setCurrentPage}
                {...productPaginationResult}
            />
        )

        pageLink = screen.getByRole('link', {name: newPageName})

        fireEvent.click(pageLink)

        expect(currentPage).toEqual(newPageNumber)
    })
})