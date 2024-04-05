import { useEffect, useMemo, useState } from "react";
import account from "atoms/account";
import alert from "atoms/alert";
import {
  goHome,
  passwordValid,
  signUpPasswordValid,
  validateEmail,
} from "utils/login";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  login,
  requestPasswordReset,
  resendConfirm,
  signup,
} from "requests/auth";
// import Alert from "components/shared/Alert";

export default function Example() {
  const [formMode, setFormMode] = useState<
    "login" | "password" | "resend-confirm" | "signup"
  >("login");
  const setUserAccount = useSetRecoilState(account);
  const [alerta, setAlert] = useRecoilState(alert);

  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const resetForm = () => {
    setFormEmail("");
    setFormPassword("");
    setRepeatPassword("");
  };

  useEffect(() => {
    resetForm();
  }, [formMode]);

  const clearMessage = () => {
    setAlert({ display: false, variant: "success", message: "" });
  };

  const handleFormEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailAddress = e.currentTarget.value;
    setFormEmail(emailAddress);
  };

  const handleFormPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.currentTarget.value;
    setFormPassword(password);
  };

  const handleFormRepeatPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.currentTarget.value;
    setRepeatPassword(password);
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const payload = {
      email: formEmail,
      password: formPassword || "",
      confirmPassword: repeatPassword || "",
    };
    let data;
    if (formMode === "password") {
      data = await requestPasswordReset(payload);
      if (data?.success) {
        setAlert({
          display: true,
          variant: "success",
          message: `Email de recuperación de contraseña enviado a ${data.email}.`,
        });
      } else {
        setAlert({
          display: true,
          variant: "error",
          message:
            data?.msg ||
            "No se pudo enviar el email de recuperación de contraseña",
        });
      }
    } else if (formMode === "resend-confirm") {
      data = await resendConfirm(payload);
      if (data?.success) {
        setAlert({
          display: true,
          variant: "success",
          message: `Email de confirmación de usuario enviado a ${data.email}.`,
        });
      } else {
        setAlert({
          display: true,
          variant: "error",
          message: data?.msg || "No se pudo enviar el email de confirmación",
        });
      }
    } else if (formMode === "signup") {
      data = await signup(payload);
      if (data?.success) {
        setAlert({
          display: true,
          variant: "success",
          message: `User created successfully. Please check your email for a confirmation link.`,
        });
        setFormMode("login");
      } else {
        setAlert({
          display: true,
          variant: "error",
          message: data?.msg || "Error creating user. Please try again.",
        });
      }
    } else {
      data = await login(payload);
      if (data?.success) {
        localStorage.setItem("rafartToken", data.token);
        setAlert({
          display: true,
          variant: "success",
          message: `Log in exitoso`,
        });

        setUserAccount({
          userId: data.id,
          email: data.email,
          role: data.role,
          companyId: "", // We get it later from getUser
        });
        goHome();
      } else {
        setAlert({
          display: true,
          variant: "error",
          message: data?.msg || "Error de log in",
        });
      }
    }
  };

  const formValid = useMemo(() => {
    if (formMode === "signup") {
      return (
        validateEmail(formEmail) &&
        signUpPasswordValid(formPassword) &&
        formPassword === repeatPassword
      );
    } else if (formMode === "login") {
      return validateEmail(formEmail) && passwordValid(formPassword);
    } else {
      return validateEmail(formEmail);
    }
  }, [formMode, formEmail, formPassword, repeatPassword]);

  return (
    <>
      {/* {alerta.display && <Alert />} */}
      <div>
        <div>
          <div>
            {/* <img
              className="mx-auto h-10 w-auto"
              src=""
              alt="Rafart Logo"
            /> */}
            <h2>Entra en tu cuenta</h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            action="#"
            method="POST"
          >
            <div>
              <div />
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Dirección Email
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  onFocus={clearMessage}
                  value={formEmail}
                  onChange={handleFormEmail}
                  // disabled={validateEmail(formEmail)}
                  required
                  placeholder="example@email.com"
                />
              </div>
              {(formMode === "login" || formMode === "signup") && (
                <>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
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
                  </div>

                  <label htmlFor="" className="sr-only">
                    Your password must contain at least 8 characters, including
                    at least one letter and one number.
                  </label>
                </>
              )}
              {formMode === "signup" && (
                <div>
                  <label htmlFor="confirm-password" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="confirm-password"
                    onFocus={clearMessage}
                    value={repeatPassword}
                    onChange={handleFormRepeatPassword}
                    autoComplete="confirm-password"
                    required
                    placeholder="Confirm Password"
                  />
                </div>
              )}
            </div>

            <div>
              <button type="submit" disabled={!formValid}>
                {formMode === "login"
                  ? "Log In"
                  : formMode === "password"
                  ? "Reset Password"
                  : formMode === "signup"
                  ? "Sign up"
                  : "Resend confimation email"}
              </button>
            </div>
            <div>
              {formMode === "login" ? (
                <>
                  <div>
                    <div onClick={() => setFormMode("password")}>
                      Forgot your password?
                    </div>

                    <div onClick={() => setFormMode("resend-confirm")}>
                      Resend confirmation email
                    </div>
                    <div onClick={() => setFormMode("signup")}>Sign up</div>
                  </div>
                </>
              ) : (
                <div>
                  <div onClick={() => setFormMode("login")}>Sign In</div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
