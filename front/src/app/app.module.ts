import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePage } from './pages/Home/home.page';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateArticlePage } from './pages/CreateArticle/createArticle.page';
import { ProfilePage } from './pages/Profile/profile.page';
import { ThemesPage } from './pages/Themes/themes.page';
import { CreateArticleFormComponent } from './components/Articles/CreateArticleForm/createArticleForm.component';
import { LoginFormComponent } from './components/Login/loginForm.component';
import { ArticleFeedComponent } from './components/Articles/ArticleFeed/articleFeed.component';
import { ArticleDetailPage } from './pages/ArticleDetail/articleDetail.page';
import { ArticlesPage } from './pages/Articles/articles.page';
import { ThemeFeedComponent } from './components/Themes/Feed/themeFeed.component';
import { CommentFeedComponent } from './components/Comments/CommentFeed/commentFeed.component';
import { BaseCardComponent } from './components/Base/BaseCard/baseCard.component';
import { BaseNavBarComponent } from './components/Base/BaseNavbar/baseNavbar.component';
import { RegisterFormComponent } from './components/Register/registerForm.component';
import { LoginPage } from './pages/Login/login.page';
import { RegisterPage } from './pages/Register/register.page';
import { ArticleDetailComponent } from './components/Articles/ArticleDetail/articleDetail.component';
import { CreateCommentFormComponent } from './components/Comments/CreateComment/createCommentForm.component';
import { ProfileFormComponent } from './components/Profile/profileForm.component';
import { AuthInterceptor } from './utils/interceptors/auth.interceptor';
import { CookieService } from "ngx-cookie-service";

@NgModule({
  declarations: [
    AppComponent,
    CreateArticleFormComponent,
    CreateCommentFormComponent,
    ThemeFeedComponent,
    ArticleFeedComponent,
    BaseCardComponent,
    CommentFeedComponent,
    BaseNavBarComponent,
    LoginFormComponent,
    RegisterFormComponent,
    ArticleDetailComponent,
    CreateCommentFormComponent,
    ProfileFormComponent,
    HomePage,
    RegisterPage,
    LoginPage,
    CreateArticlePage,
    ProfilePage,
    ThemesPage,
    ArticleDetailPage,
    ArticlesPage,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    HttpClientModule, 
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
