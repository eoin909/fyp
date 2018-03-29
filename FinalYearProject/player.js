var Player = function(id, color){
  this.id=id;
  this.color = color;
  this.selectedPlanets=[];
  this.counter=50;
}

  Player.prototype.selectPlanet = function (planet) {
    if(this.selectedPlanets.indexOf(planet)==-1){
      this.selectedPlanets.push(planet);
    }
  };

  Player.prototype.attackPlanet = function (target) {

    if(target.owner!==this.id){
      //attack
      console.log("attack");
      target.attack(this);
      this.selectedPlanets=[];
    }else {
      //join
      console.log("unclick join");
      target.join(this.selectedPlanets);
      this.selectedPlanets=[];
    }
  };

  Player.prototype.update = function (planetList) {
    this.counter=0;
    for (var i = 0; i < planetList.length; i++) {
      if(planetList[i].owner==this.id){
        this.counter+=planetList[i].lives;
      }
    }
    return this.counter;
  };
