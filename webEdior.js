
var camera, scene, renderer, control, orbit,group,focusObject,container;
var clock = new THREE.Clock();
var mixerArray   = [];
var locked = false;
var state = {
    translate:1,
    rotate:2,
}
var objectState = state.translate;
var focusLightObject ;
init();
animate();

function updatePositionX(id) {
    if(focusObject){
        focusObject.position.x =document.getElementById(id).value
    }
}

function updatePositionY(id) {
    if(focusObject){
        focusObject.position.y =document.getElementById(id).value
    }
}

function updatePositionZ(id) {
    if(focusObject){
        focusObject.position.z =document.getElementById(id).value
    }
}
function updatObjectName(id) {
    if(focusObject){
        focusObject.name =document.getElementById(id).value
    }
}
function lockObject() {
    locked = !locked;
}
function playScene() {		// 二维场景的事件添加
    // 禁用control、去掉辅助线、
    control.enabled = false;
}

function setCamera() {
    focusObject = camera;
    control.attach(camera);
    // showFocusObjectData(focusObject);
}
function updateLightColor (id){
    focusLightObject.color = new THREE.Color(document.getElementById(id).value);
}
function updateLightOpacity(id) {
    focusLightObject.intensity = document.getElementById(id).value;

}
function showFocusObjectData(object){
    // 位置信息
    document.getElementById('positionX').value = object.position.x;
    document.getElementById('positionY').value = object.position.y;
    document.getElementById('positionZ').value = object.position.z;

    // 模型名字信息
    document.getElementById('focusObjectName').value = object.name;
    // 相机对象信息
    document.getElementById('sceneCamera_fov').value = camera.fov;
    document.getElementById('sceneCamera_near').value = camera.near;
    document.getElementById('sceneCamera_far').value = camera.far;
    // 旋转
    document.getElementById('roationY').value = object.rotation.y * 360;

    // light
    document.getElementById('sceneLight_color').value = RGB2Hex(focusLightObject.color.getStyle());
    document.getElementById('sceneLight_opacity').value = focusLightObject.intensity;
}

function RGB2Hex(rgb){
    var re = rgb.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");//利用正则表达式去掉多余的部分
    var hexColor = "#";
    var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    for (var i = 0; i < 3; i++) {
        var r = null;
        var c = re[i];
        var hexAr = [];
        if (c > 15) {
            r = c % 16;
            c = (c / 16) >> 0;
            hexAr.push(hex[r]);
        }else{
            hexAr.push(0);
        }
        hexAr.push(hex[c])
        hexColor += hexAr.reverse().join('');
    }
    return hexColor;
}

function updateCameraFOV(id) {
    camera.fov = parseInt(document.getElementById(id).value) ;
    camera.updateProjectionMatrix ()
}
function updateCameraNear(id) {
    camera.near  = parseInt(document.getElementById(id).value);
    camera.updateProjectionMatrix ()
}
function updateCameraFar(id) {
    camera.far = parseInt(document.getElementById(id).value);
    camera.updateProjectionMatrix ()
}
function updateRotaitonY(id) {
    // 旋转当前对象
    if(focusObject){
        focusObject.rotation.y =document.getElementById(id).value;
    }

}


