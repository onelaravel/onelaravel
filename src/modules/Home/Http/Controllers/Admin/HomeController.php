<?php

namespace Modules\Home\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Modules\Home\Services\HomeServiceInterface;
use Illuminate\Http\Request;
use Illuminate\View\View;

class HomeController extends Controller
{
    protected HomeServiceInterface $homeService;

    public function __construct(HomeServiceInterface $homeService)
    {
        $this->homeService = $homeService;
    }

    /**
     * Display admin dashboard
     */
    public function dashboard(): View
    {
        $data = $this->homeService->getHomeData();
        $statistics = $this->homeService->getStatistics();
        
        return view('admin.home.dashboard', compact('data', 'statistics'));
    }

    /**
     * Display home settings
     */
    public function settings(): View
    {
        return view('admin.home.settings');
    }

    /**
     * Update home settings
     */
    public function updateSettings(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'featured_content' => 'array',
        ]);

        // Update settings logic here
        // This would typically save to database or config files

        return redirect()->back()->with('success', 'Settings updated successfully!');
    }
}
