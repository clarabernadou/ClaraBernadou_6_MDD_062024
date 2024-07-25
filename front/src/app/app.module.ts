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
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ArticlesComponent } from './pages/articles/articles.component';
import { NavBarComponent } from './components/navbar/navbar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ArticleDetailComponent } from './pages/article_detail/article-detail.component';
import { CreateArticleComponent } from './pages/create_article/create-article.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ThemesComponent } from './pages/themes/themes.component';
import { CreateArticleFormComponent } from './components/form/create-article/create-article-form.component';
import { CardComponent } from './components/card/card.component';
import { ArticleComponent } from './components/article/article.component';
import { CommentsComponent } from './components/article/comments/comments.component';
import { CreateCommentFormComponent } from './components/form/create-comment/create-comment-form.component';
import { LoginFormComponent } from './components/form/login/login-form.component';
import { RegisterFormComponent } from './components/form/register/register-form.component';
import { ProfileFormComponent } from './components/form/profile/profile-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    ArticlesComponent,
    ArticleDetailComponent,
    CreateArticleComponent,
    NavBarComponent,
    ProfileComponent,
    ThemesComponent,
    CreateArticleFormComponent,
    CardComponent,
    ArticleComponent,
    CommentsComponent,
    CreateCommentFormComponent,
    LoginFormComponent,
    RegisterFormComponent,
    ProfileFormComponent,
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