function init() {
    container = document.getElementById('viewport');
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor('#777777',1)
    container.appendChild( renderer.domElement );
    scene = new THREE.Scene();
    group = new THREE.Group();
    scene.add( group );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );
    camera.position.set( 1000, 20000, 10000 );
    camera.lookAt( 0, 200, 0 );
    // scene.add(camera);
    orbit = new THREE.OrbitControls( camera, container );
    orbit.maxPolarAngle = Math.PI / 2;		// 定义当前对象只能在水平面上
    orbit.maxDistance = 55000;
    orbit.minDistance = 2000;
    orbit.update();
    // orbit.addEventListener( 'change', render );

    control = new THREE.TransformControls( camera, container	 );
    // control.addEventListener( 'change', render );

    control.addEventListener( 'dragging-changed', function ( event ) {

        orbit.enabled = ! event.value;

    } );


    scene.add( control );
    console.log(scene);

    var direction_light = new THREE.DirectionalLight( 0xffffff, 1 );
    direction_light.position.set( 1, 1, 1 );
    focusLightObject = direction_light;
    scene.add( direction_light );

    var light = new THREE.AmbientLight( 0xcccccc ); // soft white light
    scene.add( light );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    var loader = new THREE.FBXLoader();

    $.getJSON('0703.json',function (json) {
        console.log(json);

        if(json.object &&json.object.length > 0 ){
            console.log('object');
            json.object.forEach(function (modelData) {
                console.log(modelData)
                loader.load( modelData.Path, function ( object ) {
                    object.name = modelData.Name;
                    if(modelData.Name != "floor"){
                        object.position.set(modelData.Position[0],object.position.y - 2000,modelData.Position[2]);
                        focusObject = object;
                        console.log(object);
                        showFocusObjectData(focusObject);
                        group.add(object);
                        bindLineHelper(object);
                        attachObject(object);
                    }else{
                        object.position.y -=2000
                        scene.add(object);
                    }

                    // var mixer = new AnimationMixer( object );
                    // var action = mixer.clipAction( object.animations[ 0 ] );
                    // action.play();
                    // mixerArray.push(mixer);
                    // object.name = modelData.name;
                    // object.position.set(modelData.position[0],modelData.position[1],modelData.position[2]);
                    // 主机颜色状态变化

                    // switch (modelData.state[0]) {
                    // 	case 0:
                    // 		object.children[9].material.color = new Color( 0x444444 );
                    // 		object.children[9].material.needsUpdate = true;
                    // 		break;
                    // 	case 1:
                    // 		break;
                    // 	case 2:
                    // 		object.children[9].material.color = new Color( 255,0,0 );
                    // 		object.children[9].material.needsUpdate = true;
                    // 		break;
                    // 	default:
                    // }
                    // // 包装机主机颜色状态变化
                    // switch (modelData.state[1]) {
                    // 	case "0":
                    // 		break;
                    // 	case "1":
                    // 		break;
                    // 	case "2":
                    // 		break;
                    // 	default:
                    // }
                    // // 包装机辅机颜色状态变化
                    // switch (modelData.state[2]) {
                    // 	case "0":
                    // 		break;
                    // 	case "1":
                    // 		break;
                    // 	case "2":
                    // 		break;
                    // 	default:
                    // }

                    scene.add(group);



                } );
            })
        }

    })

    // var grid = new GridHelper( 30000, 30, 0x444444, 0x666666);
    // scene.add( grid );

    //
    // var direction_light = new THREE.DirectionalLight( 0xffffff, 1 );
    // direction_light.position.set( 1, 1, 1 );
    // focusLightObject = direction_light;
    // scene.add( direction_light );
    //
    // var light = new THREE.AmbientLight( 0xcccccc ); // soft white light
    // scene.add( light );
    // light.position.set( 1, 1, 1 );
    // scene.add( light );
    //
    // var texture = new THREE.TextureLoader().load( 'textures/crate.gif' );
    // texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    //
    // var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    // var material = new THREE.MeshLambertMaterial( { map: texture, transparent: true } );
    //
    // var loader = new THREE.FBXLoader();
    // $.getJSON('0703.json',function (json) {
    // 	json.forEach(function (modelData) {
    // 		loader.load( modelData.path, function ( object ) {
    //
    // 			object.name = modelData.name;
    // 			if(modelData.name != "车间地形"){
    // 				focusObject = object;
    // 				object.position.set(modelData.position[0],object.position.y - 2000,modelData.position[2]);
    // 				showFocusObjectData(focusObject);
    // 				group.add(object);
    // 				bindLineHelper(object);
    // 			}else{
    // 				object.position.y -=2000
    // 				scene.add(object);
    // 			}
    // 			// var mixer = new AnimationMixer( object );
    // 			// var action = mixer.clipAction( object.animations[ 0 ] );
    // 			// action.play();
    // 			// mixerArray.push(mixer);
    // 			// object.name = modelData.name;
    // 			// object.position.set(modelData.position[0],modelData.position[1],modelData.position[2]);
    // 			// 主机颜色状态变化
    //
    // 			// switch (modelData.state[0]) {
    // 			// 	case 0:
    // 			// 		object.children[9].material.color = new Color( 0x444444 );
    // 			// 		object.children[9].material.needsUpdate = true;
    // 			// 		break;
    // 			// 	case 1:
    // 			// 		break;
    // 			// 	case 2:
    // 			// 		object.children[9].material.color = new Color( 255,0,0 );
    // 			// 		object.children[9].material.needsUpdate = true;
    // 			// 		break;
    // 			// 	default:
    // 			// }
    // 			// // 包装机主机颜色状态变化
    // 			// switch (modelData.state[1]) {
    // 			// 	case "0":
    // 			// 		break;
    // 			// 	case "1":
    // 			// 		break;
    // 			// 	case "2":
    // 			// 		break;
    // 			// 	default:
    // 			// }
    // 			// // 包装机辅机颜色状态变化
    // 			// switch (modelData.state[2]) {
    // 			// 	case "0":
    // 			// 		break;
    // 			// 	case "1":
    // 			// 		break;
    // 			// 	case "2":
    // 			// 		break;
    // 			// 	default:
    // 			// }
    // 			attachObject(object);
    // 			scene.add(group);
    // 		} );
    // 	})
    // })







    window.addEventListener( 'resize', onWindowResize, false );
    container.addEventListener( "mousedown", onDocumentMouseDown, false );

    document.addEventListener( 'keydown', function ( event ) {

        switch ( event.keyCode ) {

            case 81: // Q
                // control.setSpace( control.space === "local" ? "world" : "local" );
                break;

            case 17: // Ctrl
                // control.setTranslationSnap( 100 );
                // control.setRotationSnap( Math.degToRad( 15 ) );
                break;

            case 87: // W
                control.setMode( "translate" );
                objectState = state.translate;
                break;

            case 69: // E
                control.setMode( "rotate" );
                objectState = state.rotate;
                break;

            case 82: // R
                // control.setMode( "scale" );
                break;

            case 187:
            case 107: // +, =, num+
                control.setSize( control.size + 0.1 );
                break;

            case 189:
            case 109: // -, _, num-
                control.setSize( Math.max( control.size - 0.1, 0.1 ) );
                break;

            case 88: // X
                // control.showX = ! control.showX;
                break;

            case 89: // Y
                //	control.showY = ! control.showY;
                break;

            case 90: // Z
                // control.showZ = ! control.showZ;
                break;

            case 32: // Spacebar
                // control.enabled = ! control.enabled;
                break;

        }

    } );

    container.addEventListener( 'keyup', function ( event ) {

        switch ( event.keyCode ) {

            case 17: // Ctrl
                control.setTranslationSnap( null );
                control.setRotationSnap( null );
                break;

        }

    } );

}
function changeToTranslate() {
    control.setMode( "translate" );
    objectState = state.translate;
}
function changeToRotation() {
    control.setMode( "rotate" );
    objectState = state.rotate;
}
function setModelName() {
    console.log(focusObject.position);
}
function saveScene() { // indexdb  存储每一步的操作
    console.log(scene.toJSON());
    // localStorage.setItem('scene', JSON.stringify(scene.toJSON()));
}
function UIClearScene() {
    clearScene(scene);
    scene = new THREE.Scene();
}
function clearScene(node) {
    // scene = new THREE.Scene();
    // scene.traverse( function ( child ) {
    // 	if ( child.isMesh ) {
    // 		console.log('enter');
    // 		child.geometry.dispose();
    // 		child.material.dispose();
    // 		scene.remove(child);
    // 	}
    // } );

    // 清除浏览器所有的对象
    if(node){
        if(node.children.length > 0){
            for (var i=0;i<scene.children.length - 1;i++){
                if(node.children[i] instanceof THREE.Mesh){
                    node.children[i].geometry.dispose();
                    node.children[i].material.dispose();
                    node.remove(node.children[i]);
                }else if(node.children[i] instanceof THREE.Group){

                    clearScene(node.children[i]);
                }
            }
        }
    }

}
function loadScene() {
    let sceneJson = localStorage.getItem('scene');

    if (sceneJson) {

        // 将 sceneJson 字符串转换为 json 对象
        let loadedScene = JSON.parse(sceneJson);
        let loader = new THREE.ObjectLoader();

        scene = loader.parse(loadedScene);
        console.log(scene);
    }
}


