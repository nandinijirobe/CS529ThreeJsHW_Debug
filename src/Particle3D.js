import React, {useEffect, useRef,useMemo,useState,useLayoutEffect} from 'react';
import useSVGCanvas from './useSVGCanvas.js';
import * as THREE from 'three';
import * as d3 from 'd3';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

//helper function to  wait for window resize
function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

export default function Particle3D(props){
    //this is a generic component for plotting a d3 plot
    const container = useRef(null);

    const [screensize] = useWindowSize();
    const [height,setHeight] = useState(0);
    const [width,setWidth] = useState(0);
    const [scene,setScene] = useState();
    const relativePointSize= 10;
    const unbrushedOpacity = 0.25;

    //get the size of the convas
    useEffect( () => {
        //wait for mounting to calculate parent container size
        if(!container.current){ return; }
        var h = container.current.clientHeight*.99;
        var w = container.current.clientWidth;

        setHeight(h);
        setWidth(w);

    },[container.current,screensize]);

    //set up camera with light
    const camera = useMemo(() => {
        //setup camera
        if(width <= 0 || height <= 0){ return; }

         //how big the head is relative to the scene 2 is normal;
        var camera = new THREE.PerspectiveCamera( 75, width / height, 5, 100 );
        // Add a directional light to show off the objects
        var light = new THREE.DirectionalLight( 0xffffff, 1.5);
        // Position the light out from the scene, pointing at the origin
        light.position.set(0,2,20);
        light.lookAt(0,0,0);

        camera.add(light);

        return camera
    },[height, width]);

    //set up the renderer
    var renderer = useMemo(()=>{
        if(width <= 0 || height <= 0){ return; }
        var renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        //TODO: change background color to not be grey
        renderer.setClearColor(0xFFFFFF, 1);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height)
        if(container.current.children[0]){
            container.current.removeChild(container.current.children[0]);
        }
        container.current.appendChild(renderer.domElement);
        return renderer;
    },[width,height]);

    //set up orbit controls
    const controls = useMemo(()=>{
        if(camera === undefined | renderer === undefined){ return }
        var controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 1;
        controls.maxDistance = 5000;
        camera.position.set(2,2,12);
        controls.enablePan = false;
        camera.lookAt(0,0,0);
        controls.enablePan = false;
        controls.update();

        return controls
    },[renderer,camera]);



    //TODO: add code here to set up the point cloud and planes
    //create the scene with the pointcloud when the data loads
    //this should run once when the data loads
    useEffect(()=>{
        if(props.bounds !== undefined & camera !== undefined){
            var s = new THREE.Scene();
            s.add(camera);

            //the extents of the data
            const bounds = props.bounds;
            //for centering the y valus at the center of the cylinder
            const centerY = ((bounds.maxY - bounds.minY)/2);

            //TODO: set us the particle system + cross-section plane and add it to the scene with s.add(...)
            //Hint: use a THREE.Points object and modify the geometry based on the data positions
    
            ///

            //TODO: give the pointcloud and plane names with e.g. pointcloud.name = 'pointcloud' so we can access them with scene.getObjectByName later
            //then add the them to the scene with s.add(...)


            setScene(s);
        }
    },[camera,props.data]);

    //render the colors for the scene pointclouds when the brushedCoord value updates
    //this should run each time a brushing parameter changes (position or axis)
    useEffect(()=>{
        if(scene === undefined| props.data === undefined){ return }

        const bounds = props.bounds;

        //check if points are withing a set distance of the center of the brush plane
        function isBrushed(d){
            var dist = props.brushedCoord - props.getBrushedCoord(d);
            return Math.abs(dist) < props.brushedAreaThickness;
        }
        //TODO: Add code to update the plane + colors when brushing happens
        //Hint: access the pointcloud geometry and update the color attribute based on if the point is brushed
        //e.g. scene.getObjectByName('pointcloud').geometry.setAttribute('color',colors)
        //Then update the position of the plane cross-section with scene.getObjectByName('plane').position = ...
        
    },[scene,props.brushedCoord,props.brushedAxis])

    
    //main animate loop
    useEffect(() => {
        if(!renderer || !scene || !camera){ 
            return; 
        }
        const animate = function () {
            requestAnimationFrame( animate );
            renderer.clear();
            if(controls){
                controls.update()
            }
            renderer.render( scene, camera );
        }
    
        animate();
    },[renderer, scene, camera, renderer]);

    //cleanup function, more useful if you are changing scenes dynamically
    useEffect(() => {
        return () => {
            if(!renderer){return;}
            renderer.forceContextLoss();
        }
    },[renderer]);

    

    return (
        <div
            className={"d3-component"}
            style={{'height':'99%','width':'99%'}}
            ref={container}
        ></div>
    );
}