
'use strict';

function MainLoop(options) {
    var begin = options.begin || null;
    var end = options.end || null;
    var draw = options.draw || null;
    var update = options.update || null;
    var simulationTimestep = options.simulationTimestep || 1000 / 60;

    var frameDelta = 0;

    var lastFrameTimeMs = 0;

    var fps = 60;

    var lastFpsUpdate = 0;

    var framesThisSecond = 0;

    var numUpdateSteps = 0;

    var minFrameDelay = 0;

    var running = false;

    var started = false;

    var panic = false;

    var requestAnimationFrame = global.requestAnimationFrame || function () {
        var lastTimestamp = Date.now();

        return function (callback) {
            var now = Date.now();
            var timeout = Math.max(0, simulationTimestep - (now - lastTimestamp));

            lastTimestamp = now + timeout;

            return setTimeout(function () {
                callback(now + timeout);
            }, timeout);
        };
    }();

    var cancelAnimationFrame = global.cancelAnimationFrame || clearTimeout;

    var rafHandle = null;

    function animate(timestamp) {

        if (timestamp < lastFrameTimeMs + minFrameDelay) {
            rafHandle = requestAnimationFrame(animate);
            return;
        }

        frameDelta += timestamp - lastFrameTimeMs;
        lastFrameTimeMs = timestamp;

        if (typeof begin === 'function') {
            begin(timestamp, frameDelta);
        }

        if (timestamp > lastFpsUpdate + 1000) {
            fps = 0.25 * framesThisSecond + 0.75 * fps;

            lastFpsUpdate = timestamp;
            framesThisSecond = 0;
        }

        framesThisSecond += 1;

        numUpdateSteps = 0;

        while (frameDelta >= simulationTimestep) {
            if (typeof update === 'function') {
                update(simulationTimestep);
            }

            frameDelta -= simulationTimestep;

            numUpdateSteps += 1;

            if (numUpdateSteps >= 240) {
                panic = true;
                break;
            }
        }

        if (typeof draw === 'function') {
            draw(frameDelta / simulationTimestep);
        }

        if (typeof end === 'function') {
            end(fps, panic);
        }

        panic = false;

        rafHandle = requestAnimationFrame(animate);
    }

    function getSimulationTimestep() {
        return simulationTimestep;
    }
    function setSimulationTimestep(timestep) {
        simulationTimestep = timestep;
    }

    function getFPS() {
        return fps;
    }

    function resetFrameDelta() {
        var oldFrameDelta = frameDelta;

        frameDelta = 0;

        return oldFrameDelta;
    }

    function setBegin(value) {
        begin = value;
    }

    function setUpdate(value) {
        update = value;
    }

    function setDraw(value) {
        draw = value;
    }


    function start() {
        if (!started) {

            started = true;

            rafHandle = requestAnimationFrame(function (timestamp) {
                if (typeof draw === 'function') {
                    draw(1);
                }

                running = true;

                lastFrameTimeMs = timestamp;
                lastFpsUpdate = timestamp;
                framesThisSecond = 0;

                rafHandle = requestAnimationFrame(animate);
            });
        }
    }

    function stop() {
        running = false;
        started = false;
        cancelAnimationFrame(rafHandle);
    }


    function isRunning() {
        return running;
    }


    function getMaxAllowedFPS() {
        return 1000 / minFrameDelay;
    }

    function setEnd(value) {
        end = value;
    }

    function setMaxAllowedFPS(fps) {
        if (typeof fps === 'undefined') {
            fps = Number.Infinity;
        }

        if (fps === 0) {
            stop();
        } else {
            minFrameDelay = 1000 / fps;
        }
    }

    return Object.freeze({
        setMaxAllowedFPS: setMaxAllowedFPS,
        getMaxAllowedFPS: getMaxAllowedFPS,
        getFPS: getFPS,
        setSimulationTimestep: setSimulationTimestep,
        getSimulationTimestep: getSimulationTimestep,
        setBegin: setBegin,
        setEnd: setEnd,
        setUpdate: setUpdate,
        setDraw: setDraw,
        start: start,
        stop: stop,
        resetFrameDelta: resetFrameDelta,
        isRunning: isRunning
    });
}

module.exports = { create: MainLoop };
