<?php

namespace Shared\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Steak\Core\Services\Service;

abstract class BaseService extends Service
{
    /**
     * Execute database transaction
     */
    protected function executeInTransaction(callable $callback)
    {
        DB::beginTransaction();
        
        try {
            $result = $callback();
            DB::commit();
            return $result;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Transaction failed: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Handle exceptions and log them
     */
    protected function handleException(\Exception $e, string $context = ''): void
    {
        Log::error("Error in {$context}: " . $e->getMessage(), [
            'exception' => $e,
            'trace' => $e->getTraceAsString()
        ]);
        
        throw $e;
    }

    /**
     * Validate data
     */
    protected function validateData(array $data, array $rules): array
    {
        $validator = validator($data, $rules);
        
        if ($validator->fails()) {
            throw new \InvalidArgumentException($validator->errors()->first());
        }
        
        return $data;
    }

    /**
     * Filter data by allowed fields
     */
    protected function filterData(array $data, array $allowedFields): array
    {
        return array_intersect_key($data, array_flip($allowedFields));
    }

    /**
     * Transform data
     */
    protected function transformData(array $data, array $transformations): array
    {
        $transformed = [];
        
        foreach ($transformations as $key => $transformation) {
            if (isset($data[$key])) {
                $transformed[$key] = $transformation($data[$key]);
            }
        }
        
        return array_merge($data, $transformed);
    }

    /**
     * Generate slug from string
     */
    protected function generateSlug(string $string): string
    {
        return strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $string)));
    }

    /**
     * Generate unique slug
     */
    protected function generateUniqueSlug(string $string, callable $existsCallback): string
    {
        $baseSlug = $this->generateSlug($string);
        $slug = $baseSlug;
        $counter = 1;
        
        while ($existsCallback($slug)) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }
        
        return $slug;
    }

    /**
     * Format response data
     */
    protected function formatResponse($data, string $message = 'Success', bool $success = true): array
    {
        return [
            'success' => $success,
            'message' => $message,
            'data' => $data
        ];
    }

    /**
     * Format paginated response
     */
    protected function formatPaginatedResponse(LengthAwarePaginator $paginator, string $message = 'Success'): array
    {
        return [
            'success' => true,
            'message' => $message,
            'data' => $paginator->items(),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ]
        ];
    }
} 