function onWindowResize() {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( container.offsetWidth, container.offsetHeight );
    scene.updateMatrixWorld();
}

function animate() {
    requestAnimationFrame( animate );
    var delta = clock.getDelta();
    if ( mixerArray ) {mixerArray.forEach(function (element) {

        element.update( delta )
    })};
    if(scene && camera){

        renderer.render( scene, camera );
    }
}
function bindLineHelper(object){		// 用于mesh 的辅助线添加方式

    // if ( object && object.children.length > 0) {
    // 	return;
    // }
    //  显示辅助线条
    var box = new THREE.Box3();
    //通过传入的object3D对象来返回当前模型的最小大小，值可以使一个mesh也可以使group
    box.expandByObject(object);
    // 获取到地面的四个三维向量,识别当前对象的底部所有线条，用来作为场景的参照z
    var positionarray =  [new THREE.Vector3(object.position.x - box.max.x,box.max.y /2,object.position. z- box.max.z),
        new THREE.Vector3(object.position.x - box.max.x,box.max.y /2,object.position.z - box.min.z),
        new THREE.Vector3(object.position.x - box.min.x,box.max.y /2,object.position.z - box.min.z),
        new THREE.Vector3(object.position.x - box.min.x,box.max.y /2,object.position.z - box.max.z)]
    var material = new THREE.LineBasicMaterial( { color: 0x3333ff } );
    var geometry1 = new THREE.Geometry();
    geometry1.vertices.push(positionarray[0] );
    geometry1.vertices.push(positionarray[1] );

    var geometry2 = new THREE.Geometry();
    geometry2.vertices.push(positionarray[1] );
    geometry2.vertices.push(positionarray[2] );

    var geometry3 = new THREE.Geometry();
    geometry3.vertices.push(positionarray[2] );
    geometry3.vertices.push(positionarray[3] );

    var geometry4 = new THREE.Geometry();
    geometry4.vertices.push(positionarray[3] );
    geometry4.vertices.push(positionarray[0] );

    var line1 = new THREE.Line( geometry1, material );

    // lineX.scale.set(10,1,1);
    var line2 = new THREE.Line( geometry2, material );

    var line3 = new THREE.Line( geometry3, material );
    var line4 = new THREE.Line( geometry4, material );
    line1.scale.set(1,1,10);
    line3.scale.set(1,1,10);
    line2.scale.set(10,1,1);
    line4.scale.set(10,1,1);
    var group = new THREE.Group();
    group.name = "lineHelper";
    group.add(line1,line2,line3,line4);
    group.rotation.x = Math.PI /2;
    group.visible = false;
    object.add(group);
}
function bindLineGroupHelper(object){
    var box =new THREE.Box3();
    box.setFromObject(object);
    var helper = new THREE.Box3Helper( box, 0xffff00 );
    console.log(helper);

    control.attach(object);
    scene.add(helper);
}
function attachObject(object) {
    control.attach(object);
    // localStorage.setItem('scene', JSON.stringify(scene.toJSON()));
}
var sceneData={		// 基础的属性
    "positionX":"",
    "positionY":"",
    "positionZ":"",
    "rotationY":"",
    "visible":true
}
function getPosition() {
    sceneData.positionX =  focusObject.position.x;
    sceneData.positionY =  focusObject.position.y;
    sceneData.positionZ=  focusObject.position.z;
    sceneData.rotationY =  focusObject.rotation.y;
    sceneData.visible =  focusObject.visible;
    return sceneData;
}
function onDocumentMouseUp() {
    document.removeEventListener( "mouseup", onDocumentMouseUp, false );
    document.removeEventListener( "mousemove", onShowObjectPosition,false );
    scene.traverse(function (item) {
        if (item instanceof THREE.Group) {
            if (!item) return;
            // 删除掉所有的模型组内的mesh
            if(item.name =='lineHelper'){
                item.visible = false;
            }
        }
    });
}
function onShowObjectPosition(){
    showFocusObjectData(focusObject);
}

function onDocumentMouseDown( event ) {
    event.preventDefault();
    document.addEventListener( "mouseup", onDocumentMouseUp, false );
    document.addEventListener( "mousemove", onShowObjectPosition,false );
    var intersects = getIntersects( event.layerX, event.layerY );
    if ( intersects.length > 0 ) {
        var res = intersects.filter( function ( res ) {
            return res && res.object;
        } )[ 0 ];
        if ( res && res.object && !locked) {
            focusObject = res.object.parent.parent;
            showFocusObjectData(focusObject);
            attachObject(focusObject);
        }

    }
    if(focusObject){focusObject.children[5].visible = true;}
}
var raycaster = new THREE.Raycaster();
var mouseVector = new THREE.Vector3();
function getIntersects( x, y ) {
    x = ( (x-container.getBoundingClientRect().left) / container.getBoundingClientRect().width ) * 2 - 1;
    y = - ( (y-container.getBoundingClientRect().top) / container.getBoundingClientRect().height ) * 2 + 1;
    mouseVector.set( x, y, 0.5 );
    raycaster.setFromCamera( mouseVector, camera );

    return raycaster.intersectObject( group, true );
}
