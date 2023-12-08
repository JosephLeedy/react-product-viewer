import {renderHook, waitFor} from '@testing-library/react'
import useProducts from './useProducts'
import type {ProductsResponse} from '../types/Product'
import productsResponse, {items as products} from '../test/data/products.json'

describe('useProducts Hook', (): void => {
    afterEach((): void => {
        vi.restoreAllMocks()
    })

    it('fetches product data', async (): Promise<void> => {
        vi.spyOn(global, 'fetch').mockImplementation((): Promise<Response> => {
            return Promise.resolve({
                ok: true,
                status: 200,
                json: async (): Promise<ProductsResponse> => productsResponse as ProductsResponse,
            } as Response)
        })

        const {result} = renderHook(useProducts)

        expect(result.current.isLoadingProducts).toEqual(true)

        await waitFor((): void => {
            expect(result.current.isLoadingProducts).toEqual(false)
        })

        expect(result.current.products).toEqual(products)
        expect(result.current.errorMessage).toEqual('')
    })

    it.each([
        {
            status: 400,
            statusText: 'Bad Request'
        },
        {
            status: 401,
            statusText: 'Not Authorized'
        },
        {
            status: 403,
            statusText: 'Forbidden'
        },
        {
            status: 404,
            statusText: 'Not Found'
        },
        {
            status: 500,
            statusText: 'Internal Server Error'
        }
    ])('returns an error message if products cannot be fetched due to an HTTP error ($status $statusText)',
        async ({status, statusText}): Promise<void> => {
        vi.spyOn(global, 'fetch').mockImplementation((): Promise<Response> => {
            return Promise.resolve({
                ok: false,
                status: status,
                statusText: statusText,
                json: async (): Promise<ProductsResponse> => ({items: [], total_count: 0}),
            } as Response)
        })

        const {result} = renderHook(useProducts)

        await waitFor((): void => {
            expect(result.current.isLoadingProducts).toEqual(false)
        })

        expect(result.current.errorMessage).toEqual(`Could not load products. Error: "${status} ${statusText}"`)
        expect(result.current.products).toEqual([])
    })

    it('returns an error message if the product fetch request is rejected', async (): Promise<void> => {
        vi.spyOn(global, 'fetch').mockImplementation(
            (): Promise<never> => Promise.reject(new TypeError('Invalid header name.'))
        )

        const {result} = renderHook(useProducts)

        await waitFor((): void => {
            expect(result.current.isLoadingProducts).toEqual(false)
        })

        expect(result.current.errorMessage).toEqual(`Could not load products. Error: "Invalid header name."`)
        expect(result.current.products).toEqual([])
    })
})
