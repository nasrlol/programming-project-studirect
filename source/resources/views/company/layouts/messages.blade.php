
<div class="chat-header">
    <h2></h2>
</div>

<div class="chat-messages" id="chat-messages">
    <div class="no-messages active">
        <p>Select a student to start chatting!</p>
    </div>

    @if(isset($allMessages) && !empty($allMessages))
        @if(isset($allMessages['DEBUG']))
            <div class="debug-info" style="background: #f0f0f0; padding: 10px; margin: 10px;">
                <h3>Debug Information:</h3>
                <pre>{{ json_encode($allMessages, JSON_PRETTY_PRINT) }}</pre>
            </div>
        @else
            @foreach($allMessages as $studentId => $messages)
                <div class="conversation" data-student-id="{{ $studentId }}" style="display: none;">
                    @if(is_array($messages))
                        @foreach($messages as $message)
                            <div class="message {{ (is_array($message) ? $message['sender_type'] : $message->sender_type) === 'App\\Models\\Company' ? 'sent' : 'received' }}">
                                <div class="message-content">
                                    <p>{{ is_array($message) ? $message['content'] : $message->content }}</p>
                                    <span class="message-time">{{ \Carbon\Carbon::parse(is_array($message) ? $message['created_at'] : $message->created_at)->format('H:i') }}</span>
                                </div>
                            </div>
                        @endforeach
                    @else
                        <div class="error">Invalid message data format</div>
                    @endif
                </div>
            @endforeach
        @endif
    @endif
</div>

<div class="chat-input">
    <form id="message-form" action="../messages/send" method="POST">
        @csrf
        <input type="hidden" name="sender_id" value="{{ 2 }}" data-company-id="{{ 2 }}">
        <input type="hidden" name="sender_type" value="App\Models\Company">
        <input type="hidden" name="receiver_id" id="current-student-id" value="">
        <input type="hidden" name="receiver_type" value="App\Models\Student">
        <input type="hidden" name="content" id="message-content">
        <textarea name="message" id="message-textarea" placeholder="Type your message..." required></textarea>
        <input type="submit" value="Send">
    </form>
</div>