import React, {useEffect, useState} from 'react'
import {useSearchQueryContext} from '../contexts/SearchQueryContext'
import useProducts from '../hooks/useProducts'
import {filterEnabledProducts, filterProductsByNameOrSku, filterUncomplexProducts} from '../helpers/productFilter'
import {paginateProducts} from '../helpers/productData'
import ProductCard from './ProductGrid/ProductCard'
import ProductPaginationToolbar from './ProductGrid/ProductPaginationToolbar'
import Spinner from 'react-bootstrap/Spinner'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import {ExclamationTriangleFill, XCircleFill} from 'react-bootstrap-icons'
import type Product from '../types/Product'
import type ProductPaginationResult from '../types/ProductPaginationResult'
import './ProductGrid.scss'

type SearchResultsProperties = {
    currentPage: number
    setCurrentPage: (currentPage: number) => void
}

export default function SearchResults(
    {
        currentPage,
        setCurrentPage
    }: SearchResultsProperties
): React.JSX.Element | null {
    const [isHidden, setIsHidden] = useState<boolean>(false)
    const {searchQuery} = useSearchQueryContext()
    const {products, isLoadingProducts, errorMessage} = useProducts(0)
    let productPaginationResult: ProductPaginationResult = {} as ProductPaginationResult
    let foundProducts: Product[] = []

    useEffect((): void => {
        /* Fixes an edge-case bug where clearing the search input and then selecting a category from the navigation menu
           results in the Search Results page being shown with a "Please enter a query..." error message above the page
           for the selected category. */
        window.addEventListener('hashchange', (): void => {
            setIsHidden(!window.location.hash.startsWith('#search'))
        })
    }, [])

    if (!window.location.hash.startsWith('#search')) {
        return null
    }

    if (errorMessage.length === 0 && !isLoadingProducts && searchQuery.length > 0 && products.length > 0) {
        foundProducts = filterProductsByNameOrSku(filterUncomplexProducts(filterEnabledProducts(products)), searchQuery)

        foundProducts.sort((product0: Product, product1: Product) => product0.id - product1.id)

        productPaginationResult = paginateProducts(foundProducts, currentPage)
    }

    if (errorMessage.length > 0) {
        console.error(errorMessage)
    }

    return (
        <Container
            as="main"
            className="search-results product-grid mt-2 mt-md-5"
            data-testid="page-body"
            hidden={isHidden}
        >
            <Row className="mt-5">
                <Col>
                    <h2>Search Results{searchQuery.length > 0 && ` for "${searchQuery}"`}</h2>
                </Col>
            </Row>
            {isLoadingProducts &&
                <Row className="mt-5">
                    <Spinner animation="border" role="status" data-testid="products-loading-indicator">
                        <span className="visually-hidden">Loading products...</span>
                    </Spinner>
                </Row>
            }
            {!isLoadingProducts && errorMessage.length > 0 &&
                <Row className="mt-5">
                    <Alert variant="danger" className="d-flex">
                        <XCircleFill size={24} className="me-2" title="Error"/>
                        Could not load products from catalog.
                    </Alert>
                </Row>
            }
            {!isLoadingProducts && errorMessage.length === 0 && products.length === 0 && searchQuery.length === 0 &&
                <Row className="mt-5">
                    <Alert variant="danger" className="d-flex">
                        <XCircleFill size={24} className="me-2" title="Error"/>
                        There are no products in the catalog.
                    </Alert>
                </Row>
            }
            {!isLoadingProducts && errorMessage.length === 0 && products.length > 0 && searchQuery.length === 0 &&
                <Row className="mt-5">
                    <Alert variant="warning" className="d-flex">
                        <ExclamationTriangleFill size={24} className="me-2" title="Warning"/>
                        Please enter a query to search for.
                    </Alert>
                </Row>
            }
            {!isLoadingProducts && errorMessage.length === 0 && foundProducts.length === 0 && searchQuery.length > 0 &&
                <Row className="mt-5">
                    <Alert variant="warning" className="d-flex">
                        <ExclamationTriangleFill size={24} className="me-2" title="Warning"/>
                        There are no products matching your query. Please try another query.
                    </Alert>
                </Row>
            }
            {!isLoadingProducts && errorMessage.length === 0 && foundProducts.length > 0 && searchQuery.length > 0 &&
                <>
                    <Row xs={1} md={2} lg={3} className="mt-2 g-2 g-md-5">
                        {productPaginationResult.paginatedProducts.map((product: Product): React.JSX.Element => (
                            <Col key={product.id}>
                                <ProductCard product={product} products={products}/>
                            </Col>
                        ))}
                    </Row>
                    <ProductPaginationToolbar
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        {...productPaginationResult}
                    />
                </>
            }
        </Container>
    )
}
