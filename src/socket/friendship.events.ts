export type FriendshipChangeAction =
    | "requested"
    | "accepted"
    | "rejected"
    | "cancelled"
    | "removed";

export type FriendshipChangedPayload = {
    friendshipId: string;
    requesterId: string;
    addresseeId: string;
    action: FriendshipChangeAction;
};
