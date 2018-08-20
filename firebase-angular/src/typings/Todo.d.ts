declare type Todo = {
  id?: string;
  title: string;
  description: string;
  image: string;
  created_at: firebase.firestore.FieldValue;
};
