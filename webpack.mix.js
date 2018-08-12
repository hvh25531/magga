let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.react('resources/assets/js/app.js', 'public/js')
   .sass('resources/assets/sass/app.scss', 'public/css')
   .sass('public/css/albums.scss', 'public/css')
   .sass('public/css/common.scss', 'public/css')
   .sass('public/css/styles.scss', 'public/css')
   .sass('public/css/admin.scss', 'public/css');
   
