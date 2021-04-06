function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function loadPrefixes(htmlEl) {
    const prefixes = {"+1": "USA", "+7": "RUS", "+20": "EGY", "+27": "ZAF", "+30": "GRC", "+31": "NLD", "+32": "BEL", "+33": "FRA", "+34": "ESP", "+36": "HUN", "+39": "ITA", "+40": "ROU", "+41": "CHE", "+43": "AUT", "+44": "GBR", "+45": "DNK", "+46": "SWE", "+47": "NOR", "+48": "POL", "+49": "DEU", "+51": "PER", "+52": "MEX", "+53": "CUB", "+54": "ARG", "+55": "BRA", "+56": "CHL", "+57": "COL", "+58": "VEN", "+60": "MYS", "+61": "AUS", "+62": "IDN", "+63": "PHL", "+64": "NZL", "+65": "SGP", "+66": "THA", "+81": "JPN", "+82": "KOR", "+84": "VNM", "+86": "CHN", "+90": "TUR", "+91": "IND", "+92": "PAK", "+93": "AFG", "+94": "LKA", "+95": "MMR", "+98": "IRN", "+212": "MAR", "+213": "DZA", "+216": "TUN", "+218": "LBY", "+220": "GMB", "+221": "SEN", "+222": "MRT", "+223": "MLI", "+224": "GIN", "+225": "CIV", "+226": "BFA", "+227": "NER", "+228": "TGO", "+229": "BEN", "+230": "MUS", "+231": "LBR", "+232": "SLE", "+233": "GHA", "+234": "NGA", "+235": "TCD", "+236": "CAF", "+237": "CMR", "+238": "CPV", "+239": "STP", "+240": "GNQ", "+241": "GAB", "+243": "COD", "+244": "AGO", "+245": "GNB", "+248": "SYC", "+249": "SDN", "+250": "RWA", "+251": "ETH", "+252": "SOM", "+253": "DJI", "+254": "KEN", "+255": "TZA", "+256": "UGA", "+257": "BDI", "+258": "MOZ", "+260": "ZMB", "+261": "MDG", "+262": "MYT", "+263": "ZWE", "+264": "NAM", "+265": "MWI", "+266": "LSO", "+267": "BWA", "+268": "SWZ", "+269": "COM", "+290": "SHN", "+291": "ERI", "+297": "ABW", "+298": "FRO", "+299": "GRL", "+350": "GIB", "+351": "PRT", "+352": "LUX", "+353": "IRL", "+354": "ISL", "+355": "ALB", "+356": "MLT", "+357": "CYP", "+358": "FIN", "+359": "BGR", "+370": "LTU", "+371": "LVA", "+372": "EST", "+373": "MDA", "+374": "ARM", "+375": "BLR", "+376": "AND", "+377": "MCO", "+378": "SMR", "+380": "UKR", "+381": "SRB", "+382": "MNE", "+385": "HRV", "+386": "SVN", "+387": "BIH", "+389": "MKD", "+420": "CZE", "+421": "SVK", "+423": "LIE", "+500": "FLK", "+501": "BLZ", "+502": "GTM", "+503": "SLV", "+504": "HND", "+505": "NIC", "+506": "CRI", "+507": "PAN", "+508": "SPM", "+509": "HTI", "+590": "BLM", "+591": "BOL", "+592": "GUY", "+593": "ECU", "+595": "PRY", "+597": "SUR", "+598": "URY", "+599": "ANT", "+670": "TLS", "+672": "ATA", "+673": "BRN", "+674": "NRU", "+675": "PNG", "+676": "TON", "+677": "SLB", "+678": "VUT", "+679": "FJI", "+680": "PLW", "+681": "WLF", "+682": "COK", "+683": "NIU", "+685": "WSM", "+686": "KIR", "+687": "NCL", "+688": "TUV", "+689": "PYF", "+690": "TKL", "+691": "FSM", "+692": "MHL", "+850": "PRK", "+852": "HKG", "+853": "MAC", "+855": "KHM", "+856": "LAO", "+870": "PCN", "+880": "BGD", "+886": "TWN", "+960": "MDV", "+961": "LBN", "+962": "JOR", "+963": "SYR", "+964": "IRQ", "+965": "KWT", "+966": "SAU", "+967": "YEM", "+968": "OMN", "+971": "ARE", "+972": "ISR", "+973": "BHR", "+974": "QAT", "+975": "BTN", "+976": "MNG", "+977": "NPL", "+992": "TJK", "+993": "TKM", "+994": "AZE", "+995": "GEO", "+996": "KGZ", "+998": "UZB"};
    let options = "";
    // HACK: Auto-select italian prefix
    const lang = navigator.language || navigator.userLanguage;
    Object.keys(prefixes).forEach((key) => {
        let value = prefixes[key];
        options += `<option value='${key}' ${lang === 'it-IT' && key === '+39' ? 'selected' : ''}>${key} ${value}</option>\n`
    })
    htmlEl.html(options);
}

