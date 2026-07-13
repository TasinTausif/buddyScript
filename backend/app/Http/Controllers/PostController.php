<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Display all visible posts.
     */
    public function index(): JsonResponse
    {
        $posts = Post::where('visibility', 'public')
            ->orWhere('user_id', auth()->id())
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Posts fetched successfully.',
            'data' => $posts,
        ]);
    }

    /**
     * Store a newly created post.
     */
    public function store(StorePostRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $post = DB::transaction(function () use ($request, $validated) {

            if ($request->hasFile('image')) {
                $validated['image'] = $request
                    ->file('image')
                    ->store('posts', 'public');
            }

            return $request->user()->posts()->create($validated);
        });

        return response()->json([
            'success' => true,
            'message' => 'Post created successfully.',
            'data' => $post,
        ], 201);
    }

    /**
     * Display a single post.
     */
    public function show(Post $post): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Post fetched successfully.',
            'data' => $post,
        ]);
    }

    /**
     * Update the specified post.
     */
    public function update(UpdatePostRequest $request, Post $post): JsonResponse
    {
        $this->authorize('update', $post);

        $validated = $request->validated();

        DB::transaction(function () use ($request, $post, &$validated) {

            if ($request->hasFile('image')) {

                if ($post->image) {
                    Storage::disk('public')->delete($post->image);
                }

                $validated['image'] = $request
                    ->file('image')
                    ->store('posts', 'public');
            }

            $post->update($validated);
        });

        return response()->json([
            'success' => true,
            'message' => 'Post updated successfully.',
            'data' => $post->fresh(),
        ]);
    }

    /**
     * Remove the specified post.
     */
    public function destroy(Post $post): JsonResponse
    {
        $this->authorize('delete', $post);

        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Post deleted successfully.',
        ]);
    }
}
