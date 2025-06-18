<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Company</title>
    
    {{-- Vite injectie --}}
    @vite(['resources/css/company/company.css'])
</head>
<body>
    
        @include('company.layouts.navbar')
   

  <main id="company-content">
    @include('company.layouts.home')
</main>
    @vite([ 'resources/js/company/company.js', 'resources/js/company/messages.js'])
</body>
</html>