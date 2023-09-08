import React, {useEffect, useRef} from 'react';
import useSVGCanvas from './useSVGCanvas.js';
import * as d3 from 'd3';

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

            //limit the data to a maximum size to prevent occlusion
            data.sort((a,b) => bDist(a) - bDist(b));
            if(data.length > maxDots){
                data = data.slice(0,maxDots);
            }

            //custom radius based on number of particles
            const radius = Math.max(3*Math.min(width,height)/data.length,5);

            //scale the data by the x and z positions
            let xScale = d3.scaleLinear()
                .domain(d3.extent(data,a=>a.position[0]))
                .range([margin+radius,width-margin-radius])

            let yScale = d3.scaleLinear()
                .domain(d3.extent(data,d=>d.position[1]))
                .range([height-margin-radius,margin+radius])

            let colorScale = d3.scaleSymlog()
                .domain([0,props.bounds.maxC])
                .range(props.colorRange);
            

            //this updates the data while gradually transitioning the color changes
            //.transition can move earlier if you also want to show the dots moving
            let dots = svg.selectAll('.dot').data(data);
            dots.enter()
                .append('circle')
                .attr('class','dot')
                .merge(dots)
                .attr('cx',d=>xScale(d.position[0]))
                .attr('cy',d=>yScale(d.position[1]))
                .transition(500)
                .attr('r',radius)
                .attr('fill',d=>colorScale(d.concentration))
                .attr('stroke','black')
                .attr('strokeWidth',.1)
                .attr('opacity',.5);

            //remove any extra points
            dots.exit().remove();
        
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