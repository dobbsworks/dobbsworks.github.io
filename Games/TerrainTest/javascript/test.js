var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);



camera.rotation.x = THREE.Math.degToRad(30);
camera.position.z = 10;
camera.position.y = -30;
SetupCameraInput(camera);
AddLightsToScene(scene);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var stats = new Stats();
var container = document.createElement('div');
document.body.appendChild(stats.dom);

var treeGenerator = new TreeGenerator();
var generatedHexes = new TerrainGenerator().GenerateTerrain();
var geometry = GetHexGeometry(true);
var geometry2 = GetHexGeometry(false);
var sideMaterial = new THREE.MeshPhongMaterial({ color: 0xBB9955 });
for (var i = 0; i < generatedHexes.length; i++) {
    var hex = generatedHexes[i];
    var material = new THREE.MeshPhongMaterial({ color: hex.color });
    var hexMesh = new THREE.Mesh(geometry, material);
    hexMesh.position.set(hex.x, hex.y, (hex.value < 0.5 ? 0.5 : hex.value) * 5);

    if (hex.value > 0.5) {
        var hexMesh2 = new THREE.Mesh(geometry2, sideMaterial);
        hexMesh2.position.set(hex.x, hex.y, (hex.value < 0.5 ? 0.5 : hex.value) * 5 - 3.3608);
        scene.add(hexMesh2);
    }

    scene.add(hexMesh);
    var trees = treeGenerator.GetTreesForHex(hex);
    if (trees) scene.add(trees);
}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), INTERSECTED;

var hoverHex = null;

var render = function () {
    stats.update();
    raycaster.setFromCamera(mouse, camera);
    //var intersects = raycaster.intersectObjects(scene.children);
    //if (intersects.length) {
    //    if (hoverHex != intersects[0].object) {
    //        UnhoverHex(hoverHex);
    //        hoverHex = intersects[0].object;
    //        hoverHex.oldColor = hoverHex.material.emissive.getHex();
    //        hoverHex.material.emissive.setHex(0xCCCCCC);
    //    }
    //    } else {
    //    if (hoverHex != null) {
    //        UnhoverHex(hoverHex);
    //        hoverHex = null;
    //    }
    //}


    camera.Update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};
render();








function UnhoverHex(hex) {
    if (hex != null) hex.material.emissive.setHex(hex.oldColor);
}


function GetHexGeometry(isBeveled) {
    var hexShape = new THREE.Shape();
    var hexRatio = Math.sqrt(3) / 2;
    hexShape.moveTo(0.5, hexRatio);
    hexShape.lineTo(1, 0);
    hexShape.lineTo(0.5, -hexRatio);
    hexShape.lineTo(-0.5, -hexRatio);
    hexShape.lineTo(-1, 0);
    hexShape.lineTo(-0.5, hexRatio);
    hexShape.lineTo(0.5, hexRatio); // close path

    var extrudeSettings = { amount: isBeveled ? 0 : 3, bevelEnabled: isBeveled, bevelSegments: 1, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
    var geometry = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);

    if (!isBeveled) {
        geometry.scale(1.12,1.12,1.12);
    }

    return geometry;
}

function AddLightsToScene(scene) {
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    var mainLight = new THREE.PointLight(0xffffff, 0.7);
    mainLight.position.set(100, -100, 400);
    scene.add(mainLight);
}





