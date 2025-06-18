<div class="message-student-list">
    @foreach($students as $student)
        <div class="message-student" data-student-id="{{ $student->id }}">
            <img src="{{ $student->photo ?? '/images/default-avatar.png' }}" class="student-thumb">
            <span class="student-name">{{ $student->first_name }} {{ $student->last_name }}</span>
        </div>
    @endforeach
</div>

<div class="chat-section">
    <div class="chat-header">
        <h2></h2>
    </div>

    <div class="chat-messages" id="chat-messages">
        <div class="no-messages active">
            <p>Select a student to start chatting!</p>
        </div>

        @if(isset($allMessages) && !empty($allMessages))
            @foreach($allMessages as $studentId => $messages)
                <div class="conversation" data-student-id="{{ $studentId }}" style="display: none;">
                    @foreach($messages as $message)
                        <div class="message {{ (is_array($message) ? $message['sender_type'] : $message->sender_type) === 'App\\Models\\Company' ? 'sent' : 'received' }}">
                            <div class="message-content">
                                <p>{{ is_array($message) ? $message['content'] : $message->content }}</p>
                                <span class="message-time">{{ \Carbon\Carbon::parse(is_array($message) ? $message['created_at'] : $message->created_at)->format('H:i') }}</span>
                            </div>
                        </div>
                    @endforeach
                </div>
            @endforeach
        @endif
    </div>

    <div class="chat-input">
        <form id="message-form" action="{{ route('messages.send') }}" method="POST">
            @csrf
            <input type="hidden" name="sender_id" value="{{ $company_id }}" data-company-id="{{ $company_id }}">
            <input type="hidden" name="sender_type" value="App\Models\Company">
            <input type="hidden" name="receiver_id" id="current-student-id" value="">
            <input type="hidden" name="receiver_type" value="App\Models\Student">
            <input type="hidden" name="content" id="message-content">
            <textarea name="message" id="message-textarea" placeholder="Type your message..." required></textarea>
            <input type="submit" value="Send">
        </form>
    </div>
</div>
