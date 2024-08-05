import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthToken, Session } from '../interfaces/authSession.interface';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private session: Session = {
    isLogged: false,
    sessionInformation: undefined
  };

  private sessionSubject = new BehaviorSubject<Session>(this.session);

  public getSession(): Observable<Session> {
    return this.sessionSubject.asObservable();
  }

  public logIn(token: AuthToken): void {
    this.session = {
      isLogged: true,
      sessionInformation: token
    };
    this.emitSession();
  }

  public logOut(): void {
    this.session = {
      isLogged: false,
      sessionInformation: undefined
    };
    this.emitSession();
  }

  private emitSession(): void {
    this.sessionSubject.next(this.session);
  }
}