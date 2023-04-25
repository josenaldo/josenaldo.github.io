import React from 'react'
import { Box, Button, TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'

import { useForm, ValidationError } from '@formspree/react'

import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

const ContactForm = () => {
  const [state, handleSubmit, reset] = useForm('mzbqyjrn')
  const formRef = React.useRef(null)
  const [token, setToken] = React.useState('')

  const { executeRecaptcha } = useGoogleReCaptcha()

  const handleReset = () => {
    formRef.current.reset()
    reset()
    state.succeeded = false
  }

  const handleReCaptchaVerify = React.useCallback(async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available')
      return
    }

    const token = await executeRecaptcha('submit')
    console.log('Token: ', token)
    setToken(token)
  }, [executeRecaptcha])

  React.useEffect(() => {
    handleReCaptchaVerify()
  }, [handleReCaptchaVerify])

  console.log('state', state)

  return (
    <>
      {state.succeeded && (
        <Box>
          <h3>Thanks for your message!</h3>
          <Button variant="contained" onClick={handleReset}>
            Reset
          </Button>
        </Box>
      )}

      <Box
        id="contact-form"
        component="form"
        onSubmit={handleSubmit}
        ref={formRef}
        sx={{
          display: state.succeeded ? 'none' : 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 3,
        }}
      >
        {/* <GoogleReCaptcha onVerify={handleVerify} /> */}
        <input
          name="subject"
          value="Message from josenaldo.github.io"
          type="hidden"
        />
        <input name="_gotcha" type="hidden" />
        <input
          name="g-recaptcha-response"
          type="hidden"
          value={token}
          id="g-recaptcha-response"
        />
        <TextField
          error={state.errors.filter((e) => e.field === 'name').length > 0}
          id="name"
          name="name"
          label="Name"
          variant="outlined"
          width="100%"
          required
          min="5"
          helperText={
            <ValidationError prefix="Name" field="name" errors={state.errors} />
          }
        />
        <TextField
          error={state.errors.filter((e) => e.field === 'email').length > 0}
          id="email"
          name="email"
          label="Email"
          variant="outlined"
          required
          helperText={
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
            />
          }
        />
        <TextField
          id="message"
          name="message"
          label="Message"
          multiline
          required
          rows={4}
          helperText={
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
            />
          }
        />
        <LoadingButton
          type="submit"
          loading={state.submitting}
          variant="contained"
        >
          Submit
        </LoadingButton>
      </Box>
    </>
  )
}

export default ContactForm
