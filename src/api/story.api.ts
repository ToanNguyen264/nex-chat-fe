import api from "./axios";

export type StoryItem = {
    id: string;
    mediaUrl: string;
    mediaType: "image" | "video";
    content: string | null;
    createdAt: string;
    expiresAt: string;
};

export type UserStoryGroup = {
    userId: string;
    userName: string | null;
    authorName: string;
    avatar: string | null;
    isOwn: boolean;
    stories: StoryItem[];
};

type GetStoriesResponse = {
    success: boolean;
    data: UserStoryGroup[];
};

type CreateStoryResponse = {
    success: boolean;
    message: string;
    data: StoryItem;
};

// 1. Lấy danh sách tin của bạn bè và chính mình
export const getFeedStories = async (): Promise<UserStoryGroup[]> => {
    const response = await api.get<GetStoriesResponse>("/stories");
    return response.data.data;
};

// 2. Đăng tin mới
export const createStory = async (
    file: File,
    content?: string
): Promise<StoryItem> => {
    const formData = new FormData();
    formData.append("media", file);

    if (content && content.trim()) {
        formData.append("content", content.trim());
    }

    const response = await api.post<CreateStoryResponse>("/stories", formData);
    return response.data.data;
};

// 3. Xóa tin
export const deleteStory = async (storyId: string): Promise<void> => {
    await api.delete(`/stories/${storyId}`);
};