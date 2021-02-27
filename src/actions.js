import { firebaseApp } from './firebase.conf';
import firebase from 'firebase';
require('firebase/firestore');

const db = firebase.firestore(firebaseApp);

// Collections
export const collections = {
  PETS: 'pets',
};

// Get Collection
export const getCollection = async (collection) => {
  const result = { status: false, data: undefined, error: undefined };
  try {
    const fetchData = await db.collection(collection).get();
    const data = fetchData.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log(data);
    result.status = true;
    result.data = [...data];
  } catch (error) {
    result.error = error;
  }
  return result;
};
// Add Document
export const addDocument = async ({ collection, data }) => {
  const result = { status: false, data: undefined, error: undefined };
  try {
    const response = await db.collection(collection).add(data);
    result.data = { id: response?.id };
    result.status = true;
  } catch (error) {
    result.error = error;
  }
  return result;
};
// Get Document By ID
export const getDocumentByID = async ({ collection, id }) => {
  const result = { status: false, data: undefined, error: undefined };
  try {
    const response = await db.collection(collection).doc(id).get();

    result.data = { id: response?.id, ...response?.data };
    result.status = true;
  } catch (error) {
    result.error = error;
  }
  return result;
};
// Update Document By ID
export const updateDocumentByID = async ({ collection, id, data }) => {
  const result = { status: false, error: undefined };
  try {
    await db.collection(collection).doc(id).update(data);
    result.status = true;
  } catch (error) {
    result.error = error;
  }
  return result;
}
// Delete Document By ID
export const deleteDocumentByID = async ({ collection, id }) => {
  const result = { status: false, error: undefined };
  try {
    await db.collection(collection).doc(id).delete();
    result.status = true;
  } catch (error) {
    result.error = error;
  }
  return result;
}
