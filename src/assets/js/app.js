import $ from 'jquery';
import Cookies from 'js-cookie';
import whatInput from 'what-input';
import Master from './lib/master';

window.$ = $;
window.Cookies = Cookies;


import Foundation from 'foundation-sites';
// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';

$(document).foundation();

var appCookie, igwasCookie;
window.WebPartVal='';
//document ready
$(function(){

  window.Master = new Master();
  //get page name
  //pageName = getPageName();

  igwasCookie = Cookies.getJSON('IGWAS');
  if (igwasCookie){
    WebPartVal = getCookie(igwasCookie, 'WebPartKey');
  }else{
    WebPartVal = '021cb7cca70748ff89795e3ad544d5eb';
  }

  //set login cookie
  if (typeof Cookies.getJSON('appCookie') === 'undefined') {
    appCookie = Cookies.set('appCookie', {
    },
    { expires: 1 });
  }
  else {
    appCookie = Cookies.getJSON('appCookie');
  }

  //set normal hyperlink to open new window if its external domain
  //set data-redirect to false if don't want the function below to trigger
  //remove this function if its too troublesome or slows performance...
  $('a').filter(function() {
    if ($(this).parents('.module').length) {
      return false;
    }
    if (typeof $(this).data('redirect') !== 'undefined' && !$(this).data('redirect')) {
      return false;
    };
    if (typeof $(this).parents('ul').data('redirect') !== 'undefined' && !$(this).parents('ul').data('redirect')) {
      return false;
    }
    return true;
  }).click(function() {
    var href = $(this).attr('href');
    var redirect = true;

    var host = window.host;
    if( location.hostname === this.hostname || !this.hostname.length ) {
        window.location.href = href;
    }
    else {
      window.open(href,'','');
    }
    return false;
  });

  if (!appCookie.username && pageName.toLowerCase() != 'login') {
    var pageURL = window.location.href;
    if (typeof Cookies.getJSON('appCookie') !== 'undefined') {
      appCookie = Cookies.getJSON('appCookie');
    }
    appCookie.redirectPage = (pageURL != '') ? pageURL : appRootPath+'index.html';
    Cookies.set('appCookie', appCookie);
    var LoginID=GetQueryString('Login');

    if(!LoginID){
      window.location.href = appRootPath +'login.html';
    }
  }

  if(appCookie.loginID){
    GetBasicInformation(appCookie.personID);
  }

  var checkRoleAccess =
    $.ajax({
      url: apiSrc+"BCMain/iCtc1.CheckRoleAccess.json",
      method: "POST",
      dataType: "json",
      xhrFields: {withCredentials: true},
      data: { 'data':JSON.stringify({}),
              'WebPartKey':WebPartVal,
              'ReqGUID': getGUID() },
      success: function(data){
        if ((data) && (data.d.RetVal === -1)) {
          if (data.d.RetData.Tbl.Rows.length > 0) {
            var RoleName = data.d.RetData.Tbl.Rows[0].RoleName;
            if (RoleName=='Clients'){
              $('#caseFilter .orgCell, #mainMenu .packageMenu').hide();
            }else{
              $('#caseFilter .orgCell').show();
            }
          }
        }
      }
    });

  $('#mainMenuLeft #logOut, #logOut').click(function() {
    $.ajax({
      url: apiSrc+"Sec1.Logout.json",
      method: "POST",
      dataType: "json",
      xhrFields: { withCredentials: true },
      data: {
        'data': {},
        'WebPartKey': WebPartVal,
        'ReqGUID': getGUID()
      }
    })
    .done(function(data) {
      console.log( "Logout success" );
      if (typeof Cookies.getJSON('appCookie') !== 'undefined')
        Cookies.remove('appCookie');
      if (pageName != 'login') window.location.href = appRootPath + 'login.html';
    })
    .fail(function( jqXHR, textStatus ) {
      console.log( "Logout fail" );
      console.log(jqXHR);
      console.log( "Request failed: " + textStatus );
    });

    return false;
  });//logout

  //menu
  $('#navMainMenu').click(function() {
    console.log('mainMenuToggle click');
    mainMenuToggle();
    return false;
  });
  $('#mainMenuContainer .close-button').click(function() {
    console.log('mainMenuToggle click');
    mainMenuToggle();
    return false;
  });

  $('.tabBoxButtonClose,.tabBoxButtonSubmit, .tabBoxContent .close-button').click(function(){
    var targetRef = $(this).parents('.tabBoxContent');
    $(targetRef).hide();
    var targetRefId = targetRef.prop('id');

    $('.tabBoxButton').filter(
        function() {
          return $(this).data('target')==targetRefId;
        }).removeClass('tabBoxButtonOpen');
    return false;
  });
  $('.tabBoxButton').click(function(){
    var targetRef = $(this).data('target');
    if (  $('#'+targetRef).is(':visible')){
      $('#'+targetRef).hide();
      $(this).removeClass('tabBoxButtonOpen');
    }else{
      $('#'+targetRef).show();
      $(this).addClass('tabBoxButtonOpen');
    }
    return false;
  });

  //modal customise, to position modal freely
  $('.modalButton').click(function(){
    var targetRef = $(this).data('target');
    console.log(targetRef);
    if (  $('#'+targetRef).is(':visible')){
      $('#'+targetRef).hide();
      $(this).removeClass('modalButtonOpen');
    }else{
      $('#'+targetRef).show();
      $(this).addClass('modalButtonOpen');
    }
    return false;
  });
  $('.modalContent .close-button').click(function(){
    var targetRef = $(this).parents('.modalContent');
    $(targetRef).hide();
    var targetRefId = targetRef.prop('id');

    $('.modalButton').filter(
        function() {
          return $(this).data('target')==targetRefId;
        }).removeClass('modalButtonOpen');
    return false;
  });

  $('.items').on('click', '.add', function () {
      var imageId = $(this).data("id");
      list.add(JSON.stringify(imageId));
      var exists = list.exists(JSON.stringify(imageId))
  });

  //toggleTitle
  var toggleTitleButton = $('<button class="toggleTitleButton"></button>');
  $('.toggleTitle').append(toggleTitleButton);
  $('.toggleTitle').find('.toggleTitleButton').click(function() {
    var toggleObj = $(this);
    var toggleBox = toggleObj.parents('.toggleBox');
    var toggleContent = toggleBox.find('.toggleContent');
    if (toggleObj.hasClass('toggleOpen')) {
      toggleObj.removeClass('toggleOpen');
      toggleContent.slideDown();
    }
    else {
      toggleObj.addClass('toggleOpen');
      toggleContent.slideUp();
    }
  });

  //editLinkForm
  $('.editLinkForm').each(function() {
    var $this = $(this);
    var target = $this.data('content');
    var content = $('#'+target+'Content');
    var form = $('#'+target+'Form');
    var defaultText = (typeof $this.data('text') !== 'undefined' && $this.data('text').length) ? '['+$this.data('text')+']' : '[edit]' ;

    $this.html(defaultText);
    content.show();
    form.hide();

    $this.click(function() {
      var $this = $(this);
      var target = $this.data('content');
      var content = $('#'+target+'Content');
      var form = $('#'+target+'Form');

      if(form.is(':visible')) {
        $this.html(defaultText);
        content.show();
        form.hide();
        $('html, body').animate({
          scrollTop: content.offset().top
        }, 500);
      }
      else {
        $this.html('[cancel]');
        content.hide();
        form.show();
        $('html, body').animate({
          scrollTop: form.offset().top
        }, 500);
      }
    });
  });//editLinkForm
  //search
  //init search form and subLinksDropDown for mobile
  $( window ).resize(function() {
    resizeScreenSetup();
  });
  resizeScreenSetup();
  initSubLinks();
  //convertSubLinks(true);

  $('#navSearch').click(() => {
    $('#searchForm').slideToggle('start', function() {
      if ($('#searchForm').is(':visible')) {
        $('#mainContent').animate({
          paddingTop: '90px'
        });
      }
      else {
        $('#mainContent').animate({
          paddingTop: '1rem'
        });
      }
    });
    return false;
  });

  $('#searchBtn').click(() => {
    $('#searchForm').submit();
    return false;
  });

  formOthersInit();
  formSectionsInit();
  //loadMenu();

});//onready

