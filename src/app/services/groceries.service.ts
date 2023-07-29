import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map, of, tap } from 'rxjs';
import { Grocery } from 'src/app/grocery/grocery';
import { IonItem, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { IonItemSliding } from '@ionic/angular';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GroceriesService {
  groceries: BehaviorSubject<Array<Grocery>> = new BehaviorSubject(new Array<Grocery>())

  dataChanged: Observable<boolean>;
  private dataChangeSubject: Subject<boolean>;
  
  baseURL = "https://grocery-app-server-723c8d882f69.herokuapp.com";

  constructor(public toastCtrl: ToastController, public alertCtrl: AlertController, private http: HttpClient) { 
    this.dataChangeSubject = new Subject<boolean>();
    this.dataChanged = this.dataChangeSubject.asObservable();
  }

  async editItem(grocery: Grocery, listInput: IonItemSliding) {
    console.log("Editing item:", grocery);
    this.close(listInput);
    this.http.put<Grocery[]>(this.baseURL + "/api/groceries/" + grocery._id, grocery).subscribe(res => {
      console.log(res);
      if (this.containsErrors(res)) {
        this.presentError("Failed to Edit Grocery");
        return;
      }

      this.dataChangeSubject.next(true);
    })
  }

  async removeItem(grocery: Grocery, listInput: IonItemSliding) {
    console.log("Removing Item", grocery);
    this.close(listInput);
    this.http.delete(this.baseURL + "/api/groceries/" + grocery._id).subscribe(res => {
      console.log(res);
      if (this.containsErrors(res)) {
        this.presentError("Failed to Delete Grocery");
        return;
      }

      this.dataChangeSubject.next(true);
    })
  }

  getItems() {
    console.log("Fetching groceries...");
    this.http.get<Grocery[]>(this.baseURL + "/api/groceries").subscribe(res => {
      console.log(res);
      if (this.containsErrors(res)) {
        this.presentError("Failed to Get Groceries");
        return;
      }

      this.groceries.next(res);
      console.log("Received groceries:", res);
    });
  }

  async addItem(grocery: Grocery) {
    console.log("Adding Item");
    this.http.post<Grocery[]>(this.baseURL + "/api/groceries", grocery).subscribe(res => {
      console.log(res);
      if (this.containsErrors(res)) {
        this.presentError("Failed to Add Grocery");
        return;
      }

      this.dataChangeSubject.next(true);
    });
  }

  close(listInput: IonItemSliding) {
    console.log("Closing item...")
    listInput.close();
  }

  private containsErrors(res: any) {
    return !(res instanceof Array);
  }

  private async presentError(title: string) {
    const alert = await this.alertCtrl.create({
      header: "Error",
      message: title,
      buttons: ['OK']
    });

    await alert.present();
  }
}

class Error {
  _message: string;

  constructor(_message: string) {
    this._message = _message;
  }
}