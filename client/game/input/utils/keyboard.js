'use strict';

const MODIFIERS	= ['shift', 'ctrl', 'alt', 'meta'];
var clicked	= false;
const ALIAS	= {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    space: 32,
    pageup: 33,
    pagedown: 34,
    tab: 9
};

function Keyboard () {
    const keyCodes = {};
    const modifiers = {};

    function onKeyChange (event, pressed) {
        // Space and arrow keys
        if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
            event.preventDefault();
        }

        const keyCode = event.keyCode;

        keyCodes[keyCode] = pressed;

        modifiers.shift = event.shiftKey;
        modifiers.ctrl = event.ctrlKey;
        modifiers.alt = event.altKey;
        modifiers.meta = event.metaKey;
    }

    function onKeyDown (event) {
        onKeyChange(event, true);
    }

    function onKeyUp (event) {
        onKeyChange(event, false);
    }
    // function click (event) {
    //     //onKeyChange(event, false);
    //     console.log("click");
    //     // console.log('mouseX = ' + event.clientX);
    //     // console.log('mouseY = ' + event.clientY);
    //      document.addEventListener('mousemove', moveFunction, false);
    //     clicked=true;
    // }
    // function unclick (event) {
    //     //onKeyChange(event, false);
    //     console.log("unclick");
    //     // console.log('mouseX = ' + event.clientX);
    //     // console.log('mouseY = ' + event.clientY);
    //     // document.addEventListener('mousemove', moveFunction, false);
    //     clicked=false;
    // }
    //
    // function moveFunction (event) {
    //     //onKeyChange(event, false);
    //     console.log("move");
    //     if(clicked){
    //       console.log('mouseX = ' + event.clientX);
    //       console.log('mouseY = ' + event.clientY);
    //     }
    // }

    function isPressed (keyDesc) {
        const keys = keyDesc.split('+');

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            let pressed = false;

            if (MODIFIERS.indexOf(key) !== -1) {
                pressed	= modifiers[key];
            } else if (Object.keys(ALIAS).indexOf(key) !== -1) {
                pressed	= keyCodes[ALIAS[key]];
            } else {
                pressed	= keyCodes[key.toUpperCase().charCodeAt(0)];
            }

            if (!pressed) {
                return false;
            }
        }

        return true;
    }

    function stopListening () {
        document.removeEventListener('keydown', onKeyDown, false);
        document.removeEventListener('keyup', onKeyUp, false);
    }

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    // document.addEventListener('mousedown', click, false);
    // document.addEventListener('mouseup', unclick, false);

    return Object.freeze({
        isPressed,
        stopListening
    });
}

module.exports = { create: Keyboard };
