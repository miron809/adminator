export interface User {
  userName?: string;
  avatar?: string;
  email: string;
  password: string;
  returnSecureToken?: boolean;
  userId?: string;
}

export interface FbAuthResponse {
  idToken: string;
  expiresIn: string;
}
