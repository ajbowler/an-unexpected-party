// _       _         _                                       _          
//( )  _  ( )       (_ )                                    ( )_        
//| | ( ) | |   __   | |    ___    _     ___ ___     __     | ,_)   _   
//| | | | | | /'__`\ | |  /'___) /'_`\ /' _ ` _ `\ /'__`\   | |   /'_`\ 
//| (_/ \_) |(  ___/ | | ( (___ ( (_) )| ( ) ( ) |(  ___/   | |_ ( (_) )
//`\___x___/'`\____)(___)`\____)`\___/'(_) (_) (_)`\____)   `\__)`\___/'
//                                                                      
//                                                                      
// _    _                                    _           _ 
//( )_ ( )                                  ( )_        ( )
//| ,_)| |__     __      _ _      _ _  _ __ | ,_) _   _ | |
//| |  |  _ `\ /'__`\   ( '_`\  /'_` )( '__)| |  ( ) ( )| |
//| |_ | | | |(  ___/   | (_) )( (_| || |   | |_ | (_) || |
//`\__)(_) (_)`\____)   | ,__/'`\__,_)(_)   `\__)`\__, |(_)
//                      | |                      ( )_| |(_)
//                      (_)                      `\___/'   

// Image
var imagePath = "../images/sexyPhoto.jpg";
var images = [ imagePath, imagePath, imagePath, imagePath, imagePath, imagePath ];

var robots = [];

function getRandomInt(min, max)
{
	return Math.floor(Math.random() * (max - min)) + min;
}

// //////////////////////////////////////////////////////////////////
// STEVE'S CODE //
// //////////////////////////////////////////////////////////////////

var axis = 'z';
var paused = false;
var camera;

// translate keypress events to strings
// from http://javascript.info/tutorial/keyboard-events
function getChar(event)
{
	if (event.which == null)
	{
		return String.fromCharCode(event.keyCode) // IE
	}
	else if (event.which != 0 && event.charCode != 0)
	{
		return String.fromCharCode(event.which) // the rest
	}
	else
	{
		return null // special key
	}
}

function cameraControl(c, ch)
{
	var distance = c.position.length();
	var q, q2;

	switch (ch)
	{
	// camera controls
	case 'w':
		c.translateZ(-100);
		return true;
	case 'a':
		c.translateX(-100);
		return true;
	case 's':
		c.translateZ(100);
		return true;
	case 'd':
		c.translateX(100);
		return true;
	case 'r':
		c.translateY(100);
		return true;
	case 'f':
		c.translateY(100);
		return true;
	case 'j':
		// need to do extrinsic rotation about world y axis, so multiply
		// camera's quaternion
		// on left
		q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),
				5 * Math.PI / 180);
		q2 = new THREE.Quaternion().copy(c.quaternion);
		c.quaternion.copy(q).multiply(q2);
		return true;
	case 'l':
		q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),
				-5 * Math.PI / 180);
		q2 = new THREE.Quaternion().copy(c.quaternion);
		c.quaternion.copy(q).multiply(q2);
		return true;
	case 'i':
		// intrinsic rotation about camera's x-axis
		c.rotateX(5 * Math.PI / 180);
		return true;
	case 'k':
		c.rotateX(-5 * Math.PI / 180);
		return true;
	case 'O':
		c.lookAt(new THREE.Vector3(0, 0, 0));
		return true;
	case 'S':
		c.fov = Math.min(80, c.fov + 5);
		c.updateProjectionMatrix();
		return true;
	case 'W':
		c.fov = Math.max(5, c.fov - 5);
		c.updateProjectionMatrix();
		return true;

		// alternates for arrow keys
	case 'J':
		// this.orbitLeft(5, distance)
		c.translateZ(-distance);
		q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),
				5 * Math.PI / 180);
		q2 = new THREE.Quaternion().copy(c.quaternion);
		c.quaternion.copy(q).multiply(q2);
		c.translateZ(distance)
		return true;
	case 'L':
		// this.orbitRight(5, distance)
		c.translateZ(-distance);
		q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),
				-5 * Math.PI / 180);
		q2 = new THREE.Quaternion().copy(c.quaternion);
		c.quaternion.copy(q).multiply(q2);
		c.translateZ(distance)
		return true;
	case 'I':
		// this.orbitUp(5, distance)
		c.translateZ(-distance);
		c.rotateX(-5 * Math.PI / 180);
		c.translateZ(distance)
		return true;
	case 'K':
		// this.orbitDown(5, distance)
		c.translateZ(-distance);
		c.rotateX(5 * Math.PI / 180);
		c.translateZ(distance)
		return true;
	}
	return false;
}

function handleKeyPress(event)
{
	var ch = getChar(event);
	if (cameraControl(camera, ch))
		return;
}

// //////////////////////////////////////////////////////////////////
// STEVE'S CODE //
// //////////////////////////////////////////////////////////////////

