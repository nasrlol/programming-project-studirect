<section class="sectionType1">
    <h2>Afspraken</h2>
    <div class="appointments-list">
        @if(count($appointments ?? []) > 0)
            @foreach($appointments as $appointment)
                <div class="appointment-item">
                    <div class="appointment-time">
                        {{ $appointment['time_slot'] }}
                    </div>
                    <div class="appointment-details">
                        <h4>{{ $appointment['company_name'] ?? 'Onbekend bedrijf' }}</h4>
                        <p class="appointment-type">Afspraak</p>
                    </div>
                    <div class="appointment-actions">
                        <button class="edit-appointment" data-id="{{ $appointment['id'] }}">
                            <img src="{{ asset('images/edit.png') }}" alt="Bewerken" title="Bewerken">
                        </button>
                        <button class="delete-appointment" data-id="{{ $appointment['id'] }}">
                            <img src="{{ asset('images/delete.png') }}" alt="Verwijderen" title="Verwijderen">
                        </button>
                    </div>
                </div>
            @endforeach
        @else
            <div class="no-appointments-message">
                <p>Je hebt nog geen afspraken gepland.</p>
            </div>
        @endif
    </div>
</section>

<section class="sectionType2">
    <div class="daily-calendar">
        <table class="calendar-table">
            <thead>
                <tr>
                    <th class="time-column">Tijd</th>
                    <th class="appointment-column">Afspraken</th>
                </tr>
            </thead>
            <tbody>
                @for($hour = 9; $hour <= 18; $hour++)
                    <tr class="hour-row" data-hour="{{ $hour }}">
                        <td class="time-cell">
                            {{ sprintf('%02d:00', $hour) }}
                        </td>
                        <td class="appointment-cell" data-hour="{{ $hour }}">
                            <div class="time-slots">                                @for($quarter = 0; $quarter < 4; $quarter++)
                                    @php
                                        $minutes = $quarter * 15;
                                        $timeSlot = sprintf('%02d:%02d', $hour, $minutes);

                                        // Find appointment that matches this time slot
                                        $appointment = collect($appointments ?? [])->first(function($app) use ($hour, $minutes) {
                                            if (empty($app['time_slot'])) return false;

                                            // Parse the time_slot (e.g., "10:30-11:00" or "10:30")
                                            $timeSlotParts = explode('-', $app['time_slot']);
                                            $startTime = trim($timeSlotParts[0]);

                                            if (strpos($startTime, ':') !== false) {
                                                list($startHour, $startMin) = explode(':', $startTime);
                                                return (int)$startHour === $hour && (int)$startMin >= $minutes && (int)$startMin < $minutes + 15;
                                            }

                                            return false;
                                        });
                                    @endphp
                                    <div class="quarter-slot" data-time="{{ $timeSlot }}">
                                        @if($appointment)
                                            <div class="appointment-block" data-appointment-id="{{ $appointment['id'] }}">
                                                <span class="company-name">{{ $appointment['company_name'] ?? 'Onbekend' }}</span>
                                                <span class="appointment-time">{{ $appointment['time_slot'] }}</span>
                                            </div>
                                        @endif
                                    </div>
                                @endfor
                            </div>
                        </td>
                    </tr>
                @endfor
            </tbody>
        </table>
    </div>
</section>
