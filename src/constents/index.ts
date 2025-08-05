export type TUserRole = "superAdmin" | "admin" | "user";

export const userRole = {
  superAdmin: "superAdmin",
  user: "user",
  admin: "admin",
} as const;

export type TErrorSource = {
  path: string | number;
  message: string;
}[];
