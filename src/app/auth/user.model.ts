export class User {
  constructor(
    private _token:string,
    public name: string,
    public email : string,
    public expirationDate: number,
    private id : string
  ){}

  get token(){
    return Date.now() < this.expirationDate ? this._token : '' ;
  }
  get _id(){
    return this.id;
  }
}
