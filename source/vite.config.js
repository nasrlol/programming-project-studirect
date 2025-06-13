import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/admin/admin.css',
                'resources/js/admin/adminEvents.js',
                'resources/js/admin/admin.js',
                'resources/css/student/student.css',
                'resources/js/student/student.js',
                'resources/css/company/company.css',
                'resources/js/company/company.js'
            ],
            refresh: true,
        }),
        tailwindcss(),
    ],
});
