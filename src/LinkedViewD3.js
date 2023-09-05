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
            //getBrushedCoord gets the data point at the coordinate 
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

            //TODO: Edit radius
            //custom radius based on number of particles
            const radius = Math.max(3*Math.min(width,height)/data.length,5);

            //todo (optional): edit the change color scale. will also need to update in ColorLegend.JS
            let colorScale = d3.scaleSymlog()
                .domain([0,props.bounds.maxC])
                .range(props.colorRange);

            //TODO: Add code to draw the points
        
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