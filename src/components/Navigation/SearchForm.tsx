import React, {FormEvent} from 'react';
import {useSearchQueryContext} from '../../contexts/SearchQueryContext'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import {Search} from 'react-bootstrap-icons'

export default function SearchForm(): React.JSX.Element {
    const {searchQuery} = useSearchQueryContext()

    return (
        <Form role="search" onSubmit={(event: FormEvent): void => {event.preventDefault()}}>
            <InputGroup>
                <InputGroup.Text>
                    <Search aria-hidden/>
                </InputGroup.Text>
                <Form.Control type="search" value={searchQuery} placeholder="Search catalog"/>
            </InputGroup>
        </Form>
    )
}
