export type UserDetails = {
  name:string;
  googleId: string;
  profilePicture: string;
}
export type Message = {
  message: string;
  room: string;
  sender: string;
}
export type Room = {
  id:number;
  receiver:string;
  sender:string
}