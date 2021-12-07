import React from 'react'
import { Container, Nav, Navbar} from 'react-bootstrap';
import logoImage  from 'assets/logo.png';

const menu = [
    {title: 'Home', linkString: 'https://rafartmusic.com/'},
    {title: 'Home', linkString: 'https://rafartmusic.com/'},
    {title: 'Home', linkString: 'https://rafartmusic.com/'},
    {title: 'Home', linkString: 'https://rafartmusic.com/'},
    {title: 'Home', linkString: 'https://rafartmusic.com/'},
    {title: 'Home', linkString: 'https://rafartmusic.com/'},
]

const Menu = () => {
    return(<>
        <Navbar bg="dark" variant="dark" expand='lg'>
            <Navbar.Brand href="https://rafartmusic.com/"><img
                src={logoImage}
                width="80"
                height="30"
                className="d-inline-block align-top"
                alt="Rafart logo"
            /></Navbar.Brand>
            <Nav className="me-auto">
                {menu.map(item => <Nav.Link href={item.linkString}>{item.title}</Nav.Link>)}
            </Nav>
        </Navbar>
        </>
    );
};

export default Menu;
