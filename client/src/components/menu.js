import React from 'react'
import { Nav, Navbar} from 'react-bootstrap';
import logoImage  from 'assets/logo.png';

const menu = [
    {title: 'All Projects', linkString: '/'},
]

const Menu = () => (
    <>
        <Navbar bg="dark" variant='dark'>
            <Navbar.Brand href="https://rafartmusic.com/"><img
                src={logoImage}
                width="80"
                height="22"
                className="d-inline-block align-center"
                alt="Rafart logo"
            /></Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
                {menu.map(item => <Nav.Link style={{color: 'white'}}href={item.linkString}>{item.title}</Nav.Link>)}
            </Navbar.Collapse>
        </Navbar>
    </>
);

export default Menu;
