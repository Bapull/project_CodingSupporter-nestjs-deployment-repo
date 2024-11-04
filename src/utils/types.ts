export type UserDetails = {
  name:string;
  googleId: string;
  profilePicture: string;
}
export enum ErrorType{
  logical="1",
  syntax="2",
  runtime="3",
  etc="4"
}