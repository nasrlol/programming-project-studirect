<div class="appointment-list">
    <h3>Afspraken vandaag:</h3>
    @if(isset($appointments) && count($appointments) > 0)
        @foreach($appointments as $appointment)
            <div class="appointment-item">
                <div class="appointment-time">{{ $appointment['time_slot'] ?? 'No time specified' }}</div>
                <div class="appointment-student">{{ $appointment['student_name'] ?? 'Unknown student' }}</div>
            </div>
        @endforeach
    @else
        <p>Geen afspraken gevonden voor vandaag.</p>
    @endif
</div>
