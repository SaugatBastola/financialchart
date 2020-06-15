var Tags = {
    tagArray: {},
    formatTag: function(divId, objName, tag) {
        var elem = "<div class='alert alert-info alert-dismissable div-tags'>";
        elem += tag.label;
        elem += "  <a href='javascript:void(0);' title='Remove' onclick='Tags.deleteTagById(\"" + divId + "\",\"" + objName + "\",\"" + tag.id + "\");'><strong>×</strong></a>";
        elem += "</div>";
        return elem;
    },
    updateDisplay: function(divId, objName) {
        var container = $("#" + divId);
        container.empty();
        $.each(Tags.tagArray[objName], function() {
            container.append(Tags.formatTag(divId, objName, this));
        });
    },
    checkTagById: function(objName, id) {
        var exists = false;
        $.each(Tags.tagArray[objName], function() {
            if (this.id == id) {
                exists = true;
                return;
            }
        });
        return exists;
    },
    addTag: function(divId, objName, tagId, tagLabel) {
        var json = { "id": tagId, "label": tagLabel };
        if (!Tags.tagArray.hasOwnProperty(objName)) Tags.tagArray[objName] = [];
        if (!Tags.checkTagById(objName, tagId)) Tags.tagArray[objName].push(json);
        Tags.updateDisplay(divId, objName);
    },
    deleteTagById: function(divId, objName, id) {
        $.each(Tags.tagArray[objName], function(i) {
            if (this.id == id) {
                Tags.tagArray[objName].splice(i, 1);
                return;
            }
        });
        Tags.updateDisplay(divId, objName);
    },
    getTagCount: function(objName) {
        if (Tags.tagArray.hasOwnProperty(objName)) return Tags.tagArray[objName].length;
        return 0;
    },
    getTagArray: function(objName) {
        if (Tags.tagArray.hasOwnProperty(objName)) return Tags.tagArray[objName];
        return [];
    },
    getTagArrayString: function(objName) {
        if (Tags.tagArray.hasOwnProperty(objName)) {
            var arr = Tags.tagArray[objName];
            var len = arr.length;
            if (len > 0) {
                var s = "";
                $.each(arr, function(i) {
                    if (i == 0) s += "[";
                    s += "{\"id\":\"" + this.id + "\",\"label\":\"" + this.label + "\"}";
                    if (i == len - 1) s += "]";
                    else s += ",";
                });
                return s;
            }
            return "";
        }
        return "";
    },
    addTagArray: function(divId, objName, tagArray) {
        Tags.clearTagArray(divId, objName);
        var json = {};
        $.each(tagArray, function() {
            json = { "id": this.id, "label": this.label };
            if (!Tags.tagArray.hasOwnProperty(objName)) Tags.tagArray[objName] = [];
            if (!Tags.checkTagById(objName, this.id)) Tags.tagArray[objName].push(json);
        });
        Tags.updateDisplay(divId, objName);
    },
    clearTagArray: function(divId, objName) {
        $("#" + divId).html("");
        Tags.tagArray[objName] = [];
    }
};