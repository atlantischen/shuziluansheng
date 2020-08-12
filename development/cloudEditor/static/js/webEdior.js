import HashTable from '../../static/js/HashTable.js'
// import api from '../../static/api/api.js'
export function webEdior(callback) {
    var camera, scene, renderer, control, orbit, orbit1, group,
        focusObject, container, currentTreeID, currentChildID, direction_light,
        cameraAxis, clickObject;
    var clock = new THREE.Clock();
    var mixerArray = [];
    var locked = false;
    var state = {
        translate: 1,
        rotate: 2,
    }
    var objectState = state.translate;
    var focusLightObject;
    var itemName;
    var loader = new THREE.FBXLoader();
    var isMiniPanelShow = false;
    var miniPanleShowList = '';
    var objectList = [];
    var lightList = [];
    var materialList = []; // 全景监控当前对象的材质信息

    var emptyGroupObject = []; // 场景中的空对象

    var labelGroup;

    var selectedObjects, composer, outlinePass;
    animate();

    var api; // 读取本地json 文件

    var cameraView; // 用户动态设定的相机视角
    var viewCamera;
    var cameraHelper; // 相机辅助线

    var isRightClick = false;

    var grid = null; // 表示辅助网格

    var directionalHelper = null; // 表示灯光辅助线

    var lightHelperArray = [];

    var stats; // 帧率

    var axisModel; // 坐标系

    var userHistory = []; // 用户动作

    var loaded = true; // 加载标示

    var currentObject = null;


    function updatObjectName(id) {
        if (focusObject) {
            focusObject.name = document.getElementById(id).value
        }
    }

    function setCamera() {
        focusObject = camera;
        control.attach(camera);
        // showFocusObjectData(focusObject);
    }

    function showAxis(object) { // 添加显示坐标的方法，不同的对象，显示的坐标系不一样
        // 场景的机器对象显示 y 轴的旋转， xz 轴的移动
        console.log(object);
        console.log(objectState);
        console.log(focusLightObject);
        if (object.type == "PerspectiveCamera" || object.type == "DirectionalLight") {

            control.showY = true;
            control.showX = true;
            control.showZ = true;
        } else {
            if (objectState == 2) {
                control.showY = true;
                control.showX = false;
                control.showZ = false;
            } else {
                control.showY = false;
                control.showX = true;
                control.showZ = true;
            }
        }
    }

    function showFocusObjectData(object) {
        // 位置信息
        if (object) {
            // 模型位移
            document.getElementById('positionX').value = object.position.x.toFixed(0);
            document.getElementById('positionY').value = object.position.y.toFixed(0);
            document.getElementById('positionZ').value = object.position.z.toFixed(0);

            // 模型名字信息
            // document.getElementById('focusObjectName').value = object.name;

            // 相机对象信息
            // document.getElementById('sceneCamera_fov').value = camera.fov;
            // document.getElementById('sceneCamera_near').value = camera.near;
            // document.getElementById('sceneCamera_far').value = camera.far;

            // 旋转
            if (document.getElementById('roationX')) {
                document.getElementById('roationY').value = (object.rotation.y * 180 / Math.PI).toFixed(0);
                document.getElementById('roationX').value = (object.rotation.x * 180 / Math.PI).toFixed(0);
                document.getElementById('roationZ').value = (object.rotation.z * 180 / Math.PI).toFixed(0);
            } else {
                document.getElementById('roationY').value = (object.rotation.y * 180 / Math.PI).toFixed(0);
            }

            if (object.type == 'light') {
                document.getElementById('colorName').value = RGB2Hex(focusLightObject.color.getStyle());
                document.getElementById('intensityL').value = focusLightObject.intensity;
            }
        }
    }


    function RGB2Hex(rgb) {
        var re = rgb.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(","); //利用正则表达式去掉多余的部分
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
            } else {
                hexAr.push(0);
            }
            hexAr.push(hex[c])
            hexColor += hexAr.reverse().join('');
        }
        return hexColor;
    }

    function init() {
        container = document.getElementById('viewport');
        renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setClearColor('#777777', 1);
        renderer.autoClear = false;

        console.log(renderer);
        container.appendChild(renderer.domElement);
        scene = new THREE.Scene();
        // 场景添加background
        scene.background = new THREE.CubeTextureLoader()
            // 定义服务器的资源地址
            .setPath("./static/img/skybox/skybox-sky0/")
            .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg', ]);
        group = new THREE.Group();
        group.name = "objectGroup"; // 定义三维场景对象存放的组
        scene.add(group);

        labelGroup = new THREE.Group();
        labelGroup.name = "label",
        scene.add(labelGroup);


        stats = new Stats();
        console.log(stats);
        container.appendChild(stats.dom);

        grid = new THREE.GridHelper(300000, 30);
        grid.position.y -= 1100;
        scene.add(grid);

        camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 1, 1000000);
        camera.position.set(1000, 20000, 1000000); // 修改相机视角，更正为往水平防线，而不是看着地面
        viewCamera = camera;
        scene.add(camera);

        cameraView = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 1, 1000000);
        cameraView.position.set(2000, 20000, 100000);
        cameraView.name = 'Camera';
        scene.add(cameraView);
        cameraHelper = new THREE.CameraHelper(cameraView);
        scene.add(cameraHelper);

        cameraAxis = new THREE.OrthographicCamera(-350, 350, 350, -350, 1, 20000);
        cameraAxis.position.set(0, 200000, 500);
        cameraAxis.lookAt(0, 200, 0);
        scene.add(cameraAxis);


        orbit = new THREE.OrbitControls(camera, container);
        orbit.maxPolarAngle = Math.PI / 36 * 17; // 定义当前对象只能在水平面上
        orbit.maxDistance = 95000;
        orbit.minDistance = 2000;
        orbit.showY = false;
        orbit.update();


        orbit1 = new THREE.OrbitControls(cameraAxis, container);
        orbit1.maxPolarAngle = Math.PI / 2; // 定义当前对象只能在水平面上
        orbit1.target.set(0, 200000, 0);
        orbit1.enableZoom = false;
        orbit1.enablePan = false;
        orbit1.update();

        control = new THREE.TransformControls(camera, container);

        control.addEventListener('dragging-changed', function(event) {

            orbit.enabled = !event.value;
            orbit1.enabled = !event.value;
            // console.log('enter');

        });

        scene.add(control);

        direction_light = new THREE.DirectionalLight(0xffffff, 1);
        direction_light.name = 'default-lightN0';
        direction_light.position.set(2000, 15000, 1);
        directionalHelper = new THREE.DirectionalLightHelper(direction_light, 500);
        lightHelperArray.push(directionalHelper);
        scene.add(directionalHelper);

        focusLightObject = direction_light;
        scene.add(direction_light);

        var light = new THREE.AmbientLight(0xffffff); // soft white light
        scene.add(light);
        light.position.set(0, 0, 0);
        camera.add(light);

        var loader = new THREE.FBXLoader();
        loader.load('./static/models/fbx/tubiao.FBX', function(object) {

            object.position.y = 199700;
            object.scale.set(15, 15, 15);
            axisModel = object;
            scene.add(object);
        });

        composer = new THREE.EffectComposer(renderer);

        var renderPass = new THREE.RenderPass(scene, camera);
        composer.addPass(renderPass);


        outlinePass = new THREE.OutlinePass(new THREE.Vector2(container.offsetWidth, container.offsetHeight), scene, camera);
        composer.addPass(outlinePass);


        window.addEventListener('resize', onWindowResize, false);

        container.addEventListener("resize", onContainerResize, false);

        container.addEventListener("mousedown", onDocumentMouseDown, false);

        document.addEventListener('keydown', function(event) {

            switch (event.keyCode) {

                case 81: //
                    // control.setSpace( control.space === "local" ? "world" : "local" );
                    break;

                case 17: // Ctrl
                    // control.setTranslationSnap( 100 );
                    // control.setRotationSnap( Math.degToRad( 15 ) );
                    break;

                case 87: // W
                    control.setMode("translate");
                    objectState = state.translate;
                    if (focusObject != null) {
                        showAxis(focusObject);
                    } else {
                        showAxis(focusLightObject);
                    }
                    break;

                case 69: // E
                    control.setMode("rotate");
                    objectState = state.rotate;
                    console.log(focusObject);
                    if (focusObject != null) {
                        showAxis(focusObject);
                    } else {
                        showAxis(focusLightObject);
                    }
                    break;

                case 82: // R
                    break;
                case 80: // Px
                    camera = cameraView;
                    console.log(scene);
                    orbit.enabled = false;
                    orbit1.enabled = false;
                    control.enabled = false;
                    cameraHelper.visible = false;
                    control.showY = false;
                    control.showX = false;
                    control.showZ = false;
                    break;
                case 83: // P
                    camera = viewCamera;
                    orbit.enabled = true;
                    orbit1.enabled = true;
                    control.enabled = true;
                    cameraHelper.visible = true;
                    if (focusObject != null) {
                        showAxis(focusObject);
                    } else {
                        showAxis(focusLightObject);
                    }
                    // control.setMode( "scale" );
                    break;
                case 187:
                case 107: // +, =, num+
                    control.setSize(control.size + 0.1);
                    break;

                case 189:
                case 109: // -, _, num-
                    control.setSize(Math.max(control.size - 0.1, 0.1));
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
                case 46: // delete
                    deleteObjectFromElement(focusObject.name.substring(1, focusObject.name.length));
                    break;
            }
        });

        container.addEventListener('keyup', function(event) {

            switch (event.keyCode) {

                case 17: // Ctrl
                    control.setTranslationSnap(null);
                    control.setRotationSnap(null);
                    break;

            }

        });
        objectTree()
            // 加载服务端的模型文件用到;
            // 0805 为了用户的数据安全，将原有功能：刷新或者重新打开复现场景功能取消 ----> 重新清空所有的内存
     //  localStorage.clear();  // 07-17 添加token在localstorage，需要清除出了token 之外的所有信息
     console.log('clear sceneData')
       if(localStorage.getItem('echarts')){
         localStorage.removeItem('echarts')
       }
       if(localStorage.getItem('publics')){
        localStorage.removeItem('publics')
      }
      if(localStorage.getItem('sceneData')!=null){

        localStorage.removeItem('sceneData')
      }
      if(localStorage.getItem('dragKey')){

        localStorage.removeItem('dragKey')
      }

        // 清空除了
        var sceneObjectReview = JSON.parse(localStorage.getItem('sceneData'));
        if (!sceneObjectReview) {
            return
        }
        var onProgress = function(xhr) {

            if (xhr.lengthComputable) {

                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');

            }

        };

        var onError = function() {};


        var modelAttribute = ["包装机辅机", "卷烟机", 0, "包装机主机"]
        var loader = new THREE.FBXLoader();
        sceneObjectReview.scene3D.object.forEach(function(modelData) {
            loader.load(modelData.Path, function(object) {
                object.name = modelData.Name;
                // if (modelData.Name != "floor") {
                object.position.set(modelData.Position[0], modelData.Position[1], modelData.Position[2]);
                focusObject = object;
                console.log(focusObject);
                showFocusObjectData(object);
                group.add(object);
                attachObject(object);
                bindLineHelper(object);
                addObjectTree(object, modelAttribute, modelData, null, null)
                scene.add(group);
                objectTree();

            }, onProgress, onError);

        })

    }
    // ========================材质切换功能=================================
    var changeMaterial = function(index, objectname, materialname) {
            console.log(objectname);
            console.log(index);
            scene.traverse(object => {
                if (object.name.indexOf(objectname) > -1) { // 暂时设定地面的模型材质
                    var floorObject;
                    if (object.type == "Group") { floorObject = object.children[0] } else {
                        floorObject = object;
                    };
                    if (floorObject.material.length <= 1 || index < 0) return;
                    if (floorObject.material.length > 0 && index > -1 && floorObject.material.length >= index) {
                        console.log(floorObject);

                        for (var i = 0; i < floorObject.material.length; i++) {
                            if (floorObject.material[i].name == materialname) {
                                floorObject.material.unshift(floorObject.material[i]);
                                floorObject.material.splice(i + 1, 1)
                                floorObject.material.needsUpdate = true;
                                console.log(floorObject.material);
                                break;
                            }
                        }

                        // var materialIndex = floorObject.material[index];
                        // var matereialDefault = floorObject.material[0];
                        // floorObject.material[0] = materialIndex;
                        // floorObject.material[index] = matereialDefault;
                        // floorObject.material.needsUpdate = true;
                    }
                }

            })

        }
        // ========================设定子对象的功能==============================
    var setParent = function(parentID, childrenID) {
            // console.log(parentID);
            // console.log(childrenID);
            // console.log(scene);
            // 三维场景设定子对象直接将父级对象add 移动之后的对象即可，没有其他需要做的，所以传入的参数一定有两个，父级的ID 和子对象的ID
            var childrenObject;
            var parentObject;
            scene.traverse(function(object) {
                if (object.name.indexOf(childrenID.key) > -1) {
                    // 获取到子对象，父级对象
                    childrenObject = object;
                }
                if (object.name == parentID.key) {
                    parentObject = object;
                }
            })
            if (childrenObject && parentObject) {
                childrenObject.position.set(
                    childrenObject.position.x - parentObject.position.x,
                    childrenObject.position.y - parentObject.position.y,
                    childrenObject.position.z - parentObject.position.z); // 位置需要重新定义
                parentObject.add(childrenObject);
            }
            // 重新操作场景配置文件的属性；
            // 获取树状结构的对象;
            // console.log(scene);
        }
        // ========================添加组功能 ================================
    function updateChildrenPosition(children, parent) {
        children.position.x - parent.position.x
        return
    }
    var addSceneGroup = function() {
            console.log('add scene group');

            var emptygroup = new THREE.Group();
            emptygroup.name = 'EmptyGroup' + emptyGroupObject.length;
            emptyGroupObject.push(emptygroup);
            console.log(emptygroup);
            scene.children.filter(object => {
                if (object.name == "objectGroup") {
                    object.add(emptygroup);
                }
            })
            addObjectTree(emptygroup, null, null, null, null); // 添加组对象
            console.log(scene);
        }
        // ========================添加灯光功能 =================================
    var addSceneLight = function(type) {
        // 灯光添加，灯光分为环境光照、方向光、点光源等多类型；一般确定3种光照即可（光照过多会影响整体的效率）
        // 为灯光添加唯一的id,遍历场景中的灯光，看看当前灯光的属性
        if (!type) return;
        // 遍历当前灯光的数量
        objectTreedata.filter(object => {
            object.type = 'light';
        })
        var lightName = 'addLightNameN' + lightList.length
        var sceneData = JSON.parse(localStorage.getItem('sceneData'));
        console.log(sceneData);
        if (!sceneData && sceneAttributeData) { // 将灯光添加到对象身上
            console.log(sceneAttributeData);
            localStorage.setItem('sceneData', JSON.stringify(sceneAttributeData));
        }
        switch (type) { // 需要 设定light  的名称
            case 'directional':
                var light = new THREE.DirectionalLight(0xffffff);
                light.name = lightName;

                var helper = new THREE.DirectionalLightHelper(light, 5);
                lightHelperArray.push(helper);
                scene.add(helper);

                lightList.push(light);
                scene.add(light);
                console.log(scene);
                addObjectTree(light, null, null, null, null);
                break;
            case 'ambient':
                var light = new THREE.AmbientLight(0x404040); // soft white light

                scene.add(light);
                lightList.push(light);
                light.name = lightName;
                addObjectTree(light, null, null, null, null);
                break;
            case 'point':
                var light = new THREE.PointLight(0xff0000, 1, 100);

                var sphereSize = 1000;
                var pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
                lightHelperArray.push(helper);
                scene.add(pointLightHelper);

                scene.add(light);
                lightList.push(light);
                light.name = lightName;
                addObjectTree(light, null, null, null, null);
                break;
            default:
        }
        console.log(lightList);
        // 需要将添加的对象加到场景的树状结构的对象里面；
        if (lightList.length > 0) {
            var light = lightList[lightList.length - 1];
            var lightItem = {
                Color: RGB2Hex(light.color.getStyle()),
                InteractiveControl: true,
                InteractiveEvent: false,
                Name: light.name,
                Opacity: light.intensity,
                Position: light.position,
                Type: light.type,
            }
            addLightToLocalStorage(lightItem);
        }

    }

    function addLightToLocalStorage(light) {
        var newSceneData = JSON.parse(localStorage.getItem('sceneData'));
        newSceneData.scene3D.light.push(light);
        localStorage.setItem('sceneData', JSON.stringify(newSceneData))
    }
    // ========================控制抗锯齿属性================================
    var setAntialias = function(value) {
            renderer.antialias = value;
        }
        // ========================检测当前对象的材质列表==========================
    var objectMaterial = function() {
            // 传入被选中的对象：1.树状图选中方式；2.场景对象选中方式;

            console.log(focusObject);

        }
        // ========================切换天空盒功能=================================
    var setSkyboxForScene = function(type, name) {
            if (!name) return;
            if (type == "skybox") {
                scene.background = new THREE.CubeTextureLoader()
                    // 定义服务器的资源地址
                    .setPath("./static/img/skybox/" + name + '/')
                    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg', ]);
            } else {
                scene.background = new THREE.TextureLoader()
                    // 定义服务器的资源地址
                    .setPath("./static/img/background/")
                    .load(name + '.jpg');
            }
        }
        // ========================视图功能=======================================
    var tweenToTopPosition = function(params) { // 俯视图
        console.log(focusObject.position);
        var target = orbit.target;
        var coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };

        var tween = new TWEEN.Tween(coords)
            .to({ x: target.x, y: target.y + 30000, z: target.z }, 2000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function() {
                camera.position.set(coords.x, coords.y, coords.z);
                camera.lookAt(target.x, target.y, target.z);
            })
            .start();
        // 辅助坐标轴角度重置
        var coords1 = { x: cameraAxis.position.x, y: cameraAxis.position.y, z: cameraAxis.position.z }
        var tween1 = new TWEEN.Tween(coords1)
            .to({ x: 0, y: 200500, z: 0 }, 2000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function() {
                cameraAxis.position.set(coords1.x, coords1.y, coords1.z);
                cameraAxis.lookAt(0, 200000, 0);
            })
            .start();
    }

    var tweenToLeftPosition = function(params) { // 左视图
        console.log('left');
        var target = orbit.target;
        var coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
        var tween = new TWEEN.Tween(coords)
            .to({ x: target.x, y: target.y, z: target.z + 20000 }, 2000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function() {
                camera.position.set(coords.x, coords.y, coords.z);
                camera.lookAt(target.x, target.y, target.z);
            })
            .start();
        // 辅助坐标轴角度重置
        var coords1 = { x: cameraAxis.position.x, y: cameraAxis.position.y, z: cameraAxis.position.z }
        var tween1 = new TWEEN.Tween(coords1)
            .to({ x: 0, y: 200000, z: 500 }, 2000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function() {
                cameraAxis.position.set(coords1.x, coords1.y, coords1.z);
                cameraAxis.lookAt(0, 200000, 0);
            })
            .start();
    }

    var tweenToRightPosition = function(params) { // 右视图
        var target = orbit.target;
        var coords = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
        var tween = new TWEEN.Tween(coords)
            .to({ x: target.x + 20000, y: target.y, z: target.z }, 2000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function() {
                camera.position.set(coords.x, coords.y, coords.z);
                camera.lookAt(target.x, target.y, target.z);
            })
            .start();
        // 辅助坐标轴角度重置
        var coords1 = { x: cameraAxis.position.x, y: cameraAxis.position.y, z: cameraAxis.position.z }
        var tween1 = new TWEEN.Tween(coords1)
            .to({ x: 500, y: 200000, z: 0 }, 2000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function() {
                cameraAxis.position.set(coords1.x, coords1.y, coords1.z);
                cameraAxis.lookAt(0, 200000, 0);
            })
            .start();
    }

    // ================== 选中对象的位置 ==================
    let lookAtObject = function(objectName, layer, index) {
            // if (objectName == "Camera") return;
            console.log(objectName);
            console.log(scene);
            focusObject = null;
            focusLightObject = null;
            materialList = []
            scene.children.filter((metaData) => {
                if (metaData.name == objectName) {
                    // 灯光对象
                    console.log(metaData.name);
                    if (objectName == 'Camera') {
                        focusObject = metaData;
                        control.showY = true;
                        control.showX = true;
                        control.showZ = true;
                        control.attach(focusObject);

                    } else {
                        focusLightObject = metaData;
                        console.log(objectTreedata);
                        objectTreedata.filter(tree => {

                                if (tree.id == focusLightObject.name && focusLightObject.type == 'DirectionalLight' || focusLightObject.type == 'light') {
                                    console.log(tree);
                                    tree.color = RGB2Hex(focusLightObject.color.getStyle());
                                    tree.opacity = focusLightObject.intensity;
                                    control.showY = true;
                                    control.showX = true;
                                    control.showZ = true;
                                    control.attach(focusLightObject);

                                }
                            })
                            // showFocusObjectData(focusLightObject); // 不用显示对象的方法，直接将数据写入到treedata里面去
                            // 需要把灯光数据绑定到treedata 上面
                    }
                }
                if (metaData.name == "objectGroup") {
                    // metaData.children.filter((object) => { // 定位当前对象，传入规则即当前对象的group对象
                    metaData.traverse((object) => { // 定位当前对象，传入规则即当前对象的group对象
                        if (object.name.indexOf(objectName) > -1) {
                            focusObject = object;
                            showAxis(focusObject);
                            attachObject(object);
                            // console.log(object);
                            if (index > -1 && object.name.indexOf('EmptyGroup') < 0) { // 判断当前对象是不是添加在空物体对象
                                bindBoxHelper(object.children[index]);
                                // if(object.children[index].material.length > 0){
                                //     materialList = object.children[index].material;     // 获取当前对象的所有材质信息
                                // }else{
                                //     materialList  = [clickObject.material]
                                // }
                                materialList = object.children[index].material;
                                // console.log(materialList);
                                objectTree();
                            }
                            showFocusObjectData(object);

                        }
                    })
                }
            })
        }
        // 选中对象之后，需要在各个对象处添加一个boxhelper

    // 选中对象,通过vue传入对象的名称，从而找到当前对象的位置
    var getFocusObject = function(objectName, index) { // 双击对象，选中

        scene.children.filter((metaData) => {
            if (metaData.name == "objectGroup") {
                metaData.children.filter((object) => { // 定位当前对象，传入规则即当前对象的group对象
                    if (object.name.indexOf(objectName) > -1) {
                        control.showY = false;
                        control.showX = true;
                        control.showZ = true;
                        attachObject(object)
                            // 设置camera的位置
                        var position = object.position;
                        if (index == undefined) {
                            orbit.target.set(position.x, position.y, position.z);
                            camera.position.set(position.x, position.y + 13000, position.z + 5000);
                            camera.lookAt(position.x, position.y, position.z);
                        } else {
                            var positionChild = object.children[index].position;
                            if (index > -1) {
                                console.log(index)
                                bindBoxHelper(object.children[index]);
                                console.log(object.children[index].position);
                                orbit.target.set(positionChild.x + position.x, positionChild.y + position.y, positionChild.z + position.z);
                                camera.position.set(positionChild.x + position.x, positionChild.y + position.y + 3000, positionChild.z + position.z + 3000);
                                camera.lookAt(positionChild.x + position.x, positionChild.y + position.y, positionChild.z + position.z);
                            } else {
                                orbit.target.set(object.position.x, object.position.y, object.position.z);
                                camera.lookAt(object.position.x, object.position.y, object.position.z);
                                camera.position.set(object.position.x, object.position.y + 3000, object.position.z + 3000);
                            }
                        }
                    }
                })
            }
        })
    }

    function clearScene(node) {

        // 清除浏览器所有的对象
        if (node) {
            if (node.children.length > 0) {
                for (var i = 0; i < scene.children.length - 1; i++) {
                    if (node.children[i] instanceof THREE.Mesh) {
                        node.children[i].geometry.dispose();
                        node.children[i].material.dispose();
                        node.remove(node.children[i]);
                    } else if (node.children[i] instanceof THREE.Group) {

                        clearScene(node.children[i]);
                    }
                }
            }
        }

    }

    function disposeObject(node) { // 删除对象之后，把对应的数状结构删除
        console.log(node);
        node.traverse(function(child) { // 清除内存对象
            if (child.type == "Mesh") {
                child.geometry.dispose();
                if (child.material.length > 0) {
                    for (var i = 0; i < child.material.length; i++) {
                        child.material[i].dispose();
                    }
                }

            } else if (child.type == "Line") {
                child.geometry.dispose();
                child.material.dispose();
            }
        });
    }

    function onWindowResize() {
        console.log('window');

        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        composer.setSize(container.offsetWidth, container.offsetWidth);
        // cameraAxis.aspect = container.offsetWidth / container.offsetHeight;
        // cameraAxis.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        scene.updateMatrixWorld();

    }
    var onContainerResize = function() {
        console.log('enter')

        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        composer.setSize(container.offsetWidth, container.offsetWidth);
        // cameraAxis.aspect = container.offsetWidth / container.offsetHeight;
        // cameraAxis.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        scene.updateMatrixWorld();

    }

    function animate() {
        requestAnimationFrame(animate);
        var delta = clock.getDelta();
        if (stats) {
            stats.update();
        }
        TWEEN.update();
        if (mixerArray) {
            mixerArray.forEach(function(element) {
                element.update(delta)
            })
        };
        // if (renderer) {
        if (renderer && composer) {
            // renderer.render(scene, camera);
            composer.render();
            render();

        }
    }

    function render() {

        // renderer 顺序换了之后，右上方的辅助坐标模型才能展示出来
        // activeHelper.visible = true;

        renderer.clear();
        renderer.setViewport(0, 0, container.offsetWidth, container.offsetHeight);
        renderer.render(scene, camera);
        renderer.setViewport(9 * container.offsetWidth / 10, 4 * container.offsetHeight / 5, container.offsetWidth / 10, container.offsetHeight / 5);
        renderer.render(scene, cameraAxis); // 10-29

        // renderer.setViewport(9 * container.offsetWidth / 10, 4 * container.offsetHeight / 5, container.offsetWidth / 10, container.offsetHeight / 5);
        // renderer.render(scene, cameraAxis);  // 10-29

        // renderer.setViewport(0, 0, container.offsetWidth, container.offsetHeight);
        // renderer.render(scene, camera);

    }


    function bindLineHelper(object) { // 用于mesh 的辅助线添加方式
        // if ( object && object.children.length > 0) {
        // 	return;
        // }
        //  显示辅助线条
        var box = new THREE.Box3();
        //通过传入的object3D对象来返回当前模型的最小大小，值可以使一个mesh也可以使group
        box.expandByObject(object);
        // 获取到地面的四个三维向量,识别当前对象的底部所有线条，用来作为场景的参照z
        var positionarray = [new THREE.Vector3(object.position.x - box.max.x, box.max.y / 2, object.position.z - box.max.z),
            new THREE.Vector3(object.position.x - box.max.x, box.max.y / 2, object.position.z - box.min.z),
            new THREE.Vector3(object.position.x - box.min.x, box.max.y / 2, object.position.z - box.min.z),
            new THREE.Vector3(object.position.x - box.min.x, box.max.y / 2, object.position.z - box.max.z)
        ]
        var material = new THREE.LineBasicMaterial({ color: 0x3333ff });
        var geometry1 = new THREE.Geometry();
        geometry1.vertices.push(positionarray[0]);
        geometry1.vertices.push(positionarray[1]);

        var geometry2 = new THREE.Geometry();
        geometry2.vertices.push(positionarray[1]);
        geometry2.vertices.push(positionarray[2]);

        var geometry3 = new THREE.Geometry();
        geometry3.vertices.push(positionarray[2]);
        geometry3.vertices.push(positionarray[3]);

        var geometry4 = new THREE.Geometry();
        geometry4.vertices.push(positionarray[3]);
        geometry4.vertices.push(positionarray[0]);

        var line1 = new THREE.Line(geometry1, material);

        // lineX.scale.set(10,1,1);
        var line2 = new THREE.Line(geometry2, material);

        var line3 = new THREE.Line(geometry3, material);
        var line4 = new THREE.Line(geometry4, material);
        line1.scale.set(1, 1, 10);
        line3.scale.set(1, 1, 10);
        line2.scale.set(10, 1, 1);
        line4.scale.set(10, 1, 1);
        var group = new THREE.Group();
        group.name = "lineHelper";
        group.add(line1, line2, line3, line4);
        // group.position.x += 4200; //  位置出现问题，临时解决方案 7-30 较大可能是因为加载的时候初始位置的计算问题
        group.visible = false;
        object.add(group);
    }

    function attachObject(object) {
         console.log(object);
        if (object) {
            focusObject = object;
            control.attach(object);
        } else {
            control.attach(camera);
        }
        // UI 对象中，当对象被选中时，发送当前对象的树状结构；
        currentTreeID = object.name.split('TP')[1]; // 返回当前被选中的
        objectTree();
    }
    var sceneData = { // 基础的属性
        "positionX": "",
        "positionY": "",
        "positionZ": "",
        "rotationY": "",
        "quaternion": "",
        "visible": true
    }

    var storageSave = { // 用户对localStorage进行场景属性文件的数据存储

        get: function() {

            return localStorage.getItem(itemName);

        },

        set: function(name, data) {

            itemName = name;
            localStorage.setItem(name, data);
            return 'save to localStorage success';
        },

        clear: function() {

            localStorage.clearItem(itemName);
            return 'clear localStorage success'
        }
    }

    var objectTreedata = [{ //  定义树状结构，用于前端显示树状信息
        id: "Camera",
        label: 'Camera',
        defaultName: 'Camera', // 对象默认的名称，当isCanNamed 为true 时，当前对象可以被修改label的名称
        type: 'camera',
        isCanMove: false, // 允许被移动，即可以作为对象的子对象
        isCanDelete: false, // 允许被删除
        isCanAccept: false, // 允许当前对象接受子对象，即对象可以作为父级对象
        isCanNamed: false, // 允许修改当前对象的名称
        visible: true,
        "className": "element-icon icon-cameraelement-xiangji tree-icon",
    },
    {
        id: "default-lightN0",
        label: 'DefaultLight', // 对象默认的名称，当isCanNamed 为true 时，当前对象可以被修改label的名称
        defaultName: 'DefaultLight',
        type: 'light',
        isCanMove: false, // 允许被移动，即可以作为对象的子对象
        isCanDelete: false, // 允许被删除
        isCanAccept: false, // 允许当前对象接受子对象，即对象可以作为父级对象
        isCanNamed: false, // 允许修改当前对象的名称
        visible: true,
        "className": "element-icon icon-cameraai251 tree-icon"
    }
    ]

    var sceneAttributeData = { //  项目的属性配置文件信息   7-19 重新设定数据结构
            actions: [{
                id: "mechinestatePanel",
                index: '',
                level: '',
                objectID: '',
                datas: []
            }],
            minipanel: [{
                    machineType: "卷烟机",
                    datas: []
                },
                {
                    machineType: "包装机主机",
                    datas: []
                }, {
                    machineType: "包装机辅机",
                    datas: []
                }
            ], // 小面板的配置文件信息
            scene3D: { // 场景的属性配置文件
                "注释": "在object对象中，modelContent表示三维对象的层级关系，InteractiveEvent：ture标识可以被事件绑定、InteractiveControl:false表示不能进行控制，EventType：1表示绑定的小面板，0表示没有绑定事件，2表示绑定划动事件",
                "注释": "EventType:1,表示单击事件、2，表示滑动事件，0，表示无事件",
                "注释": "===========0723由于事件可以并列，所以新增字段MousemoveEvent,1表示启用，0表示不启用",
                info: {
                    time: '',
                    userID: '华龙讯达',
                    sceneimage: '',
                    name: '',
                },
                sceneData: {
                    BackgroundColor: "0x777777",
                    Fog: {
                        Color: "0xffffff",
                        Near: "10000",
                        Far: "100000"
                    }
                },
                DefaultCamera: {
                    Name: "Camera",
                    FOV: 75,
                    Near: 1,
                    Far: 100000,
                    Type: "PerspectiveCamera",
                    Position: [1000, 20000, 10000],
                    Target: [0, 200, 0],
                    InteractiveEvent: false,
                    InteractiveControl: true,
                    visible: true,

                },
                DefaultLight: {
                    Name: "DefaultLight",
                    Color: "#ffffff",
                    Opacity: "1",
                    Type: "DirectionalLight",
                    Position: [1, 1, 1],
                    InteractiveEvent: false,
                    InteractiveControl: true,
                    visible: true,
                },
                object: [],
                camera: [], // 定义场景中添加的项目数
                light: [], // 定义场景中的所有的灯光数量；
            }
        }
        // 点击单个对象,获取到对应得box helper; // -04-01 版本更新
    var loadServerScene = function(data) { // 打开场景功能
        console.log('loadServerScene function call');
        console.log(data);
        control.detach();
        var newSceneData = JSON.parse(localStorage.getItem('sceneData'));
        if (newSceneData) {

            newSceneData.action = data.action;
            newSceneData.scene3D.object = data.scene3D.object;
            localStorage.setItem('sceneData', JSON.stringify(newSceneData));
            localStorage.setItem('publics', true);
        } else {
            localStorage.setItem('sceneData', JSON.stringify(data));
            localStorage.setItem('publics', true);
        }
        objectTreedata = objectTreedata.slice(0, 2); // 表示当前取树对象得前面两位；
        scene.children.filter(child => {
            if (child.name.indexOf('floor') > -1) {
                // 删除floor
                disposeObject(child);
                updateTreeData(child);
                scene.remove(child);
                console.log(scene);
            }
            if (child.name == 'objectGroup') {
                child.children.filter((object) => {
                    updateTreeData(object);
                    // 删除object对象
                    disposeObject(object)
                    child.remove(object);
                })
                scene.remove(child);
            }
        })
        var onProgress = function(xhr) {

            if (xhr.lengthComputable) {

                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');

            }

        };

        var onError = function() {};

        if (group.children.length > 0) { // 情况数组
            group.children.length = 0;
        }
        if (data.scene3D.object && data.scene3D.object.length == 0) return;
        var modelAttribute = ["包装机辅机", "卷烟机", 0, "包装机主机"]
        console.log(data);
        var loader = new THREE.FBXLoader();
        data.scene3D.object.forEach(function(modelData) {
            loader.load(modelData.Path, function(object) {
                object.name = modelData.DefaultName;
                objectList.push(object);
                console.log(modelData);
                control.showY = false;
                control.showX = true;
                control.showZ = true;
                // if (object.name.indexOf('floor') > -1) {
                //     object.rotation.y = -Math.PI / 2;
                // }else{
                if (modelData.rotationForWeb) {
                    object.quaternion.x = modelData.rotationForWeb._x;
                    object.quaternion.y = modelData.rotationForWeb._y;
                    object.quaternion.z = modelData.rotationForWeb._z;
                    object.quaternion.w = modelData.rotationForWeb._w;
                } else {
                    object.rotation.y = modelData.rotationY;
                }
                // }
                object.position.set(modelData.Position[0], modelData.Position[1], modelData.Position[2]);
                focusObject = object;
                showFocusObjectData(object);
                group.add(object);
                attachObject(object);
                bindLineHelper(object);
                addObjectTree(object, modelAttribute, modelData, null, null) // TODO:10-30 重新加载场景对象数据
                scene.add(group);
                console.log(scene);
                objectTree();

            });

        }, onProgress, onError)
    }


    var createScene = function() { // 新建场景功能
        console.log('createScene function call');
        // 1.设定场景的localstorage
        control.detach();
        var newSceneData = JSON.parse(localStorage.getItem('sceneData'));
        if (newSceneData) {
            newSceneData.actions = []
            newSceneData.scene3D.object = []
            localStorage.setItem('sceneData', JSON.stringify(newSceneData));
            localStorage.setItem('publics', true);
        }
        objectTreedata = objectTreedata.slice(0, 2); // 表示当前取树对象得前面两位；
        scene.children.filter(child => {
            if (child.name.indexOf('floor') > -1) {
                // 删除floor
                disposeObject(child);
                updateTreeData(child);
                scene.remove(child);
                console.log(scene);
            }
            if (child.name == 'objectGroup') {
                child.children.filter((object) => {
                    updateTreeData(object);
                    // 删除object对象
                    disposeObject(object)
                    child.remove(object);
                })
                scene.remove(child);
            }
        })
        if (group.children.length > 0) { // 情况数组
            group.children.length = 0;
        }
    }

    function bindBoxHelper(object) {
        // console.log(object);
        if (object.name.indexOf('EmptyGroup') > -1) {
            return;
        }
        addSelectedObject(object);
        console.log(selectedObjects);
        outlinePass.selectedObjects = selectedObjects;

        //传入的是一个mesh 对象，为mesh对象添加上helper 即可
        if (object == undefined) {
            return;
        }
        scene.children.filter((object) => { // 去掉场景中的boxhelper 对象
            if (object.name == 'boxHelper') {
                scene.remove(object);
            }
        })
        var box = new THREE.BoxHelper(object, 0xffffff); //添加了boxhelper
        box.name = 'boxHelper';
        // 当切换对象之后，原来的boxhelper 需要消失，
        scene.add(box);
    }
    setTimeout(() => {

        window.$eventBus.$on('getRealDatas', function (data) { // 两秒一次 获取数据
            if (isMiniPanelShow && miniPanleShowList != '') {
                // miniPanleShowList 通过内部的子对象，将小面板展示出来，鼠标点击一下对象如果有数据，则push到list中
                // 通过遍历list 显示对应的数据
                // 当场景中的minipanel 被删除时，
                // console.log(data);
                for (var i = 0; i < data[0].datas.length; i++) {
                    console.log(data[0].datas[i].mcid + data[0].datas[i].value)
                }
            }
        });
    });
    // 当添加场景的小面板时候，将小面板的数据存放到场景的属性文件中，当对象绑定了之后做遍历修改操作；
    var addMinipanelOptions = function(data) {
            // var sceneData = JSON.parse(localStorage.getItem('sceneData'));
            // if (sceneData || sceneData == null) {
            //     sceneAttributeData.minipanel.filter((minipanel) => {
            //         if (minipanel.machineType == data.machineType) {
            //             minipanel.datas.push(data);
            //         }
            //     })
            //     localStorage.setItem('sceneData', JSON.stringify(sceneAttributeData));
            //     localStorage.setItem('publics', false);
            // } else {

            //     sceneData.minipanel.filter((minipanel) => {
            //         if (minipanel.machineType == data.machineType) {
            //             minipanel.datas.push(data);
            //         } else {
            //             var miniData = {
            //                 machineType: data.machineType,
            //                 datas: data
            //             }
            //             sceneData.minipanel.push(miniData);
            //         }
            //     })
            //     localStorage.setItem('sceneData', JSON.stringify(sceneData));
            localStorage.setItem('publics', false);
            // 将对象中的属性属性重新赋值
            // }
        }
        // 刷新对象的数据
    function updateSceneAttribute(object, type) {
        // 当场景对象被修改之后，即当focusObject 被修改之后，将对象中的属性全部更新到localStorage 中

        var sceneData = JSON.parse(localStorage.getItem('sceneData'));

        if (!sceneData) {
            return;
        }
        console.log(object);
        // 当对象是相机或者灯光的时候
        if (object.type.indexOf('Light') > -1) {
            sceneData.scene3D.DefaultLight.visible = object.visible;
        }
        if (object.type.indexOf('Camera') > -1) {
            sceneData.scene3D.DefaultCamera.visible = object.visible;
        }
        sceneData.scene3D.object.filter((object3d) => {
            console.log(object3d.DefaultName);
            console.log(object.name);
            if (!object3d) return;
            if (object3d.DefaultName == object.name) {
                switch (type) {
                    case 'positionX':
                        object3d.Position[0] = object.position.x;
                        break;
                    case 'positionY':
                        object3d.Position[1] = object.position.y;
                        break;
                    case 'positionZ':
                        object3d.Position[2] = object.position.z;
                        break;
                    case 'rotationY':

                        var k = new THREE.Euler();
                        k.copy(object.rotation);
                        k.z *= -1;
                        k.y -= Math.PI;
                        // var qk = new THREE.Quaternion(0, 0, 0, 0);
                        // qk.setFromEuler(k);

                        var qk = new THREE.Quaternion(0, 0, 0, 0);
                        qk.setFromEuler(k);
                        var qk_y = qk.y;
                        var qk_w = qk.w;
                        var qk_x = qk.x;
                        var qk_z = qk.z;
                        qk.y = qk_y;
                        qk.w = -qk_w;
                        qk.x = -qk_x;
                        qk.z = qk_z;
                        // var qk = new THREE.Quaternion();
                        // qk.copy(object.quaternion);
                        // var qk_y = qk.y;
                        // var qk_w = qk.w;
                        // qk.y = qk_w;
                        // qk.w = qk_y;
                        object3d.rotationY = object.rotation.y;
                        object3d.rotationForClient = qk;
                        object3d.rotationForWeb = object.quaternion;
                        break;
                    case 'visible':
                        object3d.visible = object.visible;
                        break;
                    case 'position':
                        console.log(object3d.Position);
                        object3d.Position[0] = object.position.x;
                        object3d.Position[1] = object.position.y;
                        object3d.Position[2] = object.position.z;
                        break;
                    case 'event': //事件,需要具体到子对象
                        break;
                    default:
                }
            }

        })
        localStorage.setItem('sceneData', JSON.stringify(sceneData));
        localStorage.setItem('publics', false);
    }

    function updateCamera(object, type) {
        var sceneData = JSON.parse(localStorage.getItem('sceneData'));
        switch (type) {
            case 'cameraFOV':
                sceneData.scene3D.camera.fov = object.fov;
                break;
            case 'cameraNear':
                sceneData.scene3D.camera.near = object.near;
                break;
            case 'cameraFar':
                sceneData.scene3D.camera.far = object.far;
                break;
            default:
        }
        localStorage.setItem('sceneData', JSON.stringify(sceneData));
        localStorage.setItem('publics', false);

    }

    function updateLight(object, type) {
        console.log(object);
        if (object.name == 'default-lightN0') {
            var sceneData = JSON.parse(localStorage.getItem('sceneData'));
            switch (type) {
                case 'lightOpacity':
                    sceneData.scene3D.DefaultLight.Opacity = object.intensity;
                    break;
                case 'lightColor':
                    sceneData.scene3D.DefaultLight.Color = RGB2Hex(object.color.getStyle());
                    break;
                default:
            }
            localStorage.setItem('sceneData', JSON.stringify(sceneData));
            localStorage.setItem('publics', false);
        } else {
            var sceneData = JSON.parse(localStorage.getItem('sceneData'));
            switch (type) {
                case 'lightOpacity':
                    sceneData.scene3D.light.filter(lightObject => {
                        if (lightObject.Name == object.name) { // light 没有DefaultName
                            lightObject.Opacity = object.intensity;
                        }
                    })
                    break;
                case 'lightColor':
                    sceneData.scene3D.light.filter(lightObject => {
                        if (lightObject.Name == object.name) { // light 没有DefaultName
                            lightObject.Color = RGB2Hex(object.color.getStyle());
                        }
                    })
                    break;
                default:
            }
            localStorage.setItem('sceneData', JSON.stringify(sceneData));
            localStorage.setItem('publics', false);
        }

    }



    // eventType:1 点击事件 2 滑动事件 0 无事件

    //利用index DB 来操作
    function getSceneAttributeData(object, patch, mechineAttribute, modelMechineTypeAttribute) { // 生成场景属性的数据结构 0703.json
        // 获取当前服务器的链接
        // 当场景中添加一个对象的时候，再object中push 数据，数据格式为：

        // var modelPath = getResourcesServerURL() + patch;
        var modelPath =patch;
        var modelName = object.name;
        var modelPosition = object.position;
        var modelRotationY;
        if (object.name.indexOf('floor') > -1) {
            modelRotationY = object.rotation.y;
        } else {
            modelRotationY = object.rotation.z;
        }
        //   var interactiveState = [0,1];
        var modelType = object.type;
        var modelData = [];
        var modelStateName = '' // 初始化当前对象的机器数据  10-30:TODO:数据点不准确，需要修改;
        for (var i = 0; i < mechineAttribute.length; i++) {
            // if (i == 1) {
            //     modelStateName = '1_1_卷烟机_运行状态'
            // }
            // if (i == 3) {
            //     modelStateName = '1_1_包装机主机_运行状态'
            // }
            if (mechineAttribute[i] == "玻璃" || mechineAttribute[i] == "管道") {
                modelStateName = '';

            } else {
                modelStateName = '1_1_' + mechineAttribute[i] + '_运行状态'
            }
            modelData.push({
                Name: object.children[i].name,
                Type: object.children[i].type,
                InteractiveEvent: modelMechineTypeAttribute[i] == null ? false : true, // 建议在配置文件中预设对象的可以交互性
                InteractiveControl: modelMechineTypeAttribute[i] == null ? false : true,
                Position: [0, 0, 0],
                RotationY: 0,
                EventType: 1,
                objectBelondName: modelStateName,
                EventContent: "",
                EventMiniPanelName: "",
                EventMiniPanelBackground: "",
                MousemoveEvent: "",
                MechineNameState: modelStateName,
                machineType: mechineAttribute[i],
                ModelChildrenMechineType: modelMechineTypeAttribute[i],
                isShowModelDetail: true,
                isShowMaxiPanel: true,
                machineBelondName: "",
            })
        }
        var sceneAttrData = JSON.parse(localStorage.getItem('sceneData'));
        if (sceneAttrData) {
            sceneAttrData.scene3D.object.push({
                Path: modelPath,
                Name: modelName,
                DefaultName: modelName,
                Position: [modelPosition.x, modelPosition.y, modelPosition.z],
                rotationY: modelRotationY,
                visible: true,
                InteractiveEvent: false,
                InteractiveControl: true,
                // rotationForClient:object.quaternion,
                rotationForWeb: object.quaternion,
                modelContent: {
                    modelName: modelName,
                    modelType: modelType,
                    data: modelData
                }
            })
            localStorage.setItem('sceneData', JSON.stringify(sceneAttrData));
            localStorage.setItem('publics', false);
        } else {
            sceneAttributeData.scene3D.object.push({
                Path: modelPath,
                Name: modelName,
                DefaultName: modelName,
                Position: [modelPosition.x, modelPosition.y, modelPosition.z],
                rotationY: modelRotationY,
                visible: true,
                InteractiveEvent: false,
                InteractiveControl: true,
                // rotationForClient:object.quaternion,
                rotationForWeb: object.quaternion,
                modelContent: {
                    modelName: modelName,
                    modelType: modelType,
                    data: modelData
                }
            })
            localStorage.setItem('sceneData', JSON.stringify(sceneAttributeData));
            localStorage.setItem('publics', false);
        }
    }

    function getPosition() {
        sceneData.positionX = focusObject.position.x;
        sceneData.positionY = focusObject.position.y;
        sceneData.positionZ = focusObject.position.z;
        sceneData.rotationY = focusObject.rotation.z;
        sceneData.visible = focusObject.visible;
        VrToUi_ObjClick(sceneData);
        return sceneData;
    }
    // getPosition();
    function addDragModel(resourcelist, id) { // 当调用这个方法的时候，当前对象记录当前添加对象

        var modelPath = resourcelist.filter((model) => {
            return model.uuid == id
        })
        console.log(modelPath);
        if (group.children.length == 0 && modelPath[0].name != '地面') {
            alert('请添加地面');
            return;
        }
        var modelAttribute = modelPath[0].attributeJson.modelChildrenType; // 需要修改服务器的子对象的数据形式
        var modelMechineTypeAttribute = [0];
        if (modelPath[0].attributeJson.modelChildrenMechineType) {
            modelMechineTypeAttribute = modelPath[0].attributeJson.modelChildrenMechineType; // 定义当前对象机器的类型
        }

        // var modelAttribute = ["包装机辅机", "卷烟机", 0, "包装机主机"]
        console.log(modelMechineTypeAttribute);
        var modelInteractive = modelPath[0].attributeJson.modelInteractive;
        console.log(modelInteractive);

        var objectNum;
        var modelNum;
        // if (group.children.length > 1) { // 临时解决方案，规定用户暂时先只能拖进去一个floor
        //     modelNum = group.children[group.children.length - 1].name.split('N')[1];
        //     objectNum = parseInt(modelNum) + 1;
        // } else {
        //     objectNum = 0;
        // }
        console.log(objectList);
        var onProgress = function(xhr) {
            console.log(xhr);
            loaded = false;
            objectTree();
            // if (xhr.lengthComputable) {
            //     var percentComplete = xhr.loaded / xhr.total * 100;
            //     console.log(Math.round(percentComplete, 2) + '% downloaded');

            // }

        };

        var onError = function() {};


        if (objectList.length > 0) { // 定义对象数组，便于后期的子对象的参数使用；
            modelNum = objectList[objectList.length - 1].name.split('N')[1];
            console.log(modelNum);
            objectNum = parseInt(modelNum) + 1;
        } else {
            objectNum = 10; // 定义模型的初始数据，避免出现11 与 1 的问题
        }

        if (modelPath[0].url) {
            // loader.load('http://111.230.241.106:9081/Resource-Management-Service/getResources/test/' + modelPath[0].modePath, (object) => {   // 局域网地址
            loader.load(modelPath[0].url, (object) => {
                // loader.load(modelPath[0].attribute.modePath, function(object) {
                loaded = true;
                objectTree()
                object.position.y -= 2000;
                control.showY = false;
                control.showX = true;
                control.showZ = true;

                // control.setMode("translate");
                group.add(object);
                if (modelPath[0].name != "地面") {
                    if (object.name == '') {
                        object.name = modelPath[0].name + "TP" + modelPath[0].uuid + "N" + objectNum;
                    } else {
                        object.name = object.name + "TP" + modelPath[0].uuid + "N" + objectNum;
                    }

                    focusObject = object;
                    currentObject = object.position;
                    showFocusObjectData(object);
                    attachObject(object);
                    // addObjectTree(object, modelAttribute, null, modelInteractive);   //10-30 将原有的机器添加具体的机器类型
                    addObjectTree(object, modelAttribute, null, modelInteractive, modelMechineTypeAttribute);
                    bindLineHelper(object);
                    getSceneAttributeData(object, modelPath[0].url, modelAttribute, modelMechineTypeAttribute);
                } else {
                    object.name = 'floor' + "TP" + modelPath[0].uuid + "N" + objectNum;
                    // object.rotation.y = -Math.PI / 2;
                    // addObjectTree(object, modelAttribute, null, modelInteractive)    //10-30 将原有的机器添加具体的机器类型
                    addObjectTree(object, modelAttribute, null, modelInteractive, modelMechineTypeAttribute);
                    attachObject(object);
                    getSceneAttributeData(object, modelPath[0].url, [], []);
                }
                objectList.push(object);
                scene.add(group);
            }, onProgress, onError);
        }
        addSceneLabel();
    }

    function updateTreeData(elementID) {
        // return objectTreedata.filter(treeItem => {
        //   return  treeItem.id != elementID
        // });
        var item = objectTreedata.filter(treeItem => {
            return treeItem.id != elementID;
        })
        console.log(item);
        objectTreedata = item;
        objectTree();
    }

    function getResourcesServerURL() { // 获取模型资源的链接地址
        //  return 'http://111.230.241.106:9081/Resource-Management-Service/getResources/test/'   // 局域网IP地址

        return api.ResourceManagementService + '/Resource-Management-Service/getResources/test/'
    }

    function addObjectTree(object, attribute, storage, modelInteractive, modelAttribute) { // 定义树状结构,添加对象的可交互性
        //    var modelAttribute = ["包装机辅机", "卷烟机", 0, "包装机主机"]  attribute
        // 具体定义到场景中的机型，后期不要这些东西，有些对象地层级不清楚，可能只有两种机器，所以这种方式不适用全部机器
        var isAutoModel = true;
        if (isAutoModel) {

            var storageData = storage;
            if (storage != null) {

            }
            // 将所有的objectTreedata 的check 重置false
            objectTreedata.filter(metaData => {
                if (metaData.checked) {
                    metaData.checked = "false"
                }
            })
            console.log(object.name);
            var addedObjectName = object.name.split('TP')[0];
            var addedObjectID = object.name.split('TP')[1];
            console.log(addedObjectID);
            currentTreeID = addedObjectID;
            var newObject;
            if (object.name.indexOf('EmptyGroup') > -1) {
                newObject = {
                    id: object.name,
                    label: object.name,
                    index: 0,
                    type: "group",
                    checked: "false",
                    helper: "false",
                    color: "#ffffff",
                    defaultName: object.name,
                    isCanMove: true, // 允许被移动，即可以作为对象的子对象
                    isCanDelete: true, // 允许被删除
                    isCanAccept: true, // 允许当前对象接受子对象，即对象可以作为父级对象
                    isCanNamed: true, // 允许修改当前对象的名称
                    opacity: 1,
                    visible: true,
                    "className": "element-icon icon-camerazu tree-icon"
                }
            } else if (object.type.indexOf("Camera") > -1) {
                // 添加场景的相机   暂时没有用到
            } else if (object.type.indexOf("Light") > -1) {
                newObject = {
                    id: object.name,
                    label: object.type,
                    index: 0,
                    type: "light",
                    checked: "false",
                    helper: "false",
                    color: "#ffffff",
                    defaultName: object.name,
                    isCanMove: false, // 允许被移动，即可以作为对象的子对象
                    isCanDelete: true, // 允许被删除
                    isCanAccept: false, // 允许当前对象接受子对象，即对象可以作为父级对象
                    isCanNamed: true, // 允许修改当前对象的名称
                    opacity: 1,
                    visible: true,
                    "className": "element-icon icon-cameraai251 tree-icon"
                }
                console.log(object);
            } else if (object.name.indexOf('floor') > -1) { // 根据对象的层级结构，生成对应的树状结构
                newObject = {
                    id: object.name,
                    label: 'floor',
                    index: 0,
                    checked: "false",
                    helper: "false",
                    defaultName: object.name,
                    isCanMove: true, // 允许被移动，即可以作为对象的子对象
                    isCanDelete: true, // 允许被删除
                    isCanAccept: true, // 允许当前对象接受子对象，即对象可以作为父级对象
                    isCanNamed: true, // 允许修改当前对象的名称
                    visible: true,
                    "className": "element-icon icon-camerasanwei tree-icon",
                }
            }
            // else if (object.children.length == 4) { // 模型设定模型测试的机器型号为固定之前测试的型号
            //     newObject = {
            //         id: addedObjectID,
            //         label: addedObjectName,
            //         level: 1,
            //         checked: "true",
            //         helper: true,
            //         belond: false,
            //         defaultName: addedObjectName,
            //         isCanMove: true, // 允许被移动，即可以作为对象的子对象
            //         isCanDelete: true, // 允许被删除
            //         isCanAccept: false, // 允许当前对象接受子对象，即对象可以作为父级对象
            //         isCanNamed: true, // 允许修改当前对象的名称
            //         "className": "element-icon icon-camerasanwei tree-icon",
            //         children: [{
            //                 id: object.name + "L1",
            //                 InteractiveEvent: true, // 来自用户的resource json
            //                 InteractiveControl: false,
            //                 label: object.children[0].name,
            //                 type: object.children[0].type,
            //                 index: 0,
            //                 belond: true,
            //                 defaultName: object.name + "L1",
            //                 isCanMove: false, // 允许被移动，即可以作为对象的子对象
            //                 isCanDelete: false, // 允许被删除
            //                 isCanAccept: false, // 允许当前对象接受子对象，即对象可以作为父级对象
            //                 isCanNamed: true, // 允许修改当前对象的名称
            //                 objectBelondName: storage != null ? storage.modelContent.data[0].objectBelondName : "",
            //                 machineType: attribute[0],
            //                 EventContent: storage != null ? storage.modelContent.data[0].EventContent : "",
            //                 EventMiniPanelName: storage != null ? storage.modelContent.data[0].EventMiniPanelName : "",
            //                 EventMiniPanelBackground: storage != null ? storage.modelContent.data[0].EventMiniPanelBackground : "",
            //                 "className": "element-icon icon-camera3dbox tree-icon"
            //             }, {
            //                 id: object.name + "L2",
            //                 InteractiveEvent: true,
            //                 InteractiveControl: false,
            //                 label: object.children[1].name,
            //                 type: object.children[1].type,
            //                 index: 1,
            //                 belond: true,
            //                 defaultName: object.name + "L2",
            //                 isCanMove: false, // 允许被移动，即可以作为对象的子对象
            //                 isCanDelete: false, // 允许被删除
            //                 isCanAccept: false, // 允许当前对象接受子对象，即对象可以作为父级对象
            //                 isCanNamed: true, // 允许修改当前对象的名称
            //                 objectBelondName: storage != null ? storage.modelContent.data[1].objectBelondName : "",
            //                 machineType: attribute[1],
            //                 EventContent: storage != null ? storage.modelContent.data[1].EventContent : "",
            //                 EventMiniPanelName: storage != null ? storage.modelContent.data[1].EventMiniPanelName : "",
            //                 EventMiniPanelBackground: storage != null ? storage.modelContent.data[1].EventMiniPanelBackground : "",
            //                 "className": "element-icon icon-camera3dbox tree-icon"
            //             },
            //             {
            //                 id: object.name + "L3",
            //                 InteractiveEvent: false,
            //                 InteractiveControl: false,
            //                 label: object.children[2].name,
            //                 type: object.children[2].type,
            //                 index: 2,
            //                 belond: false,
            //                 defaultName: object.name + "L3",
            //                 isCanMove: false, // 允许被移动，即可以作为对象的子对象
            //                 isCanDelete: false, // 允许被删除
            //                 isCanAccept: false, // 允许当前对象接受子对象，即对象可以作为父级对象
            //                 isCanNamed: true, // 允许修改当前对象的名称
            //                 objectBelondName: storage != null ? storage.modelContent.data[2].objectBelondName : "",
            //                 machineType: attribute[2],
            //                 EventContent: storage != null ? storage.modelContent.data[2].EventContent : "",
            //                 EventMiniPanelName: storage != null ? storage.modelContent.data[2].EventMiniPanelName : "",
            //                 EventMiniPanelBackground: storage != null ? storage.modelContent.data[2].EventMiniPanelBackground : "",
            //                 "className": "element-icon icon-camera3dbox tree-icon"
            //             }, {
            //                 id: object.name + "L4",
            //                 InteractiveEvent: true,
            //                 InteractiveControl: false,
            //                 label: object.children[3].name,
            //                 type: object.children[3].type,
            //                 index: 3,
            //                 belond: true,
            //                 defaultName: object.name + "L4",
            //                 isCanMove: false, // 允许被移动，即可以作为对象的子对象
            //                 isCanDelete: false, // 允许被删除
            //                 isCanAccept: false, // 允许当前对象接受子对象，即对象可以作为父级对象
            //                 isCanNamed: true, // 允许修改当前对象的名称
            //                 objectBelondName: storage != null ? storage.modelContent.data[3].objectBelondName : "",
            //                 machineType: attribute[3],
            //                 EventContent: storage != null ? storage.modelContent.data[3].EventContent : "",
            //                 EventMiniPanelName: storage != null ? storage.modelContent.data[3].EventMiniPanelName : "",
            //                 EventMiniPanelBackground: storage != null ? storage.modelContent.data[3].EventMiniPanelBackground : "",
            //                 "className": "element-icon icon-camera3dbox tree-icon"
            //             }
            //         ]
            //     }
            // }
            else {
                // 根据加载的对象中的层级结构来重新定义树状结构的层级对象
                // 修改步骤：1.当前模型与业务契合比较紧密，如果单纯的模型的话，将模型的属性展示并修改是很好处理的
                //          2.涉及到业务、同时需要把模型的多样性也考虑进来，现在遇到了矛盾点:业务需要模型的特性、卷烟机、主机、辅机；然而模型并没有这些特性供大家来处理和使用
                //
                // 场景的对象在保存的过程中，重新把模型的结构变了之后，场景的模型需要重新加载,场景可以根据树状结构将场景中的对象复现；
                // 场景做一下测试，在保存场景的时候，将树状结构传入场景的数据配置文件，根据场景数据的配置文件来复现当前对象的所有场景父子对象的关系
                // storage !=null ? storage.modelContent.data[i].ModelChildrenMechineType : attribute[i]
                console.log(storage);
                var children = []
                for (var i = 0; i < object.children.length; i++) {
                    console.log(attribute[i]);
                    if (object.children[i].type == 'Mesh') {
                        var child = {
                            id: currentTreeID + "L" + i,
                            InteractiveEvent: storage != null ? storage.modelContent.data[i].InteractiveEvent : modelAttribute[i] == null ? false : true,
                            InteractiveControl: storage != null ? storage.modelContent.data[i].InteractiveControl : modelAttribute[i] == null ? false : true, // Interactive != null && modelInteractive[i] == 0 ? false : true,
                            label: object.children[i].name,
                            index: i,
                            visible: true, // 显示与隐藏当前对象
                            // belond: attribute[i]=="玻璃"||attribute[i]=="管道"?false:true,  // 定义对象根据模型的类型，定义是否有没有这个事情
                            belond: storage != null ? storage.modelContent.data[i].MechineNameState == '' ? false : true : modelAttribute[i] == null ? false : true, // 10-30 定义当前对象是否有事件
                            defaultName: object.name + "L" + i,
                            isCanMove: false, // 允许被移动，即可以作为对象的子对象
                            isCanDelete: false, // 允许被删除
                            isCanAccept: false, // 允许当前对象接受子对象，即对象可以作为父级对象
                            isCanNamed: true, // 允许修改当前对象的名称
                            type: object.children[i].type,
                            objectBelondName: storage != null ? storage.modelContent.data[i].objectBelondName : "",
                            // machineType: attribute[i],
                            machineBelondName: storage != null ? storage.modelContent.data[i].machineBelondName : "", // 用于绑定自对象的id  2020-2-22
                            isShowModelDetail: true,
                            isShowMaxiPanel: true,
                            machineType: storage != null ? storage.modelContent.data[i].machineType : attribute[i],
                            ModelChildrenMechineType: storage != null ? storage.modelContent.data[i].ModelChildrenMechineType : modelAttribute[i],
                            EventContent: storage != null ? storage.modelContent.data[i].EventContent : "",
                            EventMiniPanelName: storage != null ? storage.modelContent.data[i].EventMiniPanelName : "",
                            EventMiniPanelBackground: storage != null ? storage.modelContent.data[i].EventMiniPanelBackground : "",
                            "className": "element-icon icon-camera3dbox tree-icon"
                        }
                        children.push(child);
                    }
                }
                console.log(children);
                newObject = {
                    id: storage != null ? storage.DefaultName.split('TP')[1] : addedObjectID,
                    label: storage != null ? storage.Name.split('TP')[0] : addedObjectName,
                    level: 1,
                    checked: "true",
                    visible: true, // 显示与隐藏当前对象
                    helper: true,
                    belond: false, // 对象是一个group ，不允许有数据绑定
                    defaultName: storage != null ? storage.DefaultName : addedObjectName,
                    isCanMove: true, // 允许被移动，即可以作为对象的子对象
                    isCanDelete: true, // 允许被删除
                    isCanAccept: false, // 允许当前对象接受子对象，即对象可以作为父级对象
                    isCanNamed: true, // 允许修改当前对象的名称
                    "className": "element-icon icon-camerasanwei tree-icon",
                    children: children
                }
                console.log(newObject);
            }
            objectTreedata.push(newObject);
            console.log(newObject);
            return objectTreedata;
        } else {
            // 定义加载的模型可以按照模型的层级结构进行渲染
            var storageData = storage;
            if (storage != null) {

            }
            // 将所有的objectTreedata 的check 重置false
            objectTreedata.filter(metaData => {
                if (metaData.checked) {
                    metaData.checked = "false"
                }
            })
            var addedObjectName = object.name.split('TP')[0];
            var addedObjectID = object.name.split('TP')[1];
            console.log(addedObjectName);
            currentTreeID = addedObjectID;
            var treeData = [];
            // isAutoModel为false 的时候，意思就是可以随意模型加载，本方法就是用来加载任意层级的模型
            var newObject = createObjectTree(object, attribute, storage, modelInteractive, treeData);
            objectTreedata.push(newObject);
            console.log(newObject);
            return objectTreedata;

        }
    }
    // isAutoModel为false 的时候，意思就是可以随意模型加载，本方法就是用来加载任意层级的模型，加载任意模型的方法
    var createObjectTree = function(object, attribute, storage, modelInteractive) { // 递归显示当前对象的所有层级关系
        var addedObjectName = object.name.split('TP')[0];
        var addedObjectID = object.name.split('TP')[1];
        console.log(addedObjectID);
        var newObject = { // 第一级对象
            id: addedObjectID,
            label: addedObjectName,
            level: 1,
            checked: "true",
            helper: true,
            belond: false,
            "className": "element-icon icon-camerasanwei tree-icon",
            children: []
        };
        for (var i = 0; i < object.children.length; i++) {
            if (object.children[i].children.length > 0) {
                var object = object.children[i];
                var children = createObjectTree(object, null, null, null);
                var parentObject = { // 第一级对象
                    id: addedObjectID,
                    label: addedObjectName,
                    level: 1,
                    checked: "true",
                    helper: true,
                    belond: false,
                    "className": "element-icon icon-camerasanwei tree-icon",
                    children: children
                }
                newObject.children.push(parentObject);
            } else {
                console.log(attribute);
                var children = {
                    id: object.name + "L" + i,
                    InteractiveEvent: true,
                    InteractiveControl: false,
                    label: object.children[i].name,
                    index: i,
                    belond: true,
                    objectBelondName: storage != null ? storage.modelContent.data[i].objectBelondName : "",
                    machineType: attribute[i],
                    EventContent: storage != null ? storage.modelContent.data[i].EventContent : "",
                    EventMiniPanelName: storage != null ? storage.modelContent.data[i].EventMiniPanelName : "",
                    EventMiniPanelBackground: storage != null ? storage.modelContent.data[i].EventMiniPanelBackground : "",
                    "className": "element-icon icon-camera3dbox tree-icon"
                }
                console.log(children);
                newObject.children.push(children);
                console.log(newObject);
            }

        }
        return newObject;
    }


    function onDocumentMouseUp() {
        var sceneData = JSON.parse(localStorage.getItem('sceneData'));

        if (!sceneData) {
            return;
        }

        document.removeEventListener("mouseup", onDocumentMouseUp, false);
        document.removeEventListener("mousemove", onShowObjectPosition, false);
        if (clickObject) { // 获取到这个对象之后，不需要保存，二次点击需要保留当前对象是否触发了小面板
            clickObject = null;
        }
        console.log(focusObject);
        console.log(currentObject);
        if (!focusObject) return;
        if (objectState == state.translate) {
            console.log('------位移------');
            sceneData.scene3D.object.filter((object3d) => {
                if (!object3d) return;
                if (object3d.DefaultName == focusObject.name) {

                    if (focusObject.position.x - object3d.Position[0] != 0 ||
                        focusObject.position.z - object3d.Position[2] != 0) {
                        var item = { type: "position", name: "位移", data: focusObject.name, checked: false, objectData: focusObject.position };
                        userHistory.push(item);

                        updateSceneAttribute(focusObject, 'position');
                    }
                }

            })
        } else {
            console.log('------旋转------');
            sceneData.scene3D.object.filter((object3d) => {
                console.log(object3d.DefaultName);
                console.log(focusObject.name);
                if (!object3d) return;
                if (object3d.DefaultName == focusObject.name) {
                    if (object3d.rotationY != focusObject.rotation.y) {

                        var item = { type: "rotation", name: "旋转", data: focusObject.name, checked: false, objectData: focusObject.rotation };
                        userHistory.push(item);


                        updateSceneAttribute(focusObject, 'rotationY')
                    }
                }

            })
        }
        scene.traverse(function(item) {
            if (item instanceof THREE.Group) {
                if (!item) return;
                // 删除掉所有的模型组内的mesh
                if (item.name == 'lineHelper') {
                    item.visible = false;
                }
            }
        });
    }

    var review = function() { // 重做

        var sceneObjectReview = JSON.parse(localStorage.getItem('review')); // 用于复现保存之后的场景
        localStorage.setItem('sceneData', JSON.stringify(sceneObjectReview));
        // 清空场景，再加载
        control.detach();
        objectTreedata = objectTreedata.slice(0, 2); // 表示当前取树对象得前面两位；
        scene.children.filter(child => {
            if (child.name.indexOf('floor') > -1) {
                // 删除floor
                disposeObject(child);
                updateTreeData(child);
                scene.remove(child);
                console.log(scene);
            }
            if (child.name == 'objectGroup') {
                child.children.filter((object) => {
                    updateTreeData(object);
                    // 删除object对象
                    disposeObject(object)
                    child.remove(object);
                })
                scene.remove(child);
            }
        })
        if (group.children.length > 0) { // 情况数组
            group.children.length = 0;
        }
        if (!sceneObjectReview) {
            return
        }
        var onProgress = function(xhr) {

            if (xhr.lengthComputable) {

                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');

            }

        };

        var onError = function() {};

        var modelAttribute = ["包装机辅机", "卷烟机", 0, "包装机主机"] // 重做，当前对象的数据保存有误，需要重新修改
            // var modelAttribute = JSON.parse(modelPath[0].attribute).modelChildrenType;   // 需要修改服务器的子对象的数据形式
        var loader = new THREE.FBXLoader();
        sceneObjectReview.scene3D.object.forEach(function(modelData) {
            loader.load(modelData.Path, function(object) {
                object.name = modelData.Name;
                // if (modelData.Name != "floor") {
                object.position.set(modelData.Position[0], modelData.Position[1], modelData.Position[2]);
                focusObject = object;
                showAxis(focusObject);
                showFocusObjectData(object);
                group.add(object);
                attachObject(object);
                bindLineHelper(object);
                addObjectTree(object, modelAttribute, modelData, null, null)
                scene.add(group);
                objectTree();

            }, onProgress, onError);
        })
    }

    var saveSceneForReview = function() { // 保存场景，用于当点击保存场景的时候，保存一个名为review的localstroage，用于场景重做功能的复现
        var review = localStorage.getItem('sceneData');
        localStorage.setItem('review', review);
    }

    function onShowObjectPosition() {
        if (focusObject == null) {
            showFocusObjectData(focusLightObject);
        } else {
            showFocusObjectData(focusObject);
        }

    }

    function getVRkey() { // 获取对象绑定的vrkey

    }
    // 检测当前对象上是否有绑定id，如果有绑定，即显示当前数据的对象
    function checkAndBindMiniPanel(object) {
        var minipanelShow;
        var name = object.parent.name;
        var sceneData = JSON.parse(localStorage.getItem('sceneData'));
        if (!sceneData) { // 对子对象添加名称
            return
        }
        sceneData.scene3D.object.filter((object) => {
            if (name == object.name) {
                object.modelContent.data.filter(child => {
                    if (child.Name == object.name && child.EventContent != '') {
                        // child.EventContent 用于显示小面板的数据
                        minipanelShow = child.EventContent;
                        return;
                    }

                })
                return;
            }
        })

        if (minipanelShow) {
            switch (object.name) {
                case 'FJ':
                    sceneData.minipanel[2].datas.filter(data => {
                        if (data.miniID == minipanelShow) {
                            var attribute = JSON.parse(data.miniAttribute);
                            // 对接 服务端数据
                        }

                    })
                    break;
                case 'ZJ':
                    sceneData.minipanel[1].datas.filter(data => {
                        if (data.miniID == minipanelShow) {
                            var attribute = JSON.parse(data.miniAttribute);
                            // 对接 服务端数据
                        }
                    })
                    break;
                case 'JYJ':
                    sceneData.minipanel[0].datas.filter(data => {
                        if (data.miniID == minipanelShow) {
                            var attribute = JSON.parse(data.miniAttribute);
                            // 对接 服务端数据
                        }
                    })
                    break;
                default:
            }
        }


    }

    function onDocumentMouseDown(event) {
        // 当用户点击左键
        event.preventDefault();
        document.addEventListener("mouseup", onDocumentMouseUp, false);
        document.addEventListener("mousemove", onShowObjectPosition, false);
        if (focusObject) {
            focusObject.children.filter(object => {
                if (object.name == "lineHelper") {
                    object.visible = true;
                }
            })
        }
        scene.children.filter((object) => { // 去掉场景中的boxhelper 对象
            if (object.name == 'boxHelper') {
                scene.remove(object);
            }
        })
        var intersects = getIntersects(event.clientX, event.clientY);
        if (intersects.length > 0) {
            var res = intersects.filter(function(res) {
                return res && res.object;
            })[0];
            if (res && res.object && !locked) {
                if (res.object.parent.name.indexOf('floor') > -1) return; // 说明当前场景中的floor 对象也可以被点击触发 // 8-28
                for (var i = 0; i < res.object.parent.children.length; i++) {
                    if (res.object.parent.children[i].name == res.object.name) {
                        objectTreedata.filter(tree => {
                            console.log(res.object.parent.name.indexOf(tree.id) > -1)
                            if (tree.id && res.object.parent.name.indexOf(tree.id) > -1) {
                                if (res.object.parent.name.indexOf('floor') > -1) {
                                    currentChildID = tree.id;
                                } else {
                                    currentChildID = tree.children[i].id;
                                }
                            }
                        })
                    }
                }
                console.log(objectTreedata);
                clickObject = res.object; // 添加被点击对象的
                bindBoxHelper(clickObject);
                if (clickObject.material.length > 0) {
                    materialList = clickObject.material;
                } else {
                    materialList = [clickObject.material]
                }
                focusObject = res.object.parent;
                currentObject = focusObject.position;
                showFocusObjectData(res.object.parent);
                attachObject(res.object.parent);
            }
            objectTree();
            if (event.button == 2) {
                isRightClick = true;
            }
        }
    }

    function addSelectedObject(object) {

        selectedObjects = [];
        console.log(object);
        selectedObjects.push(object);
    }
    var raycaster = new THREE.Raycaster();
    var mouseVector = new THREE.Vector3();

    function getIntersects(x, y) {
        x = ((x - container.getBoundingClientRect().left) / container.getBoundingClientRect().width) * 2 - 1;
        y = -((y - container.getBoundingClientRect().top) / container.getBoundingClientRect().height) * 2 + 1;
        mouseVector.set(x, y, 0.5);
        raycaster.setFromCamera(mouseVector, camera);

        return raycaster.intersectObject(group, true);

    }
    $(document).ready(function() {
        setTimeout(function() {
            $.getJSON("static/api/api.json", function(data) {
                api = data.baseroot;
                init();
            })
        }, 400)
        localStorage.setItem('publics', true);
    });
    //*************************************UI 调用3D方法******************************************* */
    function VrToUi_ObjClick(sceneData) { //UI 调用3D方法数据
        var data = {
            type: 'positionxyz',
            data: sceneData
        }
        callback(data);
    }
    var changeMachineID = function(object, index, level, value) {
        console.log(object); // 父级对象的id
        console.log(index); // 子级对象的数组下标
        console.log(level); // 子级对象的层级
        console.log(value); // 用户输入的值
        // 1.修改treedata 里面的值 machineBelondName
        console.log(objectTreedata);
        if (level < 3) {
            objectTreedata.filter(tree => {
                if (tree.id.indexOf(object.data.id) > -1) {
                    tree.children[index].machineBelondName = value;
                    var sceneData = JSON.parse(localStorage.getItem("sceneData"));
                    sceneData.scene3D.object.filter(obj => {
                        if (obj.DefaultName.indexOf(object.data.id) > -1) {
                            obj.modelContent.data[index].machineBelondName = value;
                        }
                    })
                    localStorage.setItem('sceneData', JSON.stringify(sceneData));
                }
            })
        } else {
            // 当机组是某一个对象的子对象的时候，绑定机台号的逻辑
            // 1.
        }

    }
    var isShowModelDetailControl = function (value, id, index) { // 修改treedata的值与localstorage 的值
        // id 表示被选中父级对象的objectid,
        // value 当前对象的
        console.log(value);
        console.log(id);
        console.log(index);
        console.log(objectTreedata)
        objectTreedata.filter(tree => {
            if (tree.id.indexOf(id) > -1) {
                tree.children[index].isShowModelDetail = value;
                var sceneData = JSON.parse(localStorage.getItem("sceneData"));
                sceneData.scene3D.object.filter(obj => {
                    if (obj.DefaultName.indexOf(id) > -1) {
                        obj.modelContent.data[index].isShowModelDetail = value;
                    }
                })
                localStorage.setItem('sceneData', JSON.stringify(sceneData));
            }
        })
    }
    var isShowMaxiPanelControl = function (value, id, index) { // 修改treedata的值与localstorage 的值
        //同时判断当前对象是否有绑定面板，如果有，删除大面板的数据，或者新增大面板数据
        objectTreedata.filter(tree => {
            if (tree.id.indexOf(id) > -1) {
                var sceneData = JSON.parse(localStorage.getItem("sceneData"));
                sceneData.scene3D.object.filter(obj => {
                    if (obj.DefaultName.indexOf(id) > -1) {
                        obj.modelContent.data[index].isShowMaxiPanel = value;
                    }
                })
                localStorage.setItem('sceneData', JSON.stringify(sceneData));
                tree.children[index].isShowMaxiPanel = value;
            }
        })

    }
    var updateObjectName = function (nameValue, id) {
        //更新内存
        console.log(id);
        console.log(nameValue);
        var sceneData = JSON.parse(localStorage.getItem('sceneData'));
        if (sceneData) {
            sceneData.scene3D.object.filter(object => {
                    console.log(object);
                    if (object.DefaultName && object.DefaultName.indexOf(id) > -1) {
                        console.log(object)
                        var name = object.DefaultName.split('TP')[1];
                        // object.Name = nameValue+ 'TP' + name;
                        object.Name = nameValue;
                    }
                })
                // 添加当前对象判断有没有绑定点击事件的逻辑，如果有修改名字的时候，更新当前对象的vrkey
            sceneData.actions.filter(action => {
                if (action.objectID && action.objectID.indexOf(id) > -1) { // 判断对象是否存在
                    action.datas.filter(data => {

                        var name = data.vrkey.split('-')[0];
                        data.vrkey = data.vrkey.replace(name, nameValue);

                    })

                }
            })
            localStorage.setItem('sceneData', JSON.stringify(sceneData));
        }
        // 更新 objectTreedata
        objectTreedata.filter(tree => {
            console.log(tree);
            if (tree.id.indexOf(id) > -1) {
                console.log(tree);
                tree.label = nameValue;
            } else if (tree.children) { // 03-16 对象当作子物体之后，的修改名称问题
                tree.children.filter(child => {
                    if (child.id.indexOf(id) > -1) {
                        child.label = nameValue;
                    }
                })

            }
        })

    }

    var loadResourceObject = function(resourcelist, id) {

            addDragModel(resourcelist, id);
        }
        // 当未选中数据绑定时,选择点击事件，出现minipanelData threeData 无法获取值的现象
    var getEventData = function(type, minipanelData, threeData, checked) { // TODO：流程需要优化,将数据绑定和小面板切换的事件调用了两次,这里可以优化
        console.log(threeData);
        var actionDatas = []
            // 刷新对象上面的miniID
        var sceneData = JSON.parse(localStorage.getItem('sceneData'));

        if (checked) {
            if (!sceneData) {
                // sceneData  对象不存在
                return
            }
            console.log(minipanelData);
            sceneData.scene3D.object.filter(object => {
                    if (object.DefaultName.indexOf(threeData.id) > -1 && object.modelContent.data[threeData.index]) {
                        if (type == "clickEvent") {
                            object.modelContent.data[threeData.index].EventContent = minipanelData.miniId;
                            object.modelContent.data[threeData.index].EventMiniPanelName = minipanelData.miniTitle;
                            object.modelContent.data[threeData.index].EventMiniPanelBackground = minipanelData.name;
                            // if (object.modelContent.data[threeData.index].objectBelondName == '') { // 修改添加事件，使得objectBelondName被动修改问题
                            object.modelContent.data[threeData.index].objectBelondName = threeData.belondName;
                            console.log( object.modelContent.data[threeData.index]);
                            //  }
                        } else if (type == "minichangeEvent") {
                            object.modelContent.data[threeData.index].EventContent = minipanelData.miniId;
                            object.modelContent.data[threeData.index].EventMiniPanelName = minipanelData.miniTitle;
                            object.modelContent.data[threeData.index].EventMiniPanelBackground = minipanelData.name;

                        } else { //  用来定义的滑动事件
                            object.modelContent.data[threeData.index].MousemoveEvent = 1;

                        }
                    }
                })
                // sceneData.minipanel.filter((panel) => {
                //     if (panel.miniID == minipanelData.miniID) {
                //         var attribute = JSON.parse(panel.miniAttribute);

            //         if (attribute.length > 0) {
            //             for (var i = 0; i < attribute.length; i++) {
            //                 attribute[i].vrkey = threeData.belondName + '_' + attribute[i].vrkey;
            //                 var item = {
            //                     mcid: threeData.belondName,
            //                     vrkey: attribute[i].vrkey
            //                 }
            //                 actionDatas.push(item);
            //             }
            //         }


            //     }
            // })

            objectTreedata.filter(treedata => {
                    if (treedata.id == threeData.id) {
                        if (type == "minichangeEvent") {
                            console.log('true mini change');
                            treedata.children[threeData.index].EventContent = minipanelData.miniId;
                            treedata.children[threeData.index].EventMiniPanelBackground = minipanelData.name;
                            treedata.children[threeData.index].EventMiniPanelName = minipanelData.miniTitle;
                        } else {
                            treedata.children[threeData.index].EventContent = minipanelData.miniId;
                            treedata.children[threeData.index].EventMiniPanelBackground = minipanelData.name;
                            treedata.children[threeData.index].EventMiniPanelName = minipanelData.miniTitle;
                            treedata.children[threeData.index].objectBelondName = threeData.belondName;
                        }

                    }
                    // 更新当前对象是否有点击事件

                })
                // 将action 中的vrkey 和sckey 换掉



            if (type == "clickEvent") {

                var actionName = threeData.belondName;
                var isShowMaxi = true;
                // console.log(actionName);
                var machineNum = "";
                var ModelChildrenMechineType = ""
                sceneData.scene3D.object.filter(object => {
                    if (object.DefaultName.indexOf(threeData.id) > -1 && object.modelContent.data[threeData.index]) {
                        console.log(object);
                        actionName = object.modelContent.data[threeData.index].objectBelondName
                        machineNum = object.Name;
                        ModelChildrenMechineType = object.modelContent.data[threeData.index].ModelChildrenMechineType;
                        isShowMaxi = object.modelContent.data[threeData.index].isShowMaxiPanel;
                    }
                })
                console.log(minipanelData);
                // var attribute = JSON.parse(minipanelData.miniAttribute);
                var attribute = minipanelData.miniAttribute;
                // 判断当前对象的threedata 中的 isShowModelDetail的值，如果为true，则新增数据对象到action 中；
                if (minipanelData.maxminiAttribute) {
                    // var maxiAttribute = JSON.parse(minipanelData.maxminiAttribute);
                    var maxiAttribute = minipanelData.maxminiAttribute;
                    var maxiActions = []
                    if (isShowMaxi && maxiAttribute.length > 0) {
                        for (var i = 0; i < maxiAttribute.length; i++) {
                            var item = {
                                //  mcid: threeData.belondName,
                                mcid: actionName,
                                // vrkey: threeData.belondName,
                                vrkey: machineNum + '-' + ModelChildrenMechineType + '-' + maxiAttribute[i].name,
                                // 0807 接口修改，将小面板中的sckey 与 服务端的数据的配置文件中的value 值对应起来了;
                                sckey: maxiAttribute[i].sckey, // 0731 一般来说sckey 对接到服务端，传入的应该是小面板的sckey,接口数据调试只能换成name;
                                value: "0",
                                unit: "",
                                propName:maxiAttribute[i].id,
                            }
                            maxiActions.push(item);
                        }
                    }
                }
                var serverMaxItem = {
                    id: minipanelData.miniId,
                    objectID: threeData.id,
                    level: threeData.level,
                    index: threeData.index,
                    type: "max-panel",
                    datas: maxiActions,
                }
                if (attribute.length > 0) {
                    console.log(actionName);
                    for (var i = 0; i < attribute.length; i++) {
                        var item = {
                            //  mcid: threeData.belondName,
                            mcid: actionName,
                            // vrkey: threeData.belondName,
                            vrkey: machineNum + '-' + ModelChildrenMechineType + '-' + attribute[i].name,
                            // 0807 接口修改，将小面板中的sckey 与 服务端的数据的配置文件中的value 值对应起来了;
                            sckey: attribute[i].sckey, // 0731 一般来说sckey 对接到服务端，传入的应该是小面板的sckey,接口数据调试只能换成name;
                            value: "0",
                            unit: "",
                            propName:attribute[i].id,
                        }
                        actionDatas.push(item);
                    }
                }

                // 同时生成数据的请求json文件
                var serverItem = {
                    id: minipanelData.miniId,
                    objectID: threeData.id,
                    level: threeData.level,
                    index: threeData.index,
                    type: "min-panel",
                    datas: actionDatas,
                }
                console.log(JSON.stringify(serverItem));
                sceneData.actions.push(serverMaxItem);
                sceneData.actions.push(serverItem);
            }
            if (type == "minichangeEvent") {
                var actionName = threeData.belondName;
                var machineNum = "";
                var ModelChildrenMechineType = ""
                var isShowMaxi = true;
                sceneData.scene3D.object.filter(object => {

                    if (object.DefaultName.indexOf(threeData.id) > -1 && object.modelContent.data[threeData.index]) {
                        // if (type == "clickEvent") {
                        console.log(object);
                        actionName = object.modelContent.data[threeData.index].objectBelondName;
                        machineNum = object.Name;
                        ModelChildrenMechineType = object.modelContent.data[threeData.index].ModelChildrenMechineType;
                        isShowMaxi = object.modelContent.data[threeData.index].isShowMaxiPanel;
                        //   }
                    }
                })
                var attribute = JSON.parse(minipanelData.miniAttribute);
                var maxiAttribute = JSON.parse(minipanelData.maxminiAttribute);
                var maxiActions = []
                if (isShowMaxi && maxiAttribute.length > 0) {
                    for (var i = 0; i < maxiAttribute.length; i++) {
                        var item = {
                            //  mcid: threeData.belondName,
                            mcid: actionName,
                            // vrkey: threeData.belondName,
                            vrkey: machineNum + '-' + ModelChildrenMechineType + '-' + maxiAttribute[i].name,
                            // 0807 接口修改，将小面板中的sckey 与 服务端的数据的配置文件中的value 值对应起来了;
                            sckey: maxiAttribute[i].name, // 0731 一般来说sckey 对接到服务端，传入的应该是小面板的sckey,接口数据调试只能换成name;
                            value: "0",
                            unit: "",
                        }
                        maxiActions.push(item);
                    }
                }
                console.log(maxiActions);
                if (attribute.length > 0) {
                    for (var i = 0; i < attribute.length; i++) {
                        var item = {
                            //  mcid: threeData.belondName,
                            mcid: actionName,
                            // vrkey: threeData.belondName,
                            vrkey: machineNum + '-' + ModelChildrenMechineType + '-' + attribute[i].name,
                            // 0807 接口修改，将小面板中的sckey 与 服务端的数据的配置文件中的value 值对应起来了;
                            sckey: attribute[i].name, // 0731 一般来说sckey 对接到服务端，传入的应该是小面板的sckey,接口数据调试只能换成name;
                            value: "0",
                            unit: "",
                        }
                        actionDatas.push(item);
                    }
                }
                // 先找到action,通过objectID,layer,index,匹配到对象，修改minipanel ID 、以及内部的datas
                sceneData.actions.filter(action => {
                    if (action.objectID == threeData.id && action.level == threeData.level &&
                        action.index == threeData.index && action.type == "min-panel") {
                        action.id = minipanelData.miniId;
                        action.datas = actionDatas;
                    }
                    if (action.objectID == threeData.id && action.level == threeData.level &&
                        action.index == threeData.index && action.type == "max-panel") {
                        action.id = minipanelData.miniId;
                        action.datas = maxiActions;
                    }
                })

            }
            localStorage.setItem('sceneData', JSON.stringify(sceneData));
            localStorage.setItem('publics', false);
        } else {
            if (type == "clickEvent") {
                for (var index = sceneData.actions.length - 1; index >= 0; index--) {
                    if (threeData.level == sceneData.actions[index].level &&
                        threeData.index == sceneData.actions[index].index && threeData.id == sceneData.actions[index].objectID) {
                        sceneData.actions.splice(index, 1);
                    }
                }
                sceneData.scene3D.object.filter(object => { // 当场景对象被取消绑定的点击事件之后，场景的数据清空

                    if (object.Name.indexOf(threeData.id) > -1 && object.modelContent.data[threeData.index]) {
                        if (type == "clickEvent") {
                            console.log(object.modelContent.data[threeData.index]);
                            object.modelContent.data[threeData.index].EventContent = '';
                            object.modelContent.data[threeData.index].EventMiniPanelName = '';
                            object.modelContent.data[threeData.index].EventMiniPanelBackground = '';
                            object.modelContent.data[threeData.index].objectBelondName = '';
                        } else { //  用来定义的滑动事件
                            object.modelContent.data[threeData.index].MousemoveEvent = 1;

                        }
                    }
                })

            } else if (type == "moveEvent") {
                sceneData.scene3D.object.filter(object => { // 用来取消定义的滑动事件

                    if (object.Name.indexOf(threeData.id) > -1 && object.modelContent.data[threeData.index]) {
                        object.modelContent.data[threeData.index].MousemoveEvent = 0;
                    }
                })


            }
            localStorage.setItem('sceneData', JSON.stringify(sceneData));
            localStorage.setItem('publics', false);

            console.log(type);
            // 更新treedata 的数据信息 objectTreedata
            objectTreedata.filter(treedata => {
                console.log(treedata);
                if (treedata.id == threeData.id) {
                    treedata.children[threeData.index].objectBelondName = threeData.belondName;
                    treedata.children[threeData.index].modelStateName = threeData.belondName;
                    console.log(minipanelData);

                }
                // 更新当前对象是否有点击事件

            })

            if (type == "noclickEvent") { // 用于修改当前所属对象
                console.log('noclickEvent');
                var minipanelID = '';
                sceneData.scene3D.object.forEach((objectIndex, index) => {
                    if (objectIndex.DefaultName.indexOf(threeData.id) > -1) {
                        objectIndex.modelContent.data[threeData.index].objectBelondName = threeData.belondName;
                        objectIndex.modelContent.data[threeData.index].MechineNameState = threeData.vrkey;
                        minipanelID = objectIndex.modelContent.data[threeData.index].EventContent;
                    }
                })

                console.log(threeData);
                console.log(minipanelID);
                if (sceneData.actions.length > 0) {
                    var actionName = threeData.belondName;
                    sceneData.scene3D.object.filter(object => {

                        if (object.DefaultName.indexOf(threeData.id) > -1 && object.modelContent.data[threeData.index]) {
                            if (type == "clickEvent") {
                                actionName = object.modelContent.data[threeData.index].objectBelondName

                            }
                        }
                    })
                    console.log(actionName);
                    sceneData.actions.filter(action => {
                        if (action.id == minipanelID && threeData.level == action.level &&
                            threeData.index == action.index && threeData.id == action.objectID) {
                            action.datas.filter(data => {
                                data.mcid = actionName;
                            })
                        } else if (action.id == 'mechinestatePanel') {
                            var vrkeyArray = [];
                            for (var i = 0; i < action.datas.length; i++) {
                                vrkeyArray.push(action.datas[i].vrkey);

                            }
                            if (vrkeyArray.indexOf(threeData.vrkey) < 0) {
                                var item = { mcid: actionName, vrkey: threeData.vrkey, sckey: threeData.sckey, value: 1, unit: '' }
                                action.datas.push(item);
                            }
                        }
                    })

                }

                localStorage.setItem('sceneData', JSON.stringify(sceneData));
                localStorage.setItem('publics', false);
            } else {
                objectTreedata.filter(treedata => {
                    if (treedata.id == threeData.id) {
                        treedata.children[threeData.index].EventContent = "";
                        treedata.children[threeData.index].EventMiniPanelBackground = "";
                        treedata.children[threeData.index].EventMiniPanelName = "";

                    }

                })
            }
        }



    }
    var setMouseMoveEvent = function(type, threeData) {

    }
    var objectTree = function() {

        // var length = scene.children.length;
        let sourceTree = {
            treeData: "",
            ID: "",
            childID: "",
            material: "",
            isRightButtonClick: false,
            history: [],
            loaded: true,
        };
        var materialArray = []
        if (materialList.length > 0) {
            materialList.filter((material) => {
                materialArray.push(material.name);
            })
        }
        sourceTree.treeData = objectTreedata;
        sourceTree.loaded = loaded;
        sourceTree.ID = currentTreeID;
        sourceTree.childID = currentChildID;
        sourceTree.material = materialList.length > 0 ? materialArray : "";
        sourceTree.isRightButtonClick = isRightClick;
        sourceTree.history = userHistory;
        $eventBus.$emit('sourceTree', sourceTree)
        return sourceTree;
    }
    var deleteObjectFromElement = function(objectID) { // 根据用户UI 的点击删除对象
        console.log(objectID);
        console.log(scene.children);
        var isChildren = false;
        // if (objectID.indexOf('L') > -1) {   // 添加删除灯光逻辑
        //     return false;
        // }

        scene.children.filter((meteData) => {
            if (meteData.name == objectID) { // 删除场景中的光照效果
                scene.remove(meteData);
                updateTreeData(objectID);
            }
            control.detach();
            if (meteData.name == "objectGroup") {
                // meteData.children.filter((object) => {
                //     if (object.name.indexOf(objectID) > -1) { // 删除对象,通过识别,删除父级对象
                //         console.log(object.name);
                //         updateTreeData(objectID);
                //         // 删除object对象
                //         disposeObject(object)
                //         meteData.remove(object);
                //     }
                //     // else if(     // 当子对象添加删除按钮的时候，本次逻辑表示删除子对象可以全部删除相应的父级对象
                //     //     objectID.indexOf(object.name) > -1  || objectID.indexOf('L') > -1 // 删除子级对象
                //     // ){
                //     //     // 删除子对象
                //     //     updateTreeData(object.name.indexOf('T')>-1?object.name.substring(1):object.name);
                //     //     // 删除object对象
                //     //     disposeObject(object)
                //     //     meteData.remove(object);
                //     //     // 删除失败
                //     // }
                // })
                meteData.traverse(child => {
                    if (child.name.indexOf(objectID) > -1) { // 删除对象,通过识别,删除父级对象
                        console.log(child.name);
                        updateTreeData(objectID);
                        // 删除object对象
                        disposeObject(child)
                        child.parent.remove(child);
                        // meteData.remove(child);
                    }
                })
            }
        })
        console.log(scene.children);
        isRightClick = false; // 右键UI 消失
        // 内存中删除对象，防止删除之后的对象刷新之后又复现了；
        var sceneData = JSON.parse(localStorage.getItem('sceneData'));
        sceneData.scene3D.object.forEach((element, index) => {
            if (element.DefaultName.indexOf(objectID) > -1) {
                sceneData.scene3D.object.splice(index, 1);
            }
        });
        sceneData.scene3D.light.forEach((element, index) => { // 删除新增对象localstorage 数据
            if (element.Name.indexOf(objectID) > -1) {
                sceneData.scene3D.light.splice(index, 1);
            }
        });
        localStorage.setItem('sceneData', JSON.stringify(sceneData));
    }
    var updateCameraFOV = function(id) { //视场角
        if (camera) {
            camera.fov = parseInt(document.getElementById(id).value);
            camera.updateProjectionMatrix()
            updateCamera(camera, 'cameraFOV');
        }
    }

    var updateCameraNear = function(id) { //远视距
        if (camera) {
            camera.far = parseInt(document.getElementById(id).value);
            camera.updateProjectionMatrix()
            console.log(camera);
            updateCamera(camera, 'cameraFar');
        }
    }

    var updateCameraFar = function(id) { //近视距
        if (camera) {
            camera.near = parseInt(document.getElementById(id).value);
            camera.updateProjectionMatrix()
            updateCamera(camera, 'cameraNear');
        }
    }
    var updateLightOpacity = function(id) { //灯照强度
        if (focusLightObject) {
            focusLightObject.intensity = document.getElementById(id).value;
            updateLight(focusLightObject, 'lightOpacity');
        }
    }
    var updateLightColor = function(value) { //灯光强度
        if (focusLightObject) {
            focusLightObject.color = new THREE.Color(value);
            console.log(new THREE.Color(value));
            updateLight(focusLightObject, 'lightColor');
        }
    }

    var updateRotaitonY = function(id, ID) { // 旋转当前对象
        if (ID) {
            scene.children.filter(child => {
                if (child.name == "objectGroup") {
                    child.children.filter(object => {
                        console.log(object);
                        if (object.name.indexOf(ID) > -1) {
                            console.log(object.name);
                            object.rotation.y = (document.getElementById(id).value / 180) * Math.PI; //角度变换
                            console.log(object);
                            updateSceneAttribute(object, 'rotationY');
                        }
                    })
                }
            })


        }
    }
    var updatePositionX = function(id, ID) { //位置X
        if (ID) {
            scene.children.filter(child => {
                if (child.name == "objectGroup") {
                    child.children.filter(object => {
                        console.log(object);
                        if (object.name.indexOf(ID) > -1) {
                            object.position.setX(parseInt(document.getElementById(id).value));
                            // 刷新json对象的x轴坐标
                            updateSceneAttribute(object, 'positionX');
                        }
                    })
                }
            })


        }
    }

    var updatePositionY = function(id, ID) { //位置Y
        if (ID) {
            scene.children.filter(child => {
                if (child.name == "objectGroup") {
                    child.children.filter(object => {
                        console.log(object);
                        if (object.name.indexOf(ID) > -1) {
                            console.log(object.name);
                            object.position.y = parseInt(document.getElementById(id).value)
                            updateSceneAttribute(object, 'positionY');
                        }
                    })
                }
            })


        }
    }

    var updatePositionZ = function(id, ID) { //位置Z

        if (ID) {
            scene.children.filter(child => {
                if (child.name == "objectGroup") {
                    child.children.filter(object => {
                        console.log(object);
                        if (object.name.indexOf(ID) > -1) {
                            console.log(object.name);
                            object.position.z = parseInt(document.getElementById(id).value)
                            updateSceneAttribute(object, 'positionZ');
                        }
                    })
                }
            })


        }
    }
    var setVisible = function(value, ID) { // 更新位置信息，保存位置信息
        console.log(ID);
        console.log(value);
        console.log(scene);
        // 11-15 操作对象的可见之后,
        if (ID) {
            if (ID == '10001-Light') {
                direction_light.visible = value;
                return;
            }
            scene.children.filter(child => {
                if (child.name == "objectGroup") {
                    child.children.filter(object => {
                        console.log(object);
                        if (object.name.indexOf(ID) > -1) {
                            console.log(object.name);
                            object.visible = value;
                            objectTreedata.filter(treedata => {
                                if (ID.indexOf(treedata.id) > -1) {
                                    treedata.visible = value;
                                }
                            })
                            console.log(objectTreedata);
                            updateSceneAttribute(object, 'visible');
                            if (value) {
                                control.detach();
                            } else {
                                control.detach(object);
                            }
                        } else if (ID.indexOf(object.name) > -1 && ID.indexOf('L') > -1) {
                            var index = ID.split('L')[1];
                            object.children[index].visible = value;
                            objectTreedata.filter(treedata => {
                                if (ID.indexOf(treedata.id) > -1) {
                                    treedata.children[3].visible = value;
                                }
                            })

                            if (value) {
                                control.detach();
                            }
                        }
                    })
                }
                if (child.name == ID) { // 灯光控制
                    // 灯光值相等
                    child.visible = value;

                    objectTreedata.filter(treedata => {
                        if (ID.indexOf(treedata.id) > -1) {
                            treedata.visible = value;
                        }
                    })
                    if (!value) {
                        control.detach();
                    }
                    updateSceneAttribute(child, 'visible');
                }
                // 刷新树状接口的数据，同时更新scenedata本地数据
            })

        }
        isRightClick = false; // 右键UI 消失
    }
    var lockObject = function() { //锁定点击icon
        locked = !locked;
    }
    var playScene = function() { // 二维场景的事件添加  运行点击icon
        // 禁用control、去掉辅助线、
        control.enabled = false;
        // 1.将数据的配置上传到服务器       ok
        // 2.禁用对象的控制信息             前端控制即可
        // 3.将点击事件写入到场景内部对象中；
        // 4.小面板的初始定义
    }
    var changeToRotation = function() { //旋转点击icon
        control.setMode("rotate");
        objectState = state.rotate;
        if (focusObject != null) {
            showAxis(focusObject);
        } else {
            showAxis(focusLightObject);
        }
    }
    var changeToTranslate = function() { //位移点击
        control.setMode("translate");
        objectState = state.translate;
        if (focusObject != null) {
            showAxis(focusObject);
        } else {
            showAxis(focusLightObject);
        }
    }
    var test = function() {
        console.log("test");
    }
    var rendererUpdate = function(type, value) {
        // shadowMapType gammaFactor gammaOutput GammaInput shadowMapEnable antialias
        switch (type) {
            case 'shadowMapType':
                let type = 1;
                if (value == 'PCFShadowMap') {
                    type = 1;
                } else if (value == 'PCFSoftShadowMap') {
                    type = 2;
                } else if (value == 'BasicShadowMap') {
                    type = 3;
                } else {
                    type = 0;
                }
                renderer.shadowMap.type = type;
                break;
            case 'gammaFactor':
                renderer.gammaFactor = value;
                break;
            case 'gammaOutput':
                renderer.gammaOutput = value;
                break;
            case 'GammaInput':
                renderer.GammaInput = value;
                break;
            case 'shadowMapEnable':
                renderer.shadowMap.enabled = value;
                break;
            default:
        }
        console.log(renderer);

    }
    var wireframeControls = function(value) {
        console.log(scene);
        // 控制场景的所有对象的材质，将其材质设定wareframe 设定为true,并刷新
        scene.children.filter(child => {
            if (child.name = 'object3D') {
                child.children.filter(object => {
                    object.traverse((mesh) => {
                        if (mesh instanceof THREE.Mesh) {
                            if (mesh.material.length > 0) {
                                mesh.material.filter(mater => {
                                    mater.wireframe = value;
                                    mater.needsUpdate = true;
                                })
                            } else {
                                mesh.material.wireframe = value;
                                mesh.material.needsUpdate = true;
                            }
                        }
                    })
                })
            }

        })
    }
    var helperControls = function(type, value) {
        // 控制场景的grid camera light state 坐标系 的显示与隐藏
        console.log(type);
        console.log(value);
        switch (type) {
            case 'grid':
                grid.visible = value;
                break;
            case 'camera':
                cameraHelper.visible = value;
                break;
            case 'light':
                directionalHelper.visible = value;
                break;
            case 'state':
                console.log(stats);
                if (value) {
                    stats.dom.style.display = 'block';
                } else {
                    stats.dom.style.display = 'none';
                }
                // 控制state 显示与隐藏
                // 控制viewport 的第二个子对象的display即可
                break;
            case 'axis':
                axisModel.visible = value;
                break;
            default:

        }

    }
    var clearHistory = function() {
        console.log("tiaoyong")
        if (userHistory.length > 0) {
            userHistory = [];
            objectTree();
        } else {
            console.log('当前历史记录为空');
        }
    }

    var deleteHistoryItem = function(index) {
        console.log(userHistory);
        userHistory.splice(index, 1);
        console.log(userHistory);
        // 根据index 进行场景复现;
        console.log(scene);
    }

    var showHistory = function(index) {

        for (var i = 0; i < index + 1; i++) {
            var item = userHistory[i];
            scene.children.filter(child => {
                if (child.name == "objectGroup") {
                    child.children.filter(object => {
                        if (object.name == userHistory[i].dara) {

                            if (userHistory[i].type == 'position') {
                                object.position.set(userHistory[i].objectData.x,
                                    userHistory[i].objectData.y,
                                    userHistory[i].objectData.z);
                            } else {
                                object.rotation.set(userHistory[i].objectData.x,
                                    userHistory[i].objectData.y,
                                    userHistory[i].objectData.z);

                            }
                        }

                    })
                }
            })
        }
    }

    // addSceneLabel, // 添加标签
    // updateSceneLabel, // 修改
    // deleteSceneLabel, // 添加标签
    var addSceneLabel = function(){
        var path = './static/img/icon/index-baoj.png';
        var id = '25525521251'
        var spriteMap = new THREE.TextureLoader().load( path);
        var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap } );
        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.name = id;
        sprite.scale.set(1000,1000,1);
        control.attach(sprite);
        labelGroup.add( sprite );
        // 数据中添加标签的数据格式


        // labelGroup 添加sprite对象
        // 根据path 添加texture对象

    }

    var updateSceneLabel = function(){

    }

    var deleteSceneLabel = function(){

    }

    return {
        test,
        updatePositionX,
        updatePositionY,
        updatePositionZ,
        updateRotaitonY,
        updateLightColor,
        updateLightOpacity,
        updateCameraFOV,
        updateCameraNear,
        updateCameraFar,
        changeToTranslate,
        lockObject,
        // playScene,//运行
        changeToRotation,
        objectTree,
        loadResourceObject,
        deleteObjectFromElement,
        setVisible,
        getEventData,
        addMinipanelOptions,
        setMouseMoveEvent,
        tweenToTopPosition,
        tweenToLeftPosition,
        tweenToRightPosition,
        lookAtObject,
        getFocusObject,
        loadServerScene,
        createScene,
        updateObjectName,
        review,
        saveSceneForReview,
        onContainerResize,
        setSkyboxForScene,
        addSceneLight,
        addSceneGroup,
        setParent,
        changeMaterial,
        isShowModelDetailControl, // 控制对象是否单独显示
        isShowMaxiPanelControl, // 控制大面板的显示
        setAntialias, // 控制抗锯齿
        changeMachineID, // 绑定用户的机器号码，用于数据接受
        rendererUpdate,
        wireframeControls,
        helperControls,
        clearHistory,
        deleteHistoryItem, // 删除单一的历史记录
        showHistory, // 根据历史记录，显示对应的模型
        addSceneLabel, // 添加标签
        updateSceneLabel, // 修改
        deleteSceneLabel, // 添加标签
    }
}
