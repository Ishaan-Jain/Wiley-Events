import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { SignInService } from 'src/app/services/sign-in.service';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  email: string = "";
  password: string = "";
  adminKey: string = "";

  constructor(private authService: SignInService,private router: Router){}

  OnSubmit(){

    const newUser = {
      email: this.email,
      password: this.password,
      AdminKey: this.adminKey,
      Admin: false
    }

    this.authService.register(newUser).subscribe((res: HttpResponse<any>) =>{
      if(res.status === 200){
        this.router.navigate(['']);
      }
    },
    (err: any) =>{
      alert("Please check all credentials are filled")

    });


  }

}
