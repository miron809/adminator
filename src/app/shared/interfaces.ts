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

export interface Email {
  fromName: string;
  fromEmail: string;
  date: Date;
  avatar: string;
  to: string;
  subject: string;
  text: string;
}

export interface Chart {
  backgroundColor: string;
  borderColor: string;
  label: string;
  value: number;
}

export interface ToDo {
  id: number;
  text: string;
  isDone: boolean;
}
