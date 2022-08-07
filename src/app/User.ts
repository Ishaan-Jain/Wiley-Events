export interface User{
  _id ?: number;
  email: string;
  password: string;
  AdminKey?: string;
  Admin?: boolean;
}
