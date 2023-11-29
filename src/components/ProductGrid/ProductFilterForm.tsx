import React, {ChangeEvent, FormEvent, MouseEvent} from 'react'
import {useCurrentProductFilterContext} from '../../contexts/CurrentProductFilterContext'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import {Filter} from 'react-bootstrap-icons'
import ProductFilter, {ProductFilterType} from '../../types/ProductFilter'
import './ProductFilterForm.scss';

export default function ProductFilterForm(): React.JSX.Element {
    const {currentProductFilter, setCurrentProductFilter} = useCurrentProductFilterContext()
    const handleFilterTypeSelection = (event: MouseEvent<HTMLButtonElement>): void => {
        const filterType: ProductFilterType = event.currentTarget.textContent!.toLowerCase() as ProductFilterType

        setCurrentProductFilter((previousProductFilter: ProductFilter) => ({
            ...previousProductFilter,
            type: filterType,
            isUpdated: true,
        }))

        updateLocationHash(filterType, currentProductFilter.value)
    }
    const handleFilterValueChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const filterValue: string = event.target.value

        setCurrentProductFilter((previousProductFilter: ProductFilter) => ({
            ...previousProductFilter,
            value: filterValue,
            isUpdated: true,
        }))

        updateLocationHash(currentProductFilter.type, filterValue)
    }
    const updateLocationHash = (filterType: ProductFilterType, filterValue: string): void => {
        let locationHash: string = window.location.hash.match(/(#[^?]*)\??/)![1]

        if (filterValue !== '') {
            locationHash += '?' + new URLSearchParams([
                [
                    'filter',
                    filterType
                ],
                [
                    'keyword',
                    filterValue
                ]
            ]).toString()
        }

        window.location.hash = locationHash

        setCurrentProductFilter((previousProductFilter: ProductFilter) => ({
            ...previousProductFilter,
            isUpdated: false,
        }))
    }

    return (
        <Form
            onSubmit={(event: FormEvent): void => {
                event.preventDefault()
            }}
            className="product-filter-form"
            aria-label="Product Filter"
        >
            <InputGroup>
                <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" className="product-filter-type" title="Filter by">
                        <Filter aria-hidden/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item
                            as="button"
                            onClick={handleFilterTypeSelection}
                            active={currentProductFilter.type === ProductFilterType.Name}
                        >
                            Name
                        </Dropdown.Item>
                        <Dropdown.Item
                            as="button"
                            onClick={handleFilterTypeSelection}
                            active={currentProductFilter.type === ProductFilterType.SKU}
                        >
                            SKU
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Form.Control
                    type="search"
                    placeholder="Filter products"
                    className="product-filter-value"
                    value={currentProductFilter.value}
                    onChange={handleFilterValueChange}
                    aria-label="Enter a keyword to filter products in the current category by"
                />
            </InputGroup>
        </Form>
    )
}
