<div class="message-contact" data-user-id="{{ $id }}" data-user-type="{{ $type ?? 'App/Models/Student' }}">
    <div class="contact-thumb">
        @if($photo)
            <img src="{{ $photo }}" alt="{{ $name }}">
        @else
            <div class="placeholder-thumb">{{ substr($name, 0, 1) }}</div>
        @endif
    </div>
    <div class="contact-info">
        <h4>{{ $name }}</h4>
        <p>Click to start chatting</p>
    </div>
</div>
