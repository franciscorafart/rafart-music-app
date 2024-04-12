import { Nav, Navbar } from "react-bootstrap";
import logoImage from "assets/logo.png";

const menu = [
  { title: "Login", linkString: "/login" },
  { title: "All Projects", linkString: "/" },
];

const Menu = () => (
  <>
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="https://rafartmusic.com/">
        <img
          src={logoImage}
          width="80"
          height="22"
          className="d-inline-block align-center"
          alt="Rafart logo"
        />
      </Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        {menu.map((item) => (
          <Nav.Link
            key={`menu-${item.title}`}
            style={{ color: "white", padding: "0 10px" }}
            href={item.linkString}
          >
            {item.title}
          </Nav.Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  </>
);

export default Menu;
