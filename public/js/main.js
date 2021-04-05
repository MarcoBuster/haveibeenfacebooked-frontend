function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function loadPrefixes(htmlEl) {
    fetch("/prefixes.json")
        .then(response => response.json())
        .then(json => {
            let options = "";
            Object.keys(json).forEach((key) => {
                let value = json[key];
                options += `<option value='${key}'>${key} ${value}</option>\n`
            })
            htmlEl.html(options);
        });
}

$(function() {
    const search_button = $("#search_button");
    const search_input = $("#search_input");
    const search_prefix = $('#search_prefix');
    const search_control = $('#search_control');
    loadPrefixes(search_prefix);

    // fair credits
    const credits_span = $('#credits');
    const marco = "<a target='_blank' href=\"https://github.com/MarcoBuster\">Marco Aceti</a>";
    const fumaz = "<a target='_blank' href=\"https://fumaz.dev\">Alessandro Fumagalli</a>";
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
        query = prefix + query
        search_prefix.removeClass("is-danger");
        search_control.addClass("is-loading");
        $.ajax({
            url: "https://api.haveibeenfacebooked.com/search",
            type: "get",
            data: {
                phone_number: query,
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
