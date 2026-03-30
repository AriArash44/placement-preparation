import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter, Router, NavigationEnd } from '@angular/router';
import { ThemeService } from './services/theme/theme.service';
import { DeadlineWatcherService } from './services/deadline/deadline-watcher';
import { Subject } from 'rxjs';

describe('AppComponent', () => {
  const mockThemeService = {
    theme: jasmine.createSpy('theme').and.returnValue('light'),
    toggleTheme: jasmine.createSpy('toggleTheme'),
  };
  const mockDeadlineWatcher = {
    checkOverdueOrNotif: jasmine.createSpy(),
  };
  const routerEvents$ = new Subject();
  const mockRouter = {
    events: routerEvents$.asObservable(),
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(async () => {
    mockThemeService.theme.calls.reset();
    mockThemeService.toggleTheme.calls.reset();
    mockRouter.navigate.calls.reset();
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: ThemeService, useValue: mockThemeService },
        { provide: DeadlineWatcherService, useValue: mockDeadlineWatcher },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should set pageTitle to "add" when navigating to /add', fakeAsync(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([
          { path: 'add', component: AppComponent },
          { path: '', component: AppComponent },
        ]),{ provide: ThemeService, useValue: mockThemeService },
        { provide: DeadlineWatcherService, useValue: mockDeadlineWatcher },
      ],
    });
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const router = TestBed.inject(Router);
    router.navigate(['/add']);
    tick();
    expect(app.pageTitle()).toBe('add');
  }));

  it('should set pageTitle to "todo" when navigating away from /add', fakeAsync(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([
          { path: 'add', component: AppComponent },
          { path: '', component: AppComponent },
        ]),
        { provide: ThemeService, useValue: mockThemeService },
        { provide: DeadlineWatcherService, useValue: mockDeadlineWatcher },
      ],
    });
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const router = TestBed.inject(Router);
    router.navigate(['/']);
    tick();
    expect(app.pageTitle()).toBe('todo');
  }));

  it('should call router.navigate with correct route on goTo', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    app.goTo('/add');
    expect(router.navigate).toHaveBeenCalledWith(['/add']);
  });

  it('should call themeService.toggleTheme when onThemeChange is called', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const themeService = TestBed.inject(ThemeService);
    app.onThemeChange();
    expect(themeService.toggleTheme).toHaveBeenCalledTimes(1);
  });
});
