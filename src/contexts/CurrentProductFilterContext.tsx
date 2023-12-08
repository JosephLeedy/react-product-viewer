import React, {createContext, Dispatch, SetStateAction, useContext, useMemo, useState} from 'react'
import type ProductFilter from '../types/ProductFilter'
import {ProductFilterType} from '../types/ProductFilter'

type CurrentProductFilterContextValue = {
    currentProductFilter: ProductFilter
    setCurrentProductFilter: Dispatch<SetStateAction<ProductFilter>>
}
type CurrentProductFilterContextProperties = {
    children: React.ReactNode
}

const CurrentProductFilterContext: React.Context<CurrentProductFilterContextValue | undefined>
    = createContext<CurrentProductFilterContextValue | undefined>(undefined)

export function CurrentProductFilterContextProvider(
    {
        children,
    }: CurrentProductFilterContextProperties
): React.JSX.Element {
    const queryParameters: string = window.location.hash.substring(window.location.hash.indexOf('?'))
    const urlSearchParameters: URLSearchParams = new URLSearchParams(queryParameters)
    const [currentProductFilter, setCurrentProductFilter] = useState<ProductFilter>({
        type: (urlSearchParameters.get('filter') as ProductFilterType) ?? ProductFilterType.Name,
        value: urlSearchParameters.get('keyword') ?? '',
        isUpdated: false
    })
    const value: CurrentProductFilterContextValue = useMemo((): CurrentProductFilterContextValue => ({
        currentProductFilter,
        setCurrentProductFilter
    }), [currentProductFilter])

    return (
        <CurrentProductFilterContext.Provider value={value}>
            {children}
        </CurrentProductFilterContext.Provider>
    )
}

export function useCurrentProductFilterContext(): CurrentProductFilterContextValue {
    const context: CurrentProductFilterContextValue | undefined = useContext(CurrentProductFilterContext)

    if (context === undefined) {
        throw new Error('useCurrentProductFilterContext must be used within a CurrentProductFilterContextProvider')
    }

    return context
}
