import api from "./axios";

export type TagSuggestion = {
    name: string;
    post_count: number;
};

type TagSuggestResponse = {
    success: boolean;
    data: TagSuggestion[];
};

/**
 * Gọi API lấy danh sách gợi ý hashtag theo tiền tố người dùng đang gõ
 * @param q Từ khóa (ví dụ "re" -> gợi ý "react", "reactjs")
 */
export const getTagSuggestions = async (
    q: string,
    limit = 5
): Promise<TagSuggestion[]> => {
    const response = await api.get<TagSuggestResponse>("/tags/suggest", {
        params: { q, limit },
    });

    return response.data.data;
};

