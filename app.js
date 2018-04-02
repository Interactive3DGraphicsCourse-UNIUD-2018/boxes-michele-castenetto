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


    camera.position.z = 10;    
    camera.position.y = 10;    
    camera.lookAt(0 ,0 ,0);


    

    
    // var geometry = new THREE.BoxGeometry(1,1,1);
    // var material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
    // var cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);
    

    

    var getHeightData = function(img, scale) {
        
        scale = scale || 1;

        var canvas = document.createElement( 'canvas' );
        canvas.width = img.width;
        canvas.height = img.height;
        var context = canvas.getContext( '2d' );
        context.drawImage(img, 0, 0);

        var size = img.width * img.height;
        var data = new Float32Array(size);
        data.forEach(function(el) {
            el = 0;
        });
        console.log(data);

        var img_data = context.getImageData(0, 0, img.width, img.height);
        var pix_data = img_data.data;
        console.log(pix_data);

        var j=0;
        for (var i = 0; i<pix_data.length; i +=4) {
            var all = pix_data[i]+pix_data[i+1]+pix_data[i+2];  // all is in range 0 - 255*3
            data[j++] = scale*all/3;   
        }
        console.log(data);

        return data;

    };
 
    

    
    // ##OLD
    // var img = new Image();
    // img.src = "../data/textures/heightmap2.png";
    // img.onload = function () {
    //     img.src = "../data/textures/heightmap2.png";
    //     var data = getHeightData(img, 0.1);
    // };



        
    var imageLoader = new THREE.ImageLoader();
    var image_path = "../data/textures/heightmap2.png";
    imageLoader.load(
        image_path,
        function (image) {

            getHeightData(image);

            // var body = document.querySelector('body');
            // body.removeChild(document.querySelector('canvas'));
            // var canvas = document.createElement('canvas');
            // canvas.width = image.width;
            // canvas.height = image.height;
            // var context = canvas.getContext('2d');
            // context.drawImage(image, 0, 0);
            // document.querySelector('body').appendChild(canvas);
            // canvas.style.position = 'absolute';
            // canvas.style.zIndex = 1000;
            // canvas.style.height = '100%';
        },
        undefined,
        function (error) {
            console.log(error);
        }
    );

    











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