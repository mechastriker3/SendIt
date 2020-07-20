import React from 'react'
import { Tabs, Tab, Breadcrumb } from 'react-bootstrap'
import AcceptedOngoing from './AcceptedOngoing'
import AcceptedHistory from './AcceptedHistory'

const JobsAccepted = () => {
    return (
        <div className="container">
            <Breadcrumb>
                <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Jobs Accepted</Breadcrumb.Item>
            </Breadcrumb>
            <br></br>
            <h1>These are your jobs accepted</h1>
            <hr/>
            <Tabs defaultActiveKey="ongoingJobs" id="uncontrolled-tab-jobsaccepted">
                <Tab eventKey="ongoingJobs" title="Ongoing Jobs">
                    <div>Ongoing Jobs here</div>
                    <AcceptedOngoing/>
                </Tab>
                <Tab eventKey="jobHistory" title="Job History">
                    <div>All past jobs accepted</div>
                    <AcceptedHistory/>
                </Tab>
            </Tabs>
        </div>
    )
}

export default JobsAccepted