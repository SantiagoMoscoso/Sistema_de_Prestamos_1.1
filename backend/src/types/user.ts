// Lo que esperamos recibir en el body de POST /users
export type CreateUserRequest = {
  name: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

// Lo que la tabla Users realmente tiene (incluye el Id autogenerado)
export type User = {
  Id: number;
  Name: string;
  LastName: string;
  Email: string;
  Password: string;
};