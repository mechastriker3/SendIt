import React from "react"
import {Link} from "react-router-dom"

function ViewFeedbackUserLink(props) {
    const format_string = props.userid.split('|')[1]
    return(
      <div style={{paddingTop: '8px', paddingBottom: '1px'}}>
        <Link to ={`/viewfeedback/${format_string}`}>View Sender's Feedback</Link>
      </div>
    )
  }

  export default ViewFeedbackUserLink;