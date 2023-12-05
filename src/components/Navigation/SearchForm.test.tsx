import React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import {UserEvent, userEvent} from '@testing-library/user-event'
import {SearchQueryContextProvider, useSearchQueryContext} from '../../contexts/SearchQueryContext'
import SearchForm from './SearchForm'

describe('Search Form Component', (): void => {
    const originalLocationHash: string = window.location.hash

    afterEach((): void => {
        Object.defineProperty(window, 'location', {value: {hash: originalLocationHash}})
    })

    it('renders a keyword input', (): void => {
        render(
            <SearchQueryContextProvider>
                <SearchForm/>
            </SearchQueryContextProvider>
        )

        expect(screen.getByPlaceholderText('Search catalog')).toBeInTheDocument()
    })

    it('sets the search query field value from the context', (): void => {
        Object.defineProperty(window, 'location', {value: {hash: '#search?query=test'}})

        render(
            <SearchQueryContextProvider>
                <SearchForm/>
            </SearchQueryContextProvider>
        )

        expect(screen.getByPlaceholderText('Search catalog')).toHaveValue('test')
    })

    it('updates the context value and location hash when a user types their query', async (): Promise<void> => {
        const user: UserEvent = userEvent.setup()
        const SearchQueryContextConsumer = (): React.JSX.Element | null => {
            const {searchQuery} = useSearchQueryContext()

            return searchQuery.length > 0 ? <h3>{`Search Results for "${searchQuery}"`}</h3> : null
        }

        render(
            <SearchQueryContextProvider>
                <SearchForm/>
                <SearchQueryContextConsumer/>
            </SearchQueryContextProvider>
        )

        await user.type(screen.getByPlaceholderText('Search catalog'), 'Test')

        await waitFor((): void => {
            expect(screen.getByText('Search Results for "Test"')).toBeInTheDocument()
            expect(window.location.hash).toEqual('#search?query=Test')
        })
    })

    it('resets the context value and location hash when a user erases their query', async (): Promise<void> => {
        const user: UserEvent = userEvent.setup()
        const SearchQueryContextConsumer = (): React.JSX.Element | null => {
            const {searchQuery} = useSearchQueryContext()

            return searchQuery.length > 0 ? <h3>{`Search Results for "${searchQuery}"`}</h3> : null
        }

        Object.defineProperty(window, 'location', {value: {hash: '#search?query=test'}})

        render(
            <SearchQueryContextProvider>
                <SearchForm/>
                <SearchQueryContextConsumer/>
            </SearchQueryContextProvider>
        )

        await user.clear(screen.getByPlaceholderText('Search catalog'))

        screen.debug()

        await waitFor((): void => {
            expect(screen.queryByText('Search Results fore "test"')).not.toBeInTheDocument()
            expect(window.location.hash).toEqual('#search')
        })
    })
})
