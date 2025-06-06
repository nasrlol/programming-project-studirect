import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/admin/admin.css', 
                'resources/js/admin/admin.js', 
                'resources/js/admin/adminText.js', 
                'resources/js/admin/adminVars.js'
            ],
            refresh: true,
        }),
        tailwindcss(),
    ],
});
