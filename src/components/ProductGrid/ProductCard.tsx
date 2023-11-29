import React from 'react'
import {
    formatPrice,
    getProductDescription,
    getProductImageUrl,
    getProductName,
    getProductUrl,
    getSalePrice
} from '../../helpers/productData'
import Product from '../../types/Product'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import {Cart4, TagFill} from 'react-bootstrap-icons'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

type ProductCardProperties = {
    product: Product
    products: Product[]
}

export default function ProductCard({product, products}: ProductCardProperties): React.JSX.Element {
    const salePrice: number | undefined = getSalePrice(product)
    const isOnSale: boolean = salePrice !== undefined
    const productDescription: string = getProductDescription(product)

    return (
        <Card as="article" className="product-card">
            <Card.Header as="header">
                <Card.Title as="h3" className="mb-0 lh-1 fs-4 text-center">
                    {isOnSale && <TagFill className="me-2" title="On Sale"/>}
                    {getProductName(product)}
                </Card.Title>
            </Card.Header>
            <Card.Body className="product-details">
                <figure className="mb-0 text-center">
                    <Card.Img
                        className="product-image"
                        src={getProductImageUrl(product)}
                        alt={product.name}
                        width="240"
                        height="300"
                    />
                    {productDescription !== '' &&
                        <Card.ImgOverlay
                            as="figcaption"
                            className="product-description opacity-75 bg-dark text-light"
                            data-tesid="product-description"
                        >
                            <Card.Text className="text-start">
                                {productDescription}
                            </Card.Text>
                        </Card.ImgOverlay>
                    }
                </figure>
            </Card.Body>
            <Card.Footer as="footer">
                <Container>
                    <Row className="align-items-center">
                        <Col sm={6} className="ps-0 product-price">
                            <span className="regular-price">{formatPrice(product.price)}</span>
                            {isOnSale && <span className="sale-price">{formatPrice(salePrice as number)}</span>}
                        </Col>
                        <Col sm={6} className="pe-0 d-flex justify-content-end">
                            <Button
                                variant="primary"
                                className="buy-product-button"
                                href={getProductUrl(product, products)}
                                target="_blank"
                            >
                                <Cart4 className="align-text-top" aria-hidden/> Buy
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Card.Footer>
        </Card>
    )
}
