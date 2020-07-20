import React from 'react'
import {Breadcrumb} from 'react-bootstrap'
import JobTable from './JobTable'

const JobListings = () => {
    return (
        <div className="container">
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Job Listings</Breadcrumb.Item>
            </Breadcrumb>
            <h1>These are the jobs</h1>
            <div className="container">
                <JobTable/>
            </div>
        </div>
    )   
}

export default JobListings