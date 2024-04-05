import { atom } from "recoil";
import { AlertType } from "utils/types";

const defaultAlert: AlertType = {
  display: false,
  variant: "success",
  message: "Success!",
};

const alert = atom({
  key: "alert",
  default: defaultAlert,
});

export default alert;
