import React, {ChangeEvent, FormEvent} from 'react'
import {useSearchQueryContext} from '../../contexts/SearchQueryContext'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import {Search} from 'react-bootstrap-icons'

export default function SearchForm(): React.JSX.Element {
    const {searchQuery, setSearchQuery} = useSearchQueryContext()
    const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const queryValue: string = event.target.value
        let queryString: string = ''

        if (queryValue !== '') {
            queryString = '?' + new URLSearchParams([['query', queryValue]]).toString()
        }

        window.location.hash = '#search' + queryString

        setSearchQuery(queryValue)
    }

    return (
        <Form role="search" onSubmit={(event: FormEvent): void => {event.preventDefault()}}>
            <InputGroup>
                <InputGroup.Text>
                    <Search aria-hidden/>
                </InputGroup.Text>
                <Form.Control
                    type="search"
                    value={searchQuery}
                    placeholder="Search catalog"
                    onChange={handleSearchQueryChange}
                />
            </InputGroup>
        </Form>
    )
}
