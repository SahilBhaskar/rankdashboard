<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class LeaderboardController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('activities');

    if ($request->has('filter')) {
        $filter = $request->input('filter');
        switch ($filter) {
            case 'day':
                $query->whereHas('activities', function ($query) {
                    $query->whereDate('activity_date', now());
                });
                break;
            case 'month':
                $query->whereHas('activities', function ($query) {
                    $query->whereMonth('activity_date', now()->month)
                          ->whereYear('activity_date', now()->year);
                });
                break;
            case 'year':
                $query->whereHas('activities');
                break;
        }
    }

    $users = $query->get()->map(function ($user) {
        $user->total_points = $user->activities->count() * 20;
        return $user;
    })->sortByDesc('total_points');

    $rankedUsers = [];
    $currentRank = 1;
    User::query()->update(['rank' => null]);
    foreach ($users as $index => $user) {
      
                $rankMax = User::where('total_points', $user->total_points)->pluck('rank')->first();
                if ($rankMax) {
                    $user->rank = $rankMax;
                    $user->save();
                } else {
                    $maxRank = User::max('rank') ;
    
                    $user->rank = $maxRank + 1;
                    $user->save();
                }   
           
            
       
        $rankedUsers[] = $user;
    }

    return response()->json($rankedUsers);
    // $rankedUsers[] = $user;
}


    
    public function search(Request $request)
    {
        $userId = $request->input('user_id');
        $user = User::with('activities')->find($userId);

        if ($user) {
            $user->total_points = $user->activities->count() * 20; 
            return response()->json($user); 
        }

        return response()->json(['message' => 'User not found'], 404);
    }

}
