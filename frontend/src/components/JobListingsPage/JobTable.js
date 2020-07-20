import React, { useState, useEffect } from "react"
import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { Button,Row,Col } from 'react-bootstrap'
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'
import axios from 'axios'
import { useAuth0 } from "../../react-auth0-spa"
import config from "../../auth_config.json"
import AcceptCancelJob from "./AcceptCancelJob"
import {Link} from "react-router-dom"
import ViewFeedbackUserLink from "../ViewFeedbackUserPage/ViewFeedbackUserLink"
const { apiOrigin = "http://localhost:5000/api/all-jobs/pending" } = config;

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
}

const JobTable = () => {
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
            />
          <Button variant="secondary" onClick={ handleClick } block>Clear all filters</Button>
        </div>
    )
}

const expandRow = {
  renderer: row => (
    <div>
      <Row>
        <Col md="8" style={{textAlign:'left'}}>
          <p>{ `Pick Up Address: ${row.pickUpAddress.street} ${row.pickUpAddress.unitNo}, Singapore ${row.pickUpAddress.postalNo}` }</p>
          <p>{ `Destination Address: ${row.destinationAddress.street} ${row.destinationAddress.unitNo}, Singapore ${row.destinationAddress.postalNo}` }</p>
          <p>{ `Comments: ${row.comments}` }</p>
        </Col>
        <Col style={{textAlign:'right'}}>
          <AcceptCancelJob
          sender={row.senderID}
          jobid={row._id.$oid}
          />
          <ViewFeedbackUserLink userid={row.senderID}/>
        </Col>
      </Row>
    </div>
  )
}



function ViewFeedbackUserLink2(props) {
  const format_string = props.userid.split('|')[1]
  return(
    <div style={{paddingTop: '8px', paddingBottom: '1px'}}>
      <Link to ={`/viewfeedback/${format_string}`}>View Sender's Feedback</Link>
    </div>
  )
}

export default JobTable;