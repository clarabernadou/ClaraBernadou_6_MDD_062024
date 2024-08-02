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
import { HomePage } from './pages/Home/homePage.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateArticlePage } from './pages/CreateArticlePage/createArticlePage.component';
import { ProfilePage } from './pages/Profile/profilePage.component';
import { ThemesPage } from './pages/ThemesPage/themesPage.component';
import { CreateArticleFormComponent } from './components/Articles/CreateArticleForm/createArticleFormComponent.component';
import { CreateCommentFormComponent } from './components/Comments/create-comment/create-comment-form.component';
import { LoginFormComponent } from './components/Login/LoginForm/loginFormComponent.component';
import { ProfileFormComponent } from './components/Profile/profile/profile-form.component';
import { ArticleFeedComponent } from './components/Articles/ArticleFeed/articleFeedComponent.component';
import { ArticleDetailPage } from './pages/ArticleDetailPage/articleDetailPage.component';
import { ArticlesPage } from './pages/ArticlesPage/articlesPage.component';
import { ThemeFeedComponent } from './components/Themes/Feed/themeFeedComponent.component';
import { createCommentFormComponent } from './components/Comments/CreateComment/createCommentFormComponent.component';
import { CommentFeedComponent } from './components/Comments/CommentFeed/commentFeedComponent.component';
import { BaseCardComponent } from './components/Base/BaseCard/baseCardComponent.component';
import { BaseNavBarComponent } from './components/Base/BaseNavbar/baseNavbarComponent.component';
import { RegisterFormComponent } from './components/Register/RegisterForm/registerFormComponent.component';
import { LoginPage } from './pages/Login/loginPage.component';
import { RegisterPage } from './pages/Register/registerPage.component';
import { ArticleDetailComponent } from './components/Articles/ArticleDetail/articleDetailComponent.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    RegisterPage,
    LoginPage,
    CreateArticlePage,
    ProfilePage,
    ThemesPage,
    CreateArticleFormComponent,
    CreateCommentFormComponent,
    ProfileFormComponent,
    ThemeFeedComponent,
    ArticleFeedComponent,
    ArticleDetailPage,
    ArticlesPage,
    BaseCardComponent,
    createCommentFormComponent,
    CommentFeedComponent,
    BaseNavBarComponent,
    LoginFormComponent,
    RegisterFormComponent,
    ArticleDetailComponent,
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
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
