import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorageReference, AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-brief-chart',
  templateUrl: './brief-chart.component.html',
  styleUrls: ['./brief-chart.component.css']
})
export class BriefChartComponent implements OnInit {
  addCompletedProjectForm = new FormGroup({
    title: new FormControl('', [
      Validators.required
    ]),
    about: new FormControl('', [
      Validators.required
    ]),
    live_link: new FormControl('', [
      Validators.required
    ])
  })
  file: any;

  fileRef: AngularFireStorageReference;

  constructor(private db: AngularFirestore, private aFireStorage: AngularFireStorage) { }

  ngOnInit(): void {
  }


  uploadThumbnail(event) {
    this.file = event.target.files[0];
  }
  onSubmit() {
    const filePath = `/files/${Date.now()}_${this.file.name}`;
    this.fileRef = this.aFireStorage.ref(filePath);
    const task = this.fileRef.put(this.file);
    let formValue = this.addCompletedProjectForm.value;
    console.log(formValue)
    task.snapshotChanges().pipe(
      finalize(() => {
        console.log("HERE")
        this.fileRef.getDownloadURL().subscribe(url => {
          this.db.collection('/completed-projects').add({
            title: formValue.title,
            about: formValue.about,
            live_link: formValue.live_link,
            thumbnail: url
          })
        })
      })
    ).subscribe()

  }
}
