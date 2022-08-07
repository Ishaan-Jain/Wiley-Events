import { Injectable } from '@angular/core';
import {Task} from '../Task';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = "http://localhost:5000/tasks";

  constructor(private http: HttpClient) { }

  getTasks(): Observable<any>{
     return this.http.get(this.apiUrl);
  }

  deleteTask(task: Task): Observable<Task>{
      const url = `${this.apiUrl}/${task._id}`;
      return this.http.delete<Task>(url)
  }

  adminDeleteTask(task: Task): Observable<Task>{
    const url = `${this.apiUrl}/admin/${task._id}`;
    return this.http.delete<Task>(url)
  }

  updateTaskReminder(task: Task): Observable<Task>{
    const url = `${this.apiUrl}/${task._id}`;
    return this.http.put<Task>(url,task,httpOptions);
  }

  addTask(task: Task): Observable<Task>{
    return this.http.post<Task>(this.apiUrl,task,httpOptions)
  }

  download(task: Task): Observable<any>{
    return this.http.get(`${this.apiUrl}/${task._id}`);
  }
}
