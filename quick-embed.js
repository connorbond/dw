/**
 * Create embed on page load
 */
(async function () {

    // Inject loading styles
    addHeaderStyle(`
        [data-dw-form] {
            position: relative;
            margin-bottom: 1em;
        }
        [data-dw-form].dw-is-loading {
            min-height: 10em;
            background-color: rgba(0,0,0,.05);
        }
        [data-dw-form].dw-is-loading::before {
            box-sizing: border-box;
            content: "";
            position: absolute;
            display: block;
            font-size: 2em;
            width: 1em;
            height: 1em;
            top: 50%;
            left: 50%;
            margin-top: -0.5em;
            border: 5px solid #ddd;
            border-top: 5px solid #222;
            border-radius: 50%;
            animation: dw-loading-spin 1s linear infinite;
        }
        @keyframes dw-loading-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(359deg); }
        }
    `);

    // Render all embedded forms
    const formEmbeds = document.querySelectorAll("[data-dw-form]");
    formEmbeds.forEach((embed) => {
        renderForm(embed);
    });

})();

/**
 * Render DriveWorks Specification form
 *
 * @param embed The embed element
 */
async function renderForm(embed) {

    // Get config
    const SERVER_URL = stripTrailingSlash(embed.dataset.serverUrl);
    const GROUP_ALIAS = embed.dataset.groupAlias;
    const PROJECT_NAME = embed.dataset.projectName;
    const PING_INTERVAL = embed.dataset.pingInterval;

    // Add loading state
    embed.classList.add("dw-is-loading");

    try {

        // Create DriveWorks API client
        const DW_EMBED_CLIENT = new window.DriveWorksLiveClient(SERVER_URL);

        // Login to Group
        await DW_EMBED_CLIENT.loginGroup(GROUP_ALIAS);

        // Create new Specification
        const specification = await DW_EMBED_CLIENT.createSpecification(GROUP_ALIAS, PROJECT_NAME);

        // Render Specification
        await specification.render(embed);

        // Remove loading style
        embed.classList.remove("dw-is-loading");

        // (Optional) Prevent Specification timeout
        if (PING_INTERVAL) {
            pingSpecification(specification, PING_INTERVAL);
        }

    } catch (error) {
        console.log(error);
    }

}

/**
 * Prevent Specification timeout
 *
 * A Specification will timeout after a configured period of inactivity (see DriveWorksConfigUser.xml).
 * This function prevents a Specification timing out as long as the page is in view.
 *
 * @param specification The Specification object.
 * @param interval The interval at which to ping, in seconds.
 */
function pingSpecification(specification, interval) {

    // Disable ping if interval is not a number
    if (Number.isInteger(parseInt(interval)) === false) {
        console.error("ERROR: Interval is not a valid integer (in whole seconds)");
        return;
    }

    // Disable ping if interval is 0
    if (interval === 0) {
        return;
    }

    // Ping Specification to reset timeout
    specification.ping();

    // Schedule next ping
    setTimeout(function() {
        pingSpecification(specification, interval);
    }, interval * 1000);

}

/**
 * Strip trailing slash
 *
 * @param {string} string String to remove trailing slash from
 */
function stripTrailingSlash(string) {
    if (string.substr(-1) === "/") {
        return string.substr(0, string.length - 1);
    }
    return string;
}

/**
 * Utility function to add CSS in multiple passes.
 * @param {string} styleString
 */
function addHeaderStyle(styleString) {
    const style = document.createElement("style");
    style.textContent = styleString;
    document.head.append(style);
}
