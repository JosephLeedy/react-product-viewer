import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {Github} from 'react-bootstrap-icons'

export default () => {
    return (
        <footer className="bg-body-tertiary mt-2 mt-lg-5 pt-4">
            <Container>
                <Row className="align-items-center">
                    <Col>
                        <p>Copyright &copy; {(new Date()).getFullYear().toString()}. Licensed under the <a href="https://opensource.org/license/mit/" target="_blank">MIT</a> license.</p>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <p><a href="https://github.com/JosephLeedy/react-product-viewer" target="_blank" title="View project on GitHub" className="link-dark"><Github size={24}/></a></p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}
