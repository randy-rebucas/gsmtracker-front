import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-technician-chip-list',
  templateUrl: './technician-chip-list.component.html',
  styleUrls: ['./technician-chip-list.component.scss']
})
export class TechnicianChipListComponent implements OnInit {
  @Input() technicianId: string;

  public technicianName: string;
  public isLoadingName: boolean;
  constructor(
    private userService: UserService
  ) {
    this.isLoadingName = true;
  }

  ngOnInit(): void {
    this.userService.get(this.technicianId).subscribe((userResponse) => {
      this.isLoadingName = false;
      const technicianFirstname = userResponse.name.firstname;
      const technicianLastname = userResponse.name.lastname;
      this.technicianName = technicianLastname.concat(', ', technicianFirstname.toString());
    });
  }

}
