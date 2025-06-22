<div id="message-list">
    @foreach($students as $student)
        @include('company.layouts.messageList', [
            'photo' => $student['photo'] ?? '',
            'name' => trim(($student['first_name'] ?? '') . ' ' . ($student['last_name'] ?? '')) ?: 'Student',
            'id' => $student['id'],
            'type' => 'App/Models/Student',
            'study_direction' => $student['study_direction'] ?? 'Student',
        ])
    @endforeach
</div>
