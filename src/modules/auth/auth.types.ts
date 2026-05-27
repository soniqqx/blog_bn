export type LoginBody = {
  username: string;
  password: string;
};

export type AuthTokenPayload = {
  sub: number;
  username: string;
};

export type LoginResult = {
  token: string;
  admin: {
    id: number;
    username: string;
  };
};
