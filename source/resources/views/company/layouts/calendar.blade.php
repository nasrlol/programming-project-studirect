
<div class="calendar-container">
    <div class="appointment-list">
        <h3>Afspraken vandaag:</h3>
        <div id="appointmentList">
            <!-- Dynamisch gevuld met JS -->
        </div>
    </div>

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
</div>

<script>
    const loggedInCompanyId = 5;

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
            } else {
                row.cells[colIndex].innerText += "\n" + text;
            }
        }
    }

    fetch("http://10.2.160.208/api/appointments")
        .then(response => response.json())
        .then(async (response) => {
            const allAppointments = response.data;
            const appointments = allAppointments.filter(appt => appt.company_id === loggedInCompanyId);

            const appointmentListDiv = document.getElementById("appointmentList");
            if (appointments.length === 0) {
                appointmentListDiv.innerHTML = "<p>Geen afspraken gevonden voor jouw bedrijf.</p>";
                return;
            }

            for (const appointment of appointments) {
                const time = appointment.time_slot.split(" - ")[0];
                const studentId = appointment.student_id;

                let studentName = `Student ${studentId}`;
                try {
                    const studentRes = await fetch(`http://10.2.160.208/api/students/${studentId}`);
                    const studentJson = await studentRes.json();
                    if (studentJson.data) {
                        const s = studentJson.data;
                        studentName = `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim();
                    }
                } catch (error) {
                    console.warn(`Kon student ${studentId} niet ophalen`);
                }

                const rowIndex = getTimeRowIndex(time);
                const colIndex = getMinuteColumnIndex(time);

                const groupId = `group-${time.replace(":", "")}`;
                let group = document.getElementById(groupId);
                if (!group) {
                    group = document.createElement("div");
                    group.id = groupId;
                    group.innerHTML = `<p><strong>${time}</strong></p><ul data-time="${time}"></ul>`;
                    appointmentListDiv.appendChild(group);
                }

                const ul = group.querySelector("ul");
                const li = document.createElement("li");
                li.textContent = studentName;
                ul.appendChild(li);

                setAppointment(rowIndex, colIndex, studentName);
            }
        })
        .catch(error => {
            console.error("Fout bij ophalen van afspraken:", error);
            document.getElementById("appointmentList").innerHTML += "<p>Kon afspraken niet laden.</p>";
        });
</script>
