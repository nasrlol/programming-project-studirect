<div class="calendar-table">
    <table id="calendar-table">
        <tr><th>Time slots</th><th>00</th><th>15</th><th>30</th><th>45</th></tr>
        <tr><td>09u</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
        <tr><td>10u</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
        <tr><td>11u</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
        <tr><td>12u</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
        <tr><td>13u</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
        <tr><td>14u</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
        <tr><td>15u</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
    </table>
</div>

<script>
    // Populate calendar with appointments
    document.addEventListener('DOMContentLoaded', function() {
        const appointments = @json($appointments ?? []);

        appointments.forEach(appointment => {
            if (appointment.time_slot) {
                const time = appointment.time_slot.split(' - ')[0];
                const rowIndex = getTimeRowIndex(time);
                const colIndex = getMinuteColumnIndex(time);

                setAppointment(rowIndex, colIndex, appointment.student_name || 'Student');
            }
        });
    });

    function getTimeRowIndex(time) {
        const hour = time.split(":")[0];
        const mapping = { "09": 1, "10": 2, "11": 3, "12": 4, "13": 5, "14": 6, "15": 7 };
        return mapping[hour] ?? 1;
    }

    function getMinuteColumnIndex(time) {
        const minute = time.split(":")[1];
        const mapping = { "00": 1, "15": 2, "30": 3, "45": 4 };
        return mapping[minute] ?? 1;
    }

    function setAppointment(rowIndex, colIndex, text) {
        const table = document.getElementById("calendar-table");
        if (!table) return;
        const row = table.rows[rowIndex];
        if (row && row.cells[colIndex]) {
            const current = row.cells[colIndex].innerText.trim();
            if (current === "–" || current === "") {
                row.cells[colIndex].innerText = text;
                row.cells[colIndex].style.backgroundColor = "#4CAF50";
                row.cells[colIndex].style.color = "white";
            }
        }
    }
</script>
