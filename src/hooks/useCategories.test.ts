import {renderHook, waitFor} from '@testing-library/react'
import useCategories from './useCategories'
import Category, {DefaultCategory} from '../types/Category'
import categories from '../test/data/categories.json'

describe('useCategories Hook', (): void => {
    afterEach((): void => {
        vi.restoreAllMocks()
    })

    it('fetches category data', async (): Promise<void> => {
        vi.spyOn(global, 'fetch').mockImplementation((): Promise<Response> => {
            return Promise.resolve({
                ok: true,
                status: 200,
                json: async (): Promise<Category> => categories,
            } as Response)
        })

        const {result} = renderHook(useCategories)

        expect(result.current.isLoadingCategories).toEqual(true)

        await waitFor((): void => {
            expect(result.current.isLoadingCategories).toEqual(false)
        })

        expect(result.current.rootCategory).toEqual(categories)
    });

    it('logs an error if categories cannot be fetched', async (): Promise<void> => {
        vi.spyOn(global, 'fetch').mockImplementation((): Promise<Response> => {
            return Promise.resolve({
                ok: false,
                status: 400,
                statusText: 'Bad Request',
                json: async (): Promise<object> => ({}),
            } as Response)
        })
        const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => undefined)

        const {result} = renderHook(useCategories)

        await waitFor((): void => {
            expect(result.current.isLoadingCategories).toEqual(false)
        })

        expect(consoleMock).toBeCalledWith(new Error('Could not load categories. Response: 400 Bad Request'))
        expect(result.current.rootCategory).toEqual(DefaultCategory)
    });
})
