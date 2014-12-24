/* tipObjs是一個陣列，存放著要顯示氣泡的元件ID
 * 呼叫buuble_hint並傳入tipObjs，就可以依照tipObjs內的ID順序來顯示氣泡
 */
var bubble_hint = function(tipObjs) {

	var tipAnimation;
	var animateFunc = [];
	
	var bubble;
	var button;
	
	var bubble_offset_x = 0;
	var bubble_offset_y = -30;
	
	var bubble_maxwidth = 200;
	var overlay_opacity = 0.5;
	var slidedown_speed = 500;
	var arrow_direction;
	
	var bubble_css = {'position': 'absolute', 'display': 'none', 'max-width': bubble_maxwidth + 'px', 'z-index': '999', 'background-image': 'url(\'mary.png\')', 'background-repeat': 'no-repeat', 'background-position': 'left bottom', 'padding-left': '90px'};
	var button_css = {'display': 'block', 'width': '60px', 'padding': '5px', 'margin': '10px auto 0 auto', 'background-color': '#ffffff', 'font-size': '12px'};
	var overlay_css = {'position': 'fixed', 'width': '100%', 'height': '100%', 'left': '0', 'top': '0', 'background-color': '#000000', '-moz-opacity': overlay_opacity, '-khtml-opacity': overlay_opacity, 'opacity': overlay_opacity, '-ms-filter': '"progid:DXImageTransform.Microsoft.Alpha"(Opacity=' + (overlay_opacity * 100) + ')', 'filter': 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + (overlay_opacity * 100) + ')', 'filter': 'alpha(opacity=' + (overlay_opacity * 100) + ')', 'z-index': '998'};
	
	$(tipObjs).each(function(k, v) {
		var tipObj = $('#' + v);	
		
		if (tipObj.length > 0) {
			
			animateFunc.push(function () {
			
				/* 用來遮住原先頁面的遮罩，相關CSS設定請修改上方overlay_css的內容 */
				$('<div></div>', {id: 'tipOverlay'}).html('&nbsp;').css(overlay_css).appendTo('body');
				
				/* 預設的氣泡 "left" 及 "top" 位置
				 * (可使用 "data-tip-marginleft" 和 "data-tip-margintop" 來微調)
				 */
				var bubble_left = (tipObj.offset().left + bubble_offset_x + tipObj.width());
				var bubble_top = (tipObj.offset().top + bubble_offset_y);
				
				if (typeof(tipObj.attr('data-tip-marginleft')) == 'string') { bubble_left += parseInt(tipObj.attr('data-tip-marginleft')); }
				if (typeof(tipObj.attr('data-tip-margintop')) == 'string') { bubble_top += parseInt(tipObj.attr('data-tip-margintop')); }				
				if (typeof(tipObj.attr('data-tip-direction')) == 'string') { arrow_direction = tipObj.attr('data-tip-direction'); } else { arrow_direction = 'left'; }
				
				/* 產生氣泡主體物件
				 * HTML物件上的 "data-tip-text" 屬性用來控制氣泡內顯示的文字 (可使用HTML)
				 */
				bubble = $('<p></p>').addClass('triangle-isosceles ' + arrow_direction).css(bubble_css).css({
					'left': bubble_left + 'px',
					'top': bubble_top + 'px'
				}).html((typeof(tipObj.attr('data-tip-text')) == 'string' ? tipObj.attr('data-tip-text') : '&nbsp;'));
				
				/* 如果箭頭方向朝右的話，氣泡的 "left" 要做調整
				 * -90 是因為 "bubble_css" 裡面加了 padding-left: 90px;
				 */
				if (arrow_direction == 'right') { bubble.css('left', (bubble_left - bubble_maxwidth - 90) + 'px'); }
				
				/* 產生下一步的按鈕
				 * 預設文字是 "Next"
				 * 按鈕文字可透過HTML物件上的 "data-tip-buttontext" 屬性來修改
				 */
				button = $('<button></button>').text((typeof(tipObj.attr('data-tip-buttontext')) == 'string' ? tipObj.attr('data-tip-buttontext') : 'Next')).css(button_css).click(function() {
					tipAnimate();
					$('#tipOverlay').remove();
					$(this).parent('p').remove();
				}).appendTo(bubble);	
				
				/* 氣泡下拉顯示(可控制下拉速度) */
				bubble.appendTo('body').slideDown(slidedown_speed);
				
				/* 視窗卷軸自動捲至氣泡上緣的位置 */
				var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html, body');
				$body.animate({
					scrollTop: bubble_top
				}, 600);
				
			});			
		}
	});
	
	/* 把剛剛產生的 "animateFunc" 動畫陣列儲存到" tipAnimation" 這個queue裡面 */
	$(window).queue('tipAnimation', animateFunc);
	
	/* 執行queue內的第一個動畫 */
	tipAnimate();
}

/* tipAnimate的作用是從 "tipAnimation" 這個queue內執行下一個動畫 */
var tipAnimate = function() { $(window).dequeue('tipAnimation'); };
