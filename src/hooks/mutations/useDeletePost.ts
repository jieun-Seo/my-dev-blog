// src/hooks/mutations/useDeletePost.ts

/**
 * 게시글 삭제 뮤테이션
 *
 * Day 1 요구사항: POST-005
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/lib/posts";
import { queryKeys } from "@/hooks/queries/keys";
import { toast } from "sonner"; // UI 추가

export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => deletePost(postId),

        // 성공 시 목록 캐시 무효화
        onSuccess: () => {
            toast.success("글이 삭제되었습니다"); //Toast 실행 위치
            queryClient.invalidateQueries({
                queryKey: queryKeys.posts.lists(),
            });
        },
        onError: () => {
            toast.error("글 삭제에 실패했습니다"); //Toast 실행 위치
        },
    });
}
