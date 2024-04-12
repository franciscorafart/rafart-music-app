import { useMemo, useState, useEffect, useCallback } from "react";
import { goHome, isRepeatValid, signUpPasswordValid } from "utils/login";
import { useRecoilState } from "recoil";
import alert from "atoms/alert";
// import Alert from "components/shared/Alert";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { resetPassword, validateJWT } from "requests/auth";

function ResetPassword() {
  const [token, setToken] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [alerta, setAlert] = useRecoilState(alert);

  useEffect(() => {
    const validateToken = async () => {
      // TODO: Replacer with useUrlParams hook
      const queryString = window.location.search;

      const urlParams = new URLSearchParams(queryString);

      const recoveryToken = urlParams.get("recovery") || "";
      const res = await validateJWT(recoveryToken);
      if (res?.success) {
        setToken(recoveryToken);
      } else {
        setTokenExpired(true);
      }
    };

    validateToken();
  }, []);

  const [formPassword, setFormPassword] = useState("");
  const [formRepeatPassword, setFormRepeatPassword] = useState("");

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

  const formSuccess = () => {
    setSuccess(true);
    setFormRepeatPassword("");
    setFormPassword("");
  };

  const handleSubmit = useCallback(
    async (event: React.SyntheticEvent) => {
      event.preventDefault();

      const payload = {
        recoveryToken: token,
        password: formPassword,
      };

      const res = await resetPassword(payload);

      if (res?.success) {
        // Place Notification of success, prompt user to log in
        setAlert({
          display: true,
          variant: "success",
          message: `Password reset successful for ${
            res?.email || "user"
          }. Please log in.`,
        });
        formSuccess();
      } else {
        setAlert({
          display: true,
          variant: "error",
          message: `There was an error reseting password`,
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

  if (tokenExpired) {
    return (
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Link expirado
      </h2>
    );
  }

  return (
    <>
      {/* {alerta.display && <Alert />} */}
      <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm space-y-10">
          <div>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Reset Password
            </h2>
          </div>
          {success ? (
            <div>
              <button
                onClick={goHome}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Back
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              action="#"
              method="POST"
            >
              <>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Contraseña
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
                    className="relative block w-full rounded-b-md border-0 pl-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Contraseña"
                  />
                </div>

                <div>
                  <label htmlFor="repeat-password" className="sr-only">
                    Repite Contraseña
                  </label>
                  <input
                    id="repeat-password"
                    name="repeat-password"
                    type="password"
                    onFocus={clearMessage}
                    value={formRepeatPassword}
                    onChange={handleFormRepeatPassword}
                    required
                    className="relative block w-full rounded-b-md border-0 pl-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Repite Contraseña"
                  />
                </div>
                <div className="flex gap-x-2">
                  <label>Contraseña </label>
                  <CheckCircleIcon
                    className={`h-5 w-5 text-${
                      passwordOk ? "green" : "red"
                    }-400`}
                  />
                </div>
                <div className=" flex gap-x-2">
                  <label>Confirmación idéntica </label>
                  <CheckCircleIcon
                    className={`h-5 w-5 text-${repeatOk ? "green" : "red"}-400`}
                  />
                </div>
                <label className="block text-sm font-small leading-6 text-gray-900">
                  Tu contraseña debe tener al menos 8 caracteres que incluyan al
                  menos una letra y un número.
                </label>
              </>

              <div>
                <button
                  type="submit"
                  disabled={!formValid}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Reestablecer contraseña
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
