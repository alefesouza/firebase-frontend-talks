const config = {
    apiKey: '<API_KEY>',
    authDomain: '<PROJECT_ID>.firebaseapp.com',
    databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
    projectId: '<PROJECT_ID>',
    storageBucket: '<BUCKET>.appspot.com',
    messagingSenderId: '<SENDER_ID>',
};

firebase.initializeApp(config);

const settings = {
    timestampsInSnapshots: true
};

const firestore = firebase.firestore();
firestore.settings(settings);
