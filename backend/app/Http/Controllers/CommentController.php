<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\JsonResponse;

class CommentController extends Controller
{
    /**
     * Store a newly created comment.
     */
    public function store(StoreCommentRequest $request, Post $post): JsonResponse
    {
        if ($request->filled('parent_id') && !Comment::where('post_id', $post->id)->whereKey($request->parent_id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Parent comment does not belong to this post.'
            ], 422);
        }

        $comment = Comment::create([
            'post_id'   => $post->id,
            'user_id'   => auth()->id(),
            'body'      => $request->body,
            'parent_id' => $request->parent_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Comment added successfully.',
            'data' => $comment->load('user'),
        ], 201);
    }

    /**
     * Update a comment.
     */
    public function update(UpdateCommentRequest $request, Comment $comment): JsonResponse
    {
        $this->authorize('update', $comment);

        $comment->update([
            'body' => $request->body,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Comment updated successfully.',
            'data' => $comment->fresh()->load('user'),
        ]);
    }

    /**
     * Delete a comment.
     */
    public function destroy(Comment $comment): JsonResponse
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully.',
        ]);
    }
}
