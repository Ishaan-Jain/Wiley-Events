import { Component , Input,Output, EventEmitter} from '@angular/core';
import {Task} from '../../Task';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Input() admin!: boolean;
  @Output() onDeleteTask: EventEmitter<Task> = new EventEmitter();
  @Output() onToggleReminder: EventEmitter<Task> = new EventEmitter();
  @Output() onDownload: EventEmitter<Task> = new EventEmitter();
  @Output() onAdminDeleteTask: EventEmitter<Task> = new EventEmitter();
  faTimes = faTimes;

  OnDelete(task :Task){
    this.onDeleteTask.emit(task);
  }

  onToggle(task: Task){
    this.onToggleReminder.emit(task)
  }

  onClick(task: Task){
    this.onDownload.emit(task);
  }

  OnAdminDelete(task:Task){
    this.onAdminDeleteTask.emit(task)
  }

}
