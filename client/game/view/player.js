'use strict';

const COLOR = 'rgba(255,255,255,0.1)';
const INFO_COLOR = 'rgba(255,255,255,0.1)';
const HIT_COLOR = '#FF0000';
const RELOAD_COLOR = '#005500';

function draw (ctx, player, options = {}) {
    // Set the color for this player
    if (player.isHit()) {
        ctx.fillStyle = HIT_COLOR;
    } else if (player.isReloading()) {
        ctx.fillStyle = RELOAD_COLOR;
    } else {
        ctx.fillStyle = options.color || COLOR;

    }

    const width = player.getWidth();
    const height = player.getHeight();
    let { x, y } = player.getPosition();

    x -= width / 2;
    y -= height / 2;

    //ctx.fillRect(x, y, width, height);
	ctx.beginPath();
	ctx.strokeStyle = "#F0FFFF";
	ctx.arc(x, y, 10*width, 0, 2*Math.PI);
	ctx.stroke();
    
	//improve visual later
	// ctx.beginPath();
	// ctx.strokeStyle = "#F0FFFF";
	// ctx.arc(x, y, 10*width, 0, 2*Math.PI);
	// ctx.stroke();
	
	const infoColor = options.infoColor || INFO_COLOR;

    ctx.fillStyle = infoColor;

    const stateText = options.stateText || '';

    ctx.fillText(stateText, player.getPosition().x + (width / 1.5), player.getPosition().y + (height / 4));
}

module.exports = draw;
