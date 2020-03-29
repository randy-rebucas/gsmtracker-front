import { Component, OnInit, Inject } from '@angular/core';
import { PatientsService } from 'src/app/modules/secure/user/patients/patients.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  patientId: string;
  title: string;
  status: boolean;
  isPassword: string;
  isVisible: boolean;

  form: FormGroup;
  constructor(
    private authenticationService: AuthenticationService,
    private patientsService: PatientsService,
    public dialogRef: MatDialogRef < AuthComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.patientId = data.id;
    this.title = data.title;
  }

  ngOnInit(): void {
    this.patientsService.get(this.patientId)
    .pipe(
      switchMap((patient) => {
        return this.authenticationService.get(patient._id);
      })
    )
    .subscribe((res) => {
      this.status = res.status;
      this.form.patchValue({email: res.auth.email});
      this.form.patchValue({password: this.generatePass});
    });
    // this.authenticationService.get(this.patientId).subscribe((res) => {
    //   console.log(res);
    // });

    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.email,
          Validators.maxLength(50)
        ]
      }),
      password: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(12)
        ]
      })
    });
  }

  get formCtrls() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const newAuth = {
      id: this.patientId,
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.authenticationService.generate(newAuth).subscribe((res) => {
      this.form.reset();
      this.dialogRef.close(res);
    });
  }

  get generatePass() {
    const passwordLength = 10;
    const upperGen = true;
    const numbersGen = true;
    const symbolsGen = false;
    // tslint:disable-next-line: max-line-length
    const lowerLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    // tslint:disable-next-line: max-line-length
    const upperLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    // tslint:disable-next-line: max-line-length
    const specialCharacters = ['!', '"', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'];
    let outCharacters = lowerLetters;
    if (upperGen) {
        outCharacters = outCharacters.concat(upperLetters);
    }
    if (numbersGen) {
        outCharacters = outCharacters.concat(numbers);
    }
    if (symbolsGen) {
        outCharacters = outCharacters.concat(specialCharacters);
    }
    const passwordArray = [];
    for (let i = 1; i < passwordLength; i++) {
        passwordArray.push(outCharacters[Math.floor(Math.random() * outCharacters.length)]);
    }
    return passwordArray.join('');
  }

  onView() {
    this.isVisible = !this.isVisible;
  }
}
