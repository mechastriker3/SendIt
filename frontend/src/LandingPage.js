import React from 'react'
import { Button, Jumbotron, Container } from 'react-bootstrap'
import './cssFiles/Landing.css';

class LandingPage extends React.Component {
    render() {
    return (
        <div>
            <Jumbotron fluid>
                <Container>
                    <h1 className="display-3">SendIt</h1>
                    <p>
                    Your number one solution for parcel delivery.
                    </p>
                    <Button href="/about" variant="outline-dark">Learn more</Button>
                </Container>
            </Jumbotron>

            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h2>Schedule a Job</h2>
                        <p>Create an account with us, schedule a job 
                            and provide us the neccessary details.
                            Let us know your parcel size, whether it is 
                            fragile, pick up address, delivery address
                            as well as your timings and you are set!
                        </p>
                    </div>

                    <div className="col-md-4">
                        <h2>Job Accepted</h2>
                        <p>A user will pick up your parcel 
                            and deliver it for you. These are users that 
                            are commuting to a location near 
                            to where you want your parcel delivered. 
                        </p>
                    </div>

                    <div className="col-md-4">
                        <h2>Delivered!</h2>
                        <p>Your parcel is successfully delivered! 
                            It's that simple!
                        </p>
                    </div>
                </div>
                <hr />
            </div>
            
            

            <footer className="container">
                <p>Team SendIt</p>
                <p className="text-muted">Orbital 2020 by Joshua and Xing Peng</p>
            </footer>

        </div>
    )}
}

export default LandingPage