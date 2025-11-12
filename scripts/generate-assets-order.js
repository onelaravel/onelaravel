#!/usr/bin/env node

/**
 * Generate assets loading order for HTML
 * Reads webpack build output and creates ordered script tags
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATIC_PATH = path.join(__dirname, '../public/static/app');
const OUTPUT_FILE = path.join(__dirname, '../resources/views/partials/assets-scripts.blade.php');

function getAssetsByCategory() {
    const assets = {
        core: [],
        utils: [],
        views: [],
        main: []
    };

    try {
        const files = fs.readdirSync(STATIC_PATH);
        
        files.forEach(file => {
            if (!file.endsWith('.js') || file.endsWith('.map')) return;
            
            if (file.startsWith('core-')) {
                assets.core.push(file);
            } else if (file.startsWith('utils-')) {
                assets.utils.push(file);
            } else if (file.startsWith('views-')) {
                assets.views.push(file);
            } else if (file === 'main.js') {
                assets.main.push(file);
            }
        });

        // Sort by filename to ensure consistent order
        Object.keys(assets).forEach(key => {
            assets[key].sort();
        });

        return assets;
    } catch (error) {
        console.error('Error reading assets:', error);
        return assets;
    }
}

function generateBladeTemplate(assets) {
    const lines = [
        '{{-- Auto-generated webpack assets --}}',
        '{{-- Generated at: ' + new Date().toISOString() + ' --}}',
        '',
        '{{-- Core chunks (highest priority) --}}'
    ];

    // Add core chunks
    assets.core.forEach(file => {
        lines.push(`<script src="{{ asset('static/app/${file}') }}" defer></script>`);
    });

    if (assets.utils.length > 0) {
        lines.push('');
        lines.push('{{-- Utils chunks --}}');
        assets.utils.forEach(file => {
            lines.push(`<script src="{{ asset('static/app/${file}') }}" defer></script>`);
        });
    }

    lines.push('');
    lines.push('{{-- Views chunks --}}');
    assets.views.forEach(file => {
        lines.push(`<script src="{{ asset('static/app/${file}') }}" defer></script>`);
    });

    lines.push('');
    lines.push('{{-- Main entry point (last) --}}');
    assets.main.forEach(file => {
        lines.push(`<script src="{{ asset('static/app/${file}') }}" defer></script>`);
    });

    return lines.join('\n');
}

function generateHTMLTemplate(assets) {
    console.log('\n📋 **HTML Script Tags (in loading order):**\n');
    
    console.log('<!-- Core chunks (highest priority) -->');
    assets.core.forEach(file => {
        console.log(`<script src="/static/app/${file}" defer></script>`);
    });

    if (assets.utils.length > 0) {
        console.log('\n<!-- Utils chunks -->');
        assets.utils.forEach(file => {
            console.log(`<script src="/static/app/${file}" defer></script>`);
        });
    }

    console.log('\n<!-- Views chunks -->');
    assets.views.forEach(file => {
        console.log(`<script src="/static/app/${file}" defer></script>`);
    });

    console.log('\n<!-- Main entry point (last) -->');
    assets.main.forEach(file => {
        console.log(`<script src="/static/app/${file}" defer></script>`);
    });

    console.log('\n');
}

function main() {
    console.log('🔍 Analyzing webpack assets...');
    
    const assets = getAssetsByCategory();
    
    console.log('📊 **Assets Summary:**');
    console.log(`- Core chunks: ${assets.core.length}`);
    console.log(`- Utils chunks: ${assets.utils.length}`);
    console.log(`- Views chunks: ${assets.views.length}`);
    console.log(`- Main chunks: ${assets.main.length}`);
    console.log(`- Total JS files: ${Object.values(assets).flat().length}`);

    // Generate Blade template
    const bladeContent = generateBladeTemplate(assets);
    
    try {
        fs.writeFileSync(OUTPUT_FILE, bladeContent);
        console.log(`✅ Generated Blade template: ${OUTPUT_FILE}`);
    } catch (error) {
        console.error('❌ Error writing Blade template:', error);
    }

    // Show HTML version
    generateHTMLTemplate(assets);
    
    console.log('💡 **Usage in your layout:**');
    console.log('@include("partials.assets-scripts")');
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { getAssetsByCategory, generateBladeTemplate };