function GetBasicInformation(personID) {
  var data = {'PersonID': personID};
  $.ajax({
    url: apiSrc+"BCMain/iCtc1.GetPersonalInfo.json",
    method: "POST",
    dataType: "json",
    xhrFields: {withCredentials: true},
    data: {
      'data': JSON.stringify(data),
      'WebPartKey': WebPartVal,
      'ReqGUID': getGUID()
    },
    success: function(data){
      if ((data) && (data.d.RetData.Tbl.Rows.length > 0)) {
        $('.profileName').html(data.d.RetData.Tbl.Rows[0].DisplayName);
      }
    },
    error: function(data){
      alert("Error: " + data.responseJSON.d.RetMsg);
      Cookies.remove('appCookie');
      document.location.reload();
    }
  })
}

function getCookie(cookie, cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(cookie);
    var ca = decodedCookie.split('&');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getGUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
};

function resizeScreenSetup() {
  console.log('resizeScreen');
  if (Foundation.MediaQuery.is('small only')) {
    $('#searchForm').show();
    //change sub links to dropdown list
    setupSubLinks(true);

  }
  else {
    $('#searchForm').hide();
    //change sub links to ul list
    setupSubLinks(false);
    //initSubLinksDropDown();
  }

}
var menu = [];
function loadMenu() {
  var data = {};
  $.ajax({
    url: apiSrc+"BCMain/Sec1.Menu.json",
    method: "POST",
    dataType: "json",
    xhrFields: {withCredentials: true},
    data: {
      'data': JSON.stringify(data),
      'WebPartKey':WebPartVal,
      'ReqGUID': getGUID()
    },
    success: function(data){
      if ((data) && (data.d.RetData.Tbl.Rows.length > 0)) {
        var menus = data.d.RetData.Tbl.Rows;
        //var moduleRegex = /(.+)\\/;
        var moduleItemRegex = /\\(.+)/;
        var mainMenuContainer = $('#mainMenu');
        mainMenuContainer.html('');
        var module;
        var moduleMenu;
        var moduleName;
        var moduleNameOriginal;

        module = $('<ul class="module"></ul>');
        mainMenuContainer.append(module);
        for (var i =0; i < menus.length; i++) {
          var menuObj = menus[i];

          //main menu module
          if (menuObj.MenuName.indexOf("\\") <= -1 && menu.indexOf(menuObj.MenuName) <= -1 && menuObj.MenuType.toLowerCase() == 'text') {
            moduleNameOriginal = menuObj.MenuName;
              menu.push(moduleNameOriginal);
              moduleName = moduleNameOriginal.replace(/[^A-Za-z0-9]/g,'');

              moduleMenu = $('<ul id="moduleMenu-'+ moduleName +'" class="moduleMenu"><li><a href="'+menuObj.RelativeURL+'" target="'+menuObj.TargetFrame+'" data-sort-key="'+menuObj.SortKey+'" >'+moduleNameOriginal+'</a></li></ul>');
              console.log('menuObj.RelativeURL:' + menuObj.RelativeURL);
              var moduleItem = $('<li><a href="/'+menuObj.RelativeURL+'/" data-menu="'+moduleName+'" data-sort-key="'+menuObj.SortKey+'" >'+moduleNameOriginal+'</a></li>');
              module.append(moduleItem);
              mainMenuContainer.append(moduleMenu);
          }
          else {
            moduleMenu = $('#moduleMenu-'+moduleName);
          }

          var moduleItemName = menuObj.MenuName.match(moduleItemRegex);
          if (moduleItemName != null) {
            //console.log(moduleItemName[1]);
            //console.log(apiSrc.substr(0,apiSrc.length-1));

            var moduleMenuItem = $('<li><a href="'+ (( /\/$/.test(apiSrc) ) ? apiSrc.substr(0,apiSrc.length-1) : apiSrc ) + menuObj.RelativeURL +'" target="'+menuObj.TargetFrame+'" data-sort-key="'+menuObj.SortKey+'" >'+moduleItemName[1]+'</a></li>');
            //console.log(moduleMenu);
            moduleMenu.append(moduleMenuItem);
          }
        }
        //console.log(menu);
        //console.log($('#mainMenu .module a').length);
        $('#mainMenu .module a').click(function() {
          var targetId = $(this).data('menu');
          var targetObj = $('#moduleMenu-'+targetId);
          //console.log(targetObj.length);
          if (Foundation.MediaQuery.current == 'small')
          {
            if (targetObj.find('li').length > 1) {
              $('.module').hide();
              $('.moduleMenu').hide();
              targetObj.show();
            }
            else {
              console.log('aaa');
              window.location.href = $(this).prop('href');
            }
          }
          else {
            //console.log('aaa');
            $('.moduleMenu').hide();
            targetObj.show();
          }
          return false;
        });//module Links

        $('.moduleMenu').find('a').click(function() {
          var thisObj = $(this);
          var target = thisObj.prop('target');
          var href = thisObj.attr('href');

          mainMenuToggle();
          loadPage(href,target);

          return false;
        });
      }//rows
    },//success
    error: function(XMLHttpRequest, data, errorThrown){
      console.log(errorThrown);
    }
  });
}

