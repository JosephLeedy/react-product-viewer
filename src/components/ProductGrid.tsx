import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Pagination from 'react-bootstrap/Pagination'
import Row from 'react-bootstrap/Row'
import {Cart4, Filter, Heart, HeartFill, TagFill} from 'react-bootstrap-icons'
import './ProductGrid.scss'

export default () => {
    return (
        <Container as="main" className="product-grid mt-2 mt-md-5" data-testid="page-body">
            <Row>
                <Col>
                    <h2>Example Category</h2>
                </Col>
                <Col className="d-flex justify-content-end">
                    <Form>
                        <InputGroup>
                            <InputGroup.Text>
                                <Filter/>
                            </InputGroup.Text>
                            <Form.Control type="text" placeholder="Filter products" id="product-filter"/>
                        </InputGroup>
                    </Form>
                </Col>
            </Row>
            <Row xs={1} md={2} lg={3} className="mt-2 g-2 g-md-5">
                {Array.from({ length: 9 }).map((_, index) => (
                    <Col key={index}>
                        <Card as="article" className="product-card">
                            <Card.Header as="header">
                                <Card.Title as="h3" className="mb-0 lh-1 fs-4 text-center">{index % 3 === 0 && <TagFill className="me-2" title="On Sale"/>}Joust Duffle Bag</Card.Title>
                            </Card.Header>
                            <Card.Body className="product-details">
                                <figure className="mb-0 text-center">
                                    <Card.Img className="product-image" src="https://commerce246.test/media/catalog/product//m/b/mb01-blue-0.jpg" alt="Joust Duffle Bag" width="240" height="300"/>
                                    <Card.ImgOverlay as="figcaption" className="product-description opacity-75 bg-dark text-light">
                                        <Card.Text className="text-start">
                                            The sporty Joust Duffle Bag can't be beat - not in the gym, not on the luggage carousel,
                                            not anywhere. Big enough to haul a basketball or soccer ball and some sneakers with
                                            plenty of room to spare, it's ideal for athletes with places to go.
                                        </Card.Text>
                                    </Card.ImgOverlay>
                                </figure>
                            </Card.Body>
                            <Card.Footer as="footer">
                                <Container>
                                    <Row className="align-items-center">
                                        <Col sm={6} className="ps-0 product-price">
                                            <span className="regular-price">$34.99</span>
                                            {index % 3 === 0 && <span className="sale-price">$29.99</span>}
                                        </Col>
                                        <Col sm={6} className="pe-0 d-flex justify-content-end">
                                            <Button variant="link" className="favorite-product-button" title="Save to Favorites">
                                                <span className="unfavorited-icon"><Heart/></span>
                                                <span className="favorited-icon"><HeartFill/></span>
                                            </Button>
                                            <Button variant="primary" className="buy-product-button" href="https://commerce246.test/joust-duffle-bag.html" target="_blank"><Cart4 className="align-text-top"/> Buy</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row className="toolbar mt-2 mt-md-5 align-items-center">
                <Col>
                    <p>Showing <strong>1-9</strong> of <strong>27</strong> products.</p>
                </Col>
                <Col className="d-flex justify-content-end">
                    <Pagination>
                        <Pagination.First/>
                        <Pagination.Prev/>
                        <Pagination.Item active>{1}</Pagination.Item>
                        <Pagination.Item>{2}</Pagination.Item>
                        <Pagination.Item>{3}</Pagination.Item>
                        <Pagination.Next/>
                        <Pagination.Last/>
                    </Pagination>
                </Col>
            </Row>
        </Container>
    )
}
