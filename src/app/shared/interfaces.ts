export interface User {
  displayName?: string;
  photoUrl?: string;
  email: string;
  password?: string;
  returnSecureToken?: boolean;
  idToken?: string;
}

export interface FbAuthResponse {
  idToken: string;
  expiresIn: string;
}
