import React, {createContext, useContext} from 'react'
import type Category from '../types/Category'

type CategoriesContextValue = {
    categories: Category[]
}
type CategoriesContextProperties = {
    categories: Category[]
    children: React.ReactNode
}

const CategoriesContext: React.Context<CategoriesContextValue | undefined>
    = createContext<CategoriesContextValue | undefined>(undefined)

export function CategoriesContextProvider({children, ...properties}: CategoriesContextProperties): React.JSX.Element {
    return (
        <CategoriesContext.Provider value={properties}>
            {children}
        </CategoriesContext.Provider>
    )
}

export function useCategoriesContext(): CategoriesContextValue {
    const context: CategoriesContextValue | undefined = useContext(CategoriesContext)

    if (context === undefined) {
        throw new Error('useCategoriesContext must be used within a CategoriesContextProvider')
    }

    return context
}
