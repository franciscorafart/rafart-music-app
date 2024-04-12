import { atom } from "recoil";

export const defaultAccount = {
  userId: "",
  email: "",
  role: 0,
};

const account = atom({
  key: "account",
  default: defaultAccount,
});

export default account;
