import React from 'react'
import { useAuth0 } from "../react-auth0-spa"
import { Navbar, Button, Nav, Image, NavDropdown } from 'react-bootstrap'




function NavBar() {

    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

    const logoutWithRedirect = () => {
      console.log(window.location.origin)
      logout({
        // replace url below with the redirect url after user logs out of your app
        returnTo: `http://localhost:3000`
      })
    };
  
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="/">
                <Image src="https://i.ibb.co/3hKhfLw/send-It-logo.png" alt="SendIt Logo" width="50" height="50" rounded/>           
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
        {
          !isAuthenticated && 
          <Nav className="ml-auto">
            <Button variant="outline-light" onClick={() => loginWithRedirect({})}>Log in</Button>
          </Nav>
        }
        
        {
          isAuthenticated && (   
            <Nav className="ml-auto">
                <Nav>
                    <NavDropdown title="Profile" id="collasible-nav-dropdown">
                        <NavDropdown.Item href="/profile">User Information</NavDropdown.Item>
                        <NavDropdown.Item href="/jobsaccepted">View Jobs Accepted</NavDropdown.Item>
                        <NavDropdown.Item href="/jobsposted">View Jobs Posted</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="/joblistings">Job Listings</Nav.Link>
                    <Nav.Link href="/schedulejobs">Schedule Jobs</Nav.Link>
                </Nav>
                <Nav>
                    <Button variant="outline-light" onClick={() => logoutWithRedirect()}>Log out</Button>
                </Nav>
            </Nav>
          )}       
          </Navbar.Collapse>
      </Navbar>
    );
  };



export default NavBar