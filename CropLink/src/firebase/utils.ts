import { db } from "./main";
import { 
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

export const getDocsFromCollectionWhere = async (collectionName: string, field: string, operator: any, value: any): Promise<Document[]> => {
    try {
        const q = query(collection(db, collectionName), where(field, operator, value));
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map((doc) => doc.data());
        return docs as Document[];
    } catch (error:any) {
        onError(error);
        return [];
    }
};

export const getPaginatedDocuments = async (collectionName: string, field: string, docLimit: number, startAfterDocument?: Document): Promise<PaginatedDocuments> => {
    try {
        if(!startAfterDocument) {
            const first = query(collection(db,collectionName), orderBy(field), limit(docLimit));
            const querySnapshots = await getDocs(first);
            const docs = querySnapshots.docs.map((doc) => {return {id: doc.id, ...doc.data()}});
            const lastVisible = querySnapshots.docs[querySnapshots.docs.length-1];
            return {lastVisible: lastVisible as Document, docs: docs as Document[]}
        } else {
            const next = query(collection(db,collectionName), orderBy(field), startAfter(startAfterDocument), limit(docLimit));
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
    console.log("getPaginatedCollectionGroupWhere", collectionName, field, operator, value, orderField, docLimit, startAfterDocument)
    try {
        if(!startAfterDocument) {
            const first = query(collectionGroup(db,collectionName), where(field, operator, value), orderBy(...orderField), limit(docLimit));
            const querySnapshots = await getDocs(first);
            const docs = querySnapshots.docs.map((doc) => {return {id: doc.id, ...doc.data()}});
            const lastVisible = querySnapshots.docs[querySnapshots.docs.length-1];
            console.log("getPaginatedCollectionGroupWhere", "first", docs, lastVisible)
            return {lastVisible: lastVisible as Document, docs: docs as Document[]}
        } else {
            const next = query(collection(db,collectionName), where(field, operator, value), orderBy(field), startAfter(startAfterDocument), limit(docLimit));
            const querySnapshots = await getDocs(next);
            const docs = querySnapshots.docs.map((doc) => {return {id: doc.id, ...doc.data()}});
            const lastVisible = querySnapshots.docs[querySnapshots.docs.length-1];
            console.log("getPaginatedCollectionGroupWhere", "next", docs, lastVisible)
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
export const getDocument = async (collectionName: string, documentId: string): Promise<Document> => {
    try {
        console.log("getDocument", collectionName, documentId)
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);
        console.log("getDocument data", docSnap.data())
        return docSnap.data() as Document;
    } catch(error:any) {
        onError(error);
        return []
    }
};

export const setDocument = async (collectionName: string, documentId: string, merge=true): Promise<void> => {
    try {
        await setDoc(doc(db, collectionName, documentId), { merge });
    } catch(error:any) {
        onError(error);
    }
};

export const addDocument = async (collectionName: string, document: Document): Promise<Document> => {
    try { 
        const docRef = await addDoc(collection(db, collectionName), document);
        return { ...document, id: docRef.id };
    } catch(error:any) {
        onError(error);
        return {}
    }
};

export const deleteDocument = async (collectionName: string, documentId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, collectionName, documentId));
    } catch (error:any) {
        onError(error);
    }
};
export const queryForCollectionGroupDocumentById = async (collectionName: string, docId: string): Promise<Document | null> => {
    console.log("queryForCollectionGroupDocumentById", collectionName, docId)
    try {
        const q = query(collectionGroup(db, collectionName), where('id', '==', docId));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log("queryForCollectionGroupDocumentById", "No matching documents.");
            return null;  
        }
        const doc = querySnapshot.docs[0];
        console.log("queryForCollectionGroupDocumentById", doc.data())
        return { id: doc.id, ...doc.data() } as Document;

    } catch (error:any) {
        onError(error);
        return null;
    }
};
export const isFirestoreTimestamp = (timestamp: any): boolean => {
    return timestamp instanceof Timestamp;
};

export const convertTimestampToDate = (timestamp: any): Date => {
    return timestamp.toDate();
}