import React from 'react'
import './App.scss'
import {CategoriesContextProvider} from './contexts/CategoriesContext'
import {CurrentCategoryContextProvider} from './contexts/CurrentCategoryContext'
import useCategories from './hooks/useCategories'
import Navigation from './components/Navigation'
import LocationHashChangeListener from './components/LocationHashChangeListener'
import ProductGrid from './components/ProductGrid'
import Footer from './components/Footer'

export default function App(): React.JSX.Element {
    const {isLoadingCategories, categories} = useCategories()

    return (
        <>
            <CategoriesContextProvider isLoadingCategories={isLoadingCategories} categories={categories}>
                <Navigation/>
                <CurrentCategoryContextProvider categories={categories}>
                    <LocationHashChangeListener categories={categories}/>
                    <ProductGrid/>
                </CurrentCategoryContextProvider>
            </CategoriesContextProvider>
            <Footer/>
        </>
    )
}
