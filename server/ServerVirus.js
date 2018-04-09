'use strict';

const Virus = require('../lib/Virus');
const ServerVirus = require('../lib/ServerVirus');

function ServerPlanet ({  id, name, color, virusID }) {

    switch (virusID) {
                      case 20:
                              return ServerVirus.create({
                                  id,
                                  name,
                                  color
                                  });
                              break;
                        case 1:
                              return Virus.create({
                                  id,
                                  name,
                                  color,
                                  speed: 60,
                                  agility: 60,
                                  strength: 90
                              });
                        case 2:
                              return Virus.create({
                                  id,
                                  name,
                                  color,
                                  speed: 90,
                                  agility: 60,
                                  strength: 60
                              });

                        case 3:
                              return Virus.create({
                                  id,
                                  name,
                                  color,
                                  speed: 60,
                                  agility: 90,
                                  strength: 60
                              });

                        case 4:
                              return Virus.create({
                                  id,
                                  name,
                                  color,
                                  speed: 70,
                                  agility: 70,
                                  strength: 70
                              });
                      default:
                        return Virus.create({
                            id,
                            name,
                            color,
                            speed: 70,
                            agility: 70,
                            strength: 70
                        });
    }
}

module.exports = { create: ServerPlanet };
