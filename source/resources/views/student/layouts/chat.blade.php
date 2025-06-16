<div class="chat-header">
    <h2></h2>
</div>
<div class="chat-messages">
    {{-- will be integrated later through backend --}}
</div>
<div class="chat-input">
    <form action="../messages/send" method="POST">
    @csrf
    <input type="hidden" name={{ $student_id }} value={{ $student_id }}>
    <input type="hidden" name="sender_type" value="App\Models\Student">
    <input type="hidden" name="company_id" value={{ $company_id }}>
    <input type="hidden" name="receiver_type" value="App\Models\Company">
    <textarea name="message" placeholder="Type your message..."></textarea>
    <input type="submit" value="Send">
    </form>
</div>
