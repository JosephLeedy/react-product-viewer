import React from 'react'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import CategoryMenu from './Navigation/CategoryMenu'
import SearchForm from './Navigation/SearchForm'
import './Navigation.scss';

export default function Navigation(): React.JSX.Element {
    return (
        <header data-testid="page-header">
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand as="h1" className="mb-0">Product Viewer</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <CategoryMenu/>
                        <SearchForm/>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}
