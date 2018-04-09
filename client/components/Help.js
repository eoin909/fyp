'use strict';

const React = require('react');

class Help extends React.Component {
    render () {
        return (
            <div className="border-left border">
                <div className="pl-3" >
                    <ul className="mr-3 ml-3 mt-3 mb-3">
                        <h2>Description </h2>
                        <li>Spread your parasites in this fast pace, strategy game. The goal is to overtake all other parasites. Learn to master each parasite effectively and infect all forms of cellular life.</li>
                        <li>Click Mouse over a cell you want to control and drag towards target and release to fire </li>
                        <li>To win the game reduce Enemy parasite count to zero</li>
                        <li>If you win your score will be updated on the leaderBoard based on the Rank of the player you just defeated </li>
                        <li>You can check out the leaderBoard and see you position </li>
                    </ul>
                </div>
            </div>
        );
    }
}

module.exports = Help;
