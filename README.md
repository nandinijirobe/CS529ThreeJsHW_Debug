# Instructions
Credits: The support code in this repo has been created by Andrew Wentzel, a member of the Electronic Visualization Laboratory, as teaching support for UIC's CS529 Visual Data Science course.


### Installation

Installation is the same as in Homework 1. Install the required modules (d3 and three) using 

> npm install

or (if making a repo from scratch)

> npm install d3
> npm install three

Then test the code with 

> npm start


### Code Structure

In addition to what you learned in the previous homework, this homework introduces 3D graphics on the web, spatial data, and the use of multiple coordinated views (which can be coordinated via brushing and linking etc.). By default, our template code sets up the window with a basic THREE.js canvas, a basic D3 canvas, a color legend, and code for loading and passing variables for the linked view. 


Our code changes the brushing plane position variable "brushedCoord" when the user uses the arrow keys by default. You will need to add code to draw the particle pointcloud in Three.js and the linked cross-section in d3.

 * App.js contains the high-level app with the high-level code strucutre
 * Particle3D.js contains the code to run the THREE.js pointcloud. It sets up the required code to render anything you add to the scene with scene.add
 * LinkedViewD3 contains the template for the linked view that is supposed to show a 2-dimensional cross section of the particles
 * ColorLegend.js contains code for the color legend for the LinkedView. Editing it is optional unless you change the color scheme

 Since we use brushing, there are some features in the high-level App that are shared between features. When called in LinkedViewD3 and Patricle3D we add "props." (e.g.props.brushedCoord) to access it.

 * brushedCoord: the coordinate in the given plane (defaults to zy plane) that we want to brush. 
 * brushedAxis: the plane we are slicing. 'x' is the zy plane, 'y' is the zx plane, etc. By default this is set to 'x' and can be ignored, unless you set "allowAxisToggle=false;" for extra credit
 * bounds: the dimensional bounds ({minX, maxX, minY, maxY, minZ, maxZ}) of the particle system. Passed to props so we can scale the visualizations
 * getBrushedCoord: function that takes a data point object for a particle and returns the position in the axis that we are slicing for the cross-section based on brushedAxis and bounds. makes it easier to check if the particle is in the plane we are slicing through.
 * brushedAreaThickness: a constant used to set the width of the area that we are considering for the cross-section plane. Larger values are easier to see in the Three.JS view but yield higher occusion in the D3 view.


 ### Data Structure

 We process the data and return is as an Array of objects with the features:

 * Position => float: [x,y,z]
 * Velocity => float: [x,y,z]
 * Concentration => float: c


### Note

This code introduces THREE.js, a cross-browser JavaScript library and application programming interface (API) used to create and display animated 3D computer graphics in a web browser via webGL. The THREE.js documentation can be found here: 

https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene

We have integrated three.js with react using refs. There is also a popular library named react-three-fiber which is meant to turn threejs into react components if you wish to do that in later projects. Fiber requires less template code: 

https://docs.pmnd.rs/react-three-fiber/getting-started/introduction

However, react-fiber has poor documentation that assumes knowledge of the original API, so we recommend learning vanilla three.js first.
