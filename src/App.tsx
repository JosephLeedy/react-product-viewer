import React, {useState} from 'react'
import {CategoriesContextProvider} from './contexts/CategoriesContext'
import {SearchQueryContextProvider} from './contexts/SearchQueryContext'
import {CurrentCategoryContextProvider} from './contexts/CurrentCategoryContext'
import {CurrentProductFilterContextProvider} from './contexts/CurrentProductFilterContext'
import useCategories from './hooks/useCategories'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {XCircleFill} from 'react-bootstrap-icons'
import Navigation from './components/Navigation'
import SearchResults from './components/SearchResults'
import LocationHashChangeListener from './components/LocationHashChangeListener'
import ProductGrid from './components/ProductGrid'
import Footer from './components/Footer'
import './App.scss'

export default function App(): React.JSX.Element {
    const {isLoadingCategories, categories, errorMessage: categoriesErrorMessage} = useCategories()
    const queryParameters: string = window.location.hash.substring(window.location.hash.indexOf('?'))
    const startingPage: number = parseInt(new URLSearchParams(queryParameters).get('page') ?? '1', 10)
    const [currentPage, setCurrentPage] = useState<number>(startingPage)

    if (categoriesErrorMessage.length > 0) {
        console.error(categoriesErrorMessage)

        return (
            <Container as="main" className="mt-5" data-testid="page-body">
                <Alert variant="danger">
                    <Row className="align-items-center">
                        <Col xs="auto">
                            <XCircleFill size={24} title="Error"/>
                        </Col>
                        <Col xs={10} className="p-0">
                            Could not load categories. Please verify that the backend application is running and
                            functioning properly.
                        </Col>
                    </Row>
                </Alert>
            </Container>
        )
    }

    return (
        <>
            <CategoriesContextProvider isLoadingCategories={isLoadingCategories} categories={categories}>
                <SearchQueryContextProvider>
                    <Navigation/>
                    <SearchResults currentPage={currentPage} setCurrentPage={setCurrentPage}/>
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
                </SearchQueryContextProvider>
            </CategoriesContextProvider>
            <Footer/>
        </>
    )
}
