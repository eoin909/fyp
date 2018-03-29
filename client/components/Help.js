'use strict';

const React = require('react');

class Help extends React.Component {
    render () {
        return (
            <div className="border-left border">
                <div className="pl-3" >
                    <ul className="mr-3 ml-3 mt-3 mb-3">
                        <li>Click Mouse over a cell you want to control and drag towards target and release to fire half that the cell </li>
                        <li>To win the game reduce Enemy cell count to zero</li>
                        <li>If you win your score will be updated on the leardBoard based on the level of the player you just beat </li>
                    </ul>
                </div>
            </div>
        );
    }
}

module.exports = Help;
