var width = 700;
var height = 700;

var mapWidth = 7;
var mapHeight = 7;

/*
Directions :
	GAUCHE = 0
	HAUT = 1
	DROITE = 2
	BAS = 3
*/
var direction = 0; // direction regardée
var rotDir = 0; // 0, rotation à gauche, 1=rotation à droite
var moving = false;
var rot = false;
// bool pour arrêt des animations
var moveCpt = 0;
var rotCpt = 0; 

function init() {
	//scene et rendu
	var scene = new THREE.Scene();
	var cam = new THREE.PerspectiveCamera(45,width/height, 0.1,1000);
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width,height);

	document.body.appendChild(renderer.domElement);

	//lumieres
	var ambient = new THREE.AmbientLight({color: 0xffffff});
	var dlight = new THREE.DirectionalLight({color: 0xffffff});
	dlight.position.set(8, 35, 13);

	//objets
	var geometry = new THREE.BoxGeometry(0.8,0.8,0.8);
	var material = new THREE.MeshPhongMaterial({color: 0xaa0000});
	var cube = new THREE.Mesh(geometry, material);
	
	var plan = new THREE.BoxGeometry(mapWidth,1,mapHeight);
	var solmat = new THREE.MeshPhongMaterial({color: 0x0000ff});
	var sol = new THREE.Mesh(plan, solmat);
	
	//ajouts et positionnements
	scene.add(sol);
	scene.add(cube);
	scene.add(ambient);
	scene.add(dlight);
	
	sol.position.y = -0.5;
	cube.position.y = 0.5;
	sol.position.x = mapWidth / 2 - 0.5;
	sol.position.z = mapHeight / 2 - 0.5;
	
	randomPosition();
		
		
	renderer.render(scene,cam);
	animate();
	
	// position aléatoire sur le plateau
	function randomPosition() {
		var x = Math.floor(Math.random() * Math.floor(mapWidth));
		cube.position.x = x;
		
		var z = Math.floor(Math.random() * Math.floor(mapHeight));
		cube.position.z = z;	
		
		direction = Math.floor(Math.random() * Math.floor(4));
		
		// réglages cam
		cam.position.y = 9;
		cam.position.x = x;
		cam.position.z = z;
		cam.lookAt(new THREE.Vector3(x,0,z));
		cam.rotation.z = THREE.Math.degToRad(90 - (90*direction));
		
		debugDir();
		console.log("Position :"); console.log(cube.position);
		console.log("\n");
	}	
	
	function animate(){
		requestAnimationFrame(animate);
		renderer.render(scene,cam);
	}
	
	// déplacement
	function move() {
		moving = true;
		if(direction == 0) {
			if(cube.position.x <= 0) {
				cube.position.x = mapWidth;
				cam.position.x  = mapWidth; 
			}
			cube.position.x -= 0.1;
			cam.position.x -= 0.1;
		}
		else if(direction == 1) {
			if(cube.position.z <= 0) {
				cube.position.z = mapHeight;
				cam.position.z  = mapHeight; 
			}
			cube.position.z -= 0.1;
			cam.position.z -= 0.1;
		}
		else if(direction == 2) {
			if(cube.position.x >= mapWidth - 1) {
				cube.position.x = -1;
				cam.position.x  = -1; 
			}
			cube.position.x += 0.1;
			cam.position.x += 0.1;
		}
		else if(direction == 3) {
			if(cube.position.z >= mapHeight - 1) {
				cube.position.z = -1;
				cam.position.z  = -1; 
			}
			cube.position.z += 0.1;
			cam.position.z += 0.1;
		}
		
		moveCpt += 0.1;
		
		// corrige pb de precision
		moveCpt = roundNumber(moveCpt,1);
		cube.position.x = roundNumber(cube.position.x,1);
		cube.position.z = roundNumber(cube.position.z,1);
		cam.position.x = roundNumber(cam.position.x,1);
		cam.position.z = roundNumber(cam.position.z,1);
		
		if(moveCpt >= 1) {
			moving = false;
			moveCpt = 0;
			console.log(cube.position);
			console.log("\n");
		}
		else requestAnimationFrame(move);			
	}
	
	// pour changement de direction
	function rotate() {
		rot = true;
		if(rotDir == 0) {
			rotCpt += THREE.Math.degToRad(10);
			cube.rotation.y += THREE.Math.degToRad(10);
			cam.rotation.z += THREE.Math.degToRad(10);
		}
		else {
			rotCpt += THREE.Math.degToRad(10);
			cube.rotation.y -= THREE.Math.degToRad(10);
			cam.rotation.z += THREE.Math.degToRad(-10);
		}
		
		if(rotCpt >= THREE.Math.degToRad(90)) {
			if(rotDir == 0) direction = mod(direction-1,4);
			else direction = mod(direction+1,4);
			debugDir();
			rot = false;
			rotCpt = 0;
		}
		else requestAnimationFrame(rotate);			
	}
	
	// modulo fonctionnant sur les negatifs
	function mod(n, m) {
		var remain = n % m;
		return Math.floor(remain >= 0 ? remain : remain + m);
	};
	
	// fonction corrigeant le pb de precision des flottants
	function roundNumber(number, decimals) {
		var newnumber = new Number(number+'').toFixed(parseInt(decimals));
		return parseFloat(newnumber); 
	}
	
	// écouteur clavier
	document.addEventListener("keydown", keyPressed);
	function keyPressed(e){
		// on vérifie qu'une animation ne soit pas déjà en cours
		if(!moving && !rot) {
			switch(e.code) {
				case "ArrowUp":
					console.log("Nouveau déplacement");
					console.log(cube.position);
					move();
					break;
				/*
				case "ArrowDown":
				
					break;
				*/
				case "ArrowLeft":
					rotDir = 0;
					rotate();
					break;
				case "ArrowRight":
					rotDir = 1;
					rotate();
					break;
				case "Space":
					console.log("Nouveau déplacement");
					console.log(cube.position);
					cube.position.x = 3;
					cube.position.z = 3;
					cam.position.x = 3;
					cam.position.z = 3;
					console.log(cube.position);
					break;
			}
		}
	}
	
	function debugDir() {
		if(direction == 0) {
			console.log("Direction : "+direction+" (GAUCHE)");
		}
		else if(direction == 1) {
			console.log("Direction : "+direction+" (HAUT)");
		}
		else if(direction == 2) {
			console.log("Direction : "+direction+" (DROITE)");
		}
		else if(direction == 3) {
			console.log("Direction : "+direction+" (BAS)");
		}
	}

}

  
	
  




