import React from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Form, Col, Button, Alert } from 'react-bootstrap'
import axios from 'axios'
import { useAuth0 } from "../../react-auth0-spa"

const schema = yup.object({
    senderFirstName: yup.string().required('Required'),
    senderLastName: yup.string().required('Required'),
    senderContact: yup.string().matches(/^[0-9]{8}$/, 'Invalid number, must be 8 digits').required('Required'),
    pickUpAddress: yup.string().required('Required'),
    pickUpUnitNumber: yup.string().required('Required'),
    pickUpPostal: yup.string().matches(/^[0-9]{6}$/, 'Invalid postal code, must be 6 digits').required('Required'),

    recipientFirstName: yup.string().required('Required'),
    recipientLastName: yup.string().required('Required'),
    recipientContact: yup.string().matches(/^[0-9]{8}$/, 'Invalid number, must be 8 digits').required('Required'),
    destinationAddress: yup.string().required('Required'),
    destinationUnitNumber: yup.string().required('Required'),
    destinationPostal: yup.string().matches(/^[0-9]{6}$/, 'Invalid postal code, must be 6 digits').required('Required'),

    parcelSize: yup.string()
      .oneOf(
        ['Small', 'Medium', 'Large', 'ExtraLarge'],
        'Invalid Parcel Size'
      )
      .required('Required')
})

function SuccessAlert() {
  return(
    <Alert variant="success" style={{marginTop:"10px", textAlign:"left" }} >
      <Alert.Heading>Your Job has been Scheduled!</Alert.Heading>
      <p>
        Your job has been successfully scheduled, a deliverer will accept your job soon.
        You may view your job at the job listings page or the jobs posted page.
      </p>
      <hr />
      Go to{' '}
      <Alert.Link href="/joblistings">Job Listings</Alert.Link>, or go to{' '}
      <Alert.Link href="/jobsposted">Jobs Posted</Alert.Link>
    </Alert>
  )
}

function FormSchedule() {
    return (
        <div className="container" style={{justifyContent:"center"}}>
          <FormInformation/>
        </div>
    )
}
  
