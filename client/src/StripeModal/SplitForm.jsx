import React, { useMemo, useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";

import Spinner from 'react-bootstrap/Spinner'

import styled from 'styled-components';
import { Form, FormGroup, FormLabel, FormText, Button, Alert } from 'react-bootstrap';

const useOptions = () => {
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize: 14,
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#aab7c4"
          }
        },
        invalid: {
          color: "#9e2146"
        }
      }
    }),
    [14]
  );

  return options;
};

const FormContainer = styled.div`
    padding: 20px;
`;

const initialFormState = {
    ccNumber: false,
    csv: false,
    expiry: false,
};

const SplitForm = ({
    displayAlert,
    handleClose,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();

  const [errorAlert, setErrorAlert] = useState({display: false, variant: '', message: '' });
  const [spinner, setSpinner] = useState(false);
  const [formEmail, setFormEmail] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formValidState, setFormValidState] = useState(initialFormState);
  const [price, setPrice] = useState(0);


    const clearMessage = () => {
        setErrorAlert({ display: false, variant: '', message: ''});
    };

    const handleFormEmail = e => {
        const emailAddress = e.target.value;
        setFormEmail(emailAddress);
    }

    const handleFormDescription = e => {
        const description = e.target.value;
        setFormDescription(description);
    }

    const handleSubmit = async event => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setSpinner(true);

        const { error, paymentMethod }= await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardNumberElement),
        });

        if (error) {
            setSpinner(false);
            setErrorAlert({
                display: true,
                variant: 'danger',
                message: `There was an error creating payment method: ${error}`,
            });
            return;
        }

        const payload = {
            paymentMethodId: paymentMethod.id,
            amount: Number(price),
            currency: 'usd',
            customerEmail: formEmail,
            customerDescription: formDescription,
        };

        fetch('/get_intent', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
            'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(payload)
        })
        .then((response) => response.json())
        .then((data) => {
            stripe.confirmCardPayment(data.clientSecret, {
                payment_method: paymentMethod.id,
            }).then(result => {
                setSpinner(false);

                if (result.error) {
                    setErrorAlert({ display: true, variant: 'danger', message: result.error.message});
                }

                if (result.paymentIntent) {
                    handleClose();
                    displayAlert(true, 'success', 'Your payment was submitted successfully');
                }
            });
        })
        .catch((error) => {
            setSpinner(false);
            setErrorAlert({ display: true, variant: 'danger', message: `There was an error: ${error}` });
        });
    };

    const formValid = fieldValid => {
        const validFormStateClone = { ...formValidState };
        const updatedFormState = {
            ...validFormStateClone,
            ...fieldValid,
        };

        setFormValidState(updatedFormState);
    };

    const validCheckout = () => Object.values(formValidState).indexOf(false) === -1;

    return (
        <FormContainer>
            <Form onSubmit={handleSubmit}>
                {errorAlert.display && <Alert key={errorAlert.variant} variant={errorAlert.variant}>{errorAlert.message}</Alert>}
                <FormGroup>
                    <FormLabel>Amount (USD)</FormLabel>
                    <Form.Control
                        onFocus={clearMessage}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        type='number'
                        placeholder='30'
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>
                        Email
                    </FormLabel>
                    <Form.Control 
                        onFocus={clearMessage} 
                        onChange={handleFormEmail} 
                        type="email" 
                        placeholder="name@example.com"
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>
                        Card number
                    </FormLabel>
                        <CardNumberElement
                        onFocus={clearMessage}
                        options={options}
                        onReady={() => {}}
                        onChange={e => {
                            const validField = e.complete === true && e.error === undefined;
                            formValid({ ccNumber: validField });
                        }}
                        onBlur={() => {}}
                        />

                </FormGroup>
                <FormGroup>
                    <FormLabel>
                        Expiration date
                    </FormLabel>
                        <CardExpiryElement
                        onFocus={clearMessage}
                        options={options}
                        onReady={() => {}}
                        onChange={e => {
                            const validField = e.complete === true && e.error === undefined;
                            formValid({ expiry: validField });
                        }}
                        onBlur={() => {}}
                        />

                </FormGroup>
                <FormGroup>
                    <FormLabel>
                        CVC
                    </FormLabel>
                        <CardCvcElement
                            onFocus={clearMessage}
                            options={options}
                            onReady={() => {}}
                            onChange={e => {
                                const validField = e.complete === true && e.error === undefined;
                                formValid({ csv: validField });
                            }}
                            onBlur={() => {}}
                        />
                </FormGroup>
                <FormGroup>
                    <FormLabel>
                        Description (optional)
                    </FormLabel>
                    <Form.Control
                        onFocus={clearMessage}
                        onChange={handleFormDescription}
                        options={options}
                        maxLength={25}
                        placeholder="What you're paying for?"
                        onReady={() => {}}
                        onBlur={() => {}}
                    />
                </FormGroup>
                <Button type="submit" variant={validCheckout()? "success": "secondary"} disabled={!stripe || !validCheckout()}>
                    {spinner? <Spinner animation="border"/>: <span>Pay</span>}
                </Button>
            </Form>
        </FormContainer>
    );
};

export default SplitForm;