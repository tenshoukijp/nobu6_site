var menuMoveMode = false; // メニュー内の移動だけかどうか
var isViewingPageLoading = false; // ページロードの表示中

$(document).ready(function(){
  // -- メニューがらみ ------------------------------
  $( '#eventpanel' ).empty();

  $( '#menu' ).multilevelpushmenu({
    containersToPush: [$( '#pushobj' )] ,
    menuWidth: 380,
    menuHeight: $(window).height(), // 左側のメニューの高さは最低1500

    onBackItemClick: function() {
        // 戻るボタン
        menuMoveMode = true;
    },
    onGroupItemClick: function() {
        // グループボタン
        menuMoveMode = true;
    },

    onCollapseMenuEnd: function() {
        // メニュー内で移動している場合に限り
        if ( menuMoveMode == true ) {
            // アンカーを伴っていなければ
            if ( ! $(location).attr('href').match("#") ) {
                // 上までスクロール
                var speed = 100; // ミリ秒
                $('body,html').animate({scrollTop:0}, speed, 'swing');
            }
        }
        menuMoveMode = false;
    },
    onExpandMenuEnd: function() {
        // メニュー内で移動している場合に限り
        if ( menuMoveMode == true ) {
            // アンカーを伴っていなければ
            if ( ! $(location).attr('href').match("#") ) {
                // 上までスクロール
                var speed = 100; // ミリ秒
                $('body,html').animate({scrollTop:0}, speed, 'swing');
            }
        }
        menuMoveMode = false;
    },

    onItemClick: function() {
        var event        = arguments[0],
        $menuLevelHolder = arguments[1],
        $item            = arguments[2],
        options          = arguments[3],
        title = $menuLevelHolder.find( 'h2:first' ).text(),
        itemName = $item.find( 'a:first' ).text(),
        itemHref = $item.find( 'a' ).attr("href");

        if ( itemHref != "#" ) {
            if ( !isViewingPageLoading && !itemHref.match("http") ) { // サイト外のアドレス
                isViewingPageLoading = true;
                $('#eventpanel').append( getPageLoadString() );
            }

            menuMoveMode = false;
            window.location = itemHref;
        }
    },
  });

  doMenuExpand();
  isViewed = true;
});

function doMenuAdjustSize() {
    var contents_height = parseInt($( '#pushobj' ).css( 'height' )) + 100; // 右側のコンテンツの高さ
    var window_height = $(window).height();
    contents_height = contents_height > window_height ? contents_height : window_height;
    contents_height = contents_height > 3000 ? contents_height : 3000;
    if ( $( '#menu' ).height() != contents_height ) {
        $( '#menu' ).multilevelpushmenu( 'option', 'menuHeight', contents_height );
        $( '#menu' ).multilevelpushmenu( 'redraw' );
    }
}

function getPageLoadString() {
    return '<div class="divPageLoad"><font color="black">&nbsp;<i class="fa fa-spinner fa-pulse"></i>&nbsp;ページ読み込み中です｡｡｡<br></font></div>';
}

$(window).on("load", function() {
    // 1秒後にリサイズ
    setTimeout(function () {
        doMenuAdjustSize();
    }, 1000);

    // 3秒後に再びリサイズ
    setTimeout(function(){
        doMenuAdjustSize();
    }, 3000);
});

$(window).on("resize", function() {
    // 2秒後にリサイズ
    setTimeout(function () {
        doMenuAdjustSize();
    }, 2000);
});

$(window).on("beforeunload",function(e){
    $( "divPageLoad" ).remove();
});