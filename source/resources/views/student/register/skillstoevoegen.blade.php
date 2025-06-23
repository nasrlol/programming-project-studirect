
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Skills toevoegen - Studirect</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <style>
        body {
            background-color: #f4f5f7;
            font-family: 'Segoe UI', sans-serif;
            padding: 2rem;
            margin: 0;
        }

        .container {
            max-width: 550px;
            margin: 0 auto;
            background-color: #fff;
            padding: 2rem 2.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        h2 {
            text-align: center;
            margin-bottom: 1.5rem;
            color: #172b4d;
        }

        p {
            text-align: center;
            margin-bottom: 1.5rem;
            color: #6b778c;
        }

        .skills-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .skill-input {
            display: flex;
            gap: 0.5rem;
            align-items: center;
        }

        .skill-input select {
            flex-grow: 1;
            padding: 0.7rem;
            border: 1px solid #dfe1e6;
            border-radius: 8px;
            background-color: #f9fafc;
            font-size: 1rem;
        }

        .skill-input button {
            padding: 0.7rem 1rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 1rem;
        }

        .add-btn {
            background-color: #0052cc;
            color: white;
        }

        .skill-list {
            margin-top: 1.5rem;
            padding: 1rem;
            background-color: #f9fafc;
            border-radius: 8px;
            min-height: 100px;
        }

        .skill-list p {
            text-align: center;
            color: #97a0af;
            margin: 1rem 0;
        }

        .skill-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0.75rem;
            background-color: #ebf0ff;
            border-radius: 4px;
            margin-bottom: 0.5rem;
        }

        .skill-item .remove {
            background-color: transparent;
            color: #ff5630;
            font-weight: bold;
            border: none;
            cursor: pointer;
            padding: 0.25rem 0.5rem;
        }

        .submit-btn {
            margin-top: 2rem;
            width: 100%;
            padding: 0.8rem;
            background-color: #0052cc;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
            font-size: 1rem;
        }

        .submit-btn:hover {
            background-color: #0747a6;
        }

        .alert {
            background-color: #ffebe6;
            color: #bf2600;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            font-size: 0.9rem;
            margin-top: 1rem;
        }

        .hidden-skills {
            display: none;
        }
    </style>
</head>
<body>

<div class="container">
    <h2>Voeg je skills toe</h2>
    <p>Selecteer skills om je profiel te verbeteren en beter in contact te komen met bedrijven</p>

    @if ($errors->any())
        <div class="alert">
            <ul style="margin: 0; padding-left: 1rem;">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="skills-container">
        <div class="skill-input">
            <select id="skill-select">
                <option value="" disabled selected>Selecteer een skill</option>
                @foreach ($availableSkills as $skill)
                    <option value="{{ $skill['id'] }}">{{ $skill['name'] }}</option>
                @endforeach
            </select>
            <button type="button" class="add-btn" id="add-skill">+</button>
        </div>
        
        <div class="skill-list" id="skill-list">
            <p id="no-skills-message">Geen skills geselecteerd</p>
            <!-- Selected skills will appear here -->
        </div>
    </div>

    <form id="skills-form" method="POST" action="{{ route('student.skills.save', ['id' => $student['id']]) }}">
        @csrf
        <!-- Hidden inputs for skills will be dynamically added here -->
        <div id="hidden-skills-container" class="hidden-skills"></div>
        
        <button type="submit" class="submit-btn">Skills opslaan</button>
    </form>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const skillSelect = document.getElementById('skill-select');
        const addSkillBtn = document.getElementById('add-skill');
        const skillList = document.getElementById('skill-list');
        const hiddenSkillsContainer = document.getElementById('hidden-skills-container');
        const noSkillsMessage = document.getElementById('no-skills-message');
        const selectedSkills = new Map(); // id -> name mapping
        
        // Add event listener to add button
        addSkillBtn.addEventListener('click', function() {
            const skillId = skillSelect.value;
            
            if (!skillId) {
                alert('Selecteer eerst een skill');
                return;
            }
            
            if (selectedSkills.has(parseInt(skillId))) {
                alert('Deze skill heb je al toegevoegd');
                return;
            }
            
            // Add skill to the map and update display
            const skillName = skillSelect.options[skillSelect.selectedIndex].text;
            selectedSkills.set(parseInt(skillId), skillName);
            updateSkillsList();
            
            // Reset select
            skillSelect.value = "";
        });
        
        // Initialize with any current skills if available
        @if(isset($currentSkills) && is_array($currentSkills))
            @foreach($currentSkills as $skill)
                @if(isset($skill['id']) && isset($skill['name']))
                    selectedSkills.set({{ $skill['id'] }}, "{{ $skill['name'] }}");
                @endif
            @endforeach
            if(selectedSkills.size > 0) {
                updateSkillsList();
            }
        @endif
        
        // Update the visual list and hidden inputs
        function updateSkillsList() {
            // Clear lists
            skillList.innerHTML = '';
            hiddenSkillsContainer.innerHTML = '';
            
            if (selectedSkills.size === 0) {
                skillList.appendChild(noSkillsMessage);
                return;
            }
            
            // Add each skill to the visible list and hidden inputs
            selectedSkills.forEach((name, id) => {
                // Create visible item
                const skillItem = document.createElement('div');
                skillItem.className = 'skill-item';
                skillItem.innerHTML = `
                    <span>${name}</span>
                    <button type="button" class="remove" data-id="${id}">×</button>
                `;
                skillList.appendChild(skillItem);
                
                // Create hidden input for the form
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'skill_ids[]'; // Direct array of skill IDs for the API
                hiddenInput.value = id;
                hiddenSkillsContainer.appendChild(hiddenInput);
            });
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove').forEach(button => {
                button.addEventListener('click', function() {
                    const skillId = parseInt(this.getAttribute('data-id'));
                    selectedSkills.delete(skillId);
                    updateSkillsList();
                });
            });
        }
    });
</script>

</body>
</html>