/* ── Version / update check ── */
(function () {
    const CURRENT_SHA = '91c512cfc41e9c0c813dfae8868f39ce751ab70f';
    const REPO        = 'DefinitelyAndrew/designweb';
    const API_URL     = `https://api.github.com/repos/${REPO}/commits/main`;
    const SHORT       = CURRENT_SHA.slice(0, 7);

    // ── Stamp the footer ──
    document.addEventListener('DOMContentLoaded', function () {
        const footer = document.querySelector('footer p');
        if (footer) {
            const sep = document.createTextNode(' · ');
            footer.appendChild(sep);

            const link = document.createElement('a');
            link.href        = `https://github.com/${REPO}/commit/${CURRENT_SHA}`;
            link.target      = '_blank';
            link.rel         = 'noopener noreferrer';
            link.textContent = SHORT;
            link.style.cssText = 'opacity:0.35;font-size:11px;font-family:monospace;text-decoration:none;color:inherit;transition:opacity 0.15s;';
            link.addEventListener('mouseenter', function () { this.style.opacity = '0.8'; });
            link.addEventListener('mouseleave', function () { this.style.opacity = '0.35'; });
            footer.appendChild(link);
        }

        // ── Check for newer commit ──
        fetch(API_URL, { cache: 'no-store' })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                const latestSha = data && data.sha;
                if (latestSha && latestSha !== CURRENT_SHA) {
                    showUpdateBanner();
                }
            })
            .catch(function () { /* silently ignore network errors */ });
    });

    function showUpdateBanner() {
        if (document.getElementById('update-banner')) return;

        const style = document.createElement('style');
        style.textContent = `
            #update-banner {
                position: fixed;
                top: 16px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 16px;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 500;
                font-family: 'Montserrat', sans-serif;
                background: rgba(20, 20, 28, 0.92);
                backdrop-filter: blur(14px);
                -webkit-backdrop-filter: blur(14px);
                border: 1px solid rgba(255,255,255,0.1);
                box-shadow: 0 4px 28px rgba(0,0,0,0.45);
                color: #fff;
                white-space: nowrap;
                animation: bannerIn 0.3s ease;
            }
            @keyframes bannerIn {
                from { opacity:0; transform:translateX(-50%) translateY(-10px); }
                to   { opacity:1; transform:translateX(-50%) translateY(0); }
            }
            #update-refresh-btn {
                background: #fff;
                color: #111;
                border: none;
                border-radius: 7px;
                padding: 4px 13px;
                font-size: 12px;
                font-weight: 700;
                font-family: inherit;
                cursor: pointer;
                transition: opacity 0.15s;
            }
            #update-refresh-btn:hover { opacity: 0.82; }
            #update-dismiss-btn {
                background: none;
                border: none;
                color: inherit;
                opacity: 0.4;
                cursor: pointer;
                font-size: 15px;
                line-height: 1;
                padding: 0 2px;
                transition: opacity 0.15s;
            }
            #update-dismiss-btn:hover { opacity: 0.9; }
        `;
        document.head.appendChild(style);

        const banner = document.createElement('div');
        banner.id = 'update-banner';
        banner.setAttribute('role', 'alert');
        banner.innerHTML = `
            <span>A newer version is available.</span>
            <button id="update-refresh-btn">Refresh</button>
            <button id="update-dismiss-btn" aria-label="Dismiss">✕</button>
        `;
        document.body.appendChild(banner);

        document.getElementById('update-refresh-btn').addEventListener('click', function () {
            window.location.reload(true);
        });
        document.getElementById('update-dismiss-btn').addEventListener('click', function () {
            banner.style.transition = 'opacity 0.2s, transform 0.2s';
            banner.style.opacity    = '0';
            banner.style.transform  = 'translateX(-50%) translateY(-8px)';
            setTimeout(function () { banner.remove(); }, 220);
        });
    }
})();
