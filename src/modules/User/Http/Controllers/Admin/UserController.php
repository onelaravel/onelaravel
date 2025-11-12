<?php

namespace Modules\User\Http\Controllers\Admin;

use Modules\User\Services\UserServiceInterface;
use Contexts\Admin\Controllers\BaseAdminController;
use Illuminate\Http\Request;

class UserController extends BaseAdminController
{
    public function __construct(private UserServiceInterface $userService) {}

    public function index()
    {
        $users = $this->userService->getAll();
        $this->setPageTitle('User Management');
        $this->setBreadcrumbs([
            ['name' => 'Dashboard', 'url' => route('admin.dashboard')],
            ['name' => 'Users', 'url' => '#']
        ]);
        
        return $this->renderAdminView('user.index', compact('users'));
    }

    public function show($id)
    {
        $user = $this->userService->find($id);
        if (!$user) {
            return $this->adminErrorRedirect('admin.user.index', 'User not found');
        }
        
        $this->setPageTitle('User Details');
        $this->setBreadcrumbs([
            ['name' => 'Dashboard', 'url' => route('admin.dashboard')],
            ['name' => 'Users', 'url' => route('admin.user.index')],
            ['name' => 'Details', 'url' => '#']
        ]);
        
        return $this->renderAdminView('user.show', compact('user'));
    }

    public function create()
    {
        $this->setPageTitle('Create User');
        $this->setBreadcrumbs([
            ['name' => 'Dashboard', 'url' => route('admin.dashboard')],
            ['name' => 'Users', 'url' => route('admin.user.index')],
            ['name' => 'Create', 'url' => '#']
        ]);
        
        return $this->renderAdminView('user.create');
    }

    public function store(Request $request)
    {
        $validation = $this->adminValidateAndRedirect($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        if ($validation !== true) {
            return $validation;
        }
        
        $this->userService->create($request->only(['name', 'email', 'password']));
        
        return $this->adminSuccessRedirect('admin.user.index', 'User created successfully');
    }

    public function edit($id)
    {
        $user = $this->userService->find($id);
        if (!$user) {
            return $this->adminErrorRedirect('admin.user.index', 'User not found');
        }
        
        $this->setPageTitle('Edit User');
        $this->setBreadcrumbs([
            ['name' => 'Dashboard', 'url' => route('admin.dashboard')],
            ['name' => 'Users', 'url' => route('admin.user.index')],
            ['name' => 'Edit', 'url' => '#']
        ]);
        
        return $this->renderAdminView('user.edit', compact('user'));
    }

    public function update(Request $request, $id)
    {
        $validation = $this->adminValidateAndRedirect($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8|confirmed',
        ]);
        
        if ($validation !== true) {
            return $validation;
        }
        
        $result = $this->userService->update($id, $request->only(['name', 'email', 'password']));
        if (!$result) {
            return $this->adminErrorRedirect('admin.user.index', 'User not found');
        }
        
        return $this->adminSuccessRedirect('admin.user.index', 'User updated successfully');
    }

    public function destroy($id)
    {
        $result = $this->userService->delete($id);
        if (!$result) {
            return $this->adminErrorRedirect('admin.user.index', 'User not found');
        }
        
        return $this->adminSuccessRedirect('admin.user.index', 'User deleted successfully');
    }
} 