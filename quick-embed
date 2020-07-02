/**
 * Create embed on page load
 */
(async function () {

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
    embed.classList.add("is-loading");

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
        embed.classList.remove("is-loading");

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

    // Disable ping if interval is 0
    if (interval === 0 || Number.isInteger(parseInt(interval))) {
        return;
    }

    // Ping Specification to reset timeout
    specification.ping();

    // Schedule next ping
    setTimeout(pingSpecification, interval * 1000, specification);

}

/**
 * Strip trailing slash
 *
 * @param string String to remove trailing slash from
 */
function stripTrailingSlash(string) {
    if (string.substr(-1) === "/") {
        return string.substr(0, string.length - 1);
    }
    return string;
}
