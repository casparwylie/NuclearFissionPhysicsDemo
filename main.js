$(function(){
	var contWidth = $("#webGL-container").width();
	var contHeight = $("#webGL-container").height();
	
	var scene = new THREE.Scene();
	
	var renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(contWidth,contHeight);
	renderer.setClearColor( 0x000000, 1);
	
	$('#webGL-container').append(renderer.domElement);
	
	//camera 
	var camera = new THREE.PerspectiveCamera(45, contWidth/contHeight, 0.1, 10000);
	camera.position.set(0,80,400);
	
	controls = new THREE.OrbitControls( camera );
	controls.addEventListener( 'change', renderer );
	
	//light
	var pointLight = new THREE.PointLight(0xffffff, 1.5);
	pointLight.position.set(-200, camera.position.y, camera.position.z);
	pointLight.rotation.x = camera.rotation.x;
	scene.add(pointLight);
	
	//plane
	var planeGeo = new THREE.CubeGeometry(300,300, 300,2,2,2,2);
	var planeMat = new THREE.MeshBasicMaterial({color: 0x898989, transparent: true, opacity: 0.0});
	var	plane = new THREE.Mesh(planeGeo, planeMat);
	plane.rotation.x = -1.5708;
	scene.add(plane);
	
	//initial neutron
	var allNeutrons = [];
	
	function produceNeutron(x,y,z){
		var neutronGeo = new THREE.SphereGeometry(2, 30,30);
		var neutronMat = new THREE.MeshLambertMaterial({color: 0xCA00AC});
		allNeutrons[allNeutrons.length] = new THREE.Mesh(neutronGeo, neutronMat);
		var i = allNeutrons.length-1;
		allNeutrons[i].position.set(x,y,z);
		allNeutrons[i].dx = Math.random() * 6 + 3;
		allNeutrons[i].dy = Math.random() * 6 + 3;
		allNeutrons[i].dz = Math.random() * 6 + 3;
		
		if(Math.random() < 0.5){
			allNeutrons[i].dx = -allNeutrons[i].dx;
		}
		if(Math.random() < 0.5){
			allNeutrons[i].dy = -allNeutrons[i].dy;
		}
		if(Math.random() < 0.5){
			allNeutrons[i].dz = -allNeutrons[i].dz;
		}
		
		scene.add(allNeutrons[allNeutrons.length-1]);
	}
	
	
	//render starting neutrons
	for(var i = 0; i<=6;i++){
		var rand = generateRandPos3D(150, 1, true);
		produceNeutron(rand.X,rand.Y,rand.Z);
	}
	//target nucleus

	
	function generateRandPos3D(max, min, useNegative){
		
		var posX = (Math.random() * max) + 1;
		var posZ = (Math.random() * max) + 1;
		var posY = (Math.random() * max) + 1;
		
		if(useNegative == true){
			if(Math.floor(posX)%2==0){
				posX = -Math.abs(posX);
			}
			if(Math.floor(posZ)%2==0){
				posZ = -Math.abs(posZ);
			}
			
			if(Math.floor(posY)%2==0){
				posY = -Math.abs(posY);
			}
			
		}

		
		return {"X":posX,"Y":posY,"Z":posZ};
	}
	
	function produceNucleus(nucleusParticles, particleDensity, colors){
		var nucleus = [];
		var particleGeo = new THREE.SphereGeometry(1, 30,30);
		var nucleusGroup = new THREE.Group();
		if(colors==undefined){
			var colors = [0xFF0000, 0x52ADC0];
		}	
		for(var i = 0;i<=nucleusParticles;i++){
			var randColor = colors[Math.floor((Math.random() * colors.length) + 0)];
			var particleMat = new THREE.MeshLambertMaterial({color: randColor});
			nucleus[i] = new THREE.Mesh(particleGeo, particleMat);
		
			//particle positioning
			particlePosition = generateRandPos3D(particleDensity,1, false);
			nucleus[i].position.set(particlePosition.X, particlePosition.Y, particlePosition.Z);
			nucleusGroup.add(nucleus[i]);

		}	
		
		return nucleusGroup;
	}
	
	function inArray(needle, haystack) {
		var length = haystack.length;
		for(var i = 0; i < length; i++) {
			if(haystack[i] == needle) return true;
		}
		return false;
	}
	
	var nucleusQuant = 150;
	allNucleus = [];
	for(var nCount = 0;nCount<=nucleusQuant;nCount++){
	
		var nucleusGroup = produceNucleus(50,10);
		var nucleusPosition = generateRandPos3D(130, 1, true);
		nucleusGroup.position.set(nucleusPosition.X, nucleusPosition.Y, nucleusPosition.Z);
		scene.add(nucleusGroup);
		allNucleus[nCount] = nucleusGroup;
	}
	
	allNucleus[10].position.set(-50, 60, 0);
	allNucleus[16].position.set(-10, 55, 35);
	
	var counter = 0;
	var nucToMove = [];
	var count = 0;
	function animate(){
		
		for(var i in allNeutrons){
			
			allNeutrons[i].position.x += allNeutrons[i].dx * 0.2;
			allNeutrons[i].position.y += allNeutrons[i].dy * 0.2;
			allNeutrons[i].position.z += allNeutrons[i].dz * 0.2;
			
			if(allNeutrons[i].position.x > 149){
				allNeutrons[i].dx = -Math.abs(allNeutrons[i].dx);
			}else if(allNeutrons[i].position.x < -149){
				allNeutrons[i].dx = Math.abs(allNeutrons[i].dx);
			}
			
			if(allNeutrons[i].position.y > 149){
				allNeutrons[i].dy = -Math.abs(allNeutrons[i].dy);
			}else if(allNeutrons[i].position.y < -149){
				allNeutrons[i].dy = Math.abs(allNeutrons[i].dy);
			}
			
			if(allNeutrons[i].position.z > 149){
				allNeutrons[i].dz = -Math.abs(allNeutrons[i].dz);
			}else if(allNeutrons[i].position.z < -149){
				allNeutrons[i].dz = Math.abs(allNeutrons[i].dz);
			}
			
		
		}
		count += 0.01;
		
		for(var i in nucToMove){
			nucToMove[i].nucleus.position.x += 0.1;
			nucToMove[i].nucleus.position.y += 0.1;
			if(i%2==0){
				nucToMove[i].nucleus.position.z -= 0.1;
			}
			nucToMove[i].inc += 0.1;
			var distLimit = (Math.random() * 100) + 20;
			if((nucToMove[i].inc)>distLimit){
				nucToMove.splice(i,1);
			}
		}
		
		for(var i in allNucleus){
			var rand1_10 = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
			var nucRotation = parseFloat(("0.00")+(rand1_10.toString()));
			if(i%2==0){
				allNucleus[i].rotation.x += nucRotation;
			}else{
				allNucleus[i].rotation.y += nucRotation;
			}
			for(var x in allNeutrons){
				var dist = allNeutrons[x].position.distanceTo(allNucleus[i].position);
				if(dist<12&&dist>11.9){
					var newNucleus1 = produceNucleus(20, 4, [0xFF00C7, 0x00FF1E]); 
					var newNucleus2 = produceNucleus(20, 4, [0xFDFF00, 0x1B33E5]); 
			
					newNucleus1.position.set(allNucleus[i].position.x, allNucleus[i].position.y, allNucleus[i].position.z+10);
					newNucleus2.position.set(allNucleus[i].position.x, allNucleus[i].position.y, allNucleus[i].position.z);
					
					allNucleus[allNucleus.length] = newNucleus1;
					allNucleus[allNucleus.length] = newNucleus2;
					scene.add(allNucleus[allNucleus.length-1]);
					scene.add(allNucleus[allNucleus.length-2]);
					
					nucToMove.push({"nucleus":allNucleus[allNucleus.length-1], "inc":0});
					nucToMove.push({"nucleus":allNucleus[allNucleus.length-2], "inc":0});
					
					produceNeutron(allNucleus[i].position.x, allNucleus[i].position.y, allNucleus[i].position.z + 40);
					
					scene.remove(allNucleus[i]);		
				}
			}	
		}
		
		renderer.render(scene, camera);
		
		requestAnimationFrame(animate);
		counter++;
	}
	animate();
});