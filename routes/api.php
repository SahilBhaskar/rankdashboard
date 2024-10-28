<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LeaderboardController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('/leaderboard')->group(function () {
    Route::get('/', [LeaderboardController::class, 'index']);            
    Route::get('/search', [LeaderboardController::class, 'search']);     
    Route::post('/recalculate', [LeaderboardController::class, 'recalculate']); 
});