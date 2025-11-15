<?php

namespace Modules\User\Http\Controllers\Api;

use Modules\User\Services\UserServiceInterface;
use Modules\User\Http\Requests\CreateUserRequest;
use Modules\User\Http\Requests\UpdateUserRequest;
use Modules\User\Http\Resources\UserResource;
use Contexts\Api\Controllers\BaseApiController;

class UserController extends BaseApiController
{
    public function __construct(private UserServiceInterface $userService) {}

    public function index()
    {
        $users = $this->userService->getAll();
        return $this->successResponse(UserResource::collection($users), 'Users retrieved successfully');
    }

    public function show($id)
    {
        $user = $this->userService->find($id);
        if (!$user) {
            return $this->notFoundResponse('User not found');
        }
        return $this->successResponse(new UserResource($user), 'User retrieved successfully');
    }

    public function store(CreateUserRequest $request)
    {
        $user = $this->userService->create($request->validated());
        return $this->successResponse(new UserResource($user), 'User created successfully', 201);
    }

    public function update(UpdateUserRequest $request, $id)
    {
        $user = $this->userService->update($id, $request->validated());
        if (!$user) {
            return $this->notFoundResponse('User not found');
        }
        return $this->successResponse(new UserResource($user), 'User updated successfully');
    }

    public function destroy($id)
    {
        $result = $this->userService->delete($id);
        if (!$result) {
            return $this->notFoundResponse('User not found');
        }
        return $this->successResponse(null, 'User deleted successfully');
    }
} 