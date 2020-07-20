import React from 'react'
import { Tabs, Tab, Breadcrumb } from 'react-bootstrap'
import PostedPending from './PostedPending'
import PostedOngoing from './PostedOngoing'
import PostedHistory from './PostedHistory'

const JobsPosted = () => {
    return (
        <div className="container">
            <Breadcrumb>
                <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Jobs Posted</Breadcrumb.Item>
            </Breadcrumb>
            <h1>These are the jobs you posted</h1>
            <p>Pending - job is pending acceptance</p>
            <p>Ongoing - job has been accepted</p>
            <p>History - completed jobs that you posted</p>
            <hr/>
            <Tabs defaultActiveKey="pendingJobs" id="uncontrolled-tab-jobsposted">
                <Tab eventKey="pendingJobs" title="Pending Jobs">
                    <div>Pending Jobs here</div>
                    <PostedPending/>
                </Tab>
                <Tab eventKey="ongoingJobs" title="Ongoing Jobs">
                    <div>Ongoing Jobs here</div>
                    <PostedOngoing/>
                </Tab>
                <Tab eventKey="jobHistory" title="Job History">
                    <div>Job History here</div>
                    <PostedHistory/>
                </Tab>
            </Tabs>
        </div>
    )
}

export default JobsPosted