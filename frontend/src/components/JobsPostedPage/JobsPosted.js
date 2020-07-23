import React from 'react'
import { Tabs, Tab, Breadcrumb } from 'react-bootstrap'
import PostedPending from './PostedPending'
import PostedOngoing from './PostedOngoing'
import PostedHistory from './PostedHistory'

const JobsPosted = () => {
    return (
        <div className="container" style={{paddingTop: '10px', paddingBottom: '10px'}}>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Jobs Posted</Breadcrumb.Item>
            </Breadcrumb>
            <br></br>
            <h2>Your Jobs Posted</h2>
            <p>If you are on mobile you may need to scroll left and right to view the entire table.</p>
            <hr/>
            <Tabs defaultActiveKey="pendingJobs" id="uncontrolled-tab-jobsposted">
                <Tab eventKey="pendingJobs" title="Pending Jobs">
                    <div style={{paddingTop:'10px', paddingBottom:'10px' }}>
                        Here are your jobs that are pending acceptance. Wait for a deliverer to accept your Job.
                    </div>
                    <PostedPending/>
                </Tab>
                <Tab eventKey="ongoingJobs" title="Ongoing Jobs">
                    <div style={{paddingTop:'10px', paddingBottom:'10px' }}>
                        Here are your ongoing jobs. A deliverer will be delivering your parcel for you.
                    </div>
                    <PostedOngoing/>
                </Tab>
                <Tab eventKey="jobHistory" title="Job History">
                    <div style={{paddingTop:'10px', paddingBottom:'10px' }}>
                        Your Job History. You may leave a feedback for your deliverer.
                    </div>
                    <PostedHistory/>
                </Tab>
            </Tabs>
            <footer className="container" style={{paddingTop:'200px'}}>
                <p>Team SendIt</p>
                <p className="text-muted">Orbital 2020 by Joshua and Xing Peng</p>
            </footer>
        </div>
    )
}

export default JobsPosted