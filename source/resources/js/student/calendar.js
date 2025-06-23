document.addEventListener('DOMContentLoaded', function() {
    // Initialize calendar for current date only
    updateCalendarDate();

    // Update calendar date display
    function updateCalendarDate() {
        const currentDate = new Date();
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            weekday: 'short'
        };
        document.getElementById('current-date').textContent =
            currentDate.toLocaleDateString('nl-NL', options);
    }

    // Handle appointment actions
    document.addEventListener('click', function(e) {
        if (e.target.closest('.edit-appointment')) {
            const appointmentId = e.target.closest('.edit-appointment').dataset.id;
            editAppointment(appointmentId);
        }

        if (e.target.closest('.delete-appointment')) {
            const appointmentId = e.target.closest('.delete-appointment').dataset.id;
            deleteAppointment(appointmentId);
        }

        if (e.target.closest('.appointment-block')) {
            const appointmentBlock = e.target.closest('.appointment-block');
            showAppointmentDetails(appointmentBlock);
        }
    });

    // Edit appointment function
    function editAppointment(appointmentId) {
        // This would typically open a modal or form
        const newTimeSlot = prompt('Nieuwe tijd voor de afspraak (bijv. 10:30-11:00):');
        if (newTimeSlot && newTimeSlot.trim()) {
            // Send update request
            fetch(`/appointments/${appointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    time_slot: newTimeSlot.trim()
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload(); // Refresh to show changes
                } else {
                    alert('Er is een fout opgetreden bij het bijwerken van de afspraak.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Er is een fout opgetreden bij het bijwerken van de afspraak.');
            });
        }
    }

    // Delete appointment function
    function deleteAppointment(appointmentId) {
        if (confirm('Weet je zeker dat je deze afspraak wilt verwijderen?')) {
            fetch(`/appointments/${appointmentId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload(); // Refresh to show changes
                } else {
                    alert('Er is een fout opgetreden bij het verwijderen van de afspraak.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Er is een fout opgetreden bij het verwijderen van de afspraak.');
            });
        }
    }

    // Show appointment details
    function showAppointmentDetails(appointmentBlock) {
        const companyName = appointmentBlock.querySelector('.company-name').textContent;
        const appointmentTime = appointmentBlock.querySelector('.appointment-time').textContent;

        alert(`Afspraak met ${companyName}\nTijd: ${appointmentTime}`);
        // This could be replaced with a proper modal or details panel
    }

    // Add click handler for time slots to create new appointments
    document.querySelectorAll('.quarter-slot').forEach(slot => {
        slot.addEventListener('click', function(e) {
            if (!e.target.closest('.appointment-block')) {
                const timeSlot = this.dataset.time;
                createAppointment(timeSlot);
            }
        });
    });

    // Create new appointment
    function createAppointment(timeSlot) {
        const companyName = prompt('Bedrijf voor de afspraak:');
        if (companyName && companyName.trim()) {
            // This is simplified - in reality you'd select from available companies
            alert(`Nieuwe afspraak gepland om ${timeSlot} met ${companyName}`);
            // Here you would make an API call to create the appointment
        }
    }
      // Highlight current time slot
    function highlightCurrentTime() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();

        // Always highlight current time since we're only showing today
        const currentQuarter = Math.floor(currentMinutes / 15);
        const timeSlot = `${currentHour.toString().padStart(2, '0')}:${(currentQuarter * 15).toString().padStart(2, '0')}`;

        const currentSlot = document.querySelector(`[data-time="${timeSlot}"]`);
        if (currentSlot) {
            currentSlot.style.backgroundColor = 'rgba(255, 193, 7, 0.2)';
            currentSlot.style.border = '2px solid #ffc107';
        }
    }

    // Call highlight function
    highlightCurrentTime();

    // Update highlight every minute
    setInterval(highlightCurrentTime, 60000);
});
