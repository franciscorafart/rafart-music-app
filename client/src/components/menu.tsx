import { Nav, Navbar } from "react-bootstrap";
import logoImage from "assets/logo.png";
import account, { defaultAccount } from "atoms/account";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Roles } from "utils/enums";
import { logout } from "requests/auth";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import alert from "atoms/alert";

const fanMenu = [{ title: "Fans", linkString: "/fans" }];
// TODO: Add admin and collaborator Menu

const Menu = () => {
  const [userAccount, setUserAccount] = useRecoilState(account);
  const navigate = useNavigate();
  const setAlert = useSetRecoilState(alert);
  const userExists = useMemo(
    () => userAccount && userAccount.role >= Roles.Fan,
    [userAccount]
  );
  const menu = userExists ? fanMenu : [];

  const onLogout = async () => {
    await logout();
    setUserAccount(defaultAccount);
    setAlert({ display: true, variant: "success", message: "Logged out" });
    navigate("/");
  };

  return (
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
          {userExists && (
            <Nav.Item
              style={{ color: "white", padding: "0 10px", cursor: "pointer" }}
              onClick={onLogout}
            >
              Log out
            </Nav.Item>
          )}
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Menu;
