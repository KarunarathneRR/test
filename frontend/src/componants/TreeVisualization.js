import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import PropTypes from 'prop-types';

const TreeVisualization = ({ nodeName }) => {
    const chartRef = useRef(null);
    const [data, setData] = useState(null);
    const [faultData, setFaultData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios(`${process.env.REACT_APP_API_URL}/api/faults/nodes/${nodeName}`);
                setFaultData(result.data.faults);
            } catch (error) {
                console.error("Error fetching fault data:", error);
            }
        };
        fetchData();
    }, [nodeName]);

    const generatePort = (portId, splitterIdPrefix, onuIdPrefix, slotId) => {
        const portFaultData = faultData.filter(f => f.slot === slotId && f.port === portId);
        const hasCriticalFault = portFaultData.some(f => f.onu === null && f.status === 'fault');

        const onuChildren = Array.from({ length: 64 }, (_, i) => {
            const onuFault = portFaultData.some(f => f.onu === i + 1 && f.status === 'fault');
            return {
                name: `ONU ${i + 1}`,
                id: `${onuIdPrefix}${i + 1}`,
                fault: hasCriticalFault || onuFault,
                partialFault: false,
            };
        });

        return {
            name: `Port ${portId}`,
            id: `slot${slotId}-port${portId}`, // Unique ID including the slot
            fault: hasCriticalFault,
            partialFault: portFaultData.some(f => f.status === 'fault' && !hasCriticalFault),
            collapsed: true, // Ports are collapsed by default
            children: [{
                name: 'Splitter',
                id: `splitter${splitterIdPrefix}`,
                fault: hasCriticalFault,
                partialFault: portFaultData.some(f => f.status === 'fault' && !hasCriticalFault),
                children: onuChildren,
            }],
        };
    };

    const generateSlot = (slotId) => ({
        name: `Slot ${slotId}`,
        id: `slot${slotId}`,
        collapsed: true, // Slots are collapsed by default
        children: Array.from({ length: 17 }, (_, portIndex) =>
            generatePort(portIndex + 1, `${slotId}-${portIndex + 1}`, `onu${slotId}-${portIndex + 1}-`, slotId)
        ),
        partialFault: faultData.some(f => f.slot === slotId && f.status === 'fault'),
    });

    const generateShelf = (shelfId) => ({
        name: `Shelf ${shelfId}`,
        id: `shelf${shelfId}`,
        collapsed: false, // Shelves are expanded by default
        children: Array.from({ length: 18 }, (_, shelfIndex) => generateSlot(shelfIndex + 1)),
        partialFault: faultData.some(f => f.status === 'fault'),
    });

    const generateRack = (rackId) => ({
        name: `Rack ${rackId}`,
        id: `rack${rackId}`,
        collapsed: false, // Racks are expanded by default
        children: Array.from({ length: 1 }, (_, shelfIndex) => generateShelf(shelfIndex + 1)),
        partialFault: faultData.some(f => f.status === 'fault'),
    });

    const generateNode = (nodeName) => ({
        name: nodeName,
        id: `node-${nodeName}`,
        collapsed: false, // Nodes are expanded by default
        children: Array.from({ length: 1 }, (_, rackIndex) => generateRack(rackIndex + 1)), // Generate racks
        partialFault: faultData.some(f => f.status === 'fault'),
    });

    useEffect(() => {
        if (nodeName) {
            const treeData = generateNode(nodeName);
            setData(treeData);
        }
    }, [faultData, nodeName]);

    const collapseOtherNodes = (node, clickedId, level) => {
        if (node.children) {
            node.children.forEach(child => {
                if (child.name.startsWith(level) && child.id !== clickedId) {
                    child.collapsed = true; // Collapse all other nodes of the same level
                }
                if (child.children) {
                    collapseOtherNodes(child, clickedId, level); // Recursive for nested nodes
                }
            });
        }
    };

    const updateVisualization = () => {
        const handleCollapse = (node) => (node.children && !node.collapsed ? node.children : null);
        const svg = d3.select(chartRef.current).select('svg');
        const g = svg.select('g');

        const updatedRootNode = d3.hierarchy(data, handleCollapse);
        const treeLayout = d3.tree().size([window.innerHeight * 4, window.innerWidth - 300]);
        treeLayout(updatedRootNode);

        // Update links
        const updatedLinks = g.selectAll('.link')
            .data(updatedRootNode.links(), d => `${d.source.data.id}-${d.target.data.id}`); // Use unique IDs

        updatedLinks.exit().remove();

        updatedLinks.enter()
            .append('path')
            .attr('class', 'link')
            .merge(updatedLinks)
            .attr('d', d3.linkHorizontal().x(d => d.y).y(d => d.x))
            .attr('fill', 'none')
            .attr('stroke', d => {
                if (d.target.data.fault) return 'red';
                if (d.target.data.partialFault) return 'yellow';
                return 'blue';
            })
            .attr('stroke-width', 2);

        // Update nodes
        const updatedNodes = g.selectAll('g.node')
            .data(updatedRootNode.descendants(), d => d.data.id); // Use unique IDs

        updatedNodes.exit().remove();

        const enterNodes = updatedNodes.enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.y},${d.x})`)
            .on('click', (event, d) => {
                if (d.data.name.startsWith('Port')) {
                    collapseOtherNodes(data, d.data.id, "Port");
                    d.data.collapsed = !d.data.collapsed;
                    updateVisualization();
                } else if (d.data.name.startsWith('Slot')) {
                    collapseOtherNodes(data, d.data.id, "Slot");
                    d.data.collapsed = !d.data.collapsed;
                    updateVisualization();
                } else if (d.data.name.startsWith('Shelf')) {
                    collapseOtherNodes(data, d.data.id, "Shelf");
                    d.data.collapsed = !d.data.collapsed;
                    updateVisualization();
                } else if (d.data.name.startsWith('Rack')) {
                    collapseOtherNodes(data, d.data.id, "Rack");
                    d.data.collapsed = !d.data.collapsed;
                    updateVisualization();
                } else if (d.data.name.startsWith(nodeName)) {
                    collapseOtherNodes(data, d.data.id, "Node");
                    d.data.collapsed = !d.data.collapsed;
                    updateVisualization();
                }
            });

        enterNodes.append('path')
            .attr('d', d => {
                if (d.depth === 0) return 'M-20,-10 H20 V10 H-20 Z';
                else if (d.data.name === 'Splitter') return 'M-10,0 L10,-20 L10,20 Z';
                else if (d.data.name.startsWith('Rack') || d.data.name.startsWith('Shelf') || d.data.name.startsWith('Slot')) return 'M-15,-10 H15 V10 H-15 Z';
                return 'M-10,0 A10,10 0 1,0 10,0 A10,10 0 1,0 -10,0';
            })
            .attr('fill', d => d.data.fault ? 'red' : d.data.partialFault ? 'yellow' : d.children ? 'lightblue' : 'lightgreen');

        enterNodes.append('text')
            .attr('dy', '0.35em')
            .attr('x', d => d.depth === 0 ? 25 : d.children ? -13 : 13)
            .style('text-anchor', d => d.depth === 0 ? 'start' : d.children ? 'end' : 'start')
            .style('font-size', '10px')
            .text(d => d.data.name);

        updatedNodes.merge(enterNodes)
            .transition()
            .duration(300)
            .attr('transform', d => `translate(${d.y},${d.x})`);
    };

    useEffect(() => {
        if (data) {
            d3.select(chartRef.current).selectAll('svg').remove();

            const svg = d3.select(chartRef.current)
                .append('svg')
                .attr('width', window.innerWidth)
                .attr('height', window.innerHeight * 4.2);

            const g = svg.append('g').attr('transform', 'translate(100,50)');

            updateVisualization();
        }
    }, [data]);

    return (
        <div className='tree'>
            <div ref={chartRef}></div>
            <style>
                {`
                .tree {
                    font-family: Arial, sans-serif;
                    overflow: auto;
                    background-color: #f9f9f9;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    
                    margin: 10px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .tree svg {
                    width: 100%;
                    height: auto;
                }

                .link {
                    stroke-opacity: 0.6;
                }

                .node path {
                    stroke: #000;
                    stroke-width: 1px;
                }

                .node text {
                    font-size: 12px;
                }

                .node:hover text {
                    fill: black;
                    font-weight: 900;
                }
                `}
            </style>
        </div>
    );
};

TreeVisualization.propTypes = {
    nodeName: PropTypes.string.isRequired,
};

export default TreeVisualization;
