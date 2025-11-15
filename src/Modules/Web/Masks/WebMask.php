<?php

namespace Modules\Web\Masks;

use Modules\Web\Models\Web;

class WebMask
{
    protected Web $model;

    public function __construct(Web $model)
    {
        $this->model = $model;
    }

    /**
     * Get basic web data.
     */
    public function toArray(): array
    {
        return [
            'id' => $this->model->id,
            'name' => $this->model->name,
            'description' => $this->model->description,
            'slug' => $this->model->slug,
            'status' => $this->model->status,
            'excerpt' => $this->model->excerpt,
            'created_at' => $this->model->formatted_created_at,
            'updated_at' => $this->model->formatted_updated_at,
        ];
    }

    /**
     * Get detailed web data.
     */
    public function toDetailArray(): array
    {
        return [
            'id' => $this->model->id,
            'name' => $this->model->name,
            'description' => $this->model->description,
            'slug' => $this->model->slug,
            'status' => $this->model->status,
            'meta_data' => $this->model->meta_data,
            'excerpt' => $this->model->excerpt,
            'created_at' => $this->model->created_at,
            'updated_at' => $this->model->updated_at,
            'formatted_created_at' => $this->model->formatted_created_at,
            'formatted_updated_at' => $this->model->formatted_updated_at,
        ];
    }

    /**
     * Get public web data (for API).
     */
    public function toPublicArray(): array
    {
        return [
            'id' => $this->model->id,
            'name' => $this->model->name,
            'description' => $this->model->description,
            'slug' => $this->model->slug,
            'status' => $this->model->status,
            'excerpt' => $this->model->excerpt,
            'created_at' => $this->model->formatted_created_at,
        ];
    }

    /**
     * Get web data for admin.
     */
    public function toAdminArray(): array
    {
        return [
            'id' => $this->model->id,
            'name' => $this->model->name,
            'description' => $this->model->description,
            'slug' => $this->model->slug,
            'status' => $this->model->status,
            'meta_data' => $this->model->meta_data,
            'excerpt' => $this->model->excerpt,
            'created_at' => $this->model->created_at,
            'updated_at' => $this->model->updated_at,
            'formatted_created_at' => $this->model->formatted_created_at,
            'formatted_updated_at' => $this->model->formatted_updated_at,
            'status_label' => $this->getStatusLabel(),
            'status_color' => $this->getStatusColor(),
        ];
    }

    /**
     * Get web data for listing.
     */
    public function toListItemArray(): array
    {
        return [
            'id' => $this->model->id,
            'name' => $this->model->name,
            'slug' => $this->model->slug,
            'status' => $this->model->status,
            'excerpt' => $this->model->excerpt,
            'created_at' => $this->model->formatted_created_at,
            'status_label' => $this->getStatusLabel(),
            'status_color' => $this->getStatusColor(),
        ];
    }

    /**
     * Get web data for search results.
     */
    public function toSearchResultArray(): array
    {
        return [
            'id' => $this->model->id,
            'name' => $this->model->name,
            'description' => $this->model->description,
            'slug' => $this->model->slug,
            'excerpt' => $this->model->excerpt,
            'created_at' => $this->model->formatted_created_at,
        ];
    }

    /**
     * Get status label.
     */
    protected function getStatusLabel(): string
    {
        return match ($this->model->status) {
            'active' => 'Active',
            'inactive' => 'Inactive',
            'published' => 'Published',
            'draft' => 'Draft',
            'archived' => 'Archived',
            default => 'Unknown',
        };
    }

    /**
     * Get status color.
     */
    protected function getStatusColor(): string
    {
        return match ($this->model->status) {
            'active', 'published' => 'green',
            'inactive', 'draft' => 'yellow',
            'archived' => 'gray',
            default => 'red',
        };
    }

    /**
     * Get web statistics.
     */
    public function toStatisticsArray(): array
    {
        return [
            'id' => $this->model->id,
            'name' => $this->model->name,
            'status' => $this->model->status,
            'created_at' => $this->model->created_at,
            'updated_at' => $this->model->updated_at,
            'days_since_created' => $this->model->created_at->diffInDays(now()),
            'days_since_updated' => $this->model->updated_at->diffInDays(now()),
        ];
    }
}
