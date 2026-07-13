<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;

class LikeController extends Controller
{
    /**
     * Toggle like on a post.
     */
    public function togglePostLike(Post $post): JsonResponse
    {
        return $this->toggleItem($post);
    }

    /**
     * Toggle like on a comment.
     */
    public function toggleCommentLike(Comment $comment): JsonResponse
    {
        return $this->toggleItem($comment);
    }

    /**
     * Toggle like for any likeable model.
     */
    private function toggleItem(Model $model): JsonResponse
    {
        $existingLike = $model->likes()
            ->where('user_id', auth()->id())
            ->first();

        if ($existingLike) {
            $existingLike->delete();

            return response()->json([
                'success' => true,
                'message' => 'Like removed successfully.',
                'liked' => false,
                'likes_count' => $model->likes()->count(),
            ]);
        }

        $model->likes()->create([
            'user_id' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Liked successfully.',
            'liked' => true,
            'likes_count' => $model->likes()->count(),
        ]);
    }
}