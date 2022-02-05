export class User {
  constructor(
    private _token:string,
    public email : string,
    public expirationDate: number,
    private id : string
  ){}

  get token(){
    return this._token;
  }
  get _id(){
    return this.id;
  }
}
