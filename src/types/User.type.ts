export type User = {
  id: string;
  name: string;
  email: string;
  banned?: boolean;
  role: "admin" | "user";
};
