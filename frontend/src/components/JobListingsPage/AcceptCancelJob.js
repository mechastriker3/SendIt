import React, {useState} from 'react'
import { Button, Col, Row, Form, Modal } from 'react-bootstrap'
import { useAuth0 } from "../../react-auth0-spa"
import axios from 'axios'
import config from '../../auth_config.json'
import { Formik } from 'formik'
import * as yup from 'yup'


const AcceptCancelJob = ({sender, jobid}) => {
    const { user, getTokenSilently } = useAuth0();
    const currentjobid = jobid
    const currentUsersName = user.name

    function refreshPage() {
        window.location.reload(false);
    }

    const schema = yup.object({
        delivererName: yup.string().required('Required'),
        delivererContactNo: yup.string().matches(/^[0-9]{8}$/, 'Must be 8 digits').required('Required')
    })
    // function AcceptJob() {
    //     const deliveryJobId = currentjobid
    //     const { apiOrigin = `http://localhost:5000/api/one-job/update-status-id/${deliveryJobId}/accepted` } = config;
    
    //     async function callApi() {
    //         const token = await getTokenSilently();
    //         console.log(token)
    //         await axios.put(`${apiOrigin}`,{}, {
    //             headers: {
    //               Authorization: `Bearer ${token}`
    //             }
    //         })
    //         .then(response => {
    //             console.log(response.data)
    //         })
    //         .catch(error => {
    //             console.log(error)
    //         });
    //     }
    //     callApi();  
    //     return refreshPage();
    // }

    function AcceptJob() {
        const deliveryJobId = currentjobid
        const { apiOrigin = `http://localhost:5000/api/one-job/update-status-id/${deliveryJobId}/accepted` } = config;

        const [show, setShow] = useState(false);

        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

        return (
            <>
              <Button variant="success" onClick={handleShow}>
                Accept Job
              </Button>
        
              <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                  <Modal.Title>Accept Job</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to accept this job? You cannot cancel after you confirm.</p>
                    <Formik
                    validationSchema={schema}
                    initialValues={{
                        delivererName: currentUsersName,
                        delivererContactNo: ''
                    }}
                    onSubmit={async (values, { setSubmitting } ) => {
                        const token = await getTokenSilently();
                        await axios.put(apiOrigin, {
                          values
                        }, {
                          headers: {
                            Authorization: `Bearer ${token}`
                          }
                        })
                        .then(response => {
                          console.log(response)
                        })
                        .catch(error => {
                          console.log(error)
                        })
                        setSubmitting(false)
                        refreshPage();
                      }}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        values,
                        touched,
                        isSubmitting,
                        errors,
                    }) => (
                        <Form onSubmit={handleSubmit}>

                            <Form.Group as={Row} controlId="delivererName">
                                <Form.Label column sm="2">Your Name</Form.Label>
                                <Col sm="10">
                                    <Form.Control 
                                        as="textarea"
                                        value={values.delivererName}
                                        onChange={handleChange}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
        
                            <Form.Group as={Row} controlId="delivererContactNo">
                                <Form.Label column sm="2">Your Contact Number</Form.Label>
                                <Col sm="10">
                                    <Form.Control 
                                        as="textarea"
                                        placeholder="Contact number"
                                        value={values.delivererContactNo}
                                        onChange={handleChange}
                                        isValid={touched.delivererContactNo && !errors.delivererContactNo}
                                        isInvalid={touched.delivererContactNo && errors.delivererContactNo}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors.delivererContactNo}
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                            <Button disabled={isSubmitting} type="submit">Confirm</Button>
                        </Form>
                        )}
                    </Formik>
                </Modal.Body>
              </Modal>
            </>
          );
    }

    function CancelJob() {
        const deliveryJobId = currentjobid
        const { apiOrigin = `http://localhost:5000/api/one-job/${deliveryJobId}` } = config;

        async function callApi() {
            const token = await getTokenSilently();
            console.log(token)
            await axios.delete(`${apiOrigin}`, {
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

    const currentUser = user.sub
    
    if (currentUser === sender ) {
        return <Button onClick={CancelJob} variant="danger" type="submit">Cancel Job</Button>
    }
    return <AcceptJob/>
}

export default AcceptCancelJob;