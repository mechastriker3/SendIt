import React from 'react'
import { Button } from 'react-bootstrap'
import { useAuth0 } from "../../react-auth0-spa"
import axios from 'axios'
import config from '../../auth_config.json'

const PickUpComplete = ({ jobid, jobstatus }) => {
    const { getTokenSilently } = useAuth0();
    const currentjobid = jobid
    const currentjobstatus = jobstatus

    function refreshPage() {
        window.location.reload(false);
    }

    function PickUp() {
        const deliveryJobId = currentjobid
        const { apiOrigin = `http://localhost:5000/api/one-job/update-status-id/${deliveryJobId}/inProgress` } = config;
    
        async function callApi() {
            const token = await getTokenSilently();
            console.log(token)
            await axios.put(`${apiOrigin}`,{}, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {
                console.log(error)
            });
        }
        callApi();  
        return refreshPage();
    }

    function MarkComplete() {
        const deliveryJobId = currentjobid
        const { apiOrigin = `http://localhost:5000/api/one-job/update-status-id/${deliveryJobId}/completed` } = config;
    
        async function callApi() {
            const token = await getTokenSilently();
            console.log(token)
            await axios.put(`${apiOrigin}`,{}, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {
                console.log(error)
            });
        }
        callApi();  
        return refreshPage();
    }


    if(currentjobstatus === "accepted") {
        return <Button onClick={PickUp} variant="success" type="submit">Picked Up</Button>
    } else { // status == inProgress
        return <Button onClick={MarkComplete} variant="success" type="submit">Completed!</Button>
    }
}

export default PickUpComplete;