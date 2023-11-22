import React, {useEffect, useRef} from 'react'
import {useCurrentCategoryContext} from '../contexts/CurrentCategoryContext'
import {findCategoryByLocationHash} from '../utilities/CategoryFinder'
import {removeReservedUrisFromLocationHash} from '../utilities/ReservedUriRemover'
import Category from '../types/Category'

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
    const {setCurrentCategory} = useCurrentCategoryContext()
    const pageRef: React.MutableRefObject<number> = useRef<number>(1)
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

    pageRef.current = currentPage

    useEffect((): void => {
        window.addEventListener('hashchange', (): void => {
            updateCurrentCategory()
            resetCurrentPage()
        })
    }, [])

    return null
}
