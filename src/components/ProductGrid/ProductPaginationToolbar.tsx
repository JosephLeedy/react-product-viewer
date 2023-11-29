import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Pagination from 'react-bootstrap/Pagination'

type ProductPaginationToolbarProperties = {
    currentPage: number
    setCurrentPage: (currenPage: number) => void
    pageCount: number
    productCount: number
    startingProductIndex: number
    endingProductIndex: number
}

export default function ProductPaginationToolbar(
    {
        currentPage,
        setCurrentPage,
        pageCount,
        productCount,
        startingProductIndex,
        endingProductIndex
    }: ProductPaginationToolbarProperties
): React.JSX.Element {
    const getLocationHashWithPageNumber = (pageNumber: number): string => {
        const currentLocationHash: string = window.location.hash.match(/([^?]*)\??/)![1]
        const indexOfQueryString: number = window.location.hash.indexOf('?')
        const queryParameters: string = indexOfQueryString !== -1
            ? window.location.hash.substring(indexOfQueryString)
            : ''
        const urlSearchParameters: URLSearchParams = new URLSearchParams(queryParameters)

        urlSearchParameters.set('page', pageNumber.toString(10))

        return currentLocationHash + '?' + urlSearchParameters.toString()
    }

    return (
        <Row
            className="product-pagination-toolbar mt-2 mt-md-5 align-items-center"
            data-testid="product-pagination-toolbar"
        >
            <Col>
                <p className="product-count" data-testid="pagination-product-count">
                    Showing{' '}
                    <strong>{`${startingProductIndex + 1}-${Math.min(endingProductIndex, productCount)}`}</strong>{' '}
                    of{' '}
                    <strong>{productCount}</strong>{' '}
                    products.
                </p>
            </Col>
            {pageCount > 1 &&
                <Col as="nav" className="d-flex justify-content-end">
                    <Pagination>
                        <Pagination.First
                            href={getLocationHashWithPageNumber(1)}
                            onClick={(): void => {
                                setCurrentPage(1)
                                window.scrollTo({
                                    top: 0,
                                    left: 0,
                                    behavior: 'smooth'
                                })
                            }}
                            disabled={currentPage === 1}
                        />
                        <Pagination.Prev
                            href={getLocationHashWithPageNumber(Math.max(currentPage - 1, 1))}
                            onClick={(): void => {
                                setCurrentPage(Math.max(currentPage - 1, 1))
                                window.scrollTo({
                                    top: 0,
                                    left: 0,
                                    behavior: 'smooth'
                                })
                            }}
                            disabled={currentPage === 1}
                        />
                        {Array.from<number>({length: pageCount}).map((_: number, index: number) => (
                            <Pagination.Item
                                key={index}
                                href={getLocationHashWithPageNumber(index + 1)}
                                onClick={(): void => {
                                    setCurrentPage(index + 1)
                                    window.scrollTo({
                                        top: 0,
                                        left: 0,
                                        behavior: 'smooth'
                                    })
                                }}
                                active={(index + 1) === currentPage}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            href={getLocationHashWithPageNumber(Math.min(currentPage + 1, pageCount))}
                            onClick={(): void => {
                                setCurrentPage(Math.min(currentPage + 1, pageCount))
                                window.scrollTo({
                                    top: 0,
                                    left: 0,
                                    behavior: 'smooth'
                                })
                            }}
                            disabled={currentPage === pageCount}
                        />
                        <Pagination.Last
                            href={getLocationHashWithPageNumber(pageCount)}
                            onClick={(): void => {
                                setCurrentPage(pageCount)
                                window.scrollTo({
                                    top: 0,
                                    left: 0,
                                    behavior: 'smooth'
                                })
                            }}
                            disabled={currentPage === pageCount}
                        />
                    </Pagination>
                </Col>
            }
        </Row>
    )
}