function initSubLinks() {
  var subLinksList = $('.subLinks');
  var subLinks = $('.subLinks').find('li').find('a');
  subLinks.each(function() {
    var $this = $(this);
    //var link = $this.find('a');

    $this.click(function() {
      subLinks.removeClass('selected');
      $this.addClass('selected');

      var subLinksDropDown = $('.subLinksDropDown');

      //console.log(subLinksDropDown.is(':visible'));
      if (subLinksDropDown.length && subLinksDropDown.is(':visible')) {
        subLinksDropDown.html($this.html());
        subLinksList.hide();
      }
    });
  });
}

function loadPage(url,target,options) {
  console.log('loadpage');
  console.log('typeof:'+ typeof url);
  console.log('url:'+url);

  var mainContent = $('#mainContent');
  var pageContent = $('#pageContent');
  var pageIFrame = $('#pageIFrame');
  //var contentWindow = mainContentContainer.find('#contentWindow');


  target = 'iframe';//hardcode for testing
  if (typeof target != 'undefined' && target.toLowerCase() == 'iframe') {
    mainContent.addClass('layout-iframe');
    pageIFrame.prop('src',url);
  }
  else {
    mainContent.removeClass('layout-iframe');
  }

}

function initSubLinksDropDown() {
  var subLinksList = $('.subLinks');
  var subLinks = subLinksList.find('li').find('a');
  var subLinkActive = subLinksList.find('.selected');
  var subLinksDropDown = $('<div class="subLinksDropDown"></div>');


  if ($('.subLinksDropDown').length <= 0) {
    //adding subLinksDropDown
    subLinksList.before(subLinksDropDown);

    //init click
    subLinksDropDown.click(function(){
      if(subLinksList.is(':visible'))
        subLinksList.hide();
      else
        subLinksList.show();
    });
  }

  return subLinksDropDown;
}

