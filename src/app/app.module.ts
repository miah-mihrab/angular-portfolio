import { PostService } from 'src/app/services/post/post.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from './../environments/environment';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MessagesComponent } from './components/messages/messages.component';
import { AuthService } from './services/auth-service/auth.service';
import { BlogComponent } from './components/blog/blog.component';
import { PostComponent } from './components/post/post.component';
import { ActionBarComponent } from './components/action-bar/action-bar.component';
import { AdminComponent } from './components/admin/admin.component';
import { AppService } from './services/app/app.service';
import { EditPostComponent } from './components/edit-post/edit-post.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    NavbarComponent,
    MessagesComponent,
    BlogComponent,
    PostComponent,
    ActionBarComponent,
    AdminComponent,
    EditPostComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'blog', component: BlogComponent },
      { path: 'blog/post/:id', component: PostComponent },
      { path: 'edit/post/:id', component: EditPostComponent },
      { path: 'admin', component: AdminComponent }
    ]),
    NgxPaginationModule

  ],
  providers: [AuthService, PostService, AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
