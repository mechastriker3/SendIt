import React, { Fragment } from "react"
import { useAuth0 } from "../react-auth0-spa"
import "../App.css";
import { Image, Button, Breadcrumb } from "react-bootstrap"

const Profile = () => {
  const { loading, user } = useAuth0();
  
  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <div className="container">
        <Breadcrumb>
          <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item active>Profile</Breadcrumb.Item>
        </Breadcrumb>
        <br></br>
        <Image src={user.picture} alt="Profile" width="100" height="100" roundedCircle/>
        <hr/>
        <div style={{paddingTop: '1px', paddingBottom: '10px'}}>
          {/* <Button variant="primary">Edit Profile</Button>{' '} */}
          {/* <Button variant="secondary" href='/viewfeedback'>View Feedbacks</Button> */}
          <Button variant="secondary" href='/myfeedback'>View Feedbacks</Button>
        </div>
        <div style={{borderStyle: 'groove', paddingTop: '20px', paddingBottom: '20px', width:'50%', margin: 'auto'}}>
          <p style={{color: "grey"}}>Name: {user.name}</p>
          <p style={{color: "grey"}}>Email: {user.email}</p>
          </div>
        </div>
    </Fragment>

  );
};

export default Profile