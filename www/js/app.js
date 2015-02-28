/*
 * Please see the included LICENSE.md file for license terms and conditions.
 */

(function() {
	
	// Wait for DOM tree is ready for access
    document.addEventListener('DOMContentLoaded', function() {
        var canvas = document.getElementById('gameScene');
        // make canvas full screen
        var width = screen.availWidth;
        var height = screen.availHeight;
        canvas.width = width;
        canvas.height = height;

        // get canvas 2d context
        // With canvas 2d context, you can draw anything freely on the canvas.
        // See https://docs.webplatform.org/wiki/tutorials/canvas/canvas_tutorial
        // for tutorials of using canvas.
        var context = canvas.getContext('2d');
        var gravity = 10;

        
        var playerImg = new Image();
        playerImg.src = "asset/9ja.png";
        
        var player = {
            tapLength: 0,
            x: 0,
            y: 0,
            velX: 0,
            velY: 0,
            w: 128,
            h: 128,
            runSpeed: 0,
            maxXSpeed: 20,
            maxYSpeed: 20,

            tap: function() {
                //on an enemy
                    //Sword dashes to the enemy
                //on ceiling
                    //player.grapple(x,y)
                //on anything else (or nothing)
                    //player.jump()
            },
            
            act: function() {
                // Set the player's X velocity

                player.velX += player.runSpeed; // If touching, runSpeed is positive, otherwise smaller negative

                // Limit velX 0-maxSpeed
                if (player.velX < 0) {
                    player.velX = 0;
                }
                if (player.velX > player.maxXSpeed) {
                    player.velX = player.maxXSpeed;
                }

                // If the player has velocity, move them appropriately
                player.x += player.velX;
                player.y += player.velY;


                // Set the player's Y velocity
                player.velY += gravity;
                if (player.velY > player.maxYSpeed) {
                    player.velY = player.maxYSpeed;
                }
                if (player.velY < -player.maxYSpeed) {
                    player.velY = -player.maxYSpeed;
                }

                // Limit player position
                
                if (player.x + player.w > canvas.width) {
                        console.log("Player hit right edge of screen");
                        player.x = canvas.width - player.w;
                        player.velX *= -1;
                }
                if (player.x < 0) {
                        console.log("Player hit left edge of screen");
                        player.x = 0;
                        player.velX *= -1;
                }
                if (player.y + player.h > canvas.height) {
                        console.log("Player hit bottom edge of screen");
                        player.y = canvas.height - player.h;
                        player.velY = 0;
                }
                if (player.y < 0) {
                        console.log("Player hit top edge of screen");
                        player.y = 0;
                        player.velY *= -0.75;
                }
            },
            
            draw: function() {
                context.drawImage(playerImg, player.x, player.y);
            }
        };
        
/*
        function floor(ix, iy, itype) {
            this.x = ix;
            this.y = iy;
            this.w = 32;
            this.h = 32;
            this.type = itype;
            
            this.draw = function() {
				context.fillRect(this.x,this.y,this.w,this.h);
            };
            
        }
        

        var world = {
            myFloors: [],
            
            draw: function() {
                var i = 0;
                for (i = 0; i < this.myFloors.length; i++) {
                    this.myFloors[i].draw();
                }
            },

            init: function() {
                var i = 0;
                for (i = 0; i < width/32; i++) {
                    this.myFloors[i] = new floor(i*32, height - 64, 1);
                }
            }
        
        
        };

        
        var myFloor = new floor(32, 32, 1);
        
        
        world.init();
*/        
        function draw(){
				context.clearRect(0,0,canvas.width,canvas.height);
				//context.fillRect(player.x,player.y,player.w,player.h);
                player.draw();
//                myFloor.draw();
//                world.draw();
                //context.drawImage(player.img, 0, 0);
                //handler.draw();
                
        }
        
        this.addEventListener("touchstart", touchstarthandler,false);
        this.addEventListener("touchend", touchendhandler,false);
        
        var end, start;
        function touchstarthandler(event)
        {
            if(event.screenX>width/2){
                player.runSpeed = 10;
                start = new Date();
            }
        }
        function touchendhandler(event)
        {
            player.runSpeed = -5;
            end = new Date();
            player.tapLength = end.getTime()-start.getTime();
            if(player.tapLength < 300){
                // do tap things: jump, attack, grapple, etc.
                //console.log("TAP! ");

            }            
        }
        
        function game() {
            //console.log("Player: X: " + player.x + ", Y: " + player.y + ", velX: " + player.velX + ", velY: " + player.velY); 
            player.act();
        }

        var gameTimer = setInterval(game,1000/30);
		var drawTimer = setInterval(draw,1000/30);

        
    }, false);

}());
