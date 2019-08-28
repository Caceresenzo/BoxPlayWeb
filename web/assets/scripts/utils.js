function isInViewport(elementId) {
	let elementTop = $("#" + elementId).offset().top;
	let elementBottom = elementTop + $("#" + elementId).outerHeight();
	let viewportTop = $(window).scrollTop();
	let viewportBottom = viewportTop + $(window).height();
	return elementBottom > viewportTop && elementTop < viewportBottom;
}