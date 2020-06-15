
var StockScreener = {
    selectCriteria: function (chk) {
        var row = $(chk).closest("tr");
        var criteriaValue = $(row).attr("id");
        if (chk.checked) {
            var hdn = document.getElementById(Criteria.hdnCriteria);
            hdn.value += criteriaValue + "|";
        }
        else {
            var hdn = document.getElementById(Criteria.hdnCriteria);
            hdn.value = hdn.value.replace(criteriaValue + "|", "");
        }
    },
    Validate: function (btn) {
        var onclick = $(btn).attr("onclick");
        $(btn).attr("onclick", "return false;");
        $("#divError").hide();
        var errMsg = "", valid = true;
        if (!validateDropdownById(Criteria.ddlSector, 0)) errMsg += "<li>Sector is required</li>";
        if (!validateDropdownById(Criteria.ddlFiscalYear, 0)) errMsg += "<li>Fiscal year is required</li>";
        if (!validateDropdownById(Criteria.ddlQtrFilter, 0)) errMsg += "<li>Quarter No. is required</li>";
        if (!validateStringById(Criteria.hdnCriteria, 0)) errMsg += "<li>Criteria is required</li>";
        
        if (errMsg != "") {
            $(btn).attr("onclick", onclick);
            showValidationError("divError", "Could not search due to following errors:", "<ul>" + errMsg + "</ul");
            valid = false;
        } else {
            showProcessing();
        }
        return valid;
    },
    customValidate: function (btn) {
        var onclick = $(btn).attr("onclick");
        $(btn).attr("onclick", "return false;");
        $("#divError").hide();
        var errMsg = "", valid = true;
        if (!validateDropdownById(Criteria.ddlSector, 0)) errMsg += "<li>Sector is required</li>";
        if (!validateDropdownById(Criteria.ddlFiscalYear, 0)) errMsg += "<li>Fiscal year is required</li>";
        if (!validateDropdownById(Criteria.ddlQtrFilter, 0)) errMsg += "<li>Quarter No. is required</li>";

        if ($("#" + Criteria.ddlCustomRatio).find("option:selected").val() != 1) {
            if (!validateStringById(Criteria.hdnCriteria, 0)) errMsg += "<li>Criteria is required</li>";
        }

        if ($("#" + Criteria.ddlCustomRatio).find("option:selected").val() == 1) {
            if (Tags.getTagCount("customtag") == 0) {
                $("#" + Criteria.hdnCustomTags).val("");
                errMsg += "<li>Custom Criteria is required</li>";

            } else {
                $("#" + Criteria.hdnCustomTags).val(Tags.getTagArrayString("customtag"));
            }

            if (Tags.getTagCount("customtag") != 2) {
                errMsg += "<li>At least select 2 custom criteria only.</li>";
            }
        }


        if (errMsg != "") {
            $(btn).attr("onclick", onclick);
            showValidationError("divError", "Could not search due to following errors:", "<ul>" + errMsg + "</ul");
            valid = false;
        } else {
            showProcessing();
        }
        return valid;
    },
    bindSort: function () {
        $('table.sortable').sorttable({
            widgets: ["zebra"],
            usNumberFormat: true,
            sortIndicator: true,
            sortList: [[0, 0]]
        });
    },
    showCustomCriteria: function () {
        var ddl = $("#" + Criteria.ddlCustomRatio);      
        var value = ddl.find("option:selected").val();        
        if (value == 1) {
            $("#btnCriteria").attr("disabled", true);
            $("#" + Criteria.ddlCustomCriteria).attr("disabled", false);

            if ($("#" +Criteria.divCriteria).is(":visible") == true) {
                $("#" + Criteria.divCriteria).toggle();
            }
              

        } else {
            $("#" + Criteria.ddlCustomCriteria).attr("disabled", true); 
            $("#btnCriteria").attr("disabled", false);
            $("#" + Criteria.hdnCustomTags).val("");
            Tags.clearTagArray(Criteria.divCustomTags, "customtag");
            $("#" + Criteria.divCustomTags).hide();
        }
    },
    addCustomTag: function () {
        $("#" + Criteria.divCustomTags).show();
        var ddl = $("#" + Criteria.ddlCustomCriteria);
        if (ddl.val() == 0) return;      
        Tags.addTag(Criteria.divCustomTags, "customtag", ddl.val(), ddl.find("option:selected").text());
        $("#" + Criteria.ddlCustomCriteria).val(0);
    },    
    updateCustomTags: function() {
        showProcessing();

        var customTags = $("#" + Criteria.hdnCustomTags).val();
        if (customTags != "") Tags.addTagArray(Criteria.divCustomTags, "customtag", $.parseJSON(customTags));
        
        hideProcessing();
    }
};

