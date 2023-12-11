import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {Github} from 'react-bootstrap-icons'
import {version} from '../../package.json'

export default function Footer(): React.JSX.Element {
    return (
        <footer className="bg-body-tertiary mt-2 mt-lg-5 pt-4" data-testid="page-footer">
            <Container>
                <Row className="align-items-center">
                    <Col>
                        <p>Copyright &copy; {(new Date()).getFullYear().toString()}. Licensed under the <a href="https://joseph-leedy.mit-license.org/" target="_blank">MIT</a> license.</p>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <p>
                            <span className="app-version d-inline-block me-3">Version {version}</span>
                            <a href="https://github.com/JosephLeedy/react-product-viewer" target="_blank" title="View project on GitHub" className="link-dark"><Github size={24}/></a>
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}
