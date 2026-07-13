<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    /**
     * Anyone logged in can view the post list.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Public posts are visible to everyone.
     * Private posts are only visible to their owner.
     */
    public function view(?User $user, Post $post): bool
    {
        if ($post->visibility === 'public') {
            return true;
        }

        return $user && $user->id === $post->user_id;
    }

    /**
     * Any authenticated user can create a post.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Only the owner can update their post.
     */
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    /**
     * Only the owner can delete their post.
     */
    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    public function restore(User $user, Post $post): bool
    {
        return false;
    }

    public function forceDelete(User $user, Post $post): bool
    {
        return false;
    }
}
