import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import {Search} from 'react-bootstrap-icons'
import Categories from './navigation/Categories'
import './Navigation.scss';

export default () => {
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand>Product Viewer</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Categories/>
                    </Navbar.Collapse>
                    <Form>
                        <InputGroup>
                            <InputGroup.Text>
                                <Search/>
                            </InputGroup.Text>
                            <Form.Control type="text" placeholder="Search" className="mr-sm-2"/>
                        </InputGroup>
                    </Form>
                </Container>
            </Navbar>
        </>
    )
}
