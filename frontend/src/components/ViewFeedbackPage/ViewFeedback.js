import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth0 } from '../../react-auth0-spa'
import config from '../../auth_config.json'
import { Button, Card, CardDeck, Breadcrumb } from 'react-bootstrap'



function FeedbackBySender() {
    const [jobs, setJobs] = useState([])
    const { getTokenSilently } = useAuth0();
    const { apiOrigin = "http://localhost:5000/api/jobs/completed?by=delivered" } = config;

    useEffect(() => {
        async function callApi() {
            const token = await getTokenSilently();
            await axios.get(`${apiOrigin}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                setJobs(response.data)
                console.log(response)
            }).catch(err => {
                console.log(err)
            })
        }
        callApi();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return(
        <div>
            <CardDeck>
                {jobs.filter(filterNoFeedbackSender).map(job => (
                    <Card key={job._id.$oid} style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Header as="h5">From: {job.senderFirstName} {job.senderLastName} </Card.Header>
                            <Card.Title>Rating: {job.senderRating}/5</Card.Title>
                            <Card.Text>
                                Feedback: 
                                <br></br>
                                {job.senderFeedback}
                            </Card.Text>
                            
                            <Button variant="primary" href="/jobsposted">View Jobs Posted</Button>
                        </Card.Body>
                    </Card>
                ))}
            </CardDeck>
        </div>
    )
}

function filterNoFeedbackSender(job) {
    return job.senderFeedback !== null
}

function filterNoFeedbackDeliver(job) {
    return job.delivererFeedback !== null
}

function FeedbackByDeliverer() {
    const [jobs, setJobs] = useState([])
    const { getTokenSilently } = useAuth0();
    const { apiOrigin = "http://localhost:5000/api/jobs/completed?by=requested" } = config;

    useEffect(() => {
        async function callApi() {
            const token = await getTokenSilently();
            await axios.get(`${apiOrigin}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                setJobs(response.data)
                console.log(response)
            }).catch(err => {
                console.log(err)
            })
        }
        callApi();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return(
        <div>
            <CardDeck>
                {jobs.filter(filterNoFeedbackDeliver).map(job => (
                    <Card key={job._id.$oid} style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Header as="h6">From: {job.delivererName} </Card.Header>
                            <Card.Title>Rating: {job.delivererRating}/5</Card.Title>
                            <Card.Text>
                                Feedback: 
                                <br></br>
                                {job.delivererFeedback}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </CardDeck>
        </div>
    )
}

function ViewFeedback() {
    return (
        <div className="container" style={{paddingTop: '10px', paddingBottom: '10px'}}>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item href="/profile">Profile</Breadcrumb.Item>
                <Breadcrumb.Item active>View Feedback</Breadcrumb.Item>
            </Breadcrumb>
            <h1>PAST JOBS FEEDBACKS</h1>
            <hr></hr>
        
            <p>Feedback by Senders</p>
            <FeedbackBySender/>
            <p>Feedback by Deliverers</p>
            <FeedbackByDeliverer/>
        </div>
        
    )
}
  
export default ViewFeedback;