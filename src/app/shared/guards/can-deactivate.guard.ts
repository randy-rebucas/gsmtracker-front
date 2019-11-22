import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  // add implement to component you want to trigger this
  // add method to component
  /**
   * canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
   *  if(!this.allowEdit) {
   *    return true;
   *  }
   *  detect changes
   *  if(this.serverName !== this.server.name) {
   *    return confirm('Do you want to discard the changes?');
   *  } else {
   *    return true;
   *  }
   * }
   *
   */
  canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean  | UrlTree {
    return component.canDeactivate();
  }
}
