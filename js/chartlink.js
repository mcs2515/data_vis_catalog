function chartlink() {
	let graphDiv = document.querySelector('.graph');
	let chartLink = document.querySelector('#charts-link');
	let desc = document.querySelector('.desc');
	let content = desc.innerHTML;

	$('.menu').css('opacity', '0');

	chartLink.onclick = () => {
		graphDiv.classList.toggle('hidden');
		document.querySelector('.menu').classList.toggle('hidden');

		if (graphDiv.classList.contains('hidden')) {
			$(graphDiv).animate({
					'opacity': '0'
				}, 300,
				function () {
					$('.menu').animate({
						'opacity': '1'
					}, 500);
				});

			chartLink.innerHTML = 'Back';
			desc.innerHTML = '<h1 id="select-chart">Select a chart</h1>';

		} else {
			$('.menu').animate({
					'opacity': '0'
				}, 300,
				function () {
					$(graphDiv).animate({
						'opacity': '1'
					}, 500);
				});


			chartLink.innerHTML = 'Charts';
			desc.innerHTML = content;
		}

	}
}