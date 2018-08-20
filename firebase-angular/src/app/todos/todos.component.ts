import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorage } from 'angularfire2/storage';
import { map } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction,
} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit {
  addingTodo: Partial<Todo> = {
    title: '',
    description: '',
  };
  editingTodo: Todo = null;
  todos: Observable<Todo[]>;
  todosCollection: AngularFirestoreCollection<Todo>;
  user: Observable<firebase.User>;
  todoFile: File;
  userUid = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afFirestore: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.user = this.afAuth.authState;

    this.user.subscribe(user => {
      if (!user) {
        return;
      }

      this.userUid = user.uid;

      this.todosCollection = this.afFirestore
        .collection('users')
        .doc(user.uid)
        .collection<Todo>('todos');

      this.todos = this.todosCollection.snapshotChanges().pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Todo;
            data.id = a.payload.doc.id;
            return { ...data };
          })
        )
      );
    });
  }

  addTodo() {
    const { title, description } = this.addingTodo;

    if (!title || !description) {
      alert('Please fill out all fields');
      return;
    }

    const file = this.todoFile;

    if (!file) {
      this.sendTodo(title, description);
      return;
    }

    this.afStorage
      .ref('users')
      .child(this.afAuth.auth.currentUser.uid)
      .child('todos')
      .child(file.name)
      .put(file, {
        contentType: file.type,
      })
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(url => {
        this.sendTodo(title, description, url);
      });
  }

  sendTodo(title, description, image = null) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    this.todosCollection
      .add({
        title,
        description,
        image,
        created_at: timestamp,
      })
      .catch(() => {
        alert('An error occurred.');
      });
  }

  editTodo(todo) {
    console.log(todo);
    this.editingTodo = { ...todo };
    this.editingTodo.id = todo.id;
  }

  saveTodo() {
    this.todosCollection
      .doc(this.editingTodo.id)
      .update(this.editingTodo)
      .then(() => {
        alert('Your to-do has been edited successfully.');
        this.editingTodo = null;
      })
      .catch(() => {
        alert('An error occurred');
      });
  }

  deleteTodo(todo) {
    if (!confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    this.todosCollection
      .doc(todo.id)
      .delete()
      .then(() => {
        alert('Your to-do has been deleted successfully.');
      })
      .catch(() => {
        alert('An error occurred');
      });
  }

  changeFile(event) {
    this.todoFile = event.target.files[0];
  }
}
