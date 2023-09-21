// import { useState } from 'react'
import './App.scss'
import Navigation from './components/Navigation'
import ProductGrid from './components/ProductGrid'
import Footer from './components/Footer.tsx'

function App() {
    // const [count, setCount] = useState(0)

    return (
        <>
            <Navigation/>
            <ProductGrid/>
            <Footer/>
        </>
    )
}

export default App