const PREFIX_REGEXP = /^(?:\+|00)(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)(\d+)$/;
let prefixElement = document.getElementById("search_prefix");
let numberElement = document.getElementById("search_input");

numberElement.addEventListener("paste", (e) => {
    // get data from clipboard
    let data = (e.clipboardData || window.clipboardData)
        .getData("text")
        .replace(/[^0-9+]/g, ""); // clean up input
    const match = data.match(PREFIX_REGEXP);
    if (match) {
        // we got a match, substitute prefix and whole number
        prefixElement.value = "+" + match[1];
        numberElement.value = match[2];
    } else {
        // no match (maybe wrong format?), substitute all
        numberElement.value = data;
    }
    e.preventDefault();
});

$(function() {
    const search_button = $("#search_button");
    const search_input = $("#search_input");
    const search_prefix = $('#search_prefix');
    const search_control = $('#search_control');
    loadPrefixes(search_prefix);

    // fair credits
    const credits_span = $('#credits');
    const marco = "<a target='_blank' href=\"https://github.com/MarcoBuster\">Marco Aceti</a>";
    const fumaz = "<a target='_blank' href=\"https://fumaz.dev\">Fumaz</a>";
    if (Math.round(Math.random()) === 0) {
        credits_span.html(`${marco} and ${fumaz}`)
    } else {
        credits_span.html(`${fumaz} and ${marco}`)
    }

    // on search
    search_button.on("click", (event) => {
        $('.hide').hide();

        let query = search_input.val();
        if (query === "" || query === null) {
            search_input.addClass("is-danger");
            return;
        }
        search_input.removeClass("is-danger")
        let prefix = search_prefix.val();
        if (prefix === "" || prefix === null) {
            search_prefix.addClass("is-danger");
            return;
        }
        search_prefix.removeClass("is-danger");
        search_control.addClass("is-loading");
        query = prefix + query

        let sanitized = "";
        for (let i = 0; i < query.length; i++) {
            if (!/^\d+$/.test(query[i])) {
                continue;
            }
            sanitized += query[i]
        }
        const hasher = forge.md.sha256.create()
        const hashed = hasher.update(sanitized).digest().toHex();

        $.ajax({
            url: "https://api.haveibeenfacebooked.com/search",
            type: "post",
            data: {
                phone_number: hashed,
            },
            success: (resp) => {
                search_control.removeClass("is-loading");
                if (!resp.ok) {
                    $('#error').slideDown().text("ERROR: " + resp.message);
                    return;
                }

                if (!resp.found) {
                    $('#results-section-success').slideDown();
                } else {
                    $('#results-section-danger').slideDown();
                    $("#result_country-name").text(resp.data.country.name);
                    $("#result_country-count").text(numberWithCommas(resp.data.country.count));

                    if (resp.data.first_name !== null)
                        $("#result_first-name").show()
                            .html("First name: <code>" + resp.data.first_name + "</code>");
                    if (resp.data.last_name !== null)
                        $("#result_last-name").show()
                            .html("Last name: <code>" + resp.data.last_name + "</code>");
                    if (resp.data.gender === true)
                        $("#result_gender").show()
                    if (resp.data.relationship_status === true)
                        $("#result_relationship-status").show()
                    if (resp.data.location === true)
                        $("#result_location").show()
                    if (resp.data.work_place === true)
                        $("#result_workplace").show()
                }
            }
        });
    })
});
