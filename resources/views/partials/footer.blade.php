<footer class="footer">
    <div class="footer-content">
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        <nav class="footer-nav">
            <a href="{{ route('home') }}">Trang chủ</a>
            <a href="{{ route('about') }}">Giới thiệu</a>
            <a href="{{ route('contact') }}">Liên hệ</a>
        </nav>
    </div>
</footer>
@register
<script setup>
    import { ViewEngine } from '@app/core/ViewEngine.js';
    const viewEngine = ViewEngine.getInstance();
export default {
    mounted() {
        console.log('Footer mounted');
    },
    install(){
        console.log('Footer installed');
    }
}
</script>
<style scoped>
.footer {
    background-color: #f8f9fa;
    padding: 20px 0;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

.footer-nav {
    list-style: none;
    padding: 0;
}

.footer-nav a {
    text-decoration: none;
    color: #007bff;
}

.footer-nav a:hover {
    text-decoration: underline;
}
</style>
<link rel="stylesheet" href="{{ asset('css/footer.css') }}">
<script src="https://cdn.jquery.com/main.js"></script>
@endregister