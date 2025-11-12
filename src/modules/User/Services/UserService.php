<?php

namespace Modules\User\Services;

use Steak\Core\Services\Service;
use Steak\Core\Events\EventMethods;
use Modules\User\Repositories\UserRepositoryInterface;

class UserService extends Service implements UserServiceInterface
{

    public function __construct(private UserRepositoryInterface $repo) {}

    public function getAll() { return $this->repo->all(); }
    public function find($id) { return $this->repo->find($id); }
    public function create(array $data) {
        static::on('user.creating', function($data) { return $data; });
        // $data = static::trigger('user.creating', $data);
        $user = $this->repo->create($data);
        static::trigger('user.created', $user);
        return $user;
    }
    public function update($id, array $data) {
        $user = $this->repo->find($id);
        return $this->repo->update($user, $data);
    }
    public function delete($id) {
        $user = $this->repo->find($id);
        return $this->repo->delete($user);
    }
} 