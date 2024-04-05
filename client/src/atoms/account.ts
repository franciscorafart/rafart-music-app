import { atom } from "recoil";

const defaultAccount = {
  userId: "",
  email: "",
  role: 0,
  companyId: "",
};

const account = atom({
  key: "account",
  default: defaultAccount,
});

export default account;
