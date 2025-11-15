<?php

namespace Modules\Web\Repositories;

use Modules\Web\Models\Web;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class WebRepository
{
    protected Web $model;

    public function __construct(Web $model)
    {
        $this->model = $model;
    }

    /**
     * Get all webs.
     */
    public function all(): Collection
    {
        return $this->model->all();
    }

    /**
     * Get all active webs.
     */
    public function getActive(): Collection
    {
        return $this->model->active()->get();
    }

    /**
     * Get all published webs.
     */
    public function getPublished(): Collection
    {
        return $this->model->published()->get();
    }

    /**
     * Get web by ID.
     */
    public function findById(int $id): ?Web
    {
        return $this->model->find($id);
    }

    /**
     * Get web by slug.
     */
    public function findBySlug(string $slug): ?Web
    {
        return $this->model->where('slug', $slug)->first();
    }

    /**
     * Create a new web.
     */
    public function create(array $data): Web
    {
        return $this->model->create($data);
    }

    /**
     * Update web by ID.
     */
    public function update(int $id, array $data): bool
    {
        $web = $this->findById($id);
        
        if (!$web) {
            return false;
        }

        return $web->update($data);
    }

    /**
     * Delete web by ID.
     */
    public function delete(int $id): bool
    {
        $web = $this->findById($id);
        
        if (!$web) {
            return false;
        }

        return $web->delete();
    }

    /**
     * Restore deleted web by ID.
     */
    public function restore(int $id): bool
    {
        $web = $this->model->withTrashed()->find($id);
        
        if (!$web) {
            return false;
        }

        return $web->restore();
    }

    /**
     * Force delete web by ID.
     */
    public function forceDelete(int $id): bool
    {
        $web = $this->model->withTrashed()->find($id);
        
        if (!$web) {
            return false;
        }

        return $web->forceDelete();
    }

    /**
     * Paginate webs.
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage);
    }

    /**
     * Search webs by name or description.
     */
    public function search(string $query): Collection
    {
        return $this->model->where(function ($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
              ->orWhere('description', 'like', "%{$query}%");
        })->get();
    }

    /**
     * Get webs by status.
     */
    public function getByStatus(string $status): Collection
    {
        return $this->model->where('status', $status)->get();
    }

    /**
     * Get recent webs.
     */
    public function getRecent(int $limit = 10): Collection
    {
        return $this->model->latest()->limit($limit)->get();
    }

    /**
     * Get web count by status.
     */
    public function getCountByStatus(string $status): int
    {
        return $this->model->where('status', $status)->count();
    }

    /**
     * Get total webs count.
     */
    public function getTotalCount(): int
    {
        return $this->model->count();
    }
}
