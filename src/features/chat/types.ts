export type ChatMessage = {
    id: number;
    sender: "me" | "friend";
    content: string;
    time: string;
    media?: string;
};
