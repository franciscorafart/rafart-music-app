export type UserType = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  confirmed: boolean;
  role: number;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
};

export type AlertType = {
  display: boolean;
  variant: "success" | "danger" | "warning";
  message: string;
};
