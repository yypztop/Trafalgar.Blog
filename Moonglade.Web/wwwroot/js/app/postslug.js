var postSlug = {
    getStatistics: function (pid) {
        const uri = `/api/statistics/${pid}`;
        fetch(uri)
            .then(response => response.json())
            .then(data => {
                $('.post-hit-number-text').text(data.hits);
                if ($('.likehits-num')) {
                    $('.likehits-num').text(data.likes);
                }
            })
            .catch(err => {
                toastr.error(err);
                console.error(err);
            });
    },
    postStatistics: function (pid, isLike) {
        const req = {
            postId: pid,
            isLike: isLike
        };

        callApi('/api/statistics', 'POST', req,
            (success) => {
                if (isLike) {
                    let oldVal = parseInt($('.likehits-num').text(), 10);
                    $('.likehits-num').html(++oldVal);
                    $('.btn-ratings').attr('disabled', 'disabled');
                }
            });
    },
    registerRatingButtons: function (pid) {
        $('.btn-ratings').click(function () {
            postSlug.postStatistics(pid, true);
        });
    },
    resetCaptchaImage: function () {
        d = new Date();
        $('#img-captcha').attr('src', `/captcha-image?${d.getTime()}`);
    },
    resizeImages: function () {
        $('.post-content img').removeAttr('height');
        $('.post-content img').removeAttr('width');
        $('.post-content img').addClass('img-fluid img-thumbnail');
    },
    applyImageZooming: function () {
        if (getResponsiveBreakpoint() !== 'xs') {
            $('.post-content img').click(function (e) {
                var src = $(this).attr('src');
                
                $('#imgzoom').attr('src', src);

                if (fitImageToDevicePixelRatio) {
                    setTimeout(function () {
                        var w = $('#imgzoom')[0].naturalWidth;
                        console.info(w);

                        $('#imgzoom').css('width', getImageWidthInDevicePixelRatio(w));
                    }, 100);
                }

                $('#imgzoomModal').modal();
            });
        }
    },
    renderCodeHighlighter: function () {
        $('pre').each(function (i, pre) {
            // Find <pre> that doesn't have a <code> inside it.
            if ($(pre).find('code')[0] === undefined) {
                $(pre).wrapInner('<code></code>');
            }

            // For code that can't be automatically detected, fall back to use XML
            if ($(pre).hasClass('language-markup')) {
                $(pre).children('code').addClass('lang-xml');
            }
        });

        $('pre code').each(function (i, block) {
            hljs.highlightBlock(block);
        });
    },
    warnExtLink: function () {
        $.expr[':'].external = function (obj) {
            return !obj.href.match(/^mailto\\:/) && (obj.hostname != location.hostname);
        };

        $('.post-content a:external').addClass('external');

        $('a.external').click(function (e) {
            e.preventDefault();
            var linkHref = $(this).attr('href');
            $('#extlink-url').html(linkHref);
            $('#extlink-continue').attr('href', linkHref);
            $('#externalLinkModal').modal('show');
        });

        $('#extlink-continue').click(function () {
            $('#externalLinkModal').modal('hide');
        });
    }
};

function getImageWidthInDevicePixelRatio(width) {
    console.info(width);
    if (width <= 0) return 0;
    var dpr = window.devicePixelRatio;
    if (dpr === 1) return width;
    return width / dpr;
}