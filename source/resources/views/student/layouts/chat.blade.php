<div class="chat-header">
    <h2></h2>
</div>
<div class="chat-messages" id="chat-messages">
    @if(isset($allMessages) && !empty($allMessages))
        @foreach($allMessages as $companyId => $messages)
                <div class="conversation" data-company-id="{{ $companyId }}" style="display: none;">
                    @if(is_array($messages))
                        @foreach($messages as $message)
                            <div class="message {{ (is_array($message) ? $message['sender_type'] : $message->sender_type) === 'App\\Models\\Student' ? 'sent' : 'received' }}">
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
</div>
<div class="chat-input">
    <form id="message-form" action="../messages/send" method="POST">
        @csrf
        <input type="hidden" name="sender_id" value="{{ $student_id }}" data-student-id="{{ $student_id }}">
        <input type="hidden" name="sender_type" value="App\Models\Student">
        <input type="hidden" name="receiver_id" id="current-company-id" value="">
        <input type="hidden" name="receiver_type" value="App\Models\Company">
        <input type="hidden" name="content" id="message-content">
        <textarea name="message" id="message-textarea" placeholder="Typ je bericht..." required></textarea>
        <input type="submit" value="Send">
    </form>
</div>
