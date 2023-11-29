import React from 'react'
import {useCurrentCategoryContext} from '../contexts/CurrentCategoryContext'
import useProducts from '../hooks/useProducts'
import {filterEnabledProducts, filterProductsByCategoryId, filterUncomplexProducts} from '../helpers/productFilter'
import {paginateProducts} from '../helpers/productData'
import ProductFilterForm from './ProductGrid/ProductFilterForm'
import ProductCard from './ProductGrid/ProductCard'
import ProductPaginationToolbar from './ProductGrid/ProductPaginationToolbar'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import Product from '../types/Product'
import ProductPaginationResult from '../types/ProductPaginationResult'
import './ProductGrid.scss'

type ProductGridProperties = {
    currentPage: number
    setCurrentPage: (currentPage: number) => void
}

export default function ProductGrid({currentPage, setCurrentPage}: ProductGridProperties): React.JSX.Element {
    const {currentCategory} = useCurrentCategoryContext()
    const {isLoadingProducts, products, errorMessage} = useProducts()
    const locationHash: string = window.location.hash.match(/#?([^?]*)\??/)![1]
    let categoryProducts: Product[] = []
    let productPaginationResult: ProductPaginationResult = {} as ProductPaginationResult

    if (currentCategory !== null && !isLoadingProducts && errorMessage.length === 0 && products.length > 0) {
        categoryProducts = filterProductsByCategoryId(
            filterUncomplexProducts(
                filterEnabledProducts(products)
            ),
            currentCategory.id
        )
    }

    if (categoryProducts.length > 0) {
        productPaginationResult = paginateProducts(categoryProducts, currentPage)
        categoryProducts = productPaginationResult.paginatedProducts
    }

    if (errorMessage.length > 0) {
        console.error(errorMessage)
    }

    return (
        <Container as="main" className="product-grid mt-2 mt-md-5" data-testid="page-body">
            {currentCategory === null &&
                <Row className="mt-5">
                    <p className="no-category-message">
                        {locationHash.length > 0 && 'Invalid category. '}
                        Please select a category from the menu or use the Search form to find what you're looking for.
                    </p>
                </Row>
            }
            {currentCategory !== null &&
                <Row className="mt-5">
                    <Col>
                        <h2 className="category-name-heading">{currentCategory.name}</h2>
                    </Col>
                    {!isLoadingProducts &&
                        <Col className="d-flex justify-content-end">
                            <ProductFilterForm/>
                        </Col>
                    }
                </Row>
            }
            {currentCategory !== null && isLoadingProducts &&
                <Row className="mt-5">
                    <Spinner animation="border" role="status" data-testid="products-loading-indicator">
                        <span className="visually-hidden">Loading products...</span>
                    </Spinner>
                </Row>
            }
            {currentCategory !== null && !isLoadingProducts && errorMessage.length > 0 &&
                <Row className="mt-5">
                    <p>Could not load products from this category. Please select another category or perform a
                        search.</p>
                </Row>
            }
            {currentCategory !== null && !isLoadingProducts && errorMessage.length === 0
                && categoryProducts.length === 0 &&
                <Row className="mt-5">
                    <p className="no-products-message">There are no products in this category. Please select another
                        category or perform a search.</p>
                </Row>
            }
            {currentCategory !== null && !isLoadingProducts && errorMessage.length === 0 &&
                categoryProducts.length > 0 &&
                <>
                    <Row xs={1} md={2} lg={3} className="mt-2 g-2 g-md-5">
                        {categoryProducts.map((product: Product): React.JSX.Element => (
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
