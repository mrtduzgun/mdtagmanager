
/**
 *  ---
 *
 *  @filename       jquery-mdtagmanager-1.0.js
 *  @date           02.01.12
 *  @author         Murat Duzgun
 *  @see            https://github.com/mrtduzgun/jquery-mdtagmanager
*/

(function($){
    
    $.fn.mdtagmanager = function(options) {
        
        if (/1\.(0|1|2|3)\.(0|1|2)/.test($.fn.jquery)) {
            alert("It needs JQuery 1.3.2 version at least!");
            return false;
        }
        
        var $this = $(this);
        var opts = $.extend($.fn.mdtagmanager.defaults, options);
        var tagCounter = opts.numberOfTag;
        var lastOrderNum = 1;
        
        init();
        var existingTagWrapper = $this.find(".mdtagmanagerTagWrapper");
        var tagCounterBox = $this.find(".mdtagmanagerTagCounter span");
        
        function init()
        {
            $('<div class="mdtagmanagerWrapper">'+
                '<div class="mdtagmanagerSearch">'+
                    '<div class="mdtagmanagerSearchBar">'+
                        '<input type="text" name="search" maxlength="'+opts.maxTagLength+'"/>'+
                    '</div>'+
                    '<div class="mdtagmanagerSearchBtn">'+
                        '<input type="submit" name="add" value="'+opts.lang.addButtonLabel+'" class="mdtagmanagerAddBtn fmButton fmRound" />'+
                    '</div>'+
                    '<div class="mdtagmanagerTagCounter">'+opts.lang.tagCounterDesc+'&nbsp;<span>'+tagCounter+'</span></div>'+
                '</div>'+
                '<div class="mdtagmanagerTagWrapper"></div>'+
                '<div class="mdtagmanagerDragInfo">'+opts.lang.dragTagDesc+'</div>'+
                '<div class="mdtagmanagerTagBox">'+
                    '<input type="submit" name="kaydet" value="'+opts.lang.saveButtonLabel+'" class="mdtagmanagerSaveBtn fmButton fmRound" />'+
                    '<input type="reset" name="iptal" value="'+opts.lang.cancelButtonLabel+'"  class="mdtagmanagerCancelBtn fmButton fmRound" />'+
                '</div>'+
            '</div>').appendTo($this);
        
            fillInitTags();
            registerEvents();
        }
        
        function registerEvents()
        {
            // add tag button event registered
            $this.find(".mdtagmanagerAddBtn").live('click', function(){
                addTag(0, $this.find(".mdtagmanagerSearchBar input").val());
            });
            
            // add tag button event registered
            $this.find(".mdtagmanagerTagDelete").live("click", function(){
                deleteTag($(this).parent());
            });
            
            // add tag button event registered
            $this.find(".mdtagmanagerSaveBtn").live("click", function(){
                var tagData = [];
                existingTagWrapper.children(".mdtagmanagerTag").each(function(i){
                    var data = $(this).data("data");
                    data.order = i+1;
                    tagData.push(data);
                });
                
                opts.saveTags(tagData);
            });
            
            // cancel button event registered
            $this.find(".mdtagmanagerCancelBtn").live("click", function(){
                resetTags();
            });
            
            // sorting tag event registered
            if (opts.tagSorting) {
                
                $this.find(".mdtagmanagerTag").live("mousemove", function(){
                    $(".mdtagmanagerTagWrapper").sortable({
                        placeholder: "mdtagmanagerTagPlaceholder",
                        forcePlaceholderSize: true
                    });
                });
            }
            
            // autocomplete event registered
            
            var autocompleteMenu = function (ul, item) {
                ul.removeClass("ui-corner-all");
                return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<a>" + item.label + "</a>")
                    .appendTo(ul);
            };
            
            var searchBox = $this.find(".mdtagmanagerSearchBar input");
            searchBox.autocomplete({
                source: function(request, response) {
                    $.getJSON('server.php', {key: request.term}, response);
                },
                minLength: 2,
                select: function(event, ui) {
                },
                search: function(event, ui){
                    searchBox.addClass("mdtagmanagerSearchSpinner");
                },
                response: function(event, ui){
                    searchBox.removeClass("mdtagmanagerSearchSpinner");
                }
            }).data("autocomplete")._renderItem = autocompleteMenu;
        }
        
        function getTagDatas() {
            var tagData = [];
            existingTagWrapper.children(".mdtagmanagerTag").each(function(i){
                var data = $this.data("data");
                data.order = i+1;
                tagData.push(data);
            });
            
            return tagData;
        }
        
        function deleteTag(deletedObj) {
            deletedObj.fadeOut(300, function(){
                deletedObj.remove();
                ++tagCounter;
                tagCounterBox.text(tagCounter);
                if (tagCounter > 0)
                    tagCounterBox.removeClass("tagZero");
            });
        }
        
        function addTag(id, text)
        {
            text = $.trim(text);
            
            if (text != "")
            {
                if (tagCounter > 0)
                {
                    var metadata = {
                        order: lastOrderNum + 1,
                        id: id ? id : 0,
                        label: text
                    };

                    $('<div class="mdtagmanagerTag" style="display:none;">'+
                        '<span class="mdtagmanagerTagText">'+text+'</span>'+
                        '<span class="mdtagmanagerTagDelete">&nbsp;</span>'+
                      '</div>').appendTo(existingTagWrapper).data("data", metadata).
                      fadeIn(300, function(){
                        opts.addTag();
                      });
                      
                    --tagCounter;
                    tagCounterBox.text(tagCounter);
                }
                else
                    tagCounterBox.addClass("tagZero").fadeOut(300).fadeIn(300);
            }
        }
        
        function fillInitTags() {
            for (var tag in opts.initTags) {
                addTag(tag.tag_id, tag.tag_text);
            }
        }
        
        function resetTags() {
        }
        
        return true;
    }
    
    $.fn.mdtagmanager.defaults = {
        maxTagLength: 20,
        numberOfTag: 10,
        numberOfDisplayedExistingTags: 5,
        tagSorting: true,
        initTags: [],
        addTag: function() {
            
        },
        deleteTag: function() {
            
        },
        saveTags: function(tagData) {
            
        },
        lang: {
            tagCounterDesc: 'Number of tags remain',
            saveButtonLabel: 'Save',
            addButtonLabel: 'Add',
            cancelButtonLabel: 'Cancel',
            dragTagDesc: 'Please drag tags to order..'
        }
    };
    
})(jQuery);