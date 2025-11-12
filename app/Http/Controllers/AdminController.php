<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Admin dashboard
     */
    public function dashboard()
    {
        return view('admin.dashboard', ['spa_scope' => 'admin']);
    }

    /**
     * Admin users
     */
    public function users()
    {
        return view('admin.users', ['spa_scope' => 'admin']);
    }

    /**
     * Admin settings
     */
    public function settings()
    {
        return view('admin.settings', ['spa_scope' => 'admin']);
    }
}
