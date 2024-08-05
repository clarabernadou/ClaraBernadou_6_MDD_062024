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
import { NotFoundPage } from './pages/PageNotFound/notFoundPage.component';

// consider a guard combined with canLoad / canActivate route option
// to manage unauthenticated user to access private routes
const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'register', component: RegisterPage },
  { path: 'login', component: LoginPage },
  { path: 'articles', component: ArticlesPage },
  { path: 'articles/detail/:id', component: ArticleDetailPage },
  { path: 'articles/create', component: CreateArticlePage },
  { path: 'profile', component: ProfilePage },
  { path: 'themes', component: ThemesPage },
  { path: 'page-not-found', component: NotFoundPage },
  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
