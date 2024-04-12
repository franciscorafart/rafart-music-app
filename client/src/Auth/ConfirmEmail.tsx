import { useState, useEffect, useCallback, useMemo } from "react";
import { useRecoilState } from "recoil";
import alert from "atoms/alert";
import { confirmUser, validateJWT } from "requests/auth";
// import Alert from "components/shared/Alert";
import { goHome, isRepeatValid, signUpPasswordValid } from "utils/login";
import { Container, FormElements, FormElement, H2 } from "./shared";
import { Form, Button, FormLabel } from "react-bootstrap";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import styled from "styled-components";

const GreenCheck = styled(CheckCircleIcon)`
  color: green;
  width: 20px;
  padding-left: 5px;
`;

const GrayCheck = styled(CheckCircleIcon)`
  color: gray;
  width: 20px;
  padding-left: 5px;
`;
const Label = styled(FormLabel)`
  color: white;
  margin: 0;
`;

function ConfirmEmail() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);

  const [formPassword, setFormPassword] = useState("");
  const [formRepeatPassword, setFormRepeatPassword] = useState("");

  const [alerta, setAlert] = useRecoilState(alert);

  useEffect(() => {
    const validateToken = async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const recoveryToken = urlParams.get("confirmation") || "";
      const data = await validateJWT(recoveryToken);

      if (data?.success && data.email) {
        setToken(recoveryToken);
        setEmail(data.email);
      } else {
        setTokenExpired(true);
      }
    };

    validateToken();
  }, []);

  const handleFormPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.currentTarget.value;
    setFormPassword(password);
  };

  const handleFormRepeatPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.currentTarget.value;
    setFormRepeatPassword(password);
  };

  const clearMessage = () => {
    setAlert({ display: false, variant: "success", message: "" });
  };

  const handleSubmit = useCallback(
    async (event: React.SyntheticEvent) => {
      event.preventDefault();

      const res = await confirmUser(token, formPassword);

      if (res?.success) {
        setAlert({
          display: true,
          variant: "success",
          message: `Email ${res.email} confirmed. Please log in.`,
        });
        setSuccess(true);
      } else {
        setAlert({
          display: true,
          variant: "error",
          message: res?.msg || "Error sending user confirmation",
        });
      }
    },
    [formPassword, setAlert, token]
  );
  const passwordOk = signUpPasswordValid(formPassword);
  const repeatOk = isRepeatValid(formPassword, formRepeatPassword);

  const formValid = useMemo(
    () => passwordOk && repeatOk,
    [passwordOk, repeatOk]
  );

  // if (tokenExpired) {
  //   return <H2>Link expirado</H2>;
  // }
  return (
    <Container>
      {/* {alerta.display && <Alert />} */}
      <div>
        <div>
          <H2>Confirm your account and set up your password</H2>
          <h6 className="text-center text-gray-900">{email}</h6>

          {success ? (
            <div>
              <Button onClick={goHome} variant="secondary">
                Back
              </Button>
            </div>
          ) : (
            <Form onSubmit={handleSubmit} action="#" method="POST">
              <div>
                <FormElements>
                  <FormElement>
                    <Label htmlFor="password" className="sr-only">
                      Password
                      {passwordOk ? <GreenCheck /> : <GrayCheck />}
                    </Label>
                    <Form.Control
                      id="password"
                      name="password"
                      type="password"
                      onFocus={clearMessage}
                      value={formPassword}
                      onChange={handleFormPassword}
                      autoComplete="current-password"
                      required
                      placeholder="Contraseña"
                    />
                  </FormElement>

                  <FormElement>
                    <Label htmlFor="repeat-password" className="sr-only">
                      Repeat Password
                      {repeatOk ? <GreenCheck /> : <GrayCheck />}
                    </Label>
                    <Form.Control
                      id="repeat-password"
                      name="repeat-password"
                      type="password"
                      onFocus={clearMessage}
                      value={formRepeatPassword}
                      onChange={handleFormRepeatPassword}
                      required
                      placeholder="Repite Contraseña"
                    />
                  </FormElement>
                  <Label>
                    Your password should have at least 8 characters that include
                    at least one letter and one number.
                  </Label>
                </FormElements>
                <Button
                  type="submit"
                  disabled={!Boolean(token) || !formValid}
                  variant="primary"
                >
                  Confirmar
                </Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </Container>
  );
}

export default ConfirmEmail;
