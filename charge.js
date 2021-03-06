var charges = [];
var chargeSize = 40;
var snapChargeToGrid = false;

function createCharge(position, charge)
{
  var magSlider = document.getElementById("magnitude");
  var angSlider = document.getElementById("angle");
  var magnitude = parseInt(magSlider.value);
  var angle = parseInt(angSlider.value);
  //console.log(Xvel);
  //console.log(Yvel);
  var Xvel = magnitude * cos(angle);
  var Yvel = magnitude * sin(angle);
  console.log(Xvel);
  console.log(Yvel);
  velocity = createVector(Xvel,Yvel);
  if (charge != null)
  {
    charges.push(new Charge(position.x, position.y, charge,velocity))
  }
  else
  {
    charges.push(new Charge(position.x, position.y, 0,velocity))
    charges[charges.length - 1].selected = true;
  }
}

/* function displayCharges()
{
  for (var i = 0; i < charges.length; i++)
  {
    charges[i].display();
    if (charges[i].dragging)
    {
      createDataFromMenu();
    }
  }
} */

function removeCharge(i)
{
  charges[i].selected = false;
  charges[i].slider.style("visibility", "hidden");
  charges[i].slider.remove();

  charges.splice(i,1);

  createDataFromMenu();
}

function removeAllCharges()
{
  var times = charges.length;
  for (var i = times - 1; i >= 0; i--)
  {
    removeCharge(i);
  }
  charges = [];
}

function sliderChanged()
{
  createDataFromMenu();
}

function displayCharges()
{
  //console.log(charges)
  {
    for (var i = 0; i < charges.length; i++)
    {
      if(!pause){
      charges[i].frames++;
      if (charges[i].frames > 3)
      {
        charges[i].trail.push(charges[i].position);
        charges[i].frames = 0;
      }
    }
      charges[i].display();
      if (charges[i].dragging)
      {
        createDataFromMenu();
      }
      charges[i].move();
      

      }
    }
  }

function displayGamecharges()
{
  gamecharge.move();
  gamecharge.display();
  gamecharge.checkWallCollision();
} 


function removeCharge(i)
{
  //charges.splice(i,1);
  Charges[i].show = false;
  chargeDiameter[i] = null;
}

class Charge
{
  constructor(x, y, charge, velocity)
  {
    this.x = x;
    this.y = y;
    this.position = createVector(x,y);
    this.charge = -1 * charge;
    this.R = 0
    this.selected = false;
    this.dragging = false;
    this.force = null;
    this.slider = createSlider(-250, 0, charge, 1);
    this.velocity = velocity;
    this.acceleration = createVector(0,0);
    this.trail = [this.position];
    this.frames=0;

    this.slider.style("zIndex", "999");
    this.slider.style("visibility", "hidden");
    this.slider.addClass("slider");
    this.slider.input(sliderChanged);
    this.slider.changed(sliderChanged);

    this.display = function()
    {
      if (this.selected)
      {
        this.slider.position(this.x - 75, this.y + (chargeSize/2) + 10, "fixed");
        this.charge = this.slider.value();
      }


      push();
        if (this.selected)
        {
          stroke(255);
          this.slider.style("visibility", "visible");
        }
        else
        {
          stroke(color(0,0,0,255/2));
          this.slider.style("visibility", "hidden");
        }
        //Create adaptive color
        this.R = this.charge/50*-1+.5
        if (this.charge == 0){
          fill("rgba(80,80,80, 1)");
        }
      
        else{
          fill("rgba(255,165,0,"+ this.R + ")");
        }
        ellipse(this.x, this.y, chargeSize, chargeSize);

        textSize(16);
        fill("#ffffff");
        noStroke();
        if (this.charge == 0)
        {
          text(this.charge, this.x - ((this.charge.toString().length + 1.5) * 4)+6, this.y + 7);
        }
        else
        {
          //text(this.charge, this.x - ((this.charge.toString().length) * 4), this.y + 7);
          text(this.charge*-1, this.x - ((this.charge.toString().length) * 4)+4, this.y + 7);
        }

        //Display trail
        pop();
        push();
        noStroke();
        for (var i = 0; i < this.trail.length; i++){
          console.log(i);
          ellipse(this.trail[i].x, this.trail[i].y, 5, 5);
          }
      pop();
    }

    this.move = function()
    {
      if(!pause){
      var force = netForceAtPoint(this.position);
      if (force.mag() != Infinity){
      force = force.mult(-.00001);
      this.acceleration = force.mult(this.charge);
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.x = this.position.x;
      this.y = this.position.y;
      }
    }
       
    }

    this.checkWallCollision = function()
    {
      for (var i = 0; i < walls.length; i++)
      {
        if (collideRectCircle(walls[i].x, walls[i].y, walls[i].width * gridSize, walls[i].height * gridSize, this.position.x, this.position.y, chargeDiameter))
        {
          this.velocity = createVector(0, 0);
        }
      }
    }
  }
}
