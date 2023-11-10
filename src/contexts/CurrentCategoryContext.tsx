import React, {createContext, Dispatch, ReactNode, SetStateAction, useContext, useMemo, useState} from 'react'
import {findCategoryByLocationHash} from '../utilities/CategoryFinder'
import Category from '../types/Category'

type CurrentCategoryContextValue = {
    currentCategory: Category | null
    setCurrentCategory: Dispatch<SetStateAction<Category | null>>
}
type CurrentCategoryContextProperties = {
    categories: Category[]
    children: ReactNode
}

const CurrentCategoryContext: React.Context<CurrentCategoryContextValue | undefined>
    = createContext<CurrentCategoryContextValue | undefined>(undefined)

export function CurrentCategoryContextProvider(
    {categories, children}: CurrentCategoryContextProperties
): React.JSX.Element | null {
    const locationHashSegments: string[] = window.location.hash.substring(1).split('/')
    let currentCategoryFromLocationHash: Category | null = null
    let currentCategory: Category | null
    let setCurrentCategory: Dispatch<SetStateAction<Category | null>>
    let value: CurrentCategoryContextValue

    if (categories.length === 0) {
        return null
    }

    if (categories.length !== 0 && locationHashSegments.length > 0 && locationHashSegments[0] !== '') {
        currentCategoryFromLocationHash = findCategoryByLocationHash(categories, locationHashSegments)
    }

    [currentCategory, setCurrentCategory] = useState<Category | null>(currentCategoryFromLocationHash)
    value = useMemo((): CurrentCategoryContextValue => ({
        currentCategory,
        setCurrentCategory
    }), [currentCategory])

    return (
        <CurrentCategoryContext.Provider value={value}>
            {children}
        </CurrentCategoryContext.Provider>
    )
}

export function useCurrentCategoryContext(): CurrentCategoryContextValue {
    const context: CurrentCategoryContextValue | undefined = useContext(CurrentCategoryContext)

    if (context === undefined) {
        throw new Error('useCurrentCategoryContext must be used within a CurrentCategoryContextProvider component')
    }

    return context
}
