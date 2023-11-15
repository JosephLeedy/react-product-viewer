import {useEffect} from 'react'
import {useCurrentCategoryContext} from '../contexts/CurrentCategoryContext'
import {findCategoryByLocationHash} from '../utilities/CategoryFinder'
import {removeReservedUrisFromLocationHash} from '../utilities/ReservedUriRemover'
import Category from '../types/Category'

type LocationHashChangeListenerProperties = {
    categories: Category[]
}

export default function LocationHashChangeListener({categories}: LocationHashChangeListenerProperties): null {
    const {setCurrentCategory} = useCurrentCategoryContext()
    const handleLocationHashChange = (): void => {
        const locationHashSegments: string[] = window.location.hash.match(/#?([^?]*)\??/)![1].split('/')
        let currentCategory: Category | null

        removeReservedUrisFromLocationHash(locationHashSegments)

        currentCategory = findCategoryByLocationHash(categories, locationHashSegments)

        setCurrentCategory(currentCategory)
    }

    useEffect((): void => {
        window.addEventListener('hashchange', handleLocationHashChange)
    }, [])

    return null
}
