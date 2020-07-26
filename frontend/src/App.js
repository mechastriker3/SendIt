import React from 'react'
import './App.css'
import { Router, Switch, Route } from 'react-router-dom'
import { useAuth0 } from "./react-auth0-spa"
import Spinner from 'react-bootstrap/Spinner'
import NavBar from "./components/NavBar"
import Profile from "./components/Profile"
import history from "./utils/history"
import PrivateRoute from "./components/PrivateRoute"
import LandingPage from "./LandingPage"
import JobListings from "./components/JobListingsPage/JobListings"
import ScheduleJob from "./components/ScheduleJobPage/ScheduleJob"
import Dashboard from "./components/Dashboard"
import JobsAccepted from './components/JobsAcceptedPage/JobsAccepted'
import JobsPosted from './components/JobsPostedPage/JobsPosted'
import MyFeedback from './components/MyFeedbackPage/MyFeedback'
import ViewFeedbackUser from './components/ViewFeedbackUserPage/ViewFeedbackUser'
import SubmitFeedbackSender from './components/SubmitFeedbackPage/SubmitFeedbackSender'
import SubmitFeedbackDel from './components/SubmitFeedbackPage/SubmitFeedbackDel'
import AboutPage from './components/AboutPage'


function App() {
  
  const { isAuthenticated, loading } = useAuth0();

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="App centered">
          <div style={{paddingTop: '10px', paddingBottom: '10px'}}>Loading...</div>
          <div>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
          
        </div>
      </div>  
    );
  }

    return (
      <div className="App">
        <Router history={history}>
            <NavBar />
          <Switch>
            {
            !isAuthenticated && 
            <Route exact path="/" component={LandingPage} />
            }
            <Route exact path='/about' component={AboutPage} />
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/jobsaccepted" component={JobsAccepted} />
            <PrivateRoute path="/jobsposted" component={JobsPosted} />
            <PrivateRoute path="/joblistings" component={JobListings} />
            <PrivateRoute path="/schedulejobs" component={ScheduleJob} />
            <PrivateRoute path="/myfeedback" component={MyFeedback} />
            <PrivateRoute path="/viewfeedback/:userid" component={ViewFeedbackUser} />
            <PrivateRoute path="/submitfeedbacksender/:jobid" component={SubmitFeedbackSender} />
            <PrivateRoute path="/submitfeedbackdel/:jobid" component={SubmitFeedbackDel} />
          </Switch>
        </Router>
      </div>
    )
  }

export default App;
