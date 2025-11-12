<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WebController extends Controller
{
    /**
     * Home page
     */
    public function home()
    {
        return view('web.home');
    }

    /**
     * About page
     */
    public function about()
    {
        return view('web.about');
    }

    /**
     * Users list page
     */
    public function users()
    {
        return view('web.users');
    }

    /**
     * User detail page
     */
    public function userDetail($id)
    {
        // Mock user data
        $users = [
            1 => [
                'id' => 1,
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'role' => 'Administrator',
                'status' => 'Active',
                'joined' => '2023-01-15'
            ],
            2 => [
                'id' => 2,
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'role' => 'User',
                'status' => 'Active',
                'joined' => '2023-02-20'
            ],
            3 => [
                'id' => 3,
                'name' => 'Bob Johnson',
                'email' => 'bob@example.com',
                'role' => 'Moderator',
                'status' => 'Inactive',
                'joined' => '2023-03-10'
            ]
        ];

        $user = $users[$id] ?? null;

        if (!$user) {
            abort(404, 'User not found');
        }

        return view('web.user-detail', compact('user'));
    }

    /**
     * Contact page
     */
    public function contact()
    {
        return view('web.contact');
    }
}
