import {renderHook, waitFor} from '@testing-library/react'
import useCategories from './useCategories'
import type Category from '../types/Category'
import rootCategory from '../test/data/categories.json'

describe('useCategories Hook', (): void => {
    afterEach((): void => {
        vi.restoreAllMocks()
    })

    it('fetches category data', async (): Promise<void> => {
        vi.spyOn(global, 'fetch').mockImplementation((): Promise<Response> => {
            return Promise.resolve({
                ok: true,
                status: 200,
                json: async (): Promise<Category> => rootCategory,
            } as Response)
        })

        const {result} = renderHook(useCategories)

        expect(result.current.isLoadingCategories).toEqual(true)

        await waitFor((): void => {
            expect(result.current.isLoadingCategories).toEqual(false)
        })

        expect(result.current.categories).toEqual(rootCategory.children_data)
    })

    // noinspection JSUnusedLocalSymbols
    it.each([
        {
            messageType: 'API error',
            returnedJson: {
                message: 'The token length is invalid. Check the length and try again.'
            },
            expectedErrorMessage: 'Could not load categories. Error: "The token length is invalid. Check the length '
                + 'and try again."'
        },
        {
            messageType: 'error code and status',
            returnedJson: {},
            expectedErrorMessage: 'Could not load categories. Response: 400 Bad Request'
        }
    ])('returns an error message with an $messageType if categories cannot be fetched',
        // @ts-ignore
        async ({messageType, returnedJson, expectedErrorMessage}): Promise<void> => {
        vi.spyOn(global, 'fetch').mockImplementation((): Promise<Response> => {
            return Promise.resolve({
                ok: false,
                status: 400,
                statusText: 'Bad Request',
                json: (): Promise<object> => Promise.resolve(returnedJson),
            } as Response)
        })

        const {result} = renderHook(useCategories)

        await waitFor((): void => {
            expect(result.current.isLoadingCategories).toEqual(false)
        })

        expect(result.current.errorMessage).toEqual(expectedErrorMessage)
        expect(result.current.categories).toEqual([])
    })
})
