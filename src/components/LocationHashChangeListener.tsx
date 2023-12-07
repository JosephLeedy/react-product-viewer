import React, {useEffect, useRef} from 'react'
import {useSearchQueryContext} from '../contexts/SearchQueryContext'
import {useCurrentCategoryContext} from '../contexts/CurrentCategoryContext'
import {useCurrentProductFilterContext} from '../contexts/CurrentProductFilterContext'
import {findCategoryByLocationHash} from '../utilities/CategoryFinder'
import {removeReservedUrisFromLocationHash} from '../utilities/ReservedUriRemover'
import Category from '../types/Category'
import ProductFilter, {ProductFilterType} from '../types/ProductFilter'

type LocationHashChangeListenerProperties = {
    categories: Category[]
    currentPage: number
    setCurrentPage: (currentPage: number) => void
}

export default function LocationHashChangeListener(
    {
        categories,
        currentPage,
        setCurrentPage
    }: LocationHashChangeListenerProperties
): null {
    const {searchQuery, setSearchQuery} = useSearchQueryContext()
    const {setCurrentCategory} = useCurrentCategoryContext()
    const {currentProductFilter, setCurrentProductFilter} = useCurrentProductFilterContext()
    const searchQueryRef: React.MutableRefObject<string> = useRef<string>('')
    const pageRef: React.MutableRefObject<number> = useRef<number>(1)
    const productFilterRef: React.MutableRefObject<ProductFilter> = useRef<ProductFilter>({} as ProductFilter)
    const resetSearchQuery = (): void => {
        if (window.location.hash.startsWith('#search') || searchQueryRef.current.length === 0) {
            return
        }

        setSearchQuery('')
    }
    const updateSearchQuery = (): void => {
        const queryParameters: string = window.location.hash.substring(window.location.hash.indexOf('?'))
        const urlSearchParameters: URLSearchParams = new URLSearchParams(queryParameters)
        const query: string | null = urlSearchParameters.get('query')

        if (query === null || searchQueryRef.current === query) {
            return
        }

        setSearchQuery(query)
    }
    const updateCurrentCategory = (): void => {
        const locationHashSegments: string[] = window.location.hash.match(/#?([^?]*)\??/)![1].split('/')
        let currentCategory: Category | null

        removeReservedUrisFromLocationHash(locationHashSegments)

        currentCategory = findCategoryByLocationHash(categories, locationHashSegments)

        setCurrentCategory(currentCategory)
    }
    const resetCurrentPage = (): void => {
        /*
          The logic below fixes two issues:
            1. Categories have the wrong page set when they're selected from the menu if pagination is active
            2. The current page does not change when the user navigates backwards or forwards in their browser
        */
        const page: number = parseInt(
            new URLSearchParams(window.location.hash.substring(window.location.hash.indexOf('?'))).get('page')
            ?? '1',
            10
        )

        if (page === pageRef.current) {
            return
        }

        setCurrentPage(page)
    }
    const resetCurrentProductFilter = (): void => {
        /*
          The logic below fixes two issues:
            1. Categories have the wrong product filter set when they're selected from the menu if filtering is active
            2. The current product filter does not change when the user navigates backwards or forwards in their browser
        */
        const queryParameters: string = window.location.hash.substring(window.location.hash.indexOf('?'))
        const urlSearchParameters: URLSearchParams = new URLSearchParams(queryParameters)
        const currentProductFilter: ProductFilter = {
            type: (urlSearchParameters.get('filter') as ProductFilterType) ?? ProductFilterType.Name,
            value: urlSearchParameters.get('keyword') ?? '',
            isUpdated: false,
        }

        if (
            productFilterRef.current.isUpdated
            || (
                currentProductFilter.type === productFilterRef.current.type
                && currentProductFilter.value === productFilterRef.current.value
            )
        ) {
            return
        }

        setCurrentProductFilter(currentProductFilter)
    }

    searchQueryRef.current = searchQuery
    pageRef.current = currentPage
    productFilterRef.current = currentProductFilter

    useEffect((): void => {
        window.addEventListener('hashchange', (): void => {
            resetSearchQuery()
            updateSearchQuery()
            updateCurrentCategory()
            resetCurrentPage()
            resetCurrentProductFilter()
        })
    }, [])

    return null
}
