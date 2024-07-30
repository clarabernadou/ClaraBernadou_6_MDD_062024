import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  private currentScreenSize = new BehaviorSubject<string>('');

  public displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe((state: BreakpointState) => {
      for (const query of Object.keys(state.breakpoints)) {
        if (state.breakpoints[query]) {
          this.currentScreenSize.next(this.displayNameMap.get(query) ?? 'Unknown');
        }
      }
    });
  }

  public isSmallScreen(): Observable<boolean> {
    return this.currentScreenSize.pipe(
      map(size => size === 'XSmall' || size === 'Small')
    );
  }

  public isLargeScreen(): Observable<boolean> {
    return this.currentScreenSize.pipe(
      map(size => size === 'Medium' || size === 'Large' || size === 'XLarge')
    );
  }

  public getCurrentScreenSize(): Observable<string> {
    return this.currentScreenSize.asObservable();
  }
}