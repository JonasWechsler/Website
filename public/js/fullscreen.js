var controlsSelector = "controls",
	controls = document.getElementsByClassName("controls")[0],
	inputs = controls.getElementsByTagName("input"),
	ranges = findRangesArray();

function findRangesArray(){
	var ranges = [];
	for(var i=0;i<inputs.length;i++){
		if(inputs[i].type === "range")
			ranges.push(inputs[i]);
	}
	return ranges;
}
function addRange(description, min,max,step,callback){
	if(!step)
		var step = 1;
	if(!callback)
		var callback = function(val){return val}
	var range = document.createElement("input");
	range.type="range";
	range.min = min;
	range.max = max;
	range.step = step;

	var rangeDescription = document.createElement("div");
	if(description.length > 0){
		rangeDescription.innerHTML = description;
		controls.appendChild(rangeDescription);
	}
	var rangeLabel = document.createElement("label");
	range.display = rangeLabel;

	function setLabel(){
		range.display.innerHTML = callback(this.value);
	}

	range.onchange = setLabel;
	range.oninput = setLabel;
	

	controls.appendChild(range);
	controls.appendChild(rangeLabel);
	controls.appendChild(document.createElement("br"));
	ranges = findRangesArray();
}
function addElement(dom){
	controls.appendChild(dom);
}
function getTextareaArray(){
	return controls.getElementsByTagName("textarea");
}
function setRange(idx, val){
	ranges[idx].value = val;
	ranges[idx].onchange();
}
function getRange(idx){
	return ranges[idx];
}
function setTextarea(idx,val){
	getTextareaArray()[idx].value = val;
}
function getTextarea(idx){
	return getTextareaArray()[idx];
}
function maximize(){
	var canvas = document.getElementById("draw");
	canvas.width = screen.width;
	canvas.height = screen.height;
	if(canvas.oldImageData)
		canvas.getContext("2d").putImageData(canvas.oldImageData,0,0);
	document.getElementById("resize").innerHTML='&#xf066;';
}
function minimize(){
	var canvas = document.getElementById("draw");
	var ctx = canvas.getContext("2d");
	canvas.oldImageData = ctx.getImageData(0,0,canvas.width,canvas.height);
	canvas.width = 500;
	canvas.height = 500;
	ctx = canvas.getContext("2d");
	ctx.putImageData(canvas.oldImageData,0,0);
	document.getElementById("resize").innerHTML='&#xf065;';
}
function toggleSize(){
	if(document.getElementById("draw").width === 500){
		maximize();
	}else{
		minimize();
	}
}

function disableResize(){
	maximize = null;
	minimize = null;
	document.getElementById("resize").classList.add("disabled");	
}

function disableCanvas(){
	document.getElementById("draw").remove();
}

function updateResizeIcon(){ 
	if(document.getElementById("draw").width === screen.width){
		document.getElementById("resize").innerHTML='&#xf066;';
	}else{
		document.getElementById("resize").innerHTML='&#xf065;';
	}
}
updateResizeIcon();
document.getElementById("resize").onclick = toggleSize;