function mainMenuToggle() {
  console.log('mainMenuToggle');
  var mainMenuContainer = $('#mainMenuContainer');

  if (Foundation.MediaQuery.current == 'small')
  {
    var position = mainMenuContainer.offset();
    console.log(position.left );
    if(position.left < 0) {
      console.log('slideout');
      mainMenuContainer.animate({
        left:'0'
      },350);
    }
    else {
      console.log('slidein');
      mainMenuContainer.animate({
        left:'-100%'
      },350);
    }
  }
  else {
    if(mainMenuContainer.is(':visible')) {
      console.log('slideup');
      mainMenuContainer.slideUp();
    }
    else {
      console.log('slidedown');
      mainMenuContainer.slideDown();
    }
  }
}

function setupSubLinks(smallScreen) {
  var subLinksList = $('.subLinks');
  var subLinks = subLinksList.find('li');
  var subLinkActive = subLinksList.find('a.selected');
  var subLinksDropDown = initSubLinksDropDown();

  console.log(subLinksDropDown);
  if (smallScreen) {
    subLinksList.hide();
    subLinksDropDown.show().html(subLinkActive.html());

  } //convert
  else {
    subLinksList.show();
    subLinksDropDown.hide();
  } //revert
}

function formOthersInit() {
  $('[data-form-other-text=true]').prop('disabled','disabled');
  $('[data-form-other]').each(function(){
    var thisObj = $(this);
    var targetVal = thisObj.data('form-other');
    var targetObj = $('#' + targetVal);
    var target = $('#' + targetVal);


    if (thisObj.prop('type')=='checkbox') {
      //console.log('checkbox');
      thisObj.click(function() {
        if (thisObj.is(':checked')) {
          targetObj.prop('disabled','');
        }
        else {
          targetObj.prop('disabled','disabled');
        }
      });
    }
    else if (thisObj.prop('type') == 'radio') {
      var radioName = thisObj.prop('name');
      var thisVal = thisObj.val();
      var radioGroup = $('[name='+radioName+']');

      radioGroup.click(function() {

        if ($('[name='+radioName+']:checked').val() == thisVal) {
          targetObj.prop('disabled','');
          console.log(3);
        }
        else {
          targetObj.prop('disabled','disabled');
          console.log(4);
        }
      });
    }
    else if (thisObj.is('select')) {
      thisObj.change(function() {
        var thisVal = thisObj.val();
        //console.log('select');
        if (thisVal.toLowerCase()=='other' || thisVal.toLowerCase()=='others') {
          targetObj.prop('disabled','');
        }
        else {
          targetObj.prop('disabled','disabled');
        }
      });
    }
  });
}

