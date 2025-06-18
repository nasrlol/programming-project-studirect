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
                'resources/js/company/company.js',
                'resources/js/company/home.js',
                'resources/js/company/messages.js',
                'resources/js/company/calendar.js',
                'resources/js/company/settings.js',
            ],
            refresh: true,
        }),
        tailwindcss(),
    ],
});
