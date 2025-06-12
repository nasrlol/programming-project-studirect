<div id="company-info">
    <div>
        <h5>Omschrijving</h5>
        <div>
            {!! $company_description ?? '<p>Geen omschrijving beschikbaar.</p>' !!}
        </div>
    </div>
    <div>
        <h5>Vereisten</h5>
        <div>
            {!! $company_requirements ?? '<p>Geen vereisten opgegeven.</p>' !!}
        </div>
    </div>
    <div>
        <h5>Over dit bedrijf</h5>
        <div>
            {!! $company_about ?? '<p>Er is geen informatie beschikbaar over dit bedrijf.</p>' !!}
        </ul>
    </div>
</div>
