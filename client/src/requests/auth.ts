import { UserType } from "../utils/types";
import { ResponseStatus } from "../utils/enums";
import { get, post } from "./utils";

type GetResponse = {
  success: boolean;
  data: UserType;
  status: ResponseStatus;
};

type PostResponse = {
  success: boolean;
  email?: string;
  msg?: string;
  status: ResponseStatus;
};

type LoginResponse = PostResponse & {
  id: string;
  email: string;
  token: string;
  role: number;
  msg?: string;
  companyId?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type ResetPasswordPayload = {
  recoveryToken: string;
  password: string;
};

type SignUpPayload = {
  email: string;
};

export const getAuthUser = async () => {
  const user = await get<GetResponse>({
    route: "auth/user",
  });

  return user?.data || null;
};

export const validateJWT = async (recoveryToken: string) => {
  const res = await post<PostResponse>({
    route: "auth/validate-token",
    payload: {
      recoveryToken,
    },
  });
  return res;
};

export const confirmUser = async (
  confirmationToken: string,
  password: string
) => {
  const res = await post<PostResponse>({
    route: "auth/confirm-user",
    payload: {
      confirmationToken,
      password,
    },
  });
  return res;
};

export const login = async (payload: LoginPayload) => {
  const res = await post<LoginResponse>({ route: "auth/login", payload });
  return res;
};

export const signup = async (payload: SignUpPayload) => {
  const res = await post<PostResponse>({ route: "auth/sign-up", payload });
  return res;
};

export const requestPasswordReset = async (payload: LoginPayload) => {
  const res = await post<PostResponse>({
    route: "auth/request-password-reset",
    payload,
  });
  return res;
};

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const res = await post<PostResponse>({
    route: "auth/reset-password",
    payload,
  });
  return res;
};

export const resendConfirm = async (payload: LoginPayload) => {
  const res = await post<PostResponse>({
    route: "auth/resend-confirm",
    payload,
  });
  return res;
};

export const logout = async () => {
  const res = await get<{ success: boolean }>({
    route: "auth/logout",
  });

  localStorage.removeItem("rafartToken");

  return res;
};
