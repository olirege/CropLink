import { db } from "./main";
import { type Ref } from "vue";
import {
    onSnapshot, 
    collection,
    collectionGroup,
    getDocs,
    query,
    where,
    getDoc,
    setDoc,
    addDoc,
    doc,
    Timestamp,
    deleteDoc,
    orderBy,
    startAfter,
    limit  } from "firebase/firestore";

interface Document {
    [key: string]: any;
}

interface PaginatedDocuments {
    docs: Document[],
    lastVisible: Document
}

const onError = (error:any) => {
    console.error(`Error fetching documents with conditions: ${error}`);
}

export const getDocuments = async (collectionName: string): Promise<Document[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const docs = querySnapshot.docs.map((doc) => {return {id: doc.id, ...doc.data()}});
        return docs as Document[];
    } catch (error:any) {
        onError(error);
        return [];
    }
};

export const getPaginatedDocuments = async (collectionName: string, orderField: array, docLimit: number, startAfterDocument?: Document): Promise<PaginatedDocuments> => {
    try {
        if(!startAfterDocument) {
            const first = query(collection(db,collectionName), orderBy(...orderField), limit(docLimit));
            const querySnapshots = await getDocs(first);
            const docs = querySnapshots.docs.map((doc) => {return {id: doc.id, ...doc.data()}});
            const lastVisible = querySnapshots.docs[querySnapshots.docs.length-1];
            return {lastVisible: lastVisible as Document, docs: docs as Document[]}
        } else {
            const next = query(collection(db,collectionName), orderBy(...orderField), startAfter(startAfterDocument), limit(docLimit));
            const querySnapshots = await getDocs(next);
            const docs = querySnapshots.docs.map((doc) => {return {id: doc.id, ...doc.data()}});
            const lastVisible = querySnapshots.docs[querySnapshots.docs.length-1];
            return {lastVisible: lastVisible as Document, docs: docs as Document[]}
        }
    } catch (error:any) {
        onError(error);
        return {lastVisible: {}, docs: []}
    }
}
export const getPaginatedCollectionGroupWhere = async (collectionName: string, field: string, operator: any, value: any, orderField: array, docLimit: number, startAfterDocument?: Document): Promise<PaginatedDocuments> => {
    try {
        if(!startAfterDocument) {
            const first = query(collectionGroup(db,collectionName), where(field, operator, value), orderBy(...orderField), limit(docLimit));
            const querySnapshots = await getDocs(first);
            const docs = querySnapshots.docs.map((doc) => {return {id: doc.id, ...doc.data()}});
            const lastVisible = querySnapshots.docs[querySnapshots.docs.length-1];
            return {lastVisible: lastVisible as Document, docs: docs as Document[]}
        } else {
            const next = query(collection(db,collectionName), where(field, operator, value), orderBy(field), startAfter(startAfterDocument), limit(docLimit));
            const querySnapshots = await getDocs(next);
            const docs = querySnapshots.docs.map((doc) => {return {id: doc.id, ...doc.data()}});
            const lastVisible = querySnapshots.docs[querySnapshots.docs.length-1];
            return {lastVisible: lastVisible as Document, docs: docs as Document[]}
        }
    } catch (error:any) {
        onError(error);
        return {lastVisible: {}, docs: []}
    }
}
export const getPaginatedCollectionGroupWhereWhere = async (collectionName: string, field: string, operator: any, value: any, field2: string, operator2: any, value2: any, orderField: array, docLimit: number, startAfterDocument?: Document): Promise<PaginatedDocuments> => {
    try {
        if(!startAfterDocument) {
            const first = query(collectionGroup(db,collectionName), where(field, operator, value), where(field2, operator2, value2), orderBy(...orderField), limit(docLimit));
            const querySnapshots = await getDocs(first);
            const docs = querySnapshots.docs.map((doc) => {return {id: doc.id, ...doc.data()}});
            const lastVisible = querySnapshots.docs[querySnapshots.docs.length-1];
            return {lastVisible: lastVisible as Document, docs: docs as Document[]}
        } else {
            const next = query(collection(db,collectionName), where(field, operator, value), where(field2, operator2, value2), orderBy(field), startAfter(startAfterDocument), limit(docLimit));
            const querySnapshots = await getDocs(next);
            const docs = querySnapshots.docs.map((doc) => {return {id: doc.id, ...doc.data()}});
            const lastVisible = querySnapshots.docs[querySnapshots.docs.length-1];
            return {lastVisible: lastVisible as Document, docs: docs as Document[]}
        }
    } catch (error:any) {
        onError(error);
        return {lastVisible: {}, docs: []}
    }
}
export const getPaginatedCollectionGroup = async(collectionName: string, conditions:string[][] = [], order: string[] = [], docLimit: number, startAfterDocument?: Document): Promise<PaginatedDocuments> => {
    try {
        let firestoreQuery = query(collectionGroup(db, collectionName));
        // Apply 'where' conditions
        conditions.forEach(condition => {
          if (condition.length === 3) {
            firestoreQuery = query(firestoreQuery, where(...condition));
          }
        });
        // Apply 'order' conditions
        if (order && order.length === 2) {
          firestoreQuery = query(firestoreQuery, orderBy(order[0], order[1] as any));
        }
        if(!startAfterDocument) {
            const first = query(firestoreQuery, limit(docLimit));
            const querySnapshots = await getDocs(first);
            const docs = querySnapshots.docs.map((doc) => {return {id: doc.id, ...doc.data()}});
            const lastVisible = querySnapshots.docs[querySnapshots.docs.length-1];
            return {lastVisible: lastVisible as Document, docs: docs as Document[]}
        } else {
            const next = query(firestoreQuery, startAfter(startAfterDocument), limit(docLimit));
            const querySnapshots = await getDocs(next);
            const docs = querySnapshots.docs.map((doc) => {return {id: doc.id, ...doc.data()}});
            const lastVisible = querySnapshots.docs[querySnapshots.docs.length-1];
            return {lastVisible: lastVisible as Document, docs: docs as Document[]}
        }
    } catch (error:any) {
        onError(error);
        return {lastVisible: {}, docs: []}
    }
}
export const getDocument = async (collectionName: string, documentId: string): Promise<Document> => {
    try {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);
        return docSnap.data() as Document;
    } catch(error:any) {
        onError(error);
        return []
    }
};

