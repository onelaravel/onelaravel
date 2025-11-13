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
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    <link rel="stylesheet" href="{{ asset('static/assets/web/css/main.css') }}">
    <link rel="stylesheet" href="{{ asset('static/assets/web/css/components.css') }}">
    
    @yield('styles')
</head>
<body>