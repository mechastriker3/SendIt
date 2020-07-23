import React from 'react'
import { Breadcrumb } from 'react-bootstrap'
import FormSchedule from './FormSchedule'

const ScheduleJob = () => {
    return (
        <div>
            <div className="container" style={{paddingTop: '10px', paddingBottom: '10px'}}>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Schedule a Job</Breadcrumb.Item>
            </Breadcrumb>
            <br></br>
            <h2>Schedule a Job</h2>
            <p>Fill in your job details in the form given below. Any special requests (eg. deliver by a specific time ) should be included in 
              comments in the additional information section. By default our deliverers will deliver your parcel within the same day if no time is specified.
            </p>
            <hr />
            <div className="col-md-12">
              <FormSchedule />
              <hr/>
            </div>
            <footer className="container" style={{paddingTop:'10px'}}>
                <p>Team SendIt</p>
                <p className="text-muted">Orbital 2020 by Joshua and Xing Peng</p>
            </footer>
        </div></div>
    )
}

export default ScheduleJob