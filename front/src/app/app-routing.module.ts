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
import { AuthGuard } from './guards/auth.guard';

// consider a guard combined with canLoad / canActivate route option
// to manage unauthenticated user to access private routes
const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'register', component: RegisterPage },
  { path: 'login', component: LoginPage },
  { 
    path: 'articles', 
    canActivate: [AuthGuard], 
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
  { path: 'profile', component: ProfilePage, canActivate: [AuthGuard] },
  { path: 'themes', component: ThemesPage, canActivate: [AuthGuard] },
  { path: 'page-not-found', component: NotFoundPage },
  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