export const queryForCollectionGroupDocumentById = async (collectionName: string, docId: string, idKey='id'): Promise<Document | null> => {
    try {
        const q = query(collectionGroup(db, collectionName), where(idKey, '==', docId));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log("queryForCollectionGroupDocumentById", "No matching documents.");
            return null;  
        }
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Document;

    } catch (error:any) {
        onError(error);
        return null;
    }
};
export const isFirestoreTimestamp = (timestamp: any): boolean => {
    if(timestamp instanceof Timestamp)
        return true;
    else
        return false;
};

export const convertTimestampToDate = (timestamp: any): Date => {
    return timestamp.toDate();
}

export function useQuerySubscription(
  collectionPath: string,
  conditions:string[][] = [],
  order: string[] = [],
  onData: (data: Document) => void = () => {},
  onError: (error: any) => void = () => {},
  loading: Ref<boolean>,
  onStart: () => void = () => {},
  onEnd: () => void = () => {},
  onAdd:(doc:Document) => void = (doc) => { console.log('Document added:', doc); },
  onRemove: (doc:Document) => void = (doc) => { console.log('Document removed:', doc); },
) {
  let unsubscribe:any;
  let initialSnapshotProcessed = false; // Flag to track the initial snapshot
  const subscribe = () => {
    loading.value = true;
    console.log("Firestore subscription starting:", collectionPath, conditions);
    onStart();
    let firestoreQuery = query(collectionGroup(db, collectionPath));
    // Apply 'where' conditions
    conditions.forEach(condition => {
      if (condition.length === 3) {
        firestoreQuery = query(firestoreQuery, where(...condition));
      }
    });
    // Apply 'order' conditions
    if (order && order.length === 2) {
      firestoreQuery = query(firestoreQuery, orderBy(order[0], order[1] as any));
    }
    unsubscribe = onSnapshot(firestoreQuery, snapshot => {
        snapshot.docChanges().forEach(change => {
            if (!initialSnapshotProcessed && change.type === 'added') {
              // Skip logging for initial adds
            } else if (change.type === 'added') {
              onAdd({ id: change.doc.id, ...change.doc.data() });
            }
            if (change.type === 'removed') {
              onRemove({ id: change.doc.id, ...change.doc.data() });
            }
        });
    
        if (!initialSnapshotProcessed) {
        initialSnapshotProcessed = true; // Mark initial snapshot as processed
        }
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      onData(data);
      console.log("Firestore data received:", data);
      loading.value = false;
      onEnd();
    }, error => {
      console.error("Firestore subscription error:", error);
      onError(error);
      loading.value = false;
      onEnd();
    });
  };

  const unsubscribeFn = () => {
    if (unsubscribe) {
      console.log("Unsubscribing from Firestore:", collectionPath);
      unsubscribe();
      loading.value = false;
      onEnd();
    }
  };
  return { subscribe, unsubscribe: unsubscribeFn };
}
export function useCollectionQuerySubscription(
    collectionPath: string,
    conditions:string[][] = [],
    order: string[] = [],
    onData: (data: Document) => void = () => {},
    onError: (error: any) => void = () => {},
    loading: Ref<boolean>,
    onStart: () => void = () => {},
    onEnd: () => void = () => {},
    onAdd:(doc:Document) => void = (doc) => { console.log('Document added:', doc); },
    onRemove: (doc:Document) => void = (doc) => { console.log('Document removed:', doc); },
  ) {
    let unsubscribe:any;
    let initialSnapshotProcessed = false; // Flag to track the initial snapshot
    const subscribe = () => {
      loading.value = true;
      console.log("Firestore subscription starting:", collectionPath, conditions);
      onStart();
      let firestoreQuery = query(collection(db, collectionPath));
      // Apply 'where' conditions
      conditions.forEach(condition => {
        if (condition.length === 3) {
          firestoreQuery = query(firestoreQuery, where(...condition));
        }
      });
      // Apply 'order' conditions
      if (order && order.length === 2) {
        firestoreQuery = query(firestoreQuery, orderBy(order[0], order[1] as any));
      }
      unsubscribe = onSnapshot(firestoreQuery, snapshot => {
          snapshot.docChanges().forEach(change => {
              if (!initialSnapshotProcessed && change.type === 'added') {
                // Skip logging for initial adds
              } else if (change.type === 'added') {
                onAdd({ id: change.doc.id, ...change.doc.data() });
              }
              if (change.type === 'removed') {
                onRemove({ id: change.doc.id, ...change.doc.data() });
              }
          });
      
          if (!initialSnapshotProcessed) {
          initialSnapshotProcessed = true; // Mark initial snapshot as processed
          }
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        onData(data);
        console.log("Firestore data received:", data);
        loading.value = false;
        onEnd();
      }, error => {
        console.error("Firestore subscription error:", error);
        onError(error);
        loading.value = false;
        onEnd();
      });
    };
  
    const unsubscribeFn = () => {
      if (unsubscribe) {
        console.log("Unsubscribing from Firestore:", collectionPath);
        unsubscribe();
        loading.value = false;
        onEnd();
      }
    };
    return { subscribe, unsubscribe: unsubscribeFn };
  }
