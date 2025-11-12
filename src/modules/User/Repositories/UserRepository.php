<?php

namespace Modules\User\Repositories;

use Shared\Repositories\BaseRepository;
use Modules\User\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    /**
     * Get all users (alias for getAll)
     */
    public function all(array $filters = [], array $relations = []): Collection
    {
        return $this->getAll($filters, $relations);
    }

    /**
     * Find user by email
     */
    public function findByEmail(string $email, array $relations = []): ?User
    {
        return $this->findBy('email', $email, $relations);
    }

    /**
     * Find users by role
     */
    public function findByRole(string $role, array $relations = []): Collection
    {
        return $this->findAllBy('role', $role, $relations);
    }

    /**
     * Find users by status
     */
    public function findByStatus(string $status, array $relations = []): Collection
    {
        return $this->findAllBy('status', $status, $relations);
    }

    /**
     * Find users by verification status
     */
    public function findByVerificationStatus(bool $verified, array $relations = []): Collection
    {
        $filter = $verified ? ['email_verified_at' => 'not_null'] : ['email_verified_at' => 'null'];
        return $this->getAll($filter, $relations);
    }

    /**
     * Search users by name or email
     */
    public function search(string $query, array $relations = []): Collection
    {
        $filters = [
            'name' => ['like' => $query],
            'email' => ['like' => $query],
        ];

        return $this->getAll($filters, $relations);
    }

    /**
     * Get users with pagination and search
     */
    public function getWithSearch(string $search = '', array $filters = [], array $relations = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->newQuery();

        // Apply search
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply filters
        $this->applyFilters($query, $filters);

        // Apply relations
        $this->applyRelations($query, $relations);

        return $query->paginate($perPage);
    }

    /**
     * Get users by multiple IDs
     */
    public function findMany(array $ids, array $relations = []): Collection
    {
        $query = $this->model->newQuery();
        $this->applyRelations($query, $relations);
        
        return $query->whereIn('id', $ids)->get();
    }

    /**
     * Get users by multiple emails
     */
    public function findByEmails(array $emails, array $relations = []): Collection
    {
        $query = $this->model->newQuery();
        $this->applyRelations($query, $relations);
        
        return $query->whereIn('email', $emails)->get();
    }

    /**
     * Get users created in date range
     */
    public function getByDateRange(string $startDate, string $endDate, array $relations = []): Collection
    {
        $filters = [
            'created_at' => ['between' => [$startDate, $endDate]]
        ];

        return $this->getAll($filters, $relations);
    }

    /**
     * Get users by last login date
     */
    public function getByLastLogin(string $date, string $operator = '>=', array $relations = []): Collection
    {
        $filters = [
            'last_login_at' => ['operator' => $operator, 'value' => $date]
        ];

        return $this->getAll($filters, $relations);
    }

    /**
     * Get users with specific permissions
     */
    public function getByPermissions(array $permissions, array $relations = []): Collection
    {
        $query = $this->model->newQuery();
        $this->applyRelations($query, $relations);

        foreach ($permissions as $permission) {
            $query->whereHas('permissions', function ($q) use ($permission) {
                $q->where('name', $permission);
            });
        }

        return $query->get();
    }

    /**
     * Get users by department/team
     */
    public function getByDepartment(string $department, array $relations = []): Collection
    {
        return $this->findAllBy('department', $department, $relations);
    }

    /**
     * Get users by location
     */
    public function getByLocation(string $location, array $relations = []): Collection
    {
        return $this->findAllBy('location', $location, $relations);
    }

    /**
     * Get users with specific subscription status
     */
    public function getBySubscriptionStatus(string $status, array $relations = []): Collection
    {
        return $this->findAllBy('subscription_status', $status, $relations);
    }

    /**
     * Get users with expired subscriptions
     */
    public function getExpiredSubscriptions(array $relations = []): Collection
    {
        $filters = [
            'subscription_expires_at' => ['operator' => '<', 'value' => now()]
        ];

        return $this->getAll($filters, $relations);
    }

    /**
     * Get users with active subscriptions
     */
    public function getActiveSubscriptions(array $relations = []): Collection
    {
        $filters = [
            'subscription_expires_at' => ['operator' => '>=', 'value' => now()]
        ];

        return $this->getAll($filters, $relations);
    }

    /**
     * Get users by registration source
     */
    public function getByRegistrationSource(string $source, array $relations = []): Collection
    {
        return $this->findAllBy('registration_source', $source, $relations);
    }

    /**
     * Get users by social login provider
     */
    public function getBySocialProvider(string $provider, array $relations = []): Collection
    {
        return $this->findAllBy('social_provider', $provider, $relations);
    }

    /**
     * Get users by language preference
     */
    public function getByLanguage(string $language, array $relations = []): Collection
    {
        return $this->findAllBy('language', $language, $relations);
    }

    /**
     * Get users by timezone
     */
    public function getByTimezone(string $timezone, array $relations = []): Collection
    {
        return $this->findAllBy('timezone', $timezone, $relations);
    }

    /**
     * Get users with specific notification preferences
     */
    public function getByNotificationPreference(string $type, bool $enabled, array $relations = []): Collection
    {
        $filters = [
            "notifications.{$type}" => $enabled
        ];

        return $this->getAll($filters, $relations);
    }

    /**
     * Get users by account type
     */
    public function getByAccountType(string $type, array $relations = []): Collection
    {
        return $this->findAllBy('account_type', $type, $relations);
    }

    /**
     * Get users by verification method
     */
    public function getByVerificationMethod(string $method, array $relations = []): Collection
    {
        return $this->findAllBy('verification_method', $method, $relations);
    }

    /**
     * Get users by last activity
     */
    public function getByLastActivity(string $date, string $operator = '>=', array $relations = []): Collection
    {
        $filters = [
            'last_activity_at' => ['operator' => $operator, 'value' => $date]
        ];

        return $this->getAll($filters, $relations);
    }

    /**
     * Get users by login count
     */
    public function getByLoginCount(int $count, string $operator = '>=', array $relations = []): Collection
    {
        $filters = [
            'login_count' => ['operator' => $operator, 'value' => $count]
        ];

        return $this->getAll($filters, $relations);
    }

    /**
     * Get users by failed login attempts
     */
    public function getByFailedLoginAttempts(int $attempts, string $operator = '>=', array $relations = []): Collection
    {
        $filters = [
            'failed_login_attempts' => ['operator' => $operator, 'value' => $attempts]
        ];

        return $this->getAll($filters, $relations);
    }

    /**
     * Get users by account age (days)
     */
    public function getByAccountAge(int $days, string $operator = '>=', array $relations = []): Collection
    {
        $date = now()->subDays($days);
        $filters = [
            'created_at' => ['operator' => $operator, 'value' => $date]
        ];

        return $this->getAll($filters, $relations);
    }

    /**
     * Get users by profile completion percentage
     */
    public function getByProfileCompletion(int $percentage, string $operator = '>=', array $relations = []): Collection
    {
        $filters = [
            'profile_completion' => ['operator' => $operator, 'value' => $percentage]
        ];

        return $this->getAll($filters, $relations);
    }
} 