import path from 'path';
import { fileURLToPath } from 'url';
import TerserPlugin from 'terser-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    mode: 'production',
    devtool: 'source-map', // Enable source maps for debugging
    entry: './resources/js/app/index.js',
    output: {
        path: path.resolve(__dirname, 'resources/js/build'),
        filename: '[name].js',
        chunkFilename: '[name].[chunkhash:8].js',
        clean: false, // Don't clean the directory to preserve other files
        library: {
            name: 'App',
            type: 'umd', // Universal Module Definition
            export: 'default'
        },
        globalObject: 'typeof self !== \'undefined\' ? self : this', // Universal compatibility
        sourceMapFilename: '[name].js.map' // Explicit source map filename
    },
    module: {
        rules: [
            // No babel - keep original ES6 syntax
        ]
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname, 'resources/js/app'),
            '@app': path.resolve(__dirname, 'resources/js/app'),
        }
    },
    optimization: {
        minimize: true, // Enable minification for production
        minimizer: [
            // Use TerserPlugin for better minification
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: false, // Keep console.log for debugging
                        drop_debugger: true,
                        // pure_funcs: ['console.log'], // Keep console.log for debugging
                        passes: 2 // Multiple passes for better compression
                    },
                    mangle: {
                        toplevel: true, // Mangle top-level names
                        keep_fnames: false
                    },
                    format: {
                        comments: false // Remove comments
                    },
                    sourceMap: true // Preserve source maps in terser options
                },
                extractComments: false, // Don't extract comments to separate file
                parallel: true // Enable parallel processing
            })
        ],
        // Enable optimizations
        concatenateModules: true, // Concatenate modules for better compression
        usedExports: true, // Enable tree shaking
        sideEffects: false,
        splitChunks: {
            chunks: 'all',
            maxSize: 200000, // Split chunks larger than 200KB
            cacheGroups: {
                // Separate vendor libraries
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: 10,
                    maxSize: 150000 // Split vendors larger than 150KB
                },
                // Separate core modules
                core: {
                    test: /[\\/]resources[\\/]js[\\/]app[\\/]core[\\/]/,
                    name: 'core',
                    chunks: 'all',
                    priority: 8,
                    maxSize: 100000 // Split core larger than 100KB
                },
                // Separate views
                views: {
                    test: /[\\/]resources[\\/]js[\\/]app[\\/]views[\\/]/,
                    name: 'views',
                    chunks: 'all',
                    priority: 6,
                    minChunks: 1,
                    maxSize: 150000 // Split views larger than 150KB
                },
                // Separate helpers/utils
                utils: {
                    test: /[\\/]resources[\\/]js[\\/]app[\\/](helpers|services)[\\/]/,
                    name: 'utils',
                    chunks: 'all',
                    priority: 5,
                    maxSize: 50000
                }
            }
        }
    },
    externals: {
        // Don't bundle these, assume they're available globally
        'window': 'window',
        'document': 'document'
    },
    // Performance configuration
    performance: {
        maxEntrypointSize: 400000, // 400KB for entrypoints
        maxAssetSize: 250000, // 250KB for individual assets
        hints: 'warning' // Show warnings instead of errors
    },
    // Cấu hình để mỗi module có scope riêng
    experiments: {
        topLevelAwait: true
    }
};
