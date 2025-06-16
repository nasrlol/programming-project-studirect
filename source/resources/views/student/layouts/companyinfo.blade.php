<div id="company-info">
    <div>
        <h5>Omschrijving</h5>
        <div>
            {!! $job_domain ?? '<li>Geen jobdomein opgegeven.</li>' !!}
            {!! $job_type ?? '<li>Geen functietype opgegeven.</li>' !!}
            {!! $job_description ?? '<li>Geen omschrijving beschikbaar.</li>' !!}
        </div>
    </div>
    <div>
        <h5>Vereisten</h5>
        <div>
            {!! $job_requirements ?? '<li>Geen vereisten opgegeven.</li>' !!}
        </div>
    </div>
    <div>
        <h5>Over dit bedrijf</h5>
        <div>
            {!! $description ?? '<p>Er is geen informatie beschikbaar over dit bedrijf.</p>' !!}
        </ul>
    </div>
</div>
