<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('posts', PostController::class);

    Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    Route::post('/posts/{post}/like', [LikeController::class, 'togglePostLike']);
    Route::post('/comments/{comment}/like', [LikeController::class, 'toggleCommentLike']);

    Route::get('/feed', [PostController::class, 'feed']);
    Route::get('/posts/search', [PostController::class, 'search']);

    Route::get('/me', function (Request $request) {
        return response()->json([
            'success' => true,
            'data' => $request->user()->loadCount([
                'posts',
                'comments',
                'likes'
            ]),
        ]);
    });
    Route::get('/my-posts', [PostController::class, 'myPosts']);
    
    Route::post('/logout', [AuthController::class, 'logout']);
});
