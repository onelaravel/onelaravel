<?php

namespace Contexts\Admin\Controllers;

use Contexts\Admin\Controllers\BaseAdminController;

class DashboardController extends BaseAdminController
{
    public function index()
    {
        return $this->renderAdminView('dashboard.index');
    }
}