import React, { useState, useEffect } from "react"
import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { Button, Row, Col, Card } from 'react-bootstrap'
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'
import axios from 'axios'
import { useAuth0 } from "../../react-auth0-spa"
import config from "../../auth_config.json"
import { Link } from "react-router-dom"
import ViewFeedbackDelivererLink from "../ViewFeedbackUserPage/ViewFeedbackDelivererLink"


const { apiOrigin = "http://localhost:5000/api/jobs/completed?by=requested" } = config;

const fragileCheck = {
  true: 'Yes',
  false: 'No'
}

const parcelSizeCheck = {
  Small : 'Small',
  Medium : 'Medium',
  Large : 'Large',
  ExtraLarge : 'Extra Large'
}

let pickUpFilter;
let destinationFilter;
let fragileFilter;
let sizeFilter;

const columns = [{
    dataField: 'pickUpAddress.street',
    text: 'Pick Up Location',
    filter: textFilter({
      getFilter: (filter) => {
        pickUpFilter = filter;
      }
    })
  }, {
    dataField: 'destinationAddress.street',
    text: 'Destination',
    filter: textFilter({
      getFilter: (filter) => {
        destinationFilter = filter;
      }
    })
  }, {
    dataField: 'fragile',
    text: 'Fragile',
    formatter: cell => fragileCheck[cell],
    filter: selectFilter({
        options: fragileCheck,
        getFilter: (filter) => {
          fragileFilter = filter;
        }
    })
  }, {
    dataField: 'parcelSize',
    text: 'Parcel Size',
    formatter: cell => parcelSizeCheck[cell],
    filter: selectFilter({
        options: parcelSizeCheck,
        getFilter: (filter) => {
          sizeFilter = filter;
        }
    })
  }]

const expandRow = {
    renderer: row => (
      <div>
        <Row>
          <Col md="9">
            <Row>
              <Col style={{textAlign:'left'}}>
                <Card text="black" bg="light" border="light" >
                  <Card.Body>
                    <Card.Title>Job details:</Card.Title>
                      <Card.Text>{ `Pick Up Address: ${row.pickUpAddress.street} ${row.pickUpAddress.unitNo}, Singapore ${row.pickUpAddress.postalNo}` }</Card.Text>
                      <Card.Text>{ `Destination Address: ${row.destinationAddress.street} ${row.destinationAddress.unitNo}, Singapore ${row.destinationAddress.postalNo}` }</Card.Text>
                      <Card.Text>{ `Comments: ${row.comments}` }</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col md="3" style={{textAlign:'left'}}>
                <Card text="white" bg="info" border="info" style={{ width: '14rem' }} >
                  <Card.Body>
                    <Card.Title>Deliverer's Details:</Card.Title>
                    <Card.Text>{ `Name: ${row.delivererName}`}</Card.Text>
                    <Card.Text>{ `Contact:  ${row.delivererContactNo}`}</Card.Text>
                  </Card.Body>
                </Card>     
              </Col>
            </Row>
          </Col>
          <Col style={{textAlign:'right'}}>
            {row.senderFeedback === null ? <LeaveFeedback jobid={row._id.$oid}/> : <p>Feedback left</p>}
            <ViewFeedbackDelivererLink userid={row.delivererID}/>
          </Col>
        </Row>        
      </div>
    )
};

function LeaveFeedback(props) {
  return(
    <div>
      <Link to ={`/submitfeedbacksender/${props.jobid}`}>Leave Feedback</Link>
    </div>
  )
}

const options = {
  sizePerPage: 5,
  paginationSize: 4,
  pageStartIndex: 1,
  alwaysShowAllBtns: true,
  withFirstAndLast: false,
  hideSizePerPage: true
};

const handleClick = () => {
  pickUpFilter('');
  destinationFilter('');
  fragileFilter();
  sizeFilter();
};

const PostedHistory = () => {
  const [jobs, setJobs] = useState([])
  const { getTokenSilently } = useAuth0();

  useEffect(() => {
    async function callApi() {
      const token = await getTokenSilently();
      await axios.get(`${apiOrigin}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setJobs(response.data)
        console.log(response)
      }).catch(err => {
        console.log(err)
      })
    }
    callApi();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

        return (
          <div>
            <BootstrapTable
                keyField='_id.$oid'
                data={ jobs }
                columns={ columns }
                expandRow={ expandRow }
                bordered={ false }
                filter={ filterFactory() }
                pagination={ paginationFactory(options) }
                wrapperClasses="table-responsive" 
            />
            <Button variant="secondary" onClick={ handleClick } block>Clear all filters</Button>
          </div>
          )
}

export default PostedHistory;