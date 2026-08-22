<?php
/**
 * BeliSeken.com - PHP Router Fallback
 * Use this when cPanel doesn't support Node.js
 * Deploy this along with static export (out/) folder
 */

$uri = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);

// Remove trailing slash
$path = rtrim($path, '/');

// Route mapping (Next.js static export routes)
$routes = [
    '' => 'index.html',
    '/products' => 'products.html',
    '/about' => 'about.html',
    '/contact' => 'contact.html',
    '/sell' => 'sell.html',
    '/search' => 'search.html',
    '/login' => 'login.html',
    '/register' => 'register.html',
    '/blog' => 'blog.html',
    '/admin' => 'admin.html',
    '/admin/login' => 'admin/login.html',
    '/admin/products' => 'admin/products.html',
    '/admin/products/new' => 'admin/products/new.html',
    '/admin/orders' => 'admin/orders.html',
    '/admin/customers' => 'admin/customers.html',
    '/admin/banners' => 'admin/banners.html',
    '/admin/blog' => 'admin/blog.html',
    '/admin/blog/new' => 'admin/blog/new.html',
];

// Check if route exists
if (isset($routes[$path])) {
    $file = $routes[$path];
    if (file_exists($file)) {
        readfile($file);
        exit;
    }
}

// Dynamic routes: /product/[slug], /category/[slug], /blog/[slug]
$segments = explode('/', trim($path, '/'));

if (count($segments) >= 2) {
    $prefix = $segments[0];
    $slug = $segments[1];
    
    $dynamicRoutes = [
        'product' => "product/$slug.html",
        'category' => "category/$slug.html",
        'blog' => "blog/$slug.html",
    ];
    
    if (isset($dynamicRoutes[$prefix]) && file_exists($dynamicRoutes[$prefix])) {
        readfile($dynamicRoutes[$prefix]);
        exit;
    }
}

// Static assets
if (preg_match('/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/', $path)) {
    $file = ltrim($path, '/');
    if (file_exists($file)) {
        $ext = pathinfo($file, PATHINFO_EXTENSION);
        $mimeTypes = [
            'css' => 'text/css',
            'js' => 'application/javascript',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'ico' => 'image/x-icon',
            'woff' => 'font/woff',
            'woff2' => 'font/woff2',
            'ttf' => 'font/ttf',
            'eot' => 'application/vnd.ms-fontobject',
        ];
        
        header('Content-Type: ' . ($mimeTypes[$ext] ?? 'application/octet-stream'));
        header('Cache-Control: public, max-age=31536000, immutable');
        readfile($file);
        exit;
    }
}

// API routes (if using separate API server)
if (strpos($path, '/api/') === 0) {
    // Redirect to API server or return error
    header('Content-Type: application/json');
    http_response_code(404);
    echo json_encode(['error' => 'API not available on this server']);
    exit;
}

// 404 - Try to serve 404.html
if (file_exists('404.html')) {
    http_response_code(404);
    readfile('404.html');
} else {
    http_response_code(404);
    echo '<h1>404 - Not Found</h1>';
}
?>
