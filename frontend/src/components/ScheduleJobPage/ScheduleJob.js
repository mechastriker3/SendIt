import React from 'react'
import { Breadcrumb } from 'react-bootstrap'
import FormSchedule from './FormSchedule'

const ScheduleJob = () => {
    return (
        <div>
            <div className="container">
            <Breadcrumb>
                <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Schedule a Job</Breadcrumb.Item>
            </Breadcrumb>
            <br></br>
            <h1>Schedule a Job</h1>
            <hr />
            <div className="col-md-12">
              <FormSchedule />
              <hr/>
            </div>
            <footer className="container">
              SendIt 2020
            </footer>
        </div></div>
    )
}

export default ScheduleJob