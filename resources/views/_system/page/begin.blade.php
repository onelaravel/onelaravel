<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('meta:title', 'One Laravel - Advanced SPA Framework')</title>
    <meta name="description" content="@yield('meta:description', 'One Laravel is an advanced SPA framework that seamlessly integrates Laravel backend with reactive frontend capabilities.')">
    <meta name="keywords" content="@yield('meta:keywords', 'Laravel, SPA, PHP, JavaScript, Framework, Reactive, One Laravel')">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="{{ $__env->yieldContent('favicon', asset('favicon.ico')) }}">
    @include($__component__.'links')
    
    @yield('styles')
</head>
<body>
    <!-- body top -->

    <!-- begin application content -->
    <div id="app-root" data-server-rendered="true">