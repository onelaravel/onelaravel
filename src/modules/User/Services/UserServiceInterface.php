<?php

namespace Modules\User\Services;

interface UserServiceInterface
{
    public function getAll();
    public function find($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
} 