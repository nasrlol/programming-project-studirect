<div class="message-company" data-company-id="{{ $id }}">
    <img src="{{ !empty($photo) ? $photo : asset('images/image-placeholder.png') }}" 
         class="company-thumb" 
         alt="Company Logo"
         onerror="this.src='{{ asset('images/image-placeholder.png') }}'">
    <span class="company-name">{{ $name }}</span>
</div>
