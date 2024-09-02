import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/Home/home.page';
import { RegisterPage } from './pages/Register/register.page';
import { LoginPage } from './pages/Login/login.page';
import { ArticlesPage } from './pages/Articles/articles.page';
import { ArticleDetailPage } from './pages/ArticleDetail/articleDetail.page';
import { CreateArticlePage } from './pages/CreateArticle/createArticle.page';
import { ProfilePage } from './pages/Profile/profile.page';
import { ThemesPage } from './pages/Themes/themes.page';
import { NotFoundPage } from './pages/NotFound/notFound.page';
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
