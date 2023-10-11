import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown'

export default () => {
    return (
        <Nav as="ul" className="me-auto">
            <Nav.Item as="li">
                <Nav.Link href="#category-0">Category 0</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
                <Dropdown id="category-1-dropdown">
                    <Dropdown.Toggle as={Nav.Link}>Category 1</Dropdown.Toggle>
                    <Dropdown.Menu as="ul" renderOnMount={true}>
                        <li><Dropdown.Item href="#category-1.1">Category 1.1</Dropdown.Item></li>
                    </Dropdown.Menu>
                </Dropdown>
            </Nav.Item>
            <Nav.Item as="li">
                <Nav.Link href="#category-2">Category 2</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
                <Nav.Link href="#category-3">Category 3</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
                <Dropdown id="category-4-dropdown">
                    <Dropdown.Toggle as={Nav.Link}>Category 4</Dropdown.Toggle>
                    <Dropdown.Menu as="ul" renderOnMount={true}>
                        <li><Dropdown.Item href="#category-4.1">Category 4.1</Dropdown.Item></li>
                    </Dropdown.Menu>
                </Dropdown>
            </Nav.Item>
        </Nav>
    )
}
