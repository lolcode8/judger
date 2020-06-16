import { db } from "./index";

export const addPost = (body, opt1, opt2, userId) => {
  db.collection("posts").add({
    body: body,
    created_at: Date.now(),
    option_a_name: opt1,
    option_b_name: opt2,
    option_a: [],
    option_b: [],
    owner_id: userId,
  });
};
