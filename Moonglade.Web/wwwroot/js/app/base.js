﻿window.toastr.options = {
    "positionClass": 'toast-bottom-center'
};

var isDarkMode = false;
var supportLightSwitch = false;

$(function () {
    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip();

    if (/Android|webOS|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('div.container').addClass('container-fluid').removeClass('container');
    }

    $('input#search, #search-mobile')
        .focus(function () {
            $(this).attr('placeholder', '');
        })
        .blur(function () {
            $(this).attr('placeholder', 'Search');
        });

    $('.lightswitch').click(function () {
        if (isDarkMode) {
            themeModeSwitcher.useLightMode();
        } else {
            themeModeSwitcher.useDarkMode();
        }
    });
});

/**
 * Detect the current active responsive breakpoint in Bootstrap
 * @returns {string}
 * @author farside {@link https://stackoverflow.com/users/4354249/farside}
 */
function getResponsiveBreakpoint() {
    var envs = { xs: 'd-none', sm: 'd-sm-none', md: 'd-md-none', lg: 'd-lg-none', xl: 'd-xl-none' };
    var env = '';

    var $el = $('<div>');
    $el.appendTo($('body'));

    for (var i = Object.keys(envs).length - 1; i >= 0; i--) {
        env = Object.keys(envs)[i];
        $el.addClass(envs[env]);
        if ($el.is(':hidden')) {
            break; // env detected
        }
    }
    $el.remove();
    return env;
};

function buildErrorMessage(responseObject) {
    if (responseObject.responseJSON) {
        var json = responseObject.responseJSON;
        var errorMessage = 'Error(s):\n\r';

        Object.keys(json).forEach(function (k) {
            errorMessage += (k + ': ' + json[k]) + '\n\r';
        });

        return errorMessage;
    }

    if (responseObject.responseText) {
        return responseObject.responseText.trim();
    }

    return responseObject.status;
}