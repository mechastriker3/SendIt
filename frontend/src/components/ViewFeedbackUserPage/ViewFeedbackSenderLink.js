import React from "react"
import { Link } from "react-router-dom"

function ViewFeedbackSenderLink(props) {
    const format_string = props.userid.split('|')[1]
    return(
      <div style={{paddingTop: '85px', paddingBottom: '1px'}}>
        <Link to ={`/viewfeedback/${format_string}`}>View Sender's Past Feedback</Link>
      </div>
    )
  }

  export default ViewFeedbackSenderLink;