import React, {createContext, Dispatch, ReactNode, SetStateAction, useContext, useMemo, useState} from 'react'
import {removeReservedUrisFromLocationHash} from '../utilities/ReservedUriRemover'
import {findCategoryByLocationHash} from '../utilities/CategoryFinder'
import type Category from '../types/Category'

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
    const setInitialCurrentCategory = (): Category | null => {
        const locationHashSegments: string[] = window.location.hash.match(/#?([^?]*)\??/)![1].split('/')

        removeReservedUrisFromLocationHash(locationHashSegments)

        if (categories.length === 0 || locationHashSegments.length === 0 || locationHashSegments[0] === '') {
            return null
        }

        return findCategoryByLocationHash(categories, locationHashSegments)
    }
    const [currentCategory, setCurrentCategory] = useState<Category | null>(setInitialCurrentCategory)
    const value: CurrentCategoryContextValue = useMemo((): CurrentCategoryContextValue => ({
        currentCategory,
        setCurrentCategory
    }), [currentCategory])

    if (categories.length === 0) {
        return null
    }

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
