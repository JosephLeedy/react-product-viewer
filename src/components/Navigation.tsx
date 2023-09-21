import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import {Search} from 'react-bootstrap-icons'
import Categories from './navigation/Categories'
import './Navigation.scss';

export default () => {
    return (
        <header>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand as="h1" className="mb-0">Product Viewer</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Categories/>
                    </Navbar.Collapse>
                    <Form>
                        <InputGroup>
                            <InputGroup.Text>
                                <Search/>
                            </InputGroup.Text>
                            <Form.Control type="text" placeholder="Search"/>
                        </InputGroup>
                    </Form>
                </Container>
            </Navbar>
        </header>
    )
}
