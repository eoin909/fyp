'use strict';

const uuid = require('node-uuid');
const Virus = require('../lib/Virus');
const ServerVirus = require('../lib/ServerVirus');

function ServerPlanet ({  id, name, color, virusID, x = 300, y = 300, width = 16, height = 16, speed = 50 }) {
  console.log("client.getId() " + id);
    switch (virusID) {
                      case 20:
                              return ServerVirus.create({
                                                          id,
                                                          name,
                                                          color,
                                                          x,
                                                          y,
                                                          width,
                                                          height,
                                                          speed
                                                        });
                              break;
                        case 0:
                              return Virus.create({
                                  id,
                                  name,
                                  color,
                                  x,
                                  y,
                                  width,
                                  height,
                                  speed
                              });
                        case 1:
                              return Virus.create({
                                  id,
                                  name,
                                  color,
                                  x,
                                  y,
                                  width,
                                  height,
                                  speed
                              });

                          break;
                      default:
                              return Virus.create({
                                  id,
                                  name,
                                  color,
                                  x,
                                  y,
                                  width,
                                  height,
                                  speed
                              });
    }
}

module.exports = { create: ServerPlanet };
