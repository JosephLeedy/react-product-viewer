import React, {useState} from 'react'
import {CategoriesContextProvider} from './contexts/CategoriesContext'
import {CurrentCategoryContextProvider} from './contexts/CurrentCategoryContext'
import {CurrentProductFilterContextProvider} from './contexts/CurrentProductFilterContext'
import useCategories from './hooks/useCategories'
import Navigation from './components/Navigation'
import LocationHashChangeListener from './components/LocationHashChangeListener'
import ProductGrid from './components/ProductGrid'
import Footer from './components/Footer'
import './App.scss'

export default function App(): React.JSX.Element {
    const {isLoadingCategories, categories} = useCategories()
    const queryParameters: string = window.location.hash.substring(window.location.hash.indexOf('?'))
    const startingPage: number = parseInt(new URLSearchParams(queryParameters).get('page') ?? '1', 10)
    const [currentPage, setCurrentPage] = useState<number>(startingPage)

    return (
        <>
            <CategoriesContextProvider isLoadingCategories={isLoadingCategories} categories={categories}>
                <Navigation/>
                <CurrentCategoryContextProvider categories={categories}>
                    <CurrentProductFilterContextProvider>
                        <LocationHashChangeListener
                            categories={categories}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                        <ProductGrid
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </CurrentProductFilterContextProvider>
                </CurrentCategoryContextProvider>
            </CategoriesContextProvider>
            <Footer/>
        </>
    )
}
