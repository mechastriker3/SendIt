import React from 'react'
import { Form, Button, Col, Alert, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { useAuth0 } from "../../react-auth0-spa"
import config from '../../auth_config.json'

const schema = yup.object({
    senderFeedback: yup.string().required('Required'),
    senderRating: yup.number().oneOf(
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

function SubmitFeedbackSender(props) {
    const { getTokenSilently } = useAuth0();
    const currentjobid = props.match.params.jobid
    

    const { apiOrigin = `http://localhost:5000/api/one-job/update-sender-feedback/${currentjobid}` } = config;

    return(
        <div className="container">
                 <br></br>
                 <h3>Leave your feedback Here</h3>
                 <p>Rate your Deliverer from 1 to 5 and provide additional feedback.</p>
                 <hr></hr>

        <Formik
            validationSchema={schema}
            initialValues={{
                senderFeedback: '',
                senderRating: ''
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

                    <Form.Group as={Row} controlId="senderFeedback">
                        <Form.Label column sm="2">Feedback</Form.Label>
                        <Col sm="10">
                        <Form.Control 
                            as="textarea" 
                            rows="4" 
                            placeholder="Your feedback here"
                            name="senderFeedback"
                            onChange={handleChange}
                            value={values.senderFeedback}
                            isValid={touched.senderFeedback && !errors.senderFeedback}
                            isInvalid={touched.senderFeedback && errors.senderFeedback}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} md={{span:4}} controlId="senderRating">
                        <Form.Label column sm="2">Rate from 1 to 5</Form.Label>
                        <Col sm="3">
                        <Form.Control 
                            as="select"
                            name="senderRating"
                            onChange={handleChange}
                            value={values.senderRating}
                            isValid={touched.senderRating && !errors.senderRating}
                            isInvalid={touched.senderRating && errors.senderRating}
                            >
                            <option value="" label="Select a rating">Select a rating</option>
                            <option value="1" label="1">1</option>
                            <option value="2" label="2">2</option>
                            <option value="3" label="3">3</option>
                            <option value="4" label="4">4</option>
                            <option value="5" label="5">5</option>
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

export default SubmitFeedbackSender