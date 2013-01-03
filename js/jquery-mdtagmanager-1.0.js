
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
        var existingTagWrapper = $this.find(".mdtagmanagerExistingTagWrapper");
        var tagCounterBox = $this.find(".mdtagmanagerTagCounter span");
        
        function init()
        {
            $('<div class="mdtagmanagerWrapper">'+
                '<div class="mdtagmanagerSearch">'+
                    '<div class="mdtagmanagerSearchBar"><input type="text"/></div>'+
                    '<div class="mdtagmanagerSearchBtn"><input type="submit" name="ekle" value="Ekle" class="mdtagmanagerAddBtn" /></div>'+
                    '<div class="mdtagmanagerTagCounter">Hala ekleyebilirsiniz: <span>'+tagCounter+'</span></div>'+
                '</div>'+
                '<div class="mdtagmanagerExistingTagWrapper">'+
                '</div>'+
                '<div class="mdtagmanagerDragInfo">Sıralamak için istediğiniz etiketi sürükleyin.</div>'+
                '<div style="width:300px; float:left; margin-top:20px;">'+
                    '<input type="submit" name="kaydet" value="Kaydet" class="mdtagmanagerSaveBtn" />'+
                    '<input type="reset" name="iptal" value="İptal"  class="mdtagmanagerCancelBtn" />'+
                '</div>'+
            '</div>').appendTo($this);
        
            fillInitTags();
            registerEvents();
        }
                
        function saveChanges() {
            
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
                existingTagWrapper.children(".mdtagmanagerTag").each(function(){
                    tagData.push($(this).data("data"));
                });
            });
            
            // cancel button event registered
            $this.find(".mdtagmanagerCancelBtn").live("click", function(){
                resetTags();
            });
            
            // sorting tag event registered
            if (opts.tagSorting) {
                
                $this.find(".mdtagmanagerTag").live("mousemove", function(){
                    $(".mdtagmanagerExistingTagWrapper").sortable({
                        placeholder: "mdtagmanagerTagPlaceholder",
                        forcePlaceholderSize: true
                    });
                });
            }
            
            // autocomplete event registered
            var searchBox = $this.find(".mdtagmanagerSearchBar input");
            searchBox.autocomplete({
                source: function(request, response) {
                    $.getJSON('server.php', {key: request.term}, response);
                },
                minLength: 2,
                select: function(event, ui) {
                }
            });
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
                        id: id ? id : 0
                    };

                    $('<div class="mdtagmanagerTag" style="display:none;">'+
                        '<span class="mdtagmanagerTagText">'+text+'</span>'+
                        '<span class="mdtagmanagerTagDelete">&nbsp;</span>'+
                      '</div>').appendTo(existingTagWrapper).data("data", metadata).
                      fadeIn(300, function(){
                        opts.addTag();
                        --tagCounter;
                        tagCounterBox.text(tagCounter);
                      });
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
        saveChanges: function(tagData) {
            
        },
        lang: {
            
        }
    };
    
})(jQuery);