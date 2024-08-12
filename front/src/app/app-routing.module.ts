import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/Home/homePage.component';
import { RegisterPage } from './pages/Register/registerPage.component';
import { LoginPage } from './pages/Login/loginPage.component';
import { ArticlesPage } from './pages/ArticlesPage/articlesPage.component';
import { ArticleDetailPage } from './pages/ArticleDetailPage/articleDetailPage.component';
import { CreateArticlePage } from './pages/CreateArticlePage/createArticlePage.component';
import { ProfilePage } from './pages/Profile/profilePage.component';
import { ThemesPage } from './pages/ThemesPage/themesPage.component';
import { NotFoundPage } from './pages/pageNotFound/notFoundPage.component';
import { RequireAuthGuard, PreventAuthAccessGuard } from './utils/guards/auth.guard';

// consider a guard combined with canLoad / canActivate route option
// to manage unauthenticated user to access private routes
const routes: Routes = [
  { path: '', component: HomePage, canActivate: [PreventAuthAccessGuard], canLoad: [PreventAuthAccessGuard], },
  { path: 'register', component: RegisterPage, canActivate: [PreventAuthAccessGuard], canLoad: [PreventAuthAccessGuard], },
  { path: 'login', component: LoginPage, canActivate: [PreventAuthAccessGuard], canLoad: [PreventAuthAccessGuard], },
  { 
    path: 'articles', 
    canActivate: [RequireAuthGuard],
    canLoad: [RequireAuthGuard],
    children: [
      {
        path: '',
        component: ArticlesPage
      },
      {
        path: 'detail/:id', 
        component: ArticleDetailPage
      },
      { 
        path: 'create',
        component: CreateArticlePage
      },
    ]
  },
  { path: 'profile', component: ProfilePage, canActivate: [RequireAuthGuard], canLoad: [RequireAuthGuard] },
  { path: 'themes', component: ThemesPage, canActivate: [RequireAuthGuard], canLoad: [RequireAuthGuard] },
  { path: 'page-not-found', component: NotFoundPage, canActivate: [RequireAuthGuard], canLoad: [RequireAuthGuard] },
  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
