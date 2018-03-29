var Computer = function(id, color, delay){
  this.id = id;
  this.delay = delay;
  this.color=color;
  this.counter=0;
  this.selectedPlanets=[];
}

  Computer.prototype.update = function (cellsList) {
    this.counter++;
    if(this.counter<this.delay)
      return;
    this.counter=0;
    var copyPlanetList = cellsList.slice();
    var ownedPlanets= [];

    for (var i = 0; i < copyPlanetList.length; i++) {
      if(copyPlanetList[i].owner==this.id){
        ownedPlanets[ownedPlanets.length] = copyPlanetList[i];
        copyPlanetList.splice(i,1);
      }
    }

    if(ownedPlanets.length>0){
      var selectCount = Math.round(Math.random() * ownedPlanets.length);
      for (var i = 0; i < selectCount; i++) {
        this.selectPlanet(ownedPlanets[Math.floor(Math.random()*ownedPlanets.length)]);
      }
      if(copyPlanetList.length>0){
        var target;
        var i =0;
        do{
          target = copyPlanetList[Math.floor(Math.random()*copyPlanetList.length)];
          i++;
        }while(this.isStupidTarget(target)&& i<copyPlanetList.length){
          this.attackPlanet(target);
        }
      }
    }
  };

  Computer.prototype.isStupidTarget = function (target) {
    var sum=0;
    for (var p in this.selectedPlanets){
      sum+=p.lives;
    };
    if(sum<target.lives) return true;
    return false;
  };

  //code copied from player class
  Computer.prototype.selectPlanet = function (planet) {
    if(planet!==null){
      if(this.selectedPlanets.indexOf(planet)==-1){
        this.selectedPlanets[this.selectedPlanets.length] = planet;
      }
    }
  };

  Computer.prototype.attackPlanet = function(target){

    if(target.owner!==this.id){
      //attack
      if(this.selectedPlanets.length>0){
        target.attack(this);
        this.selectedPlanets=[];
      }
     }
    //else {
    //   //join
    //   console.log("unclick join");
    //   target.join(this.selectedPlanets);
    //   this.selectedPlanets=[];
    // }
  };
