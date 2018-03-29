var Planet = function(i){
  this.radius = Math.floor((Math.random() * 20) + 40);
  this.xPos= i* 100 + this.radius +50;
  this.yPos=i * 100 + this.radius +50;
  this.owner = 1;
  this.lives=Math.floor((Math.random() * 10) + 1);
  this.color = "#000066";
}

  Planet.prototype.draw = function (context) {
    context.beginPath();
    context.strokeStyle= this.color;
    context.arc(this.xPos, this.yPos,this.radius + this.lives*0.2,0,2*Math.PI);
    context.stroke();
    context.beginPath();
    context.fillText(Math.floor(this.lives), this.xPos-5, this.yPos+5);
    context.fill();
  };

  Planet.prototype.setOwner = function (owner) {
    this.owner = owner.id;
    this.color = owner.color;
  };

  Planet.prototype.attack = function (player) {

    for (var i = 0; i < player.selectedPlanets.length; i++) {
      if(player.selectedPlanets[i]!==null){
        if(player.selectedPlanets[i].lives!==null){
          if(player.selectedPlanets[i].lives>2){
          this.lives = this.lives - (player.selectedPlanets[i].lives)/2;
          player.selectedPlanets[i].lives = Math.floor(player.selectedPlanets[i].lives/2);
          }
        }
      }
    }

    if(this.lives<0){
      this.lives = Math.floor(Math.abs(this.lives));
      this.setOwner(player);
    }
  };

  Planet.prototype.join = function (list) {
    for (var i = 0; i < list.length; i++) {
      if(list[i].lives>1){
      this.lives = this.lives + (list[i].lives)/2;
      list[i].lives = Math.floor(list[i].lives/2);
      }
    }
  };

  Planet.prototype.update = function () {
    //increment if not neutral
    if(this.owner !== 1){
      this.lives += .03
    }
  };
