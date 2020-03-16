import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/modules/secure/user/user.service';
import { Observable, forkJoin } from 'rxjs';
import { PhysiciansService } from 'src/app/modules/secure/user/physicians/physicians.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent implements OnInit {
  @Input() physicianId: string;
  isLoading: boolean;

  user: any;
  constructor(
    private userService: UserService,
    private physiciansService: PhysiciansService,
    private uploadService: UploadService
  ) {
    this.isLoading = true;
  }

  ngOnInit(): void {
    console.log(this.physicianId);
    if (this.physicianId != null) {

      this.getData(this.physicianId).subscribe((resData) => {
        const merge = {...resData[0], ...resData[1], ...resData[2]};
        this.user = merge;
        this.isLoading = false;
      });
    }
  }

  getData(userId: string): Observable<any> {
    const images = this.uploadService.get(userId);
    const users = this.userService.get(userId);
    const physicians = this.physiciansService.get(userId);
    return forkJoin([images, users, physicians]);
  }

}
