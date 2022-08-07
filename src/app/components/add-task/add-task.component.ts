import { Component, EventEmitter, Output } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';
import {Task} from '../../Task';
import { SignInService } from 'src/app/services/sign-in.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {
  @Output() onAddTask: EventEmitter<Task> = new EventEmitter();
  text: string = "";
  day: string = "";
  reminder: boolean =false;
  showAddTask: boolean = false;
  subscription: Subscription;

  constructor(private uiService: UiService, private login: SignInService){
    this.subscription = this.uiService.onToggle().subscribe((value) => {this.showAddTask = value})
  }

  OnSubmit(){
    if(!this.text){
      alert("Please add a task");
      return
    }

    const newTask = {
      text: this.text,
      day: this.day,
      reminder: this.reminder
    }

    this.onAddTask.emit(newTask);

    this.text = "";
    this.day = "";
    this.reminder = false;

  }


}
