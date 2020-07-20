import React from 'react'
import { Form, Button, Col, Alert, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { useAuth0 } from "../../react-auth0-spa"
import config from '../../auth_config.json'

const schema = yup.object({
    delivererFeedback: yup.string().required('Required'),
    delivererRating: yup.number().oneOf(
        [1, 2, 3, 4, 5],
        'Invalid rating'
      ).required('Required')
})

function SuccessAlert() {
    return(
        <Alert variant="success" style={{marginTop:"10px", textAlign:"left" }}>
            <Alert.Heading>Your feedback has been posted.</Alert.Heading>
            Return to{' '}
            <Alert.Link href="/">Dashboard</Alert.Link>
        </Alert>
    )
}

function SubmitFeedbackDel(props) {
    const { getTokenSilently } = useAuth0();
    const currentjobid = props.match.params.jobid

    const { apiOrigin = `http://localhost:5000/api/one-job/update-deliverer-feedback/${currentjobid}` } = config;

    return(
        <div className="container">
                 <br></br>
                 <h3>Leave your feedback Here</h3>
                 <p>Rate your Sender from 1 to 5 and provide additional feedback.</p>
                 <hr></hr>

        <Formik
            validationSchema={schema}
            initialValues={{
                delivererFeedback: '',
                delivererRating: ''
            }}
            onSubmit={async (values, { setSubmitting, setStatus } ) => {
                const token = await getTokenSilently();
                await axios.post(apiOrigin, {
                  values
                }, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                })
                .then(response => {
                  console.log(response)
                  setStatus({ success: true })
                })
                .catch(error => {
                  console.log(error)
                })
                setSubmitting(false)
              }}
        >
            {({
                handleSubmit,
                handleChange,
                values,
                touched,
                isSubmitting,
                errors,
                status
            }) => (
                <Form onSubmit={handleSubmit}>

                    <Form.Group as={Row} controlId="delivererFeedback">
                        <Form.Label column sm="2">Feedback</Form.Label>
                        <Col sm="10">
                        <Form.Control 
                            as="textarea" 
                            rows="4" 
                            placeholder="Your feedback here"
                            name="delivererFeedback"
                            onChange={handleChange}
                            value={values.delivererFeedback}
                            isValid={touched.delivererFeedback && !errors.delivererFeedback}
                            isInvalid={touched.delivererFeedback && errors.delivererFeedback}
                            />
                        </Col>
                    </Form.Group>

                    
                    <Form.Group as={Row} md={{span:4}} controlId="delivererRating">
                        <Form.Label column sm="2">Rate from 1 to 5</Form.Label>
                        <Col sm="3">
                        <Form.Control 
                            as="select"
                            name="delivererRating"
                            onChange={handleChange}
                            value={values.delivererRating}
                            isValid={touched.delivererRating && !errors.delivererRating}
                            isInvalid={touched.delivererRating && errors.delivererRating}
                            >
                            <option value="" label="Select a rating" />
                            <option value="1" label="1" />
                            <option value="2" label="2" />
                            <option value="3" label="3" />
                            <option value="4" label="4" />
                            <option value="5" label="5" />
                        </Form.Control>
                        </Col>
                    </Form.Group>
                    

                    <Button disabled={isSubmitting} type="submit">Submit</Button>
                    {status ? <SuccessAlert/> : <div></div>}
                </Form>
            )}
        </Formik>
        </div>
    )
}

export default SubmitFeedbackDel