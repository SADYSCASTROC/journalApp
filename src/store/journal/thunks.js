import { collection, doc, setDoc } from "firebase/firestore/lite";
import { FirebaseDB } from "../../firebase/config";
import { addNewEmptyNote, savinNewNote, setActiveNote, setNotes, setSaving, updateNote } from "./journalSlice";
import { loadNotes } from "../../helpers";

// thunks es cuando tengo que despachar tareas asincronas para el reducer
export const startNewNote = () => {

    return async (dispatch, getstate) => {

        dispatch(savinNewNote());

        //uid
        const { uid } = getstate().auth;

        const newNote = {
            title: '',
            body: '',
            date: new Date().getTime(),
        }

        const newDoc = doc(collection(FirebaseDB, `${uid}/journal/notes`));
        const setDocResp = await setDoc(newDoc, newNote);

        newNote.id = newDoc.id;


        // dispach
        dispatch(addNewEmptyNote(newNote))
        dispatch(setActiveNote(newNote))

    }
}

export const startLoadingNotes = () => {

    return async (dispatch, getstate) => {

        const { uid } = getstate().auth;
        if (!uid) throw new Error(' EL UID DEL USUARIO NO EXISTE');

        const notes = await loadNotes(uid)
        dispatch(setNotes(notes));
    }

}

export const startSaveNote = () =>{
    return async(dispatch, getstate) =>{

        dispatch( setSaving())

        const {uid} =getstate().auth;
        const { active:note} = getstate().journal;

        const noteToFiresStore = {...note};
        delete noteToFiresStore.id;
        console.log(noteToFiresStore)

        const docRef = doc( FirebaseDB,`${uid}/journal/notes/${note.id}` );
        await setDoc( docRef, noteToFiresStore,{ merge:true})

        dispatch( updateNote( note))
    }
}