import React from 'react'
import {Breadcrumb} from 'react-bootstrap'
import JobTable from './JobTable'

const JobListings = () => {
    return (
        <div className="container" style={{paddingTop: '10px', paddingBottom: '10px'}}>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Job Listings</Breadcrumb.Item>
            </Breadcrumb>
            <br></br>
            <h2>Job Listings</h2>
            <p>If you are on mobile you may need to scroll left and right to view the entire table.</p>
            <div className="container">
                <JobTable/>
            </div>
            <footer className="container" style={{paddingTop:'200px'}}>
                <p>Team SendIt</p>
                <p className="text-muted">Orbital 2020 by Joshua and Xing Peng</p>
            </footer>
        </div>
    )   
}

export default JobListings