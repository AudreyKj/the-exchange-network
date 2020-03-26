import axios from "./axios";

export async function receiveFriendsWannabes() {
  try {
    const { data } = await axios.get(`/friends-wannabes`);
    return {
      type: "friends-wannabe",
      friendsWannabes: data
    };
  } catch (e) {
    console.log("e", e);
  }
}

export async function acceptFriendRequest(user) {
  try {
    const { data } = await axios.post(`/accept-friend-request`, {
      user: user
    });
    return {
      type: "acceptFriendRequest",
      id: data.sender_id
    };
  } catch (e) {
    console.log("e", e);
  }
}

export async function unfriend(user) {
  try {
    const { data } = await axios.post(`/end-friendship`, {
      user: user
    });
    return {
      type: "unfriend",
      id: data
    };
  } catch (e) {
    console.log("e", e);
  }
}

export async function chatMessages(chatMessages) {
  return {
    type: "chatMessages",
    chatMessages: chatMessages
  };
}

export async function newChatMessage(newChatMessage) {
  return {
    type: "newChatMessage",
    newChatMessage: newChatMessage
  };
}
