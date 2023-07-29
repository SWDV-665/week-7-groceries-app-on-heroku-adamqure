export class Grocery {
    _id: any | undefined;
    name: string;
    quantity: number;

    constructor(name: string, quantity: number, _id: any | undefined = undefined) {
        this._id = _id
        this.name = name
        this.quantity = quantity
    }
}