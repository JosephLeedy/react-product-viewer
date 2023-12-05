import React, {createContext, Dispatch, SetStateAction, useContext, useMemo, useState} from 'react'

type SearchQueryContextValue = {
    searchQuery: string
    setSearchQuery: Dispatch<SetStateAction<string>>
}

type SearchQueryContextProperties = {
    children: React.ReactNode
}

const SearchQueryContext: React.Context<SearchQueryContextValue | undefined>
    = createContext<SearchQueryContextValue | undefined>(undefined)

export function SearchQueryContextProvider({children}: SearchQueryContextProperties): React.JSX.Element {
    let defaultSearchQuery: string = ''
    let searchQuery: string
    let setSearchQuery: Dispatch<SetStateAction<string>>
    let value: SearchQueryContextValue

    if (window.location.hash.startsWith('#search')) {
        defaultSearchQuery = new URLSearchParams(window.location.hash.substring(window.location.hash.indexOf('?')))
            .get('query') ?? ''
    }

    [searchQuery, setSearchQuery] = useState<string>(defaultSearchQuery)
    value = useMemo((): SearchQueryContextValue => ({
        searchQuery,
        setSearchQuery
    }), [searchQuery])

    return (
        <SearchQueryContext.Provider value={value}>
            {children}
        </SearchQueryContext.Provider>
    )
}

export function useSearchQueryContext(): SearchQueryContextValue {
    const context: SearchQueryContextValue | undefined = useContext(SearchQueryContext)

    if (context === undefined) {
        throw new Error('useSearchQueryContext must be used within a SearchQueryContextProvider')
    }

    return context
}
