import { Component, OnInit ,Input} from '@angular/core';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-live-chat',
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.css']
})
export class LiveChatComponent implements OnInit{
  @Input() email !: string;
  message: string = "";
  CHAT_ROOM: string = "Floor 4NE Everybody";
  

  constructor(private socketService: SocketioService) {}

  messageList: string[] = []
  Users: any[] = []


  ngOnInit() {
    this.socketService.setupSocketConnection(this.CHAT_ROOM, this.email);
    this.socketService.getMessage().subscribe((message:string)=> {
      this.messageList.push(message);
    })
    this.socketService.getUsers().subscribe((users: any )=>{
      this.Users = users;
    })
  }

  sendMessage() {
    this.socketService.sendMessage({msg: this.message,room: this.CHAT_ROOM, email: this.email});
  };

  ngOnDestroy() {
    this.socketService.disconnect();
  }

  submitRoom(){
    this.socketService.setupSocketConnection(this.CHAT_ROOM,this.email);
    this.socketService.getMessage().subscribe((message:string)=> {
      this.messageList.push(message);
    })
    //this.socketService.subscribeToMessages();
  }


  // submitMessage(){
  //   if (this.message) {
  //     this.socketService.sendMessage(this.message,this.CHAT_ROOM);
  //   }
  // }

}

