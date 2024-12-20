export type UserDetails = {
  name:string;
  googleId: string;
  profilePicture: string;
}
export type Message = {
  message: string;
  room: string;
  sender: string;
  senderId:number;
}
export type Room = {
  id:number;
  receiver:string;
  sender:string
}
export type SessionData = {
  cookie:object,
  passport:{
    user:number
  }
}
export interface EmailOption{
  to: string;
  subject: string;
  html: string;
}