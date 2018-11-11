function chartlink(){
	let graphDiv = document.querySelector('.graph');
	let chartLink = document.querySelector('#charts-link');
	let desc = document.querySelector('.desc');
	let content = desc.innerHTML;
			
	chartLink.onclick = () =>{
		graphDiv.classList.toggle('hidden');
		document.querySelector('.menu').classList.toggle('hidden');
		
		
		if(document.querySelector('.key')){
			document.querySelector('.key').classList.toggle('hidden');
		}

		if(graphDiv.classList.contains('hidden')){
			chartLink.innerHTML = 'Back';
			desc.innerHTML =  '<h1 id="select-chart">Select a chart</h1>';
		}
		else{
			chartLink.innerHTML = 'Charts';
			desc.innerHTML = content;
		}

	}
}