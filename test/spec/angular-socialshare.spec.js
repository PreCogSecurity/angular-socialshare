/*global angular, describe, it, beforeEach, expect, inject, jasmine, module, spyOn*/
(function socialshareSpec() {
  'use strict';

  describe('720kb.socialshare', function () {
    var $compile
      , $rootScope
      , $window
      , $location
      , element;

    beforeEach(module('720kb.socialshare'));

    beforeEach(inject(function (_$compile_, _$rootScope_, _$window_, _$location_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $window = _$window_;
      $location = _$location_;
      spyOn($window, 'open');
    }));

    var compileShare = function compileShare(attributes) {
      element = $compile('<a href="#" socialshare ' + (attributes || '') + '>Share</a>')($rootScope);
      $rootScope.$digest();
      return element;
    };

    var triggerShare = function triggerShare(attributes) {
      compileShare(attributes);
      element.triggerHandler('click');
    };

    it('registers the 720kb.socialshare module', function () {
      expect(angular.module('720kb.socialshare')).toBeDefined();
    });

    it('does not throw when the socialshare-provider attribute is missing', function () {
      expect(function () {
        compileShare('');
      }).not.toThrow();
    });

    it('does not throw for an unknown provider', function () {
      expect(function () {
        compileShare('socialshare-provider="not-a-provider"');
      }).not.toThrow();
    });

    describe('popup providers', function () {
      it('opens a popup when the default click trigger fires', function () {
        triggerShare('socialshare-provider="google" socialshare-url="http://example.com"');
        expect($window.open).toHaveBeenCalledWith(
          'https://plus.google.com/share?url=http%3A%2F%2Fexample.com',
          'sharer', jasmine.stringMatching(/width=500,height=600/));
      });

      it('falls back to the current page url when socialshare-url is missing', function () {
        var absUrl = $location.absUrl();
        triggerShare('socialshare-provider="google"');
        expect($window.open).toHaveBeenCalledWith(
          'https://plus.google.com/share?url=' + encodeURIComponent(absUrl),
          'sharer', jasmine.any(String));
      });

      it('binds a custom trigger event', function () {
        compileShare('socialshare-provider="google" socialshare-url="http://example.com" socialshare-trigger="mouseover"');
        element.triggerHandler('mouseover');
        expect($window.open).toHaveBeenCalledWith(
          'https://plus.google.com/share?url=http%3A%2F%2Fexample.com',
          'sharer', jasmine.any(String));
      });

      it('does not fire on click when a custom trigger is set', function () {
        compileShare('socialshare-provider="google" socialshare-url="http://example.com" socialshare-trigger="mouseover"');
        element.triggerHandler('click');
        expect($window.open).not.toHaveBeenCalled();
      });

      it('builds a twitter share url', function () {
        triggerShare('socialshare-provider="twitter" socialshare-url="http://example.com" socialshare-text="Hello" socialshare-via="user" socialshare-hashtags="a,b"');
        expect($window.open).toHaveBeenCalledWith(
          'https://www.twitter.com/intent/tweet?text=Hello&via=user&hashtags=a%2Cb&url=http%3A%2F%2Fexample.com',
          'sharer', jasmine.any(String));
      });

      it('builds a facebook sharer url', function () {
        triggerShare('socialshare-provider="facebook" socialshare-url="http://example.com"');
        expect($window.open).toHaveBeenCalledWith(
          'https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fexample.com',
          'sharer', jasmine.any(String));
      });

      it('builds a facebook feed dialog url', function () {
        triggerShare('socialshare-provider="facebook" socialshare-type="feed" socialshare-url="http://example.com" socialshare-via="123" socialshare-text="Name" socialshare-description="Desc" socialshare-media="http://img.example" socialshare-caption="Cap" socialshare-source="http://src.example" socialshare-ref="r1,r2" socialshare-from="from@example.com" socialshare-to="to@example.com" socialshare-redirect-uri="http://redirect.example" socialshare-display="popup"');
        expect($window.open).toHaveBeenCalledWith(
          'https://www.facebook.com/dialog/feed?&app_id=123&redirect_uri=http%3A%2F%2Fredirect.example&link=http%3A%2F%2Fexample.com&to=to%40example.com&display=popup&ref=r1%2Cr2&from=from%40example.com&description=Desc&name=Name&caption=Cap&picture=http%3A%2F%2Fimg.example&source=http%3A%2F%2Fsrc.example',
          'sharer', jasmine.any(String));
      });

      it('builds a facebook send dialog url', function () {
        triggerShare('socialshare-provider="facebook" socialshare-type="send" socialshare-url="http://example.com" socialshare-via="123" socialshare-to="to@example.com" socialshare-display="popup" socialshare-ref="r1" socialshare-redirect-uri="http://redirect.example"');
        expect($window.open).toHaveBeenCalledWith(
          'https://www.facebook.com/dialog/send?&app_id=123&redirect_uri=http%3A%2F%2Fredirect.example&link=http%3A%2F%2Fexample.com&to=to%40example.com&display=popup&ref=r1',
          'sharer', jasmine.any(String));
      });

      it('builds a linkedin share url', function () {
        triggerShare('socialshare-provider="linkedin" socialshare-url="http://example.com" socialshare-text="Title" socialshare-description="Summary" socialshare-source="Source"');
        expect($window.open).toHaveBeenCalledWith(
          'https://www.linkedin.com/shareArticle?mini=true&url=http%3A%2F%2Fexample.com&title=Title&summary=Summary&source=Source',
          'sharer', jasmine.any(String));
      });

      it('builds a reddit share url', function () {
        triggerShare('socialshare-provider="reddit" socialshare-url="http://example.com" socialshare-text="T"');
        expect($window.open).toHaveBeenCalledWith(
          'https://www.reddit.com/submit?url=http%3A%2F%2Fexample.com&title=T',
          'sharer', jasmine.stringMatching(/width=900,height=650/));
      });

      it('builds a reddit share url with a subreddit', function () {
        triggerShare('socialshare-provider="reddit" socialshare-url="http://example.com" socialshare-text="T" socialshare-subreddit="technology"');
        expect($window.open).toHaveBeenCalledWith(
          'https://www.reddit.com/r/technology/submit?url=http%3A%2F%2Fexample.com&title=T',
          'sharer', jasmine.any(String));
      });

      it('builds a stumbleupon share url', function () {
        triggerShare('socialshare-provider="stumbleupon" socialshare-url="http://example.com" socialshare-text="T"');
        expect($window.open).toHaveBeenCalledWith(
          'https://www.stumbleupon.com/submit?url=http%3A%2F%2Fexample.com&title=T',
          'sharer', jasmine.any(String));
      });

      it('builds a pinterest share url', function () {
        triggerShare('socialshare-provider="pinterest" socialshare-url="http://example.com" socialshare-media="http://img.example" socialshare-text="T"');
        expect($window.open).toHaveBeenCalledWith(
          'https://www.pinterest.com/pin/create/button/?url=http%3A%2F%2Fexample.com&media=http%3A%2F%2Fimg.example&description=T',
          'sharer', jasmine.any(String));
      });

      it('builds a digg share url', function () {
        triggerShare('socialshare-provider="digg" socialshare-url="http://example.com" socialshare-text="T"');
        expect($window.open).toHaveBeenCalledWith(
          'https://www.digg.com/submit?url=http%3A%2F%2Fexample.com&title=T',
          'sharer', jasmine.any(String));
      });

      it('builds a tumblr link share url', function () {
        triggerShare('socialshare-provider="tumblr" socialshare-url="http://example.com" socialshare-text="T"');
        expect($window.open).toHaveBeenCalledWith(
          'https://www.tumblr.com/share/link?url=http%3A%2F%2Fexample.com&description=T',
          'sharer', jasmine.any(String));
      });

      it('builds a tumblr photo share url', function () {
        triggerShare('socialshare-provider="tumblr" socialshare-media="http://img.example" socialshare-text="T"');
        expect($window.open).toHaveBeenCalledWith(
          'https://www.tumblr.com/share/photo?source=http%3A%2F%2Fimg.example&caption=T',
          'sharer', jasmine.any(String));
      });

      it('builds a vk share url', function () {
        triggerShare('socialshare-provider="vk" socialshare-url="http://example.com" socialshare-text="T" socialshare-media="http://img.example" socialshare-description="D"');
        expect($window.open).toHaveBeenCalledWith(
          'https://www.vk.com/share.php?url=http%3A%2F%2Fexample.com&title=T&image=http%3A%2F%2Fimg.example&description=D',
          'sharer', jasmine.any(String));
      });

      it('builds an ok share url', function () {
        triggerShare('socialshare-provider="ok" socialshare-url="http://example.com" socialshare-text="T"');
        expect($window.open).toHaveBeenCalledWith(
          'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st._surl=http%3A%2F%2Fexample.com&st.comments=T',
          'sharer', jasmine.any(String));
      });

      it('builds a delicious share url', function () {
        triggerShare('socialshare-provider="delicious" socialshare-url="http://example.com" socialshare-text="T"');
        expect($window.open).toHaveBeenCalledWith(
          'https://www.delicious.com/save?v=5&noui&jump=close&url=http%3A%2F%2Fexample.com&title=T',
          'sharer', jasmine.any(String));
      });

      it('builds a buffer share url', function () {
        triggerShare('socialshare-provider="buffer" socialshare-url="http://example.com" socialshare-text="T" socialshare-via="user"');
        expect($window.open).toHaveBeenCalledWith(
          'https://bufferapp.com/add?text=T&via=user&url=http%3A%2F%2Fexample.com',
          'sharer', jasmine.any(String));
      });

      it('builds a hackernews share url', function () {
        triggerShare('socialshare-provider="hackernews" socialshare-url="http://example.com" socialshare-text="T"');
        expect($window.open).toHaveBeenCalledWith(
          'https://news.ycombinator.com/submitlink?t=T&u=http%3A%2F%2Fexample.com',
          'sharer', jasmine.any(String));
      });

      it('builds a flipboard share url', function () {
        triggerShare('socialshare-provider="flipboard" socialshare-url="http://example.com" socialshare-text="T"');
        expect($window.open).toHaveBeenCalledWith(
          'https://share.flipboard.com/bookmarklet/popout?v=2&title=T&url=http%3A%2F%2Fexample.com',
          'sharer', jasmine.any(String));
      });

      it('builds a pocket share url', function () {
        triggerShare('socialshare-provider="pocket" socialshare-url="http://example.com" socialshare-text="T"');
        expect($window.open).toHaveBeenCalledWith(
          'https://getpocket.com/save?text=T&url=http%3A%2F%2Fexample.com',
          'sharer', jasmine.any(String));
      });

      it('builds a wordpress share url', function () {
        triggerShare('socialshare-provider="wordpress" socialshare-url="http://example.com" socialshare-text="T" socialshare-media="http://img.example"');
        expect($window.open).toHaveBeenCalledWith(
          'http://wordpress.com/press-this.php?t=T&i=http%3A%2F%2Fimg.example&u=http%3A%2F%2Fexample.com',
          'sharer', jasmine.any(String));
      });

      it('builds a xing share url', function () {
        triggerShare('socialshare-provider="xing" socialshare-url="http://example.com" socialshare-follow="http://xing.example"');
        expect($window.open).toHaveBeenCalledWith(
          'https://www.xing.com/spi/shares/new?url=http%3A%2F%2Fexample.com&follow_url=http%3A%2F%2Fxing.example',
          'sharer', jasmine.any(String));
      });

      it('builds an evernote share url', function () {
        triggerShare('socialshare-provider="evernote" socialshare-url="http://example.com" socialshare-text="T"');
        expect($window.open).toHaveBeenCalledWith(
          'http://www.evernote.com/clip.action?url=http%3A%2F%2Fexample.com&title=T',
          'sharer', jasmine.any(String));
      });

      it('builds a skype share url', function () {
        triggerShare('socialshare-provider="skype" socialshare-url="http://example.com" socialshare-text="T"');
        expect($window.open).toHaveBeenCalledWith(
          'https://web.skype.com/share?source=button&url=http%3A%2F%2Fexample.com&text=T',
          'sharer', jasmine.any(String));
      });
    });

    describe('direct link providers', function () {
      it('sets the href for facebook-messenger', function () {
        compileShare('socialshare-provider="facebook-messenger" socialshare-url="http://example.com"');
        expect(element.attr('href')).toBe('fb-messenger://share?link=http%3A%2F%2Fexample.com');
      });

      it('sets the href for whatsapp', function () {
        compileShare('socialshare-provider="whatsapp" socialshare-url="http://example.com" socialshare-text="Hello"');
        expect(element.attr('href')).toBe('whatsapp://send?text=Hello%20http%3A%2F%2Fexample.com');
      });

      it('sets the href for viber', function () {
        compileShare('socialshare-provider="viber" socialshare-url="http://example.com" socialshare-text="Hello"');
        expect(element.attr('href')).toBe('viber://forward?text=Hello%20http%3A%2F%2Fexample.com');
      });
    });

    describe('email provider', function () {
      it('builds a mailto url', function () {
        triggerShare('socialshare-provider="email" socialshare-to="to@example.com" socialshare-body="Body" socialshare-subject="Subject" socialshare-cc="cc@example.com" socialshare-bcc="bcc@example.com"');
        expect($window.open).toHaveBeenCalledWith(
          'mailto:to%40example.com?body=Body&subject=Subject&cc=cc%40example.com&bcc=bcc%40example.com',
          '_self');
      });
    });

    describe('socialshareConfProvider', function () {
      var configuredCompile
        , configuredRootScope
        , configuredWindow;

      beforeEach(module('720kb.socialshare', function (socialshareConfProvider) {
        socialshareConfProvider.configure([{
          'provider': 'twitter',
          'conf': {
            'text': 'configured-twitter',
            'url': 'http://configured.example'
          }
        },
        {
          'provider': 'facebook',
          'conf': {
            'text': 'configured-facebook',
            'url': 'http://configured.example'
          }
        }]);
      }));

      beforeEach(inject(function (_$compile_, _$rootScope_, _$window_) {
        configuredCompile = _$compile_;
        configuredRootScope = _$rootScope_;
        configuredWindow = _$window_;
        spyOn(configuredWindow, 'open');
      }));

      it('applies configuration to every listed provider', function () {
        var twitterElement = configuredCompile('<a href="#" socialshare socialshare-provider="twitter">Share</a>')(configuredRootScope);
        configuredRootScope.$digest();
        twitterElement.triggerHandler('click');
        expect(configuredWindow.open).toHaveBeenCalledWith(
          'https://www.twitter.com/intent/tweet?text=configured-twitter&url=http%3A%2F%2Fconfigured.example',
          'sharer', jasmine.any(String));

        var facebookElement = configuredCompile('<a href="#" socialshare socialshare-provider="facebook">Share</a>')(configuredRootScope);
        configuredRootScope.$digest();
        facebookElement.triggerHandler('click');
        expect(configuredWindow.open).toHaveBeenCalledWith(
          'https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fconfigured.example',
          'sharer', jasmine.any(String));
      });

      it('lets html attributes override the configured values', function () {
        var twitterElement = configuredCompile('<a href="#" socialshare socialshare-provider="twitter" socialshare-text="from-attribute">Share</a>')(configuredRootScope);
        configuredRootScope.$digest();
        twitterElement.triggerHandler('click');
        expect(configuredWindow.open).toHaveBeenCalledWith(
          'https://www.twitter.com/intent/tweet?text=from-attribute&url=http%3A%2F%2Fconfigured.example',
          'sharer', jasmine.any(String));
      });
    });

    describe('with a configuration entry missing conf', function () {
      var missingCompile
        , missingRootScope
        , missingWindow;

      beforeEach(module('720kb.socialshare', function (socialshareConfProvider) {
        socialshareConfProvider.configure([{
          'provider': 'twitter'
        }]);
      }));

      beforeEach(inject(function (_$compile_, _$rootScope_, _$window_) {
        missingCompile = _$compile_;
        missingRootScope = _$rootScope_;
        missingWindow = _$window_;
        spyOn(missingWindow, 'open');
      }));

      it('does not throw when configuring a provider without conf', function () {
        expect(function () {
          var missingElement = missingCompile('<a href="#" socialshare socialshare-provider="twitter">Share</a>')(missingRootScope);
          missingRootScope.$digest();
          missingElement.triggerHandler('click');
        }).not.toThrow();
      });
    });

    describe('with configured email defaults', function () {
      var emailCompile
        , emailRootScope
        , emailWindow;

      beforeEach(module('720kb.socialshare', function (socialshareConfProvider) {
        socialshareConfProvider.configure([{
          'provider': 'email',
          'conf': {
            'to': 'to@example.com',
            'subject': 'Subject',
            'body': 'Body',
            'cc': 'cc@example.com',
            'bcc': 'bcc@example.com'
          }
        }]);
      }));

      beforeEach(inject(function (_$compile_, _$rootScope_, _$window_) {
        emailCompile = _$compile_;
        emailRootScope = _$rootScope_;
        emailWindow = _$window_;
        spyOn(emailWindow, 'open');
      }));

      it('uses the configured subject, body, cc and bcc', function () {
        var emailElement = emailCompile('<a href="#" socialshare socialshare-provider="email">Share</a>')(emailRootScope);
        emailRootScope.$digest();
        emailElement.triggerHandler('click');
        expect(emailWindow.open).toHaveBeenCalledWith(
          'mailto:to%40example.com?body=Body&subject=Subject&cc=cc%40example.com&bcc=bcc%40example.com',
          '_self');
      });
    });
  });
}());