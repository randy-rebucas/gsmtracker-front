import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/modules/secure/user/user.service';
import { forkJoin, Observable } from 'rxjs';
import { UploadService } from '../../services/upload.service';
import { PhysiciansService } from 'src/app/modules/secure/user/physicians/physicians.service';

@Component({
  selector: 'app-physician',
  templateUrl: './physician.component.html',
  styleUrls: ['./physician.component.scss']
})
export class PhysicianComponent implements OnInit {
  @Input() physician: string;

  user: any;
  constructor(
    private userService: UserService,
    private physiciansService: PhysiciansService,
    private uploadService: UploadService
  ) { }

  ngOnInit(): void {
    this.getData(this.physician).subscribe((resData) => {
      const merge = {...resData[0], ...resData[1], ...resData[2]};
      console.log(merge);
      this.user = merge;
    });
  }

  getData(userId): Observable<any> {
    const images = this.uploadService.get(userId);
    const users = this.userService.get(userId);
    const physicians = this.physiciansService.get(userId);
    return forkJoin([images, users, physicians]);
  }
}
