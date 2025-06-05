export interface Role {
    _id: string;
    name: string;
    description: string;
    permissions: Permission[];
};

export interface Permission  {
    _id: string;
    name: string;
    description: string;
    key: string;
};

export interface User {
  _id: string;
  name: string;
  email: string;
  userId: string;
  roles?: Role[];
  permissions?: Permission[];
}