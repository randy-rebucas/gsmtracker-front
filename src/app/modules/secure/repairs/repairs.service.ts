import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';


import { environment } from 'src/environments/environment';
import { Repairs } from './repairs';


const BACKEND_URL = environment.apiUrl + '/repairs';

@Injectable({
  providedIn: 'root'
})
export class RepairsService {

  private repairs: Repairs[] = [];
  private repairsUpdated = new Subject<{ repairs: any[], counts: number }>();
  private selectedSub = new Subject<any>();

  constructor(
    private http: HttpClient
  ) { }

  getAll(perPage: number, currentPage: number, label?: string, userId?: string) {
    const queryParams = `?pagesize=${perPage}&page=${currentPage}&userId=${userId}&labelId=${label}`;
    this.http.get<{message: string, repairs: any, counts: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(userData => {
        return this.getMap(userData);
      })
    )
    .subscribe((transformData) => {
      this.repairSub(transformData);
    });
  }

  repairSub(transformData) {
    this.repairs = transformData.repairs;
    this.repairsUpdated.next({
      repairs: [...this.repairs],
      counts: transformData.max
    });
  }

  getMap(repairData) {

    return { repairs: repairData.repairs.map(repair => {
      let customerName;
      let technicianName;
      if (repair.customerId) {
        const customerFirstname = repair.customerId.userId.name.firstname;
        const customerLastname = repair.customerId.userId.name.lastname;
        customerName = customerLastname.concat(', ', customerFirstname.toString());
      } else {
        customerName = '--no customer--';
      }

      if (repair.technicianId) {
        const technicianFirstname = repair.technicianId.userId.name.firstname;
        const technicianLastname = repair.technicianId.userId.name.lastname;
        technicianName = technicianLastname.concat(', ', technicianFirstname.toString());
      } else {
        technicianName = '--no technician--';
      }
      return {
        id: repair._id,
        customer: customerName,
        phoneInfo: repair.phoneInfo,
        complaint: repair.complaint,
        actionTaken: repair.actionTaken,
        technician: technicianName,
        amountPaid: repair.amountPaid,
        created: repair.createdAt,
        updated: repair.updatedAt,
        owners: repair.owners,
        labels: repair.labels,
        warranty: repair.warranty,
        status: repair.status,
        deleted: repair.deleted,
        release: repair.release
      };
    }), max: repairData.counts};
  }

  getUpdateListener() {
    return this.repairsUpdated.asObservable();
  }

  get(repairId: string) {
    return this.http.get<any>(BACKEND_URL + '/' + repairId);
  }

  insert(newRepair: any) {
    return this.http.post<{ message: string, repairId: string }>(BACKEND_URL, newRepair);
  }

  update(updatedRepair: any) {
    return this.http.put<{ message: string }>(BACKEND_URL + '/' + updatedRepair._id, updatedRepair);
  }

  delete(repairId: string) {
    return this.http.delete<{ message: string, id: string }>(BACKEND_URL + '/' + repairId);
  }

  deleteMany(repairIds: []) {
    const queryParams = `?repairIds=${repairIds}`;
    return this.http.delete<{ message: string }>(BACKEND_URL + queryParams);
  }

  checkOwner(ownerId: string, repairId: string) {
    return this.http.get<any>(BACKEND_URL + '/checkOwnerExist/' + ownerId + '/' + repairId);
  }

  setLabel(repairId: string, labels: any[]) {
    return this.http.get<any>(BACKEND_URL + '/setLabel/' + repairId + '/' + labels);
  }

  setSelectedItem(selectedItem: any) {
    this.selectedSub.next(selectedItem);
  }

  getSelectedItem() {
    return this.selectedSub.asObservable();
  }
}
