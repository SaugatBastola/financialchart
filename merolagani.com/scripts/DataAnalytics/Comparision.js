
var Comparision = {
    addCompany: function() {
        var id = $("#" + Comparision_ClientID.ASCompany).parent().find("input[type='hidden']:eq(0)").val();
        var label = $("#" + Comparision_ClientID.ASCompany).val();
        if (id == 0 || label == "") return;
        Tags.addTag(Comparision_ClientID.divCompanies, "company", id, label);
        $("#" + Comparision_ClientID.ASCompany).val(null);
        $("#" + Comparision_ClientID.ASCompany).focus();
    },
    validateComparision: function(btn) {
        var onclick = $(btn).attr("onclick");
        $(btn).attr("onclick", "return false;");
        $("#divError").hide();
        var errMsg = "", valid = true;

        if (!validateDropdownById(Comparision_ClientID.ddlSector, "0")) errMsg += "<li>Sector is required</li>";
        if (!validateDropdownById(Comparision_ClientID.ddlFiscalYear, "")) errMsg += "<li>Fiscal Year is required</li>";
        if (!validateDropdownById(Comparision_ClientID.ddlQtrFilter, "0")) errMsg += "<li>Quarter No. is required</li>";

        if (Tags.getTagCount("company") == 0) {
            $("#" + Comparision_ClientID.hdnCompanies).val("");
            errMsg += "<li>Company is required</li>";
            highlightError(Comparision_ClientID.ASCompany);
        } else {
            $("#" + Comparision_ClientID.hdnCompanies).val(Tags.getTagArrayString("company"));
            removeHighlight(Comparision_ClientID.ASCompany);
        }

        if (Tags.getTagCount("company") == 1) {
            errMsg += "<li>At least select 2 companies.</li>";
        }

        if (errMsg != "") {
            $(btn).attr("onclick", onclick);
            showValidationError("divError", "", "<ul>" + errMsg + "</ul");
            valid = false;
        } else {
            $("#" + Comparision_ClientID.hdnCompanies).val(Tags.getTagArrayString("company"));
            showProcessing();
        }

        return valid;
    },
    updateTags: function() {
        showProcessing();
        var companies = $("#" + Comparision_ClientID.hdnCompanies).val();
        if (companies != "") Tags.addTagArray(Comparision_ClientID.divCompanies, "company", $.parseJSON(companies));
        hideProcessing();
    },
    getcompanybysector: function (sct) {
        //$("#hdnSector").val(sct);
       // AutoSuggest.getAutoSuggestDataByElement("Company", AutoSuggest);
      //  window.location.reload();
    }
}