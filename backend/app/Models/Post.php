<?php

namespace App\Models;

use App\Models\Comment;
use App\Models\Like;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Post extends Model
{
    protected $fillable = [
        'body',
        'image',
        'visibility',

    ];

    protected $with = [
        'user',
        'comments.user',
        'comments.replies.user'
    ];

    protected $withCount = [
        'likes',
        'comments'
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->whereNull('parent_id');
    }

    public function likes(): MorphMany

    {
        return $this->morphMany(Like::class, 'likeable');
    }
}
