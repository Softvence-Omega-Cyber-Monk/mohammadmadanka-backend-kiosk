export type TUserRole = "superAdmin" | "shopAdmin" 
export const userRole = {
  superAdmin: "superAdmin",

  shopAdmin: "shopAdmin",
} as const;

export type TErrorSource = {
  path: string | number;
  message: string;
}[];
