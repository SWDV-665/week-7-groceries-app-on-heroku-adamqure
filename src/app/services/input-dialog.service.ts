import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Grocery } from 'src/app/grocery/grocery';


@Injectable({
  providedIn: 'root'
})
export class InputDialogService {

  constructor(public alertCtrl: AlertController,) { }

  async showItemPrompt(title: string, message: string, grocery?: Grocery): Promise<Grocery> {
    return new Promise(async (resolve) => {
      const prompt = await this.alertCtrl.create({
        header: title,
        message: message,
        inputs: [
          {
            name: 'name',
            placeholder: 'Name',
            value: grocery?.name
          },
          {
            name: 'quantity',
            placeholder: 'Quantity',
            value: grocery?.quantity
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: item => {
              console.log('Saved clicked', item);
              resolve(new Grocery(item.name, item.quantity, grocery?._id))
            }
          }
        ]
      });
      await prompt.present();
    });    
  }
}
