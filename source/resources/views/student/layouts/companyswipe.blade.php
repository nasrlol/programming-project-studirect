<div id="company-screen">
    <div id="company-title">
        <h2>
        {{ $company_name ?? 'Naam Bedrijf' }}
        </h2>
        <p>
        {{ $job_title ?? 'Functietitel' }}
        </p>
    </div>
    <div id="company-logo">
        <img src="{{ $company_logo }}">
    </div>
    <div id="swipe">
        <button id="dislike">✕</button>
        <button id="like">✓</button>
    </div>
</div>