function FormInformation() {
  const { user, getTokenSilently } = useAuth0();
  
  return (
      <Formik
        validationSchema={schema}
        initialValues={{
          senderFirstName: '',
          senderLastName: '',
          senderContact: '',
          pickUpAddress: '',
          pickUpUnitNumber: '',
          pickUpPostal: '',
          recipientFirstName: '',
          recipientLastName: '',
          recipientContact: '',
          destinationAddress: '',
          destinationUnitNumber: '',
          destinationPostal: '',
          fragile: false,
          parcelSize: '',
          comments: ''
        }}
        onSubmit={async (values, { setSubmitting, resetForm, setStatus } ) => {
          const token = await getTokenSilently();
          values["senderEmail"] = user.email;
          await axios.post('http://localhost:5000/api/jobs', {
            values
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(response => {
            console.log(response)
            resetForm()  
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
          handleBlur,
          values,
          touched,
          isValid,
          errors,
          isSubmitting,
          status
        }) => (
          <Form onSubmit={handleSubmit}>
            <h4>Sender's Information</h4>
              <Form.Row>
                <Form.Group as={Col} md={{ span:4, offset:2 }} controlId="senderFirstName">
                  <Form.Label>Sender's First name</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="senderFirstName"
                    placeholder="First name"
                    value={values.senderFirstName}
                    onChange={handleChange}
                    isValid={touched.senderFirstName && !errors.senderFirstName}
                    isInvalid={touched.senderFirstName && errors.senderFirstName}
                  />
                </Form.Group>
                  
                <Form.Group as={Col} md="4" controlId="senderLastName">
                  <Form.Label>Sender's Last name</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="senderLastName"
                    placeholder="Last name"
                    value={values.senderLastName}
                    onChange={handleChange}
                    isValid={touched.senderLastName && !errors.senderLastName}
                    isInvalid={touched.senderLastName && errors.senderLastName}
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>   
                <Form.Group as={Col} md={{ span:8, offset:2 }} controlId="pickUpAddress">
                  <Form.Label>Pick Up Address</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Street name and number"
                    name="pickUpAddress"
                    value={values.pickUpAddress}
                    onChange={handleChange}
                    isValid={touched.pickUpAddress && !errors.pickUpAddress}
                    isInvalid={touched.pickUpAddress && errors.pickUpAddress}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.pickUpAddress}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row> 

              <Form.Row>
                <Form.Group as={Col} md={{ span:4, offset:2}} controlId="pickUpUnitNumber">
                  <Form.Label>Unit number</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Unit number"
                    name="pickUpUnitNumber"
                    value={values.pickUpUnitNumber}
                    onChange={handleChange}
                    isValid={touched.pickUpUnitNumber && !errors.pickUpUnitNumber}
                    isInvalid={touched.pickUpUnitNumber && errors.pickUpUnitNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.pickUpUnitNumber}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Enter "-" if unit number is not applicable
                  </Form.Text>
                </Form.Group>
              
                <Form.Group as={Col} md="4" controlId="pickUpPostal">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Postal Code"
                    name="pickUpPostal"
                    value={values.pickUpPostal}
                    onChange={handleChange}
                    isValid={touched.pickUpPostal && !errors.pickUpPostal}
                    isInvalid={touched.pickUpPostal && errors.pickUpPostal}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.pickUpPostal}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} md={{ span:4, offset:2 }} controlId="senderContact">
                  <Form.Label>Sender's Contact number</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="senderContact"
                    placeholder="Contact number"
                    value={values.senderContact}
                    onChange={handleChange}
                    isValid={touched.senderContact && !errors.senderContact}
                    isInvalid={touched.senderContact && errors.senderContact}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.senderContact}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>

              <h4>Recipient's Information</h4>
               
              <Form.Row>
                <Form.Group as={Col} md={{ span:4, offset:2 }} controlId="recipientFirstName">
                  <Form.Label>Recipient's First name</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="recipientFirstName"
                    placeholder="First name"
                    value={values.recipientFirstName}
                    onChange={handleChange}
                    isValid={touched.recipientFirstName && !errors.recipientFirstName}
                    isInvalid={touched.recipientFirstName && errors.recipientFirstName}
                  />
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="recipientLastName">
                  <Form.Label>Recipient's Last name</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="recipientLastName"
                    placeholder="Last name"
                    value={values.recipientLastName}
                    onChange={handleChange}
                    isValid={touched.recipientLastName && !errors.recipientLastName}
                    isInvalid={touched.recipientLastName && errors.recipientLastName}
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>   
                <Form.Group as={Col} md={{ span:8, offset:2 }} controlId="destinationAddress">
                  <Form.Label>Destination Address</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Street name and number"
                    name="destinationAddress"
                    value={values.destinationAddress}
                    onChange={handleChange}
                    isValid={touched.destinationAddress && !errors.destinationAddress}
                    isInvalid={touched.destinationAddress && errors.destinationAddress}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.destinationAddress}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row> 

              <Form.Row>
                <Form.Group as={Col} md={{ span:4, offset:2}} controlId="destinationUnitNumber">
                  <Form.Label>Unit number</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Unit number"
                    name="destinationUnitNumber"
                    value={values.destinationUnitNumber}
                    onChange={handleChange}
                    isValid={touched.destinationUnitNumber && !errors.destinationUnitNumber}
                    isInvalid={touched.destinationUnitNumber && errors.destinationUnitNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.destinationUnitNumber}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Enter "-" if unit number is not applicable
                  </Form.Text>
                </Form.Group>
              
                <Form.Group as={Col} md="4" controlId="destinationPostal">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Postal Code"
                    name="destinationPostal"
                    value={values.destinationPostal}
                    onChange={handleChange}
                    isValid={touched.destinationPostal && !errors.destinationPostal}
                    isInvalid={touched.destinationPostal && errors.destinationPostal}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.destinationPostal}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} md={{ span:4, offset:2 }} controlId="recipientContact">
                  <Form.Label>Recipient's Contact number</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name="recipientContact"
                    placeholder="Contact number"
                    value={values.recipientContact}
                    onChange={handleChange}
                    isValid={touched.recipientContact && !errors.recipientContact}
                    isInvalid={touched.recipientContact && errors.recipientContact}
                  />              
                  <Form.Control.Feedback type="invalid">
                    {errors.recipientContact}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>

              <h4>Additional Details</h4>
              <Form.Row>
                <Form.Group controlId="parcelSize" as={Col} md={{ offset:2, span:3}}>
                  <Form.Label>Select parcel size</Form.Label>
                  <Form.Control
                      as="select"
                      size="sm"
                      name="parcelSize"
                      value={values.parcelSize}
                      onChange={handleChange} 
                      isValid={touched.parcelSize && !errors.parcelSize}
                      isInvalid={touched.parcelSize && errors.parcelSize}
                      custom>
                      <option value="" label="Select a size" />
                      <option value="Small" label="Small" />
                      <option value="Medium" label="Medium" />
                      <option value="Large" label="Large" />
                      <option value="ExtraLarge" label="Extra Large" />
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.parcelSize}
                  </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>

            <br></br>
            <Form.Row>
                <Form.Group as={Col} md={{ span:3, offset:2 }} controlId="fragile">
                <Form.Check
                  name="fragile"
                  label="Yes, my parcel is fragile"
                  value={values.fragile}
                  onChange={handleChange}
                  id="checkbox"
                  checked={values.fragile}
                />
                <Form.Text className="text-muted">
                  Tick this checkbox if your parcel is fragile
                </Form.Text></Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} controlId="comments" md={{span:8, offset:2}}>
                  <Form.Label>Comments</Form.Label>
                  <Form.Control
                    as="textarea" 
                    rows="6"
                    name="comments"
                    value={values.comments}
                    onChange={handleChange}
                    />
                </Form.Group>
            </Form.Row>

            <Button disabled={isSubmitting} type="submit">Submit</Button>
            {status ? <SuccessAlert/> : <div></div>}
            
        </Form> 
        )}
      </Formik>
    )
}

export default FormSchedule;