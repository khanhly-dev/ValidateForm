import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators, NG_ASYNC_VALIDATORS, AsyncValidator } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// export function forbiddenUsername(c : AbstractControl)
// {
//   const user = ['admin', 'manager'];
//   return (user.includes(c.value)) ? {
//     invalidUsername : true
//   } : null
// }
const users = ['admin', 'manager'];

export function forbiddenUsername(user = [])
{
  return (c : AbstractControl) => {
    return (user.includes(c.value)) ? {
      invalidUsername : true
    } : null
  };
}

export function comparePass(c : AbstractControl)
{
  const v = c.value;
  return(v.pass === v.confirmPass)? null : 
  {
    passNotMacth : true
  }
}


@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent implements OnInit {

  isAlterEgoTaken(alterEgo: string): Observable<boolean> {
    const isTaken = users.includes(alterEgo);

    return of(isTaken).pipe();
  }

  validate(control : AbstractControl) : Observable<ValidationErrors | null>
  {
    return this.isAlterEgoTaken(control.value).pipe(
      map(isTaken => (isTaken ? { concac1: true } : null)),
      catchError(() => of(null))
    );
  }

  public myForm = new FormGroup(
    {
      user1: new FormControl('', {
        asyncValidators: [this.validate.bind(this)],
        updateOn: 'blur'
      }),
      //user :new FormControl('', [Validators.required, Validators.minLength(5)], forbiddenUsername),
      //user :new FormControl('', [Validators.required, Validators.minLength(5), forbiddenUsername(['admin', 'manager'])]),
      passGroup: new FormGroup(
        {
          pass: new FormControl('', [Validators.required, Validators.minLength(8)]),
          confirmPass: new FormControl('', [Validators.required, Validators.minLength(8)])
        },{
          validators : comparePass
        }
      )
      
    }
  )

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(){
    console.log(this.myForm.value.user)
    // console.log(this.myForm.controls.name)
  }
}
