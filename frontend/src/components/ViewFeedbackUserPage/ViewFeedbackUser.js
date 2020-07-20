import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth0 } from '../../react-auth0-spa'
import config from '../../auth_config.json'
import { Button, Card, CardDeck } from 'react-bootstrap'



function FeedbackBySender(props) {
    const [jobs, setJobs] = useState([])
    const { getTokenSilently } = useAuth0();
    console.log(props.userid)
    const { apiOrigin = `http://localhost:5000/api/feedback/${props.userid}?by=delivered` } = config;
    const [senderAvgRating, setSenderAvgRating] = useState()
    const avgRatingApiOrigin = `http://localhost:5000/api/avg-rating/${props.userid}?by=delivered`

    useEffect(() => {
        async function callApi() {
            const token = await getTokenSilently();
            const requestOne = await axios.get(`${apiOrigin}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const requestTwo = await axios.get(avgRatingApiOrigin, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            axios.all([requestOne, requestTwo])
            .then(axios.spread((...responses) => {
                setSenderAvgRating(responses[1].data.avgRating)
                setJobs(responses[0].data)

                console.log(responses[0])
                // console.log(responses[1])
            })).catch(err => {
                console.log(err)
            })
        }
        callApi();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    return(
        <div>
            <p>Average rating:  {senderAvgRating}/5</p>
            <CardDeck>
                {jobs.filter(filterNoFeedbackSender).map(job => (
                    <Card style={{ width: '18rem' }}>
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

function FeedbackByDeliverer(props) {
    const [jobs, setJobs] = useState([])
    const { getTokenSilently } = useAuth0();
    const { apiOrigin = `http://localhost:5000/api/feedback/${props.userid}?by=requested` } = config;
    const [delivererAvgRating, setDelivererAvgRating] = useState()
    const avgRatingApiOrigin = `http://localhost:5000/api/avg-rating/${props.userid}?by=requested` 

    useEffect(() => {
        async function callApi() {
            const token = await getTokenSilently();
            const requestOne = axios.get(`${apiOrigin}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const requestTwo = axios.get(avgRatingApiOrigin, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            axios.all([requestOne, requestTwo])
            .then(axios.spread((...responses) => {
                setDelivererAvgRating(responses[1].data.avgRating)
                setJobs(responses[0].data)
                // console.log(responses[0])
                console.log(responses[1])
            })).catch(err => {
                console.log(err)
            })
        }
        callApi();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return(
        <div>
            <p>Average rating:  {delivererAvgRating}/5</p>
            <CardDeck>
                {jobs.filter(filterNoFeedbackDeliver).map(job => (
                    <Card style={{ width: '18rem' }}>
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

function ViewFeedbackUser(props) {
    const currentuserid = props.match.params.userid
    return (
        <div className="container" style={{paddingTop: '10px', paddingBottom: '10px'}}>
            <h1>PAST JOBS FEEDBACKS</h1>
            <hr></hr>
        
            <p>Feedback by Senders</p>
            <FeedbackBySender userid={currentuserid} />
            <p>Feedback by Deliverers</p>
            <FeedbackByDeliverer userid={currentuserid}/>
        </div>
        
    )
}
  
export default ViewFeedbackUser;