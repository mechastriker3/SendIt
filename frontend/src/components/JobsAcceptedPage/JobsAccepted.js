import React from 'react'
import { Tabs, Tab, Breadcrumb } from 'react-bootstrap'
import AcceptedOngoing from './AcceptedOngoing'
import AcceptedHistory from './AcceptedHistory'

const JobsAccepted = () => {
    return (
        <div className="container" style={{paddingTop: '10px', paddingBottom: '10px'}}>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Jobs Accepted</Breadcrumb.Item>
            </Breadcrumb>
            <br></br>
            <h2>Your Jobs Accepted</h2>
            <p>If you are on mobile you may need to scroll left and right to view the entire table.</p>
            <hr/>
            <Tabs defaultActiveKey="ongoingJobs" id="uncontrolled-tab-jobsaccepted">
                <Tab eventKey="ongoingJobs" title="Ongoing Jobs">
                    <div style={{paddingTop:'10px', paddingBottom:'10px' }}>
                        Here are your ongoing jobs. Once you have picked up the parcel, click the Picked Up button.
                        When the delivery is complete click the Complete button.           
                    </div>
                    <AcceptedOngoing/>
                </Tab>
                <Tab eventKey="jobHistory" title="Job History">
                    <div style={{paddingTop:'10px', paddingBottom:'10px' }}>
                        All your past jobs accepted. You may leave a feedback for your sender.
                    </div>
                    <AcceptedHistory/>
                </Tab>
            </Tabs>
            <footer className="container" style={{paddingTop:'200px'}}>
                <p>Team SendIt</p>
                <p className="text-muted">Orbital 2020 by Joshua and Xing Peng</p>
            </footer>
        </div>
    )
}

export default JobsAccepted