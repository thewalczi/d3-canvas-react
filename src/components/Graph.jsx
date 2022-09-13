import React, { useEffect, useMemo } from "react";
import * as d3 from "d3";
import { useState } from "react";

const WIDTH = 800;
const HEIGHT = 600;
const NODE_WIDTH = 100;
const NODE_HEIGHT = 50;

const data = [
	{
		id: 1,
		connections: [{ id: 2 }, { id: 3 }],
	},
	{
		id: 2,
		connections: [{ id: 4 }],
	},
	{
		id: 3,
	},
	{
		id: 4,
		connections: [{ id: 3 }, { id: 1 }],
	},
];

export const Graph = () => {
	const [nodesData, setNodesData] = useState([]);
	const [mouseDown, setMouseDown] = useState(false);

	let canvas;
	let ctx;
	let nodes;

	const init = () => {
		canvas = d3
			.select("canvas")
			.attr("width", WIDTH)
			.attr("height", HEIGHT)
			.style("background-color", "lightblue");

		ctx = canvas.node().getContext("2d");
	};

	useEffect(() => {
		const nodes = data.map((node, i) => {
			return { ...node, x: 120 * ++i, y: 100 * ++i };
		});
		setNodesData(nodes);
	}, []);

	let linksData = useMemo(
		() =>
			nodesData.reduce((acc, curr, i, arr) => {
				if (curr.hasOwnProperty("connections")) {
					curr.connections.forEach((item) => {
						const target = arr.find((node) => node.id === item.id);
						return acc.push({
							source: curr.id,
							sourceX: curr.x,
							sourceY: curr.y,
							target: target.id,
							targetX: target.x,
							targetY: target.y,
						});
					});
				}
				return acc;
			}, []),
		[nodesData]
	);

	const drawLinks = () => {
		const links = canvas.selectAll(".link").data(linksData).enter();

		return links.each((d) => {
			const outputX = d.sourceX + NODE_WIDTH;
			const outputY = d.sourceY + NODE_HEIGHT / 2;
			const inputX = d.targetX;
			const inputY = d.targetY + NODE_HEIGHT / 2;
			let arcR =
				Math.abs(outputY - inputY) > 20 || Math.abs(outputY - inputY) > 20
					? 10
					: Math.abs(outputY - inputY) / 2;

			ctx.beginPath();
			ctx.moveTo(outputX, outputY);

			if (outputX < inputX && outputY < inputY) {
				ctx.lineTo((outputX + inputX) / 2 - arcR, outputY);
				ctx.arc(
					(outputX + inputX) / 2 - arcR,
					outputY + arcR,
					arcR,
					1.5 * Math.PI,
					2 * Math.PI
				);
				ctx.lineTo((outputX + inputX) / 2, inputY - arcR);
				ctx.arc(
					(outputX + inputX) / 2 + arcR,
					inputY - arcR,
					arcR,
					3 * Math.PI,
					(Math.PI * 5) / 2,
					1
				);
			} else if (outputX < inputX && outputY > inputY) {
				ctx.lineTo((outputX + inputX) / 2 - arcR, outputY);
				ctx.arc(
					(outputX + inputX) / 2 - arcR,
					outputY - arcR,
					arcR,
					0.5 * Math.PI,
					2 * Math.PI,
					1
				);
				ctx.lineTo((outputX + inputX) / 2, inputY + arcR);
				ctx.arc(
					(outputX + inputX) / 2 + arcR,
					inputY + arcR,
					arcR,
					1 * Math.PI,
					1.5 * Math.PI
				);
			} else if (outputX > inputX && outputY < inputY) {
				ctx.lineTo((outputX + inputX) / 2 + arcR, outputY);
				ctx.arc(
					(outputX + inputX) / 2 + arcR,
					outputY + arcR,
					arcR,
					1.5 * Math.PI,
					1 * Math.PI,
					1
				);
				ctx.lineTo((outputX + inputX) / 2, inputY - arcR);
				ctx.arc(
					(outputX + inputX) / 2 - arcR,
					inputY - arcR,
					arcR,
					0 * Math.PI,
					0.5 * Math.PI
				);
			} else {
				ctx.lineTo((outputX + inputX) / 2 + arcR, outputY);
				ctx.arc(
					(outputX + inputX) / 2 + arcR,
					outputY - arcR,
					arcR,
					0.5 * Math.PI,
					Math.PI * 1
				);
				ctx.lineTo((outputX + inputX) / 2, inputY + arcR);
				ctx.arc(
					(outputX + inputX) / 2 - arcR,
					inputY + arcR,
					arcR,
					0 * Math.PI,
					Math.PI * 1.5,
					1
				);
			}
			ctx.lineTo(inputX, inputY);

			ctx.strokeStyle = "#000";
			ctx.lineWidth = 2;
			ctx.stroke();
		});
	};

	const drawNodes = () => {
		nodes = canvas.selectAll(".node").data(nodesData).enter();

		return nodes.each((d) => {
			ctx.strokeStyle = "royalblue";
			ctx.strokeRect(d.x, d.y, NODE_WIDTH, NODE_HEIGHT);
			if (!d.active) {
				ctx.fillStyle = "skyblue";
			} else {
				ctx.fillStyle = "red";
			}
			ctx.fillRect(d.x, d.y, NODE_WIDTH, NODE_HEIGHT);
			ctx.fillStyle = "white";
			ctx.fillText(d.id, d.x + 10, d.y + 15);
		});
	};

	const drawGraph = () => {
		init();
		drawLinks();
		drawNodes();
	};

	useEffect(() => {
		let rect;
		let mouseX;
		let mouseY;

		drawGraph();

		canvas.on("mousedown", (e) => {
			e.preventDefault();
			setMouseDown(true);
			rect = e.target.getBoundingClientRect();
			mouseX = e.clientX - rect.left;
			mouseY = e.clientY - rect.top;

			const active = nodesData.find((node) => {
				if (
					node.x < mouseX &&
					node.x + NODE_WIDTH > mouseX &&
					node.y < mouseY &&
					node.y + NODE_HEIGHT > mouseY
				) {
					return node;
				} else {
					return null;
				}
			});
			setNodesData(
				nodesData.map((node) => ({
					...node,
					active: node.id === active?.id,
				}))
			);
		});

		canvas.on("mousemove", (e) => {
			e.preventDefault();
			rect = e.target.getBoundingClientRect();
			mouseX = e.clientX - rect.left;
			mouseY = e.clientY - rect.top;
			if (mouseDown) {
				setNodesData(
					nodesData.map((node) => {
						return node.active
							? {
									...node,
									x: mouseX - NODE_WIDTH / 2,
									y: mouseY - NODE_HEIGHT / 2,
							  }
							: node;
					})
				);
			}
		});

		canvas.on("mouseup", (e) => {
			e.preventDefault();
			setMouseDown(false);
		});
	});

	return <canvas></canvas>;
};