function formSectionsInit() {
  $('form.formSection').each(function() {
    var form = $(this);
    var fieldsets = form.find('fieldset');
    var breadcrumbs = form.find('.breadcrumbs');
    var footer = form.find('footer.buttonsGroup');

    form.data('current-form-index',0);

    //set breadcrumbs and hide fieldsets
    breadcrumbs.html('');

    fieldsets.each(function(index) {

      var fieldset = $(this);
      fieldset.data('fieldset-index',index);
      breadcrumbs.append('<li><a href="#'+fieldset.prop('id')+'" data-fieldset-index="'+index+'">'+fieldset.find('h2').html()+'</a>').find('li:eq(0) a').addClass('active');

      if(index>0) {
        fieldset.hide();
      }
    });

    breadcrumbs.find('a').click(function() {
      var thisObj = $(this);
      var currentIndex = parseInt(form.data('current-form-index'));
      if (formSectionValidate(currentIndex) ) {
        loadFormSection(thisObj.data('fieldset-index'));
      }
      return false;
    });

    //set buttons
    footer.find('#previous').hide();
    footer.find('[type=submit]').hide();

    footer.find('#previous').click(function() {
      var currentIndex = parseInt(form.data('current-form-index'));
      var targetIndex = currentIndex-1;

      if (targetIndex <0) targetIndex=0;

      if (formSectionValidate(currentIndex) ) {
        loadFormSection(targetIndex);
      }
      loadFormSection( targetIndex);
    });
    footer.find('#next').click(function() {
      var currentIndex = parseInt(form.data('current-form-index'));
      var targetIndex = currentIndex + 1;

      if (targetIndex >= fieldsets.length) targetIndex=fieldsets.length-1;

      if (formSectionValidate(currentIndex) ) {
        loadFormSection( targetIndex);
      }
    });

    function formSectionValidate(index) {

      //check error
      //if(error) {
        //prompt error
        //return false;
      //}

      return true;
    }

    function loadFormSection(index) {
      //set index
      form.data('current-form-index', index);
      var targetIndex = index;

      console.log(index);
      //set breadcrumbs
      breadcrumbs.find('a').removeClass('active').filter(function() {

        return ($(this).data('fieldset-index') == targetIndex)
      }).addClass('active');

      //set fieldset`
      fieldsets.hide().filter(function() {
        return ($(this).data('fieldset-index') == targetIndex)
      }).show();

      if (index == 0) {
        footer.find('#previous').hide();
        footer.find('#next').show();
        footer.find('[type=submit]').hide();
      }
      else if (index == fieldsets.length-1) {
        footer.find('#previous').show();
        footer.find('#next').hide();
        footer.find('[type=submit]').show();
      }
      else {
        footer.find('#previous').show();
        footer.find('#next').show();
        footer.find('[type=submit]').hide();
      }

      //set footer
    }
  });

}
function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
}
