import React from 'react'
import './App.scss'
import Navigation from './components/Navigation'
import ProductGrid from './components/ProductGrid'
import Footer from './components/Footer'

export default function App(): React.JSX.Element {
    return (
        <>
            <Navigation/>
            <ProductGrid/>
            <Footer/>
        </>
    )
}