export function useDocumentSubscription(
    collectionPath: string,
    documentId: string,
    onData: (data: Document) => void = () => {},
    onError: (error: any) => void = () => {},
    loading: Ref<boolean>,
    onStart: () => void = () => {},
    onEnd: () => void = () => {},
    ) {
    let unsubscribe:any;
    const subscribe = () => {
        loading.value = true;
        console.log("Firestore subscription starting:", collectionPath, documentId);
        onStart();
        unsubscribe = onSnapshot(doc(db, collectionPath, documentId), snapshot => {
        const data = { id: snapshot.id, ...snapshot.data() };
        onData(data);
        console.log("Firestore data received:", data);
        loading.value = false;
        onEnd();
        }, error => {
        console.error("Firestore subscription error:", error);
        onError(error);
        loading.value = false;
        onEnd();
        });
    };
    
    const unsubscribeFn = () => {
        if (unsubscribe) {
        console.log("Unsubscribing from Firestore:", collectionPath, documentId);
        unsubscribe();
        loading.value = false;
        onEnd();
        }
    };
    return { subscribe, unsubscribe: unsubscribeFn };
}
import { getFunctions, httpsCallable } from "firebase/functions";

export function useFirebaseFunctionCall(
    functionName: string,
    payload: any,
    loading: Ref<boolean>,
    onStart = () => { console.log("Function call start");} ,
    onData = (data: any) => { console.log("Function call data:", data); },
    onEnd = () => { console.log("Function call end"); },
    onError = (error) => { console.error("Function call error: ", error); }
  ) {
    const callFunction = async () => {
      console.log(`Calling function '${functionName}' with payload:`, payload);
      loading.value = true;
      onStart();
      try {
        const cloudFunction = httpsCallable(getFunctions(undefined, "northamerica-northeast1"), functionName)
        console.log("cloudFunction", cloudFunction)
        const result = await cloudFunction(payload);
        console.log(`Function '${functionName}' returned successfully:`, result);
        onData(result);
        loading.value = false;
        onEnd();
        return result;
      } catch (error) {
        console.error(`Error calling function '${functionName}':`, error);
        loading.value = false;
        onError(error);
        throw error; // rethrow the error for further handling if necessary
      }
    };
    return { callFunction };
  }