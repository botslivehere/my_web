import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Navbar.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import App from './App';
import Auth from './Auth';
import NotFound from './NotFound';
import Footer from './Footer';

function NAvbar() {
  return (
    <Router>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Web Diary
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/auth">
                Authorize
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/auth" element={<Auth />} />
        <Route path='*' element={<NotFound/>} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default NAvbar;
