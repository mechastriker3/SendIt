import React, { useState, useEffect } from 'react'
import "../App.css"
import { Card, Col, Row, Button } from 'react-bootstrap'
import { useAuth0 } from "../react-auth0-spa"
import config from '../auth_config.json'
import axios from 'axios'

function Dashboard() {
    const [ count, setCount ] = useState([])
    const { user, getTokenSilently } = useAuth0()
    const { apiOrigin = "http://localhost:5000/api/jobs-count" } = config;

    useEffect(() => {
        async function callApi() {
            const token = await getTokenSilently();
            await axios.get(`${apiOrigin}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                console.log(response.data)
                setCount(response.data)
            }).catch(err => {
                console.log(err)
            })
        }
        callApi(); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) 
    
        return (
            <div className="background" style={{paddingTop:"50px"}}>
                <h2>Dashboard</h2>  
                <div className="container" style={{paddingTop:"30px"}}>
                    <h4>Welcome {user.name}!</h4>
                    <h5>Here is your Current Activity:</h5>
                    <br></br>
                     
                    <Row>
                        <Col md={{ span: 4, offset: 2 }}>
                        <Card style={{ width: '100%' }}>
                            <Card.Header>
                                <Button variant="outline-dark" href="/jobsposted">Jobs Posted</Button>
                            </Card.Header>
                            <Card.Body>
                            <Card.Text>
                                Pending Jobs: {count.jobsPostedPendingCount}
                            </Card.Text>
                            <Card.Text>
                                Ongoing Jobs: {count.jobsPostedOnGoingCount}
                            </Card.Text>
                            { count.jobsPostedOnGoingCount === 0 && count.jobsPostedPendingCount === 0 ?
                            <Card.Text>You have no jobs pending or ongoing. Schedule a job!</Card.Text>
                            :
                            <div></div>}
                            </Card.Body>
                        </Card>
                        </Col>
                        <Col md={{ span: 4 }}>
                        <Card style={{ width: '100%' }}>
                            <Card.Header>
                            <Button variant="outline-dark" href="/jobsaccepted">Jobs Accepted</Button>
                            </Card.Header>
                            <Card.Body>    
                            <Card.Text>
                                Ongoing Jobs: {count.jobsAcceptedCount}
                            </Card.Text>
                            { count.jobsAcceptedCount === 0 ?
                            <Card.Text>You have not accepted any jobs. Accept a job!</Card.Text>
                            :
                            <div></div>}
                            </Card.Body>
                        </Card>
                        </Col>
                    </Row>
                    
                </div>
                <footer className="container" style={{paddingTop:'400px'}}>
                    <p>Team SendIt</p>
                    <p className="text-muted">Orbital 2020 by Joshua and Xing Peng</p>
                </footer>
            </div>
        )
    
}

export default Dashboard
