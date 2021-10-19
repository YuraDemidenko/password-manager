import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
import { getFirestore, doc, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot, getDoc, collection, query, wher} from "firebase/firestore"
import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";

const firebaseApp = initializeApp({
    apiKey: "AIzaSyBFUESXzMJHatvgXZxl80i2lvgerP6mXwY",
    authDomain: "password-manager-8f21e.firebaseapp.com",
    projectId: "password-manager-8f21e",
    storageBucket: "password-manager-8f21e.appspot.com",
    messagingSenderId: "791009326064",
    appId: "1:791009326064:web:1b29e1af2ae529686d2335",
    measurementId: "G-NQ7FGCHQH6"
});

const db = getFirestore(firebaseApp);
const auth = getAuth();


const initialState = {
    isRegistrated: false,
    isLogedIn: false,
    records: [],
    
}


export const getRecords = createAsyncThunk( 
    'users/getRecords',
    async (userId, thunkAPI) => {

        const docRef = doc(db, "users", userId);

        onSnapshot(docRef, (doc) => {
            thunkAPI.dispatch(records(doc.data()))
        });

    }
)

export const appSlice = createSlice({
    name: 'manager',
    initialState,

    reducers: {
        registration: (state, action) => {

            const data = action.payload;

            createUserWithEmailAndPassword(auth, data.email, data.password)

            .then((userCredential) => {
                
                const user = userCredential.user;

                localStorage.setItem('user', JSON.stringify({
                    uid: user.uid,
                    email:user.email,
                    password: data.password,     
                }));

                setDoc(doc(db, "users", user.uid), {
                    id: user.uid,
                    email: user.email,
                    password: data.password,
                    records: []
                });

                console.log(user);
            })

            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                
            });
        },

        login: (state, action) => {

            const data = action.payload;

            signInWithEmailAndPassword(auth, data.email, data.password)

            .then((userCredential) => {

                const user = userCredential.user;

                localStorage.setItem('user', JSON.stringify({
                    uid: user.uid,
                    email:user.email,
                    password: data.password,     
                }));
                
            })

        },
       
        logout: () => {
            localStorage.removeItem('user');
            signOut(auth).then(() => {
               
            }).catch((error) => {
                console.log(error);
            });
        },

        setNewRecord: (state, action) => {

            const userId = doc(db, "users", auth.currentUser.uid);

            updateDoc(userId, {
                records: arrayUnion(action.payload)
            });
            
        },

        deleteRecord: (state, action) => {
            const recordRef = doc(db, 'users', auth.currentUser.uid);
            updateDoc(recordRef, { records: arrayRemove(action.payload) });
                
           
        },

        records: (state, action) => {
            state.records = action.payload.records   
        },

        changeRecord: (state, action) => {

            const userId = doc(db, "users", auth.currentUser.uid);

            updateDoc(userId, {
                records: action.payload
            });
        },

        hidePassword: (state, action) => {

            const userId = doc(db, "users", auth.currentUser.uid);

            updateDoc(userId, {
                records: action.payload
            });
        }
    },
});


export const {registration, login, logout, setNewRecord, deleteRecord, records, changeRecord, hidePassword} = appSlice.actions;

export const userState = (state) => state.manager;

export default appSlice.reducer