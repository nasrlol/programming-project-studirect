<div id="company-info">
    <div>
        <h5>Omschrijving</h5>
        <ul>
            <li>{{ $job_domain ?? 'Geen jobdomein opgegeven.' }}</li>
            <li>{{ $job_type ?? 'Geen functietype opgegeven.' }}</li>
            <li>{{ $job_description ?? 'Geen omschrijving beschikbaar.' }}</li>
        </ul>
    </div>
    <div>
        <h5>Vereisten</h5>
        <ul>
            <li>{{ $job_requirements ?? 'Geen vereisten opgegeven.' }}</li>
        </ul>
    </div>
    <div>
        <h5>Over dit bedrijf</h5>
        <p>{{ $description ?? 'Er is geen informatie beschikbaar over dit bedrijf.' }}</p>
    </div>
</div>
