import { atom } from "recoil";

const userRoute = atom({
  key: "userRoute",
  default: {
    request: "",
    navigation: "",
  },
});

export default userRoute;
