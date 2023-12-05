import React from 'react';
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import {Search} from 'react-bootstrap-icons'

export default function SearchForm(): React.JSX.Element {
    return (
        <Form role="search">
            <InputGroup>
                <InputGroup.Text>
                    <Search/>
                </InputGroup.Text>
                <Form.Control type="search" placeholder="Search catalog"/>
            </InputGroup>
        </Form>
    )
}
