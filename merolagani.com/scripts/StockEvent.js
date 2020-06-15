var firstDay, totalNoofDays = parseFloat(0), stockData, i, y, m, selectedMonthName, selectedYear, firstOfMonth, lastOfMonth;
var startIndex = 0, endIndex = 6, flag = 0, status = 0;
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


(function($) {
    $("#eventPopup").draggable();
    var date = new Date();
    eventsDate(date);

})(jQuery);

var StockEvent = {
    LoadByNxt: function() {
        var current = new Date(y, m + 1, 1);
        eventsDate(current);
    },
    LoadByPrev: function() {
        var current = new Date(y, m - 1, 1);
        eventsDate(current);
    },
    BindStockEvent: function(data) {

        var stockTable = $("#tbl-event-calendar");
        stockTable.html("");

        $("#SpanStockEvent").html(selectedMonthName + " " + selectedYear);
        var html = "";

        startIndex = firstDay;

        stockTable.append(
            "<thead>" +
            "<tr>" +
            "<th scope=\"col\" title=\"Sunday\">S</th>" +
            "<th scope=\"col\" title=\"Monday\">M</th>" +
            "<th scope=\"col\" title=\"Tuesday\">T</th>" +
            "<th scope=\"col\" title=\"Wednesday\">W</th>" +
            "<th scope=\"col\" title=\"Thursday\">T</th>" +
            "<th scope=\"col\" title=\"Friday\">F</th>" +
            "<th scope=\"col\" title=\"Saturday\">S</th>" +
            "</tr></thead>");

        html += "<tbody>";

        for (i = 1; i <= totalNoofDays; i++) {
            if (i == 1) {
                if (firstDay != 0) {
                    html += "<tr>" + "<td colspan=\"" + firstDay + "\">&nbsp;</td>";
                } else {
                    html += "<tr>";
                }

            }

            html += "<td>";
            status = 0;
            $.each(data.detail, function() {
                if (i == this.day) {
                    if (flag == 0) {
                        html += "<a class=\"eventsCalendar-day  dayWithEvents\" class=\"stock_event_tooltip\" href=\"javascript:void(0);\"";
                        status = 1;
                    }
                    flag = 1;

                } else {
                    flag = 0;
                }
            });
            if (flag == 0 && status == 0) {
                html += i + "</td>";
            }
            if (status == 1) {
                html += ">" + i + "</a>";
                html += "</td>";
            }

            if (startIndex == endIndex) {
                startIndex = 0;
                html += "</tr><tr>";
            } else {
                startIndex++;
            }
        }

        html += "</tr></tbody>";
        stockTable.append(html);
    },
    todayEvents: function() {
        $.ajax({
            url: "/handlers/webrequesthandler.ashx?type=today_event",
            type: "GET",
            dataType: "json",
            success: function(data) {
                if (data != "" && data.mt == "ok") {
                    var html = "";
                    var owl = $(".owl-carousel");

                    if (data.detail.length > 0) {
                        $.each(data.detail, function() {
                            html += "<div>" + this.announcementDetail.replace(/["']/g, "") + "</div>";
                        });
                        owl.append(html);
                        owl.owlCarousel({
                            items: 1,
                            loop: true,
                            autoplay: true,
                            nav: true,
                            smartSpeed: 900,
                            margin: 30,
                            navText: ["<a href=\"javascript:void(0);\" class=\"glyphicon glyphicon-chevron-left\" title=\"prev\"></a>", "<a href=\"javascript:void(0);\" class=\"glyphicon glyphicon-chevron-right\" title=\"next\"></a>"]
                        });
                        $(".owl-prev").click(function() {
                            owl.trigger("prev.owl.carousel");
                        });

                        $(".owl-next").click(function() {
                            owl.trigger("next.owl.carousel");
                        });

                    } else {
                        html += "<div><center>No Event</center></div>";
                        owl.append(html);
                        owl.owlCarousel({
                            items: 1,
                            loop: false,
                            autoplay: false
                        });
                    }
                }
            },
            error: function(xhr, s, e) {
                console.log(e);
            }

        });
    },
    BindStars: function () {
        $("[data-live='stock-stars']").each(function () {
            var id = $(this).data("id");
            var val = parseFloat($(this).val());
            var size = Math.max(0, (Math.min(5, val))) * 16;
            var $span = $("<span />").width(size);
            $(".stars" + id).html($span);
            $("span.stars" + id + ",span.stars" + id + " span").css({ "display": "block", "width": "80px", "background": "url(/Content/images/stars.png) 0 -16px repeat-x", "height": "16px" });
            var newvalue = "0px 0px";
            $("span.stars" + id + " span").css({ "background-position": newvalue, "width": size });
        });
    }

};

$("[data-live='stock-stars']").each(function() {
    var id = $(this).data("id");
    var val = parseFloat($(this).val());
    var size = Math.max(0, (Math.min(5, val))) * 16;
    var $span = $("<span />").width(size);
    $(".stars" + id).html($span);
    $("span.stars" + id + ",span.stars" + id + " span").css({ "display": "block", "width": "80px", "background": "url(/Content/images/stars.png) 0 -16px repeat-x", "height": "16px" });
    var newvalue = "0px 0px";
    $("span.stars" + id + " span").css({ "background-position": newvalue, "width": size });
});

$(document).on("click", ".eventsCalendar-day", function(e) {
    e.preventDefault();
    var selectDate = $(this).text();
    GetStockEventByDate(m + 1 + "/" + selectDate + "/" + y);
});

$("#spnClosepopup").click(function() {
    $("#eventPopup").hide();
});

function GetStockEvent(firstOfMonth, lastOfMonth) {
    $.ajax({
        url: "/handlers/webrequesthandler.ashx?type=stock_event",
        type: "GET",
        beforeSend: function() {
            //   $('#divLoader').show();
        },
        onComplete: function() {
            $("#divLoader").hide();
        },
        data: {
            fromDate: firstOfMonth,
            toDate: lastOfMonth
        },
        dataType: "json",
        success: function(data) {
            if (data != "" && data.mt == "ok") {
                StockEvent.BindStockEvent(data);
            }
        },
        error: function(xhr, s, e) {
            console.log(e);
        }

    });
}

function GetStockEventByDate(selectedDate) {
    $("#ulStock").empty();
    $("#eventPopup").show();
    $.ajax({
        url: "/handlers/webrequesthandler.ashx?type=stock_event",
        type: "GET",
        beforeSend: function() {
            $("#divLoader").show();
        },
        data: {
            fromDate: selectedDate,
            toDate: selectedDate
        },
        dataType: "json",
        success: function(data) {

            if (data != "" && data.mt == "ok") {
                var ulStock = $("#ulStock");
                var html1 = "";

                $.each(data.detail, function() {

                    html1 += "<li id=\"\" class=\"eventList>";
                    html1 += "<span class=\"date\">" + this.actionDate + "</span>";
                    html1 += "<p class=\"eventTitle\"><i>" + this.announcementDetail.replace(/["']/g, "") + "</i></p>";
                    html1 += "</li>";

                });
                $("#divLoader").hide();
                ulStock.append(html1);

            }
        },
        error: function(xhr, s, e) {
            console.log(e);
        }
    });

}

function eventsDate(date) {
    selectedMonthName = months[date.getMonth()];

    selectedYear = date.getFullYear();
    y = selectedYear, m = date.getMonth();

    firstDay = firstDaysInMonth(m, y).getDay();

    totalNoofDays = toalDaysInMonth(m, y);

    var month = m + 1;

    var firstDate = new Date(y, m, 1).getDate();

    var lastDate = new Date(y, m + 1, 0).getDate();

    firstOfMonth = month + "/" + firstDate + "/" + selectedYear;
    lastOfMonth = month + "/" + lastDate + "/" + selectedYear;

    GetStockEvent(firstOfMonth, lastOfMonth);
}

function firstDaysInMonth(month, year) {
    return new Date(year, month, 1);
}

function toalDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}