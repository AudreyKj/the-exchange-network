export default function(state = {}, action) {
    if (action.type === "friends-wannabe") {
        return { ...state, friendsWannabes: action.friendsWannabes };
    }

    if (action.type === "acceptFriendRequest") {
        return {
            ...state,
            friendsWannabes: state.friendsWannabes.map(element => {
                if (element.id == action.id) {
                    return { ...element, accepted: true };
                } else {
                    return element;
                }
            })
        };
    }

    if (action.type === "unfriend") {
        return {
            ...state,
            friendsWannabes: state.friendsWannabes.filter(element => {
                if (element.id !== action.id) {
                    return element;
                }
            })
        };
    }

    if (action.type === "chatMessages") {
        return {
            ...state,
            chatMessages: action.chatMessages
        };
    }

    if (action.type === "newChatMessage") {
        return {
            ...state,
            chatMessages: state.chatMessages.concat(action.newChatMessage)
        };
    }

    return state;
}
