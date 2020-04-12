export interface IFirestoreConverter<T> {

    toFirestore(object: T): FirebaseFirestore.DocumentData;
    fromFirestore(snapshot: FirebaseFirestore.DocumentSnapshot): T | undefined;

}