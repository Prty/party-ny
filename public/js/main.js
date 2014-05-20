var camera, scene, renderer;
var controls;

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 3000;

	scene = new THREE.Scene();

	// table

	for ( var i = 0; i < table.length; i += 6 ) {

		var element = document.createElement( 'div' );
		element.className = 'element';
		element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

		var number = document.createElement( 'div' );
		number.className = 'number';
		number.textContent = table[i + 3];
		// number.textContent = (i/5) + 1;
		element.appendChild( number );

		var symbol = document.createElement( 'div' );
		symbol.className = 'symbol ';
		// symbol.className = 'symbol ' + table[i + 3];
		symbol.textContent = table[ i ];
		element.appendChild( symbol );

		var details = document.createElement( 'div' );
		details.className = 'details';
		details.innerHTML = table[ i + 1 ] + '<br>' + table[ i + 2 ];
		element.appendChild( details );

		var image = document.createElement( 'img' );
		image.className = 'img';
		image.src = 'assets/projects/thumbnails/' + table[i + 5];
		element.appendChild( image );

		console.log(table[i + 5]);

		var object = new THREE.CSS3DObject( element );
		object.position.x = Math.random() * 4000 - 2000;
		object.position.y = Math.random() * 4000 - 2000;
		object.position.z = Math.random() * 4000 - 2000;
		scene.add( object );

		objects.push( object );

		//

		var object = new THREE.Object3D();
		object.position.x = ( table[ i + 3 ] * 140 ) - 1330;
		object.position.y = - ( table[ i + 4 ] * 180 ) + 990;

		targets.table.push( object );

	}

	// sphere

	var vector = new THREE.Vector3();

	for ( var i = 0, l = objects.length; i < l; i ++ ) {

		var phi = Math.acos( -1 + ( 2 * i ) / l );
		var theta = Math.sqrt( l * Math.PI ) * phi;

		var object = new THREE.Object3D();

		object.position.x = 200 * Math.cos( theta ) * Math.sin( phi );
		object.position.y = 200 * Math.sin( theta ) * Math.sin( phi );
		object.position.z = 200 * Math.cos( phi );

		vector.copy( object.position ).multiplyScalar( 2 );

		object.lookAt( vector );

		targets.sphere.push( object );

	}

	// helix

	var vector = new THREE.Vector3();

	for ( var i = 0, l = objects.length; i < l; i ++ ) {

		var phi = i;

		console.log(phi);

		var object = new THREE.Object3D();

		object.position.x = 500 * Math.sin( phi );
		object.position.y = - ( i / 1 ) + 100;
		object.position.z = 500 * Math.cos( phi );

		vector.x = object.position.x * 10;
		vector.y = object.position.y;
		vector.z = object.position.z * 10;

		object.lookAt( vector );

		targets.helix.push( object );

	}

	// var vector = new THREE.Vector3();

	// for ( var i = 0, l = objects.length; i < l; i ++ ) {

	// 	var phi = i * 0.175 + Math.PI + 100;

	// 	console.log(phi)

	// 	var object = new THREE.Object3D();

	// 	object.position.x = 900 * Math.sin( phi );
	// 	object.position.y = - ( i * 8 ) + 300;
	// 	object.position.z = 900 * Math.cos( phi ) + 1000;

	// 	vector.x = object.position.x * 2;
	// 	vector.y = object.position.y;
	// 	vector.z = object.position.z * 2;

	// 	object.lookAt( vector );

	// 	targets.helix.push( object );

	// }

	// grid

	for ( var i = 0; i < objects.length; i ++ ) {

		var object = new THREE.Object3D();

		object.position.x = ( ( i % 3 ) * 300 ) - 400;
		object.position.y = ( - ( Math.floor( i / 3 )) * 300 ) + 400;
		object.position.z = ( Math.floor( i / 25 ) );

		targets.grid.push( object );

	}

	//

	renderer = new THREE.CSS3DRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.position = 'absolute';
	document.getElementById( 'container' ).appendChild( renderer.domElement );

	//

	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.rotateSpeed = 0.5;
	controls.minDistance = 1900;
	controls.maxDistance = 1900;
	controls.addEventListener( 'change', render );

	// var button = document.getElementById( 'table' );
	// button.addEventListener( 'click', function ( event ) {

	// 	transform( targets.table, 1000 );

	// }, false );

	// var button = document.getElementById( 'sphere' );
	// button.addEventListener( 'click', function ( event ) {

	// 	transform( targets.sphere, 1000 );

	// }, false );

	var button = document.getElementById( 'helix' );
	button.addEventListener( 'click', function ( event ) {

		transform( targets.helix, 1000 );

	}, false );

	var button = document.getElementById( 'grid' );
	button.addEventListener( 'click', function ( event ) {

		transform( targets.grid, 1000 );

	}, false );

	// initially sets the first animation of the items
	transform( targets.helix, 1000 );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function transform( targets, duration ) {

	TWEEN.removeAll();

	for ( var i = 0; i < objects.length; i ++ ) {

		var object = objects[ i ];
		var target = targets[ i ];

		new TWEEN.Tween( object.position )
			.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();

		new TWEEN.Tween( object.rotation )
			.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();

	}

	new TWEEN.Tween( this )
		.to( {}, duration * 2 )
		.onUpdate( render )
		.start();

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	render();

}

function animate() {

	requestAnimationFrame( animate );

	TWEEN.update();

	controls.update();

}

function render() {

	renderer.render( scene, camera );

}

function switchBg(item_number) {
	console.log(item_number);

	switch (item_number) {
		case '1':
			bg.css({'background-image': 'url("assets/projects/cut_copy.png")'});
			break;

		case '2':
			bg.css({'background-image': 'url("assets/projects/drake_weather.png")'});
			console.log(bg);
			break;

		case '3':
			bg.css({'background-image': 'url("assets/projects/sbtrkt.png")'});
			console.log(bg);
			break;
		case '4':
			bg.css({'background-image': 'url("assets/projects/banners.png")'});
			console.log(bg);
			break;

		case '5':
			bg.css({'background-image': 'url("assets/projects/super_important_tweet.png")'});
			console.log(bg);
			break;

		default:
			console.log('default!');
	}
}

function resetBg() {
	if (!item_active) {
		bg.css({'background': 'white', 'background-image': 'none'});
	}
}

//jquery dom manipulation

var project_items = $('.element'),
	bg = $('#bg-back'),
	item_active = false,
	hover_item,
	hover_item_number;

project_items.hover(function () {

	item_active			= true;
	hover_item 			= $(this);
	hover_item.addClass('active');
	hover_item_number	= hover_item[0].childNodes[0].innerHTML;
	
	// console.log(hover_item_number);

	switchBg(hover_item_number);
}).mouseleave(function () {
	hover_item.removeClass('active');
	item_active = false;
	setTimeout(function () {
		resetBg();
	}, 500);
});