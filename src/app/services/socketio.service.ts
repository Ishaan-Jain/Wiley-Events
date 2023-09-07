import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable, Observer} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket: any;

  constructor() { }

  setupSocketConnection(room :string, email: string) {
    this.socket = io("https://wiley-events-4086e0df4568.herokuapp.com/");
    this.socket.emit('room',room,email);
  }

  sendMessage(Obj: any){
    console.log(Obj.msg)
    this.socket.emit('message', Obj);
  }

  getUsers(){
    return  new Observable((observer: Observer<any>)=>{
      this.socket.on('users', (users:any)=>{
        observer.next(users);
      })
    })
  }


  getMessage(){
  return  new Observable((observer: Observer<any>)=>{
      this.socket.on('message', (message:string)=>{
        observer.next(message);
      })
    })
  }

  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }


}
