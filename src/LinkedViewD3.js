import React, {useEffect, useRef} from 'react';
import useSVGCanvas from './useSVGCanvas.js';
import * as d3 from 'd3';


//example function/code for making a custom glyph
function makeVelocityGlyph(d,axis,scale=1){
    var xv = d.velocity[1];
    var yv = d.velocity[2];
    if(axis == 'y'){
        xv = d.velocity[0];
        yv =  d.velocity[1];
    } else if(axis == 'z'){
        xv = d.velocity[0];
    }
    let magnitude = Math.sqrt(xv**2 + yv**2);

    let xpos = xv/scale
    let ypos = yv/scale
    let path = 'M ' + xpos + ',' + ypos + ' '
        + -ypos/3 + ',' + xpos/3 + ' '
        + ypos/3 + ',' + -xpos/3 + 'z'
    return path;
    //limit th
}

export default function LinkedViewD3(props){
    //this is a generic component for plotting a d3 plot
    const d3Container = useRef(null);
    const [svg, height, width, tTip] = useSVGCanvas(d3Container);

    const margin = 10;
    //sets a number of the number of particles we show when the brushed area has is too large
    const maxDots = 2000;
    
    //draw the points in the brushed area
    useEffect(()=>{
        if(svg !== undefined & props.data !== undefined){
            //filter data by particles in the brushed region
            const bDist = d => props.brushedCoord - props.getBrushedCoord(d);
            function isBrushed(d){
                return Math.abs(bDist(d)) < props.brushedAreaThickness;
            }
            var data = props.data.filter(isBrushed);

            var getX = d => d.position[1];
            var getY = d => d.position[2];
            if(props.brushedAxis == 'y'){
                getX = d => d.position[0];
                getY = d => d.position[1];
            } else if(props.brushedAxis == 'z'){
                getX = d => d.position[0];
            }
            //limit the data to a maximum size to prevent occlusion
            data.sort((a,b) => bDist(a) - bDist(b));
            if(data.length > maxDots){
                data = data.slice(0,maxDots);
            }

            const getVelocityMagnitude = d => Math.sqrt(d.velocity[0]**2 + d.velocity[1]**2 + d.velocity[2]**2);
            const vMax = d3.max(data,getVelocityMagnitude);
            
            //custom radius based on number of particles
            const radius = Math.max(3*Math.min(width,height)/data.length,5);

            //scale the data by the x and z positions
            let xScale = d3.scaleLinear()
                .domain(d3.extent(data,getX))
                .range([margin+radius,width-margin-radius])

            let yScale = d3.scaleLinear()
                .domain(d3.extent(data,getY))
                .range([height-margin-radius,margin+radius])

            let colorScale = d3.scaleLinear()
                .domain(d3.extent(data,getY))
                .range(props.colorRange);

            //TODO: map the color of the glyph to the particle concentration instead of the particle height
            let dots = svg.selectAll('.glyph').data(data)
            dots.enter().append('path')
                .attr('class','glyph')
                .merge(dots)
                .transition(100)
                .attr('d', d => makeVelocityGlyph(d,props.brushedAxis,.25*vMax/radius))
                .attr('fill',d=>colorScale(getY(d)))
                .attr('stroke','black')
                .attr('stroke-width',.1)
                .attr('transform',d=>'translate(' + xScale(getX(d)) + ',' + yScale(getY(d)) + ')');

            dots.exit().remove()
        }
    },[svg,props.data,props.getBrushedCoord])

    
    return (
        <div
            className={"d3-component"}
            style={{'height':'99%','width':'99%'}}
            ref={d3Container}
        ></div>
    );
}
