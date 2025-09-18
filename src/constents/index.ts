export type TUserRole = "superAdmin" | "shopAdmin" | "webuser";
export const userRole = {
  superAdmin: "superAdmin",
  shopAdmin: "shopAdmin",
  webuser: "webuser",
} as const;

export type TErrorSource = {
  path: string | number;
  message: string;
}[];
