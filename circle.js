var canvas = document.getElementById('my_Canvas');
var gl = canvas.getContext('experimental-webgl');
		 
var width = canvas.getAttribute("width"), height = canvas.getAttribute("height");

//all possible colours to randomly choose from
/*var colours = [
	[0,0,1,1],
	[1,0,0,1],
	[0,1,0,1],
	[1,0,1,1]
]*/

// Fullscreen if not set
if (width) {
    gl.maxWidth = width;
}

if (height) {
    gl.maxHeight = height;
}

/*======= Defining and storing the geometry ======*/


// Create an empty buffer object
var vertex_buffer = gl.createBuffer();
var vertices = []; 
var vertCount = 2;
		 
for(var i=0.0; i<=360; i+=1){
	var j = i * Math.PI / 180;
		
	var vert1 = [
		Math.sin(j),
		Math.cos(j),
	];
		
	var vert2 = [
		0,
		0,
	];
		
	vertices = vertices.concat(vert1);
	vertices = vertices.concat(vert2);
}
var n = vertices.length/vertCount;
	

// Bind appropriate array buffer to it
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
      
// Pass the vertex data to the buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

// Unbind the buffer
gl.bindBuffer(gl.ARRAY_BUFFER, null);

/*=================== Shaders ====================*/

function createShaders(colour){
	// Vertex shader source code
    var vertCode =
        'attribute vec3 coordinates;' +
        'void main(void) {' +
        ' gl_Position = vec4(coordinates, 1.0);' +
        '}';

    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);

    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);

    // Compile the vertex shader
    gl.compileShader(vertShader);

    // Fragment shader source code
    var fragCode =
        'void main(void) {' +
        'gl_FragColor = vec4('+colour[0]+', '+colour[1]+', '+colour[2]+', '+colour[3]+');' +
         '}';

    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode);

    // Compile the fragmentt shader
    gl.compileShader(fragShader);

    // Create a shader program object to store
    // the combined shader program
    var shaderProgram = gl.createProgram();

    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader);

    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);

    // Link both the programs
    gl.linkProgram(shaderProgram);

    // Use the combined shader program object
    gl.useProgram(shaderProgram);
		 
	/*======= Associating shaders to buffer objects ======*/

    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, vertCount, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);
}



// Clear the canvas
gl.clearColor(0.5, 0.5, 0.5, 0.9);

// Enable the depth test
gl.enable(gl.DEPTH_TEST);
		
//Clear the color and depth buffer
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
for(var i = 0; i < 10; i++){
	drawBacteria();
}

drawMainCircle();
		 
		 
function drawMainCircle(){
	createShaders([0,0,0,0]);
	// Set the view port
	gl.viewport(canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.8, canvas.height * 0.8);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
		 
function drawBacteria() {
	//var randomColour = Math.floor(Math.random() * 4);
	createShaders(getRandomColour());
	var coord = getRandomLoc();
	console.log(coord[1]);
				
	gl.viewport(coord[0]-50,coord[1]-50,100,100);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
		 
function getRandomLoc(){
    var rand = Math.floor(20 * Math.random()) / 20.0;
	var angle = (rand*Math.PI*2);
	var coord = [2];

	coord[0] = canvas.width / 2 + canvas.width * 0.8/2 * Math.cos(-angle);
	console.log(coord[0]);
	coord[1] = canvas.height / 2 + canvas.height * 0.8/2 * Math.sin(-angle);
	return coord;
}

function getRandomColour(min, max)
{
    //Random Colour
    min = 0.2;
    max = 0.8;
    colour = [min, max, Math.random() * (max - min) + min, 1];
    pos = Math.floor(Math.random() * 3);
    p = colour[0];
    colour[0] = colour[pos];
    colour[pos] = p;
    pos = Math.floor(Math.random() * 2 + 1);
    p = colour[1];
    colour[1] = colour[pos];
    colour[pos] = p;

    console.log(colour);

    return colour;
}

var canvasLeft = canvas.offsetLeft, canvasTop = canvas.offsetTop;

canvas.addEventListener('click', function(event){
	var x = event.pageX - canvasLeft;
	var y = event.pageY - canvasTop;
	
	console.log(x + " "+ y);
});
