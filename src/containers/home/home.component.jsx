import React, { useEffect, useState } from "react";
import { auth } from "database";
import { useSelector } from "react-redux";
import Post from "containers/post";
import Profile from "containers/profile";
import Modal from "components/modal";
import Navbar from "containers/navbar";

const Home = (props) => {
  const [posts, setPosts] = useState([]);
  const [displayPosts, setDisplayPosts] = useState([]);
  const [selectDisplayPostOption, setSelectDisplayPostOption] = useState(
    "Newest"
  );
  const userFromState = useSelector((state) => state.users.user);
  const userVoteHistory = userFromState.vote_history;
  const doesUserHaveUsername = !!userFromState.username;
  const postsFromState = useSelector((state) => state.posts);

  const signOut = () => {
    auth.signOut();
    props.logoutThunk();
  };

  const handleDisplayPostChange = () => {
    const viewOption = document.getElementById("select-view-option").value;
    setSelectDisplayPostOption(viewOption);
  };

  useEffect(() => {
    if (selectDisplayPostOption === "Newest") {
      props.fetchPostsThunk("created_at", "desc");
    } else {
      props.fetchPostsThunk("total_votes", "desc");
    }
    setPosts(postsFromState);
  }, [posts, props, selectDisplayPostOption]);

  //Get user's profile picture
  useEffect(() => {
    const username = userFromState.username;
    if (username) {
      props.fetchUserAvatarThunk({ username });
    }
  }, []);

  useEffect(() => {
    console.log(userVoteHistory);
    if (postsFromState.posts.length > 0) {
      const displayPost = postsFromState.posts.map((post) => {
        let hasUserVoted = false;
        if (userVoteHistory.includes(post.id)) {
          hasUserVoted = true;
        }
        return (
          <Post
            body={post.body}
            optionA={post.option_a}
            optionB={post.option_b}
            created_at={post.created_at}
            id={post.id}
            optionAName={post.option_a_name}
            optionBName={post.option_b_name}
            hasUserVoted={hasUserVoted}
            totalVotes={post.total_votes}
          />
        );
      });
      setDisplayPosts(displayPost);
    }
  }, [postsFromState.posts.length, selectDisplayPostOption]);

  if (!doesUserHaveUsername) {
    return (
      <Modal show>
        <Profile />
      </Modal>
    );
  } else {
    return (
      <div className="bg-blueGray">
        <div>
          <Navbar navigation="/create-post" postAdd="post_add" />
        </div>
        <h1 className="flex justify-center text-grayy">
          {userFromState.full_name} is logged in with the username:
          {userFromState.username}
        </h1>
        <div className="flex items-center justify-center rounded-full">
          {userFromState.avatar_link && (
            <img
              src={userFromState.avatar_link}
              alt="Avatar"
              className="rounded full h-16 w-16"
            />
          )}
        </div>
        <button className="bg-blue w-full bg-red-600" onClick={signOut}>
          Sign out
        </button>
        <form>
          <select
            id="select-view-option"
            value={selectDisplayPostOption}
            onChange={handleDisplayPostChange}
          >
            <option value="Newest">Newest</option>
            <option value="Most Popular">Most Popular</option>
            <option value="Most One-sided">Most One-sided</option>
          </select>
        </form>
        <ul>{displayPosts}</ul>
      </div>
    );
  }
};

export default Home;
