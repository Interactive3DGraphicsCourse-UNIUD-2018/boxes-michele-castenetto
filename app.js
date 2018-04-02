(function() {
    

    



    var scene = new THREE.Scene();

    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.clearColor(0xf0f0f0);
    renderer.setClearColor( 0xfff0f0 );
    document.body.appendChild( renderer.domElement);

    scene.background = new THREE.Color( 0xf0f0f0 );

    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.body.appendChild( stats.domElement);


    // (apertura angolo verticale ?, rapporto width/height, min dist, max dist)
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(new THREE.Vector3(0,0,0));
    var controls = new THREE.OrbitControls(camera);


    window.addEventListener( 'resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );


    Coordinates.drawAllAxes(scene);


    camera.position.x = 300;    
    camera.position.y = 300;    
    camera.lookAt(0 ,0 ,0);


    // ##OLD
    // var img = new Image();
    // img.src = "../data/textures/heightmap2.png";
    // img.onload = function () {
    //     img.src = "../data/textures/heightmap2.png";
    //     var data = getHeightData(img, 0.1);
    // };


    // var image_path = "../data/textures/heightmap2.png";
    // loadImage(image_path, function(err, image) {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     var heightData = getHeightDataFromImage(image);
    //     for (var i = 1; i <= heightData.width; i++) {
    //         for (var j = 1; j <= heightData.height; j++) {
    //             var h = heightData.getValue(i ,j);
    //             // addCubeColumn(new THREE.Vector3(i, 0, j), Math.floor(h/10));
    //             addCube(new THREE.Vector3(i, Math.floor(h/10), j));
    //             // console.log(h);
    //         }
    //     }
    // });


    var getHeightDataFromImage = function(img, scale) {
        
        scale = scale || 1;

        var canvas = document.createElement( 'canvas' );
        canvas.width = img.width;
        canvas.height = img.height;
        var context = canvas.getContext( '2d' );
        context.drawImage(img, 0, 0);

        var img_data = context.getImageData(0, 0, img.width, img.height);
        var pix_data = img_data.data;
        // console.log(pix_data);


        // var size = img.width * img.height;
        // var data = new Float32Array(size);
        // data.forEach(function(el) {
        //     el = 0;
        // });
        // var j=0;
        // for (var i = 0; i<pix_data.length; i +=4) {
        //     var all = pix_data[i]+pix_data[i+1]+pix_data[i+2];  // all is in range 0 - 255*3
        //     data[j++] = scale*all/3;   
        // }
        // console.log(data);
        
        
        var data = pix_data.reduce(function(acc, curr, index) {
            if (index % 4 === 0) {
                var avg = pix_data[index] + pix_data[index+1] + pix_data[index+2];
                acc.push(avg/3);
            }
            return acc;
        }, []);
        // console.log(data);

        var heightData = new HeightData({
            values: data,
            width:img.width, 
            height: img.height
        });

        return heightData;

    };




    



    var geometry = new THREE.BoxGeometry(1,1,1);
    var material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
    var box = new THREE.Mesh(geometry, material);
    var addCube = function(position, parent) {
        parent = parent || scene;
        var b = box.clone();
        b.position.set(position.x, position.y, position.z);
        parent.add(b);
    };
    var addCubeColumn = function(position, height, parent) {
        parent = parent || scene;
        height = height || 1;
        var pos = position;
        for (var i = 0; i < height; i++) {
            addCube(pos, parent);
            pos.y += 1;
        }
    };
    



    var HeightImageData = (function() {
        function HeightImageData(params) {
            params = params || {};
            this.values = params.values || [];
            this.width = params.width || 1;
            this.height = params.height || 1;
        }

        HeightImageData.prototype.getValue = function(x, y) {
            if (x < 1 || x > this.width) {
                console.log('index value x out of range!');
                return;
            }
            if (y < 1 || y > this.height) {
                console.log('index value y out of range!');
                return;
            }
            return this.values[(x - 1) * this.width + y - 1];
        };

        HeightImageData.prototype.setValuesFromImage = function(image) {
            
            var canvas = document.createElement( 'canvas' );
            canvas.width = image.width;
            canvas.height = image.height;
            var context = canvas.getContext( '2d' );
            context.drawImage(image, 0, 0);
            
            var img_data = context.getImageData(0, 0, image.width, image.height);
            var pix_data = img_data.data;
            
            var data = pix_data.reduce(function(acc, curr, index) {
                if (index % 4 === 0) {
                    var avg = pix_data[index] + pix_data[index+1] + pix_data[index+2];
                    acc.push(avg/3);
                }
                return acc;
            }, []);
            
            this.values = data;
            this.width = image.width;
            this.height = image.height;
            
        }; 

        HeightImageData.prototype.valuesLoop = function(callback) {
            for (var i = 1; i <= this.width; i++) {
                for (var j = 1; j <= this.height; j++) {
                    var h = this.getValue(i ,j);
                    callback(i, j, h);
                }
            }
        };

        return HeightImageData;
    })();



    var loadImage = function(path, callback) {
        var imageLoader = new THREE.ImageLoader();
        imageLoader.load(
            path,
            function (image) {
                callback(null, image);
            },
            undefined,
            function (error) {
                callback(error);
            }
        );
    };




    var loadFace = function(path) {
        loadImage(path, function(err, image) {
            if (err) {
                return console.log(err);
            }

            var heightImageData = new HeightImageData();
            heightImageData.setValuesFromImage(image);

            heightImageData.valuesLoop(function(i, j, h) {
                addCube(new THREE.Vector3(i, Math.floor(25 - h/10), j));
            });

        });
    };

    
    // loadFace("../data/textures/heightmap2.png");
    loadFace("../data/textures/face1.jpg");


    window.scene = scene;











    var _animate = function() {
        var d = new Date(); 
        var time = d.getTime();
        
        
 
    };



    
    var engine = new Engine(function() {
        _animate();
        stats.update();
        controls.update();
        renderer.render( scene, camera );
    });
    engine.startRenderLoop();



   




    


})();