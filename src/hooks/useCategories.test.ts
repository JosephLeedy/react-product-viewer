import {renderHook, waitFor} from '@testing-library/react'
import {SpyInstance} from 'vitest'
import useCategories from './useCategories'
import Category from '../types/Category'
import categories from '../test/data/categories.json'

describe('useCategories Hook', (): void => {
    let fetchMock: SpyInstance<[input: RequestInfo | URL, init?: RequestInit | undefined], Promise<Response>>

    beforeEach((): void => {
        fetchMock = vi.spyOn(global, 'fetch').mockImplementation(() => {
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

    it('fetches category data', async (): Promise<void> => {
        const {result} = renderHook(useCategories)

        expect(result.current.isLoadingCategories).toEqual(true)

        await waitFor((): void => {
            expect(result.current.isLoadingCategories).toEqual(false)
        })

        expect(result.current.rootCategory).toEqual(categories)
    });
})
