<template>
    <div class="mdl-grid">
        <div class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--1-offset-tablet mdl-cell--8-col-desktop mdl-cell--2-offset-desktop">
            <div class="mdl-card__title">
                <h2 class="mdl-card__title-text">To-Dos</h2>
            </div>
            <ul class="mdl-list">
                <Todo v-for="todo in todos" :key="todo.key" :data='todo' @edit-todo="editTodo(todo)" @delete-todo="deleteTodo(todo)" />
            </ul>
        </div>

        <div v-if="editingTodo" class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--1-offset-tablet mdl-cell--8-col-desktop mdl-cell--2-offset-desktop">
            <div class="mdl-card__title">
                <h2 class="mdl-card__title-text" id="card-title">Edit To-Do</h2>
            </div>
            <div class="mdl-card__supporting-text">
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="text" id="title" v-model="editingTodo.title">
                </div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="text" id="description" v-model="editingTodo.description">
                </div>
            </div>
            <div class="mdl-card__actions mdl-card--border">
                <button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--raised" @click="saveTodo()">
                    Save
                </button>
            </div>
        </div>

        <div class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--1-offset-tablet mdl-cell--8-col-desktop mdl-cell--2-offset-desktop">
            <div class="mdl-card__title">
                <h2 class="mdl-card__title-text" id="card-title">Add To-Do</h2>
            </div>
            <div class="mdl-card__supporting-text">
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="text" id="title" v-model="addingTodo.title">
                    <label class="mdl-textfield__label" for="title">Title</label>
                </div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="text" id="description" v-model="addingTodo.description">
                    <label class="mdl-textfield__label" for="description">Description</label>
                </div>
                <div>
                    <input type="file" id="file" ref="todoFile">
                </div>
            </div>
            <div class="mdl-card__actions mdl-card--border">
                <button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--raised" @click="addTodo()">
                    Add Todo
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase';
import { firestore } from '../utils/vuefire';
import Todo from '../components/Todo.vue';

export default {
  components: {
    Todo,
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.$router.push('/');
        return;
      }

      this.user = user;

      this.$bind(
        'todos',
        firestore
          .collection('users')
          .doc(user.uid)
          .collection('todos')
      );
    });
  },
  data() {
    return {
      todos: [],
      user: null,
      editingTodo: null,
      addingTodo: {
        title: '',
        description: '',
      },
    };
  },
  methods: {
    addTodo() {
      const { title, description } = this.addingTodo;

      if (!title || !description) {
        alert('Please fill out all fields');
        return;
      }

      const file = this.$refs.todoFile.files[0];

      if (!file) {
        this.sendTodo(title, description);
        return;
      }

      const ref = firebase.storage().ref();

      ref
        .child('users')
        .child(this.user.uid)
        .child('todos')
        .child(file.name)
        .put(file, {
          contentType: file.type,
        })
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          this.sendTodo(title, description, url);
        });
    },
    editTodo(todo) {
      this.editingTodo = { ...todo };
      this.editingTodo.id = todo.id;
    },
    saveTodo() {
      this.$firestoreRefs.todos
        .doc(this.editingTodo.id)
        .update(this.editingTodo)
        .then(() => {
          alert('Your to-do has been edited successfully.');
          this.editingTodo = null;
        })
        .catch(() => {
          alert('An error occurred');
        });
    },
    sendTodo(title, description, image = null) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();

      this.$firestoreRefs.todos
        .add({
          title,
          description,
          image,
          created_at: timestamp,
        })
        .catch(() => {
          alert('An error occurred.');
        });
    },
    deleteTodo(todo) {
      if (!confirm('Are you sure you want to delete this todo?')) {
        return;
      }

      this.$firestoreRefs.todos
        .doc(todo.id)
        .delete()
        .then(() => {
          alert('Your to-do has been deleted successfully.');
        })
        .catch(() => {
          alert('An error occurred');
        });
    },
  },
};
</script>
