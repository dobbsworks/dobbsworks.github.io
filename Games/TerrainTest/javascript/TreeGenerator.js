function TreeGenerator() {

    var treeMaterials = [];
    for (var i = 0; i < 5; i++) {
        var r = Math.random() * 0.1;
        var g = Math.random() * 0.4 + 0.5;
        var b = Math.random() * 0.2 + 0.2;
        var color = "rgb(" + parseInt(r * 255) + "," + parseInt(g * 255) + "," + parseInt(b * 255) + ")";
        var material = new THREE.MeshPhongMaterial({ color: color })
        treeMaterials.push(material)
    }
    
    var treeTrunkMaterials = [];
    for (var i = 0; i < 5; i++) {
        var r = Math.random() * 0.3 + 0.4;
        var g = Math.random() * 0.2 + 0.2;
        var b = Math.random() * 0.1;
        var color = "rgb(" + parseInt(r * 255) + "," + parseInt(g * 255) + "," + parseInt(b * 255) + ")";
        var material = new THREE.MeshPhongMaterial({ color: color })
        treeTrunkMaterials.push(material)
    }


    function GetRandomFromList(list) {
        if (list.length == 1) return list[0];
        return list[parseInt(list.length * Math.random())];
    }


    var yOff1 = Math.sqrt(3) / 2 - 0.289;
    var yOff2 = 0.289;
    this.GetTreesForHex = function(hex) {
        var ret = new THREE.Group();

        var numberOfTrees = Math.ceil(hex.treeValue * 6);
        if (numberOfTrees === 0) return null;
        var offsets = [{ x: 0, y: yOff1 },
                       { x: 0, y: -yOff1 },
                       { x: 0.5, y: yOff2 },
                       { x: 0.5, y: -yOff2 },
                       { x: -0.5, y: yOff2 },
                       { x: -0.5, y: -yOff2 }];

        for (var i = 0; i < numberOfTrees; i++) {
            var tree = new THREE.Group();
            var scale = 0.4;

            var treeGeometry = GetTreeGeometry();
            treeGeometry.scale(scale, scale, scale);
            var treeMesh = new THREE.Mesh(treeGeometry, GetRandomFromList(treeMaterials));
            treeMesh.rotation.z = Math.PI * Math.random();
            tree.add(treeMesh);

            var trunkGeometry = GetTreeTrunkGeometry();
            trunkGeometry.scale(scale, scale, scale);
            var treeTrunkMesh = new THREE.Mesh(trunkGeometry, GetRandomFromList(treeTrunkMaterials));
            treeTrunkMesh.rotation.z = Math.PI * Math.random();
            tree.add(treeTrunkMesh);

            var offsetIndex = parseInt(Math.random() * offsets.length);
            var offset = offsets.splice(offsetIndex,1)[0];

            tree.position.x += offset.x;
            tree.position.y += offset.y;

            ret.add(tree);
        }
        ret.position.set(hex.x, hex.y, hex.value * 5);

        return ret;
    }


    function GetTreeGeometry() {
        var geometry = new THREE.Geometry();

        var baseScale = 0.3 + Math.random() * 0.2;
        var topScale = 0.6 + Math.random() * 0.5;
        var trunkTop = 0.8 + Math.random() * 0.5;
        var leafBottom = 0.3 + Math.random() * 0.3;
        var leafMid = 0.8 + Math.random() * 0.5;
        var leafTop = 2.0 + Math.random() * 1.0;
        var stumpTop = 0.4;
        var stumpScale = 0.2;

        geometry.vertices.push(new THREE.Vector3(0, 0, leafBottom));
        geometry.vertices.push(new THREE.Vector3(0, topScale, leafMid));
        geometry.vertices.push(new THREE.Vector3(-topScale, -topScale, leafMid));
        geometry.vertices.push(new THREE.Vector3(topScale, -topScale, leafMid));
        geometry.vertices.push(new THREE.Vector3(0, 0, leafTop));

        geometry.faces.push(new THREE.Face3(0, 2, 1));
        geometry.faces.push(new THREE.Face3(0, 3, 2));
        geometry.faces.push(new THREE.Face3(0, 1, 3));
        geometry.faces.push(new THREE.Face3(4, 1, 2));
        geometry.faces.push(new THREE.Face3(4, 2, 3));
        geometry.faces.push(new THREE.Face3(4, 3, 1));

        geometry.faces.push(new THREE.Face3(2, 4, 1));
        geometry.faces.push(new THREE.Face3(3, 4, 2));
        geometry.faces.push(new THREE.Face3(1, 4, 3));


        geometry.computeFaceNormals();

        return geometry;
    }

    function GetTreeTrunkGeometry() {
        var geometry = new THREE.Geometry();

        var baseScale = 0.3 + Math.random() * 0.2;
        var trunkTop = 0.8 + Math.random() * 0.5;

        geometry.vertices.push(new THREE.Vector3(0, 0, trunkTop));
        geometry.vertices.push(new THREE.Vector3(0, baseScale, -1.0));
        geometry.vertices.push(new THREE.Vector3(-baseScale, -baseScale, -1.0));
        geometry.vertices.push(new THREE.Vector3(baseScale, -baseScale, -1.0));

        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(0, 3, 1));
        geometry.faces.push(new THREE.Face3(0, 2, 3));

        geometry.computeFaceNormals();

        return geometry;
    }

}