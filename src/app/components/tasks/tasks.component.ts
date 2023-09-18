import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import {Task} from '../../Task';
import { saveAs } from 'file-saver';
import { SignInService } from 'src/app/services/sign-in.service';
import { EMPTY, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';



@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit{
  tasks: Task[] = []
  admin: boolean = false
  upcomingEvents: Task[] = []
  email_id!: string

  constructor(private taskService: TaskService, private router: Router){}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((Obj) => {
      if(Obj.status === 401){
        this.router.navigate(['/signin']);
      }
      this.tasks = Obj.userEvents;
      this.admin = Obj.admin;
      this.upcomingEvents = Obj.upcomingEvents;
      this.email_id = Obj.userEmail;
      if(this.admin){
        localStorage.setItem("admin","True");
      }
      else{
        localStorage.setItem("admin","False");
      }
      localStorage.setItem("username",this.email_id);
    })
   
  }

  deleteTask(task : Task){
    this.taskService.deleteTask(task).subscribe(() => {
      this.tasks = this.tasks.filter((t) => t._id !== task._id);
    })
  }

  adminDeleteTask(task : Task){
    this.taskService.adminDeleteTask(task).subscribe(() =>{
      this.tasks = this.tasks.filter((t) => t._id !== task._id);
    })
  }

  toggleReminder(task: Task){
    task.reminder = !task.reminder;
    this.taskService.updateTaskReminder(task).subscribe();
    // user ID will be appended to task in the backend
  }

  addTask(task: Task){
    this.taskService.addTask(task).subscribe((task) => {
      this.tasks.push(task)
    })
  }

  downloadRegistered(task: Task){
    this.taskService.download(task).subscribe((user_arr) => {
      const file = new File(user_arr, "foo.txt", {
        type: "text/plain",
      });
      saveAs(file,"particepants.txt")

      // var blob = new Blob(user_arr, {type: "text/plain;charset=utf-8"});
      // saveAs(blob, "students.txt");
    })
  }

}
