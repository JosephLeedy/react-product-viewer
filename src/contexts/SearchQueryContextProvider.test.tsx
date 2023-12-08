import React from 'react'
import {render, screen} from '@testing-library/react'
import {SearchQueryContextProvider, useSearchQueryContext} from './SearchQueryContext'

describe('Search Query Context Provider', (): void => {
    const originalLocationHash: string = window.location.hash
    const SearchQueryContextConsumer = (): React.JSX.Element | null => {
        const {searchQuery} = useSearchQueryContext()

        return searchQuery.length > 0 ? <h3>{searchQuery}</h3> : null
    }

    afterEach((): void => {
        Object.defineProperty(window, 'location', {value: {hash: originalLocationHash}})
    })

    it('provides a search query from the location hash if on a search page', (): void => {
        Object.defineProperty(window, 'location', {value: {hash: '#search?query=Test'}})

        render(
            <SearchQueryContextProvider>
                <SearchQueryContextConsumer/>
            </SearchQueryContextProvider>
        )

        expect(screen.getByText('Test')).toBeInTheDocument()
    })

    it('does not provide a search query from the location hash if not on a search page', (): void => {
        Object.defineProperty(window, 'location', {value: {hash: '#category?query=Test'}})

        render(
            <SearchQueryContextProvider>
                <SearchQueryContextConsumer/>
            </SearchQueryContextProvider>
        )

        expect(screen.queryByText('Test')).not.toBeInTheDocument()
    })
})
