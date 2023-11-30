import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import {Search} from 'react-bootstrap-icons'
import CategoryMenu from './Navigation/CategoryMenu'
import './Navigation.scss';

export default function Navigation() {
    return (
        <header data-testid="page-header">
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand as="h1" className="mb-0">Product Viewer</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <CategoryMenu/>
                        <Form role="search">
                            <InputGroup>
                                <InputGroup.Text>
                                    <Search/>
                                </InputGroup.Text>
                                <Form.Control type="search" placeholder="Search"/>
                            </InputGroup>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}
