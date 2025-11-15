<?php

namespace Shared\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

abstract class BaseRepository
{
    protected $model;

    public function __construct(Model $model = null)
    {
        $this->model = $model;
    }

    /**
     * Get model instance
     */
    public function getModel(): Model
    {
        return $this->model;
    }

    /**
     * Set model instance
     */
    public function setModel(Model $model): self
    {
        $this->model = $model;
        return $this;
    }

    /**
     * Get all records
     */
    public function getAll(array $filters = [], array $relations = []): Collection
    {
        $query = $this->model->newQuery();
        
        $this->applyFilters($query, $filters);
        $this->applyRelations($query, $relations);
        
        return $query->get();
    }

    /**
     * Get paginated records
     */
    public function getPaginated(array $filters = [], array $relations = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->newQuery();
        
        $this->applyFilters($query, $filters);
        $this->applyRelations($query, $relations);
        
        return $query->paginate($perPage);
    }

    /**
     * Find record by ID
     */
    public function find($id, array $relations = [])
    {
        $query = $this->model->newQuery();
        $this->applyRelations($query, $relations);
        
        return $query->find($id);
    }

    /**
     * Find record by field
     */
    public function findBy(string $field, $value, array $relations = []): ?Model
    {
        $query = $this->model->newQuery();
        $this->applyRelations($query, $relations);
        
        return $query->where($field, $value)->first();
    }

    /**
     * Find multiple records by field
     */
    public function findAllBy(string $field, $value, array $relations = []): Collection
    {
        $query = $this->model->newQuery();
        $this->applyRelations($query, $relations);
        
        return $query->where($field, $value)->get();
    }

    /**
     * Find record or fail
     */
    public function findOrFail($id, array $relations = []): Model
    {
        $query = $this->model->newQuery();
        $this->applyRelations($query, $relations);
        
        return $query->findOrFail($id);
    }

    /**
     * Find record by field or fail
     */
    public function findByOrFail(string $field, $value, array $relations = []): Model
    {
        $query = $this->model->newQuery();
        $this->applyRelations($query, $relations);
        
        return $query->where($field, $value)->firstOrFail();
    }

    /**
     * Create new record
     */
    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    /**
     * Update record
     */
    public function update($id, array $data): Model
    {
        $model = $this->find($id);
        
        if (!$model) {
            throw new \Exception('Record not found');
        }
        
        $model->update($data);
        return $model->fresh();
    }

    /**
     * Update or create record
     */
    public function updateOrCreate(array $attributes, array $values = []): Model
    {
        return $this->model->updateOrCreate($attributes, $values);
    }

    /**
     * Delete record
     */
    public function delete($id): bool
    {
        $model = $this->find($id);
        
        if (!$model) {
            return false;
        }
        
        return $model->delete();
    }

    /**
     * Soft delete record (if model supports it)
     */
    public function softDelete($id): bool
    {
        $model = $this->find($id);
        
        if (!$model || !method_exists($model, 'delete')) {
            return false;
        }
        
        return $model->delete();
    }

    /**
     * Restore soft deleted record
     */
    public function restore($id): bool
    {
        if (!method_exists($this->model, 'withTrashed')) {
            return false;
        }
        
        $model = $this->model->withTrashed()->find($id);
        
        if (!$model) {
            return false;
        }
        
        return $model->restore();
    }

    /**
     * Check if record exists
     */
    public function exists($id): bool
    {
        return $this->model->where('id', $id)->exists();
    }

    /**
     * Check if record exists by field
     */
    public function existsBy(string $field, $value): bool
    {
        return $this->model->where($field, $value)->exists();
    }

    /**
     * Count records
     */
    public function count(array $filters = []): int
    {
        $query = $this->model->newQuery();
        $this->applyFilters($query, $filters);
        
        return $query->count();
    }

    /**
     * Get first record
     */
    public function first(array $filters = [], array $relations = []): ?Model
    {
        $query = $this->model->newQuery();
        $this->applyFilters($query, $filters);
        $this->applyRelations($query, $relations);
        
        return $query->first();
    }

    /**
     * Get last record
     */
    public function last(array $filters = [], array $relations = []): ?Model
    {
        $query = $this->model->newQuery();
        $this->applyFilters($query, $filters);
        $this->applyRelations($query, $relations);
        
        return $query->orderBy('id', 'desc')->first();
    }

    /**
     * Get records with specific columns
     */
    public function getColumns(array $columns, array $filters = []): Collection
    {
        $query = $this->model->newQuery()->select($columns);
        $this->applyFilters($query, $filters);
        
        return $query->get();
    }

    /**
     * Apply filters to query
     */
    protected function applyFilters(Builder $query, array $filters): void
    {
        foreach ($filters as $field => $value) {
            if (is_array($value)) {
                if (isset($value['operator']) && isset($value['value'])) {
                    $query->where($field, $value['operator'], $value['value']);
                } elseif (isset($value['in'])) {
                    $query->whereIn($field, $value['in']);
                } elseif (isset($value['not_in'])) {
                    $query->whereNotIn($field, $value['not_in']);
                } elseif (isset($value['between'])) {
                    $query->whereBetween($field, $value['between']);
                } elseif (isset($value['like'])) {
                    $query->where($field, 'like', '%' . $value['like'] . '%');
                }
            } else {
                $query->where($field, $value);
            }
        }
    }

    /**
     * Apply relations to query
     */
    protected function applyRelations(Builder $query, array $relations): void
    {
        foreach ($relations as $relation) {
            $query->with($relation);
        }
    }

    /**
     * Get query builder instance
     */
    public function query(): Builder
    {
        return $this->model->newQuery();
    }

    /**
     * Execute raw query
     */
    public function raw(string $sql, array $bindings = []): mixed
    {
        return DB::raw($sql, $bindings);
    }

    /**
     * Execute select query
     */
    public function select(string $sql, array $bindings = []): Collection
    {
        return collect(DB::select($sql, $bindings));
    }
} 