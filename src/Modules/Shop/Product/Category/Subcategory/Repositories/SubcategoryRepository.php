<?php

namespace Modules\Shop\Product\Category\Subcategory\Repositories;

use Modules\Shop\Product\Category\Subcategory\Models\Subcategory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class SubcategoryRepository
{
    protected Subcategory $model;

    public function __construct(Subcategory $model)
    {
        $this->model = $model;
    }

    /**
     * Get all subcategorys.
     */
    public function all(): Collection
    {
        return $this->model->all();
    }

    /**
     * Get all active subcategorys.
     */
    public function getActive(): Collection
    {
        return $this->model->active()->get();
    }

    /**
     * Get all published subcategorys.
     */
    public function getPublished(): Collection
    {
        return $this->model->published()->get();
    }

    /**
     * Get subcategory by ID.
     */
    public function findById(int $id): ?Subcategory
    {
        return $this->model->find($id);
    }

    /**
     * Get subcategory by slug.
     */
    public function findBySlug(string $slug): ?Subcategory
    {
        return $this->model->where('slug', $slug)->first();
    }

    /**
     * Create a new subcategory.
     */
    public function create(array $data): Subcategory
    {
        return $this->model->create($data);
    }

    /**
     * Update subcategory by ID.
     */
    public function update(int $id, array $data): bool
    {
        $subcategory = $this->findById($id);
        
        if (!$subcategory) {
            return false;
        }

        return $subcategory->update($data);
    }

    /**
     * Delete subcategory by ID.
     */
    public function delete(int $id): bool
    {
        $subcategory = $this->findById($id);
        
        if (!$subcategory) {
            return false;
        }

        return $subcategory->delete();
    }

    /**
     * Restore deleted subcategory by ID.
     */
    public function restore(int $id): bool
    {
        $subcategory = $this->model->withTrashed()->find($id);
        
        if (!$subcategory) {
            return false;
        }

        return $subcategory->restore();
    }

    /**
     * Force delete subcategory by ID.
     */
    public function forceDelete(int $id): bool
    {
        $subcategory = $this->model->withTrashed()->find($id);
        
        if (!$subcategory) {
            return false;
        }

        return $subcategory->forceDelete();
    }

    /**
     * Paginate subcategorys.
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage);
    }

    /**
     * Search subcategorys by name or description.
     */
    public function search(string $query): Collection
    {
        return $this->model->where(function ($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
              ->orWhere('description', 'like', "%{$query}%");
        })->get();
    }

    /**
     * Get subcategorys by status.
     */
    public function getByStatus(string $status): Collection
    {
        return $this->model->where('status', $status)->get();
    }

    /**
     * Get recent subcategorys.
     */
    public function getRecent(int $limit = 10): Collection
    {
        return $this->model->latest()->limit($limit)->get();
    }

    /**
     * Get subcategory count by status.
     */
    public function getCountByStatus(string $status): int
    {
        return $this->model->where('status', $status)->count();
    }

    /**
     * Get total subcategorys count.
     */
    public function getTotalCount(): int
    {
        return $this->model->count();
    }
}