function start()
{
	window.onkeypress = handleKeyPress;

	var scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, 1.5, 0.1, 500000);
	camera.position.x = 5000;
	camera.position.y = 3500;
	camera.position.z = -3500;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	var ourCanvas = document.getElementById('theCanvas');
	var renderer = new THREE.WebGLRenderer(
	{
		canvas : ourCanvas
	});

	// ///////////////////////////////////////////////////////////////////
	// SKYBOX //
	// ///////////////////////////////////////////////////////////////////
	var ourCubeMap = THREE.ImageUtils.loadTextureCube(images);
	var cubeMapShader = THREE.ShaderLib["cube"];
	cubeMapShader.uniforms["tCube"].value = ourCubeMap;
	var material = new THREE.ShaderMaterial(
	{
		fragmentShader : cubeMapShader.fragmentShader,
		vertexShader : cubeMapShader.vertexShader,
		uniforms : cubeMapShader.uniforms,
		side : THREE.DoubleSide
	});

	var geometry = new THREE.BoxGeometry(20000, 20000, 20000);

	// Create a mesh for the object, using the cube shader as the material
	var cube = new THREE.Mesh(geometry, material);
	cube.scale.set(5, 5, 5);

	// Add it to the scene
	scene.add(cube);

	// ///////////////////////////////////////////////////////////////////
	// LIGHTS //
	// ///////////////////////////////////////////////////////////////////

	var light = new THREE.PointLight(0xffffff, 1.0);
	light.position.set(3000, 1000, 0);
	scene.add(light);
	var light = new THREE.PointLight(0xffffff, 1.0);
	light.position.set(-700, 1200, -2000);
	scene.add(light);
	var light = new THREE.PointLight(0xffffff, 1.0);
	light.position.set(3000, 1000, -3000);
	scene.add(light);
	var light = new THREE.PointLight(0xffffff, 1.0);
	light.position.set(-3000, 1000, -3000);
	scene.add(light);

	light = new THREE.AmbientLight(0x555555);
	scene.add(light);

	// ///////////////////////////////////////////////////////////////////
	// MODEL //
	// ///////////////////////////////////////////////////////////////////

	var manager = new THREE.LoadingManager();
	manager.onProgress = function(item, loaded, total)
	{
	};

	var onProgress = function(xhr)
	{
	};

	var onError = function(xhr)
	{
	};

	var loader = new THREE.OBJMTLLoader();
	loader.load('../objects/mus001.obj', '../objects/mus001.mtl', function(
			object)
	{

		object.position.x = 0;
		object.position.y = 0;
		object.position.z = 0;
		object.rotation.x -= 90 * Math.PI / 180;
		scene.add(object);

	}, onProgress, onError);

	// ///////////////////////////////////////////////////////////////////
	// OBJECTS //
	// ///////////////////////////////////////////////////////////////////

	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshPhongMaterial(
	{
		color : 0xcc0000,
		ambient : 0xcc0000,
		specular : 0x050505,
		shininess : 150
	});

	var robotDummy = new THREE.Object3D();

	var robotTorsoDummy = new THREE.Object3D();
	robotDummy.add(robotTorsoDummy);
	var robotTorso = new THREE.Mesh(geometry, material);
	robotTorso.scale.set(80, 200, 40);
	robotTorsoDummy.add(robotTorso);

	var robotHeadDummy = new THREE.Object3D();
	robotTorsoDummy.add(robotHeadDummy);
	robotHeadDummy.position.set(0, 150, 0);

	var geometry = new THREE.SphereGeometry(50, 32, 32);
	var robotHead = new THREE.Mesh(geometry, material);
	robotHeadDummy.add(robotHead);

	var geometry = new THREE.BoxGeometry(20, 150, 20);
	var robotRightArmDummy = new THREE.Object3D();
	var robotLeftArmDummy = new THREE.Object3D();
	robotTorsoDummy.add(robotRightArmDummy);
	robotTorsoDummy.add(robotLeftArmDummy);
	var robotRightArm = new THREE.Mesh(geometry, material);
	var robotLeftArm = new THREE.Mesh(geometry, material);
	robotRightArmDummy.position.set(50, 100, 0);
	robotLeftArmDummy.position.set(-50, 100, 0);
	robotRightArmDummy.add(robotRightArm);
	robotRightArm.position.set(0, -60, -30);
	robotLeftArmDummy.add(robotLeftArm);
	robotLeftArm.position.set(0, -60, -30);
	robotRightArmDummy.rotation.x -= 90 * Math.PI / 180;
	robotLeftArmDummy.rotation.x -= 90 * Math.PI / 180;

	var robotRightLegDummy = new THREE.Object3D();
	var robotLeftLegDummy = new THREE.Object3D();
	robotTorsoDummy.add(robotRightLegDummy);
	robotTorsoDummy.add(robotLeftLegDummy);
	var robotRightLeg = new THREE.Mesh(geometry, material);
	var robotLeftLeg = new THREE.Mesh(geometry, material);
	robotRightLegDummy.position.set(30, -175, 0);
	robotLeftLegDummy.position.set(-30, -175, 0);
	robotRightLegDummy.add(robotRightLeg);
	robotLeftLegDummy.add(robotLeftLeg);

	var geometry = new THREE.CylinderGeometry(0, 40, 100, 100);
	var material = new THREE.MeshPhongMaterial(
	{
		map : THREE.ImageUtils.loadTexture("../images/partyHatPattern.png")
	});

	var robotPartyHatDummy = new THREE.Object3D();
	robotHeadDummy.add(robotPartyHatDummy);
	var robotPartyHat = new THREE.Mesh(geometry, material);
	robotPartyHatDummy.position.set(0, 85, 0);
	robotPartyHatDummy.add(robotPartyHat);

	robotDummy.scale.set(4, 4, 4);

	// Here we're going to create a number of partying robots with randomized
	// positions around the piano.

	for (var i = 0; i < 10; i++)
	{
		var robot = robotDummy.clone();
		robot.position.x = getRandomInt(-4000, 4000);
		robot.position.y = getRandomInt(-4000, 4000);
		robot.position.z = getRandomInt(-4000, 4000);
		robots.push(robot);
	}

	for (var i = 0; i < 10; i++)
	{
		scene.add(robots[i]);
	}

	// ///////////////////////////////////////////////////////////////////
	// RENDER //
	// ///////////////////////////////////////////////////////////////////

	var render = function()
	{
		requestAnimationFrame(render);

		var increment = 10 * Math.PI / 180;
		for (var i = 0; i < 10; i++)
		{
			robots[i].rotation.y += increment;
		}
		renderer.render(scene, camera);
	};

	render();
}