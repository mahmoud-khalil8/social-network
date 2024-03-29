$(document).ready(function() {
    $.get("/api/notifications", (data) => {
        outputNotificationsList(data, $(".resultsContainer"));
    });


});
$("#markNotificationsAsOpened").click(() => markNotificationsAsOpened());
