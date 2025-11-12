<?php

namespace Modules\User\Http\Controllers\Web;

use Modules\User\Services\UserServiceInterface;
use Contexts\Web\Controllers\BaseWebController;
use Illuminate\Http\Request;

class UserController extends BaseWebController
{
    public function __construct(private UserServiceInterface $userService) {}

    public function profile()
    {
        $user = $this->getCurrentUser();
        $this->setPageTitle('User Profile');
        $this->setBreadcrumbs([
            ['name' => 'Home', 'url' => route('web.home')],
            ['name' => 'Profile', 'url' => '#']
        ]);
        
        return $this->renderView('web.user.profile', compact('user'));
    }

    public function updateProfile(Request $request)
    {
        $user = $this->getCurrentUser();
        
        $validation = $this->validateAndRedirect($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8|confirmed',
        ]);
        
        if ($validation !== true) {
            return $validation;
        }
        
        $this->userService->update($user->id, $request->only(['name', 'email', 'password']));
        
        return $this->backWithMessage('Profile updated successfully');
    }
} 