import { db } from "database";
import firebase from "firebase";

export const voteForOption = ({ optionName, postId, userId }) => {
  const increment = () => firebase.firestore.FieldValue.increment(1);

  return db
    .collection("posts")
    .doc(postId)
    .update({
      [optionName]: firebase.firestore.FieldValue.arrayUnion(userId),
      total_votes: increment(),
    });
};

export const addVoteToUser = ({ postId, userId }) => {
  return db
    .collection("users")
    .doc(userId)
    .update({
      vote_history: firebase.firestore.FieldValue.arrayUnion(postId),
    });
};
