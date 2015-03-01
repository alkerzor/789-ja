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

        /*
        //Lock in landscape orientation
        document.addEventListener("intel.xdk.device.ready", onDeviceReady, false);
        function onDeviceReady(){
            intel.xdk.device.setRotateOrientation('landscape');
            intel.xdk.device.hideSplashScreen();   
        }      
        */

        canvas.width = width;
        canvas.height = height;

        // get canvas 2d context
        // With canvas 2d context, you can draw anything freely on the canvas.
        // See https://docs.webplatform.org/wiki/tutorials/canvas/canvas_tutorial
        // for tutorials of using canvas.
        var context = canvas.getContext('2d');
        var gravity = 10;

        
                
        function Rectangle(left, top, width, height){
			this.left = left || 0;
			this.top = top || 0;
            this.width = width || 0;
			this.height = height || 0;
			this.right = this.left + this.width;
			this.bottom = this.top + this.height;
		}
		
		Rectangle.prototype.set = function(left, top, /*optional*/width, /*optional*/height){
			this.left = left;
            this.top = top;
            this.width = width || this.width;
            this.height = height || this.height;
            this.right = (this.left + this.width);
            this.bottom = (this.top + this.height);
		};
		
		Rectangle.prototype.within = function(r) {
			return (r.left <= this.left && 
					r.right >= this.right &&
					r.top <= this.top && 
					r.bottom >= this.bottom);
		};
		
		Rectangle.prototype.overlaps = function(r) {
			return (this.left < r.right && 
					r.left < this.right && 
					this.top < r.bottom &&
					r.top < this.bottom);
		};
        
        // possibles axis to move the camera
        var AXIS = {
            NONE: "none", 
            HORIZONTAL: "horizontal", 
            VERTICAL: "vertical", 
            BOTH: "both"
        };

        // Camera constructor
        function Camera(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight)
        {
            // position of camera (left-top coordinate)
            this.xView = xView || 0;
            this.yView = yView || 0;

            // distance from followed object to border before camera starts move
            this.xDeadZone = 0; // min distance to horizontal borders
            this.yDeadZone = 0; // min distance to vertical borders

            // viewport dimensions
            this.wView = canvasWidth;
            this.hView = canvasHeight;			

            // allow camera to move in vertical and horizontal axis
            this.axis = AXIS.BOTH;	

            // object that should be followed
            this.followed = null;

            // rectangle that represents the viewport
            this.viewportRect = new Rectangle(this.xView, this.yView, this.wView, this.hView);				

            // rectangle that represents the world's boundary (room's boundary)
            this.worldRect = new Rectangle(0, 0, worldWidth, worldHeight);

        }

        // gameObject needs to have "x" and "y" properties (as world(or room) position)
        Camera.prototype.follow = function(gameObject, xDeadZone, yDeadZone)
        {		
            this.followed = gameObject;	
            this.xDeadZone = xDeadZone;
            this.yDeadZone = yDeadZone;
        };

        Camera.prototype.update = function()
        {
            // keep following the player (or other desired object)
            if(this.followed !== null)
            {		
                if(this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH)
                {		
                    // moves camera on horizontal axis based on followed object position
                    if(this.followed.x - this.xView  + this.xDeadZone > this.wView)
                        this.xView = this.followed.x - (this.wView - this.xDeadZone);
                    else if(this.followed.x  - this.xDeadZone < this.xView)
                        this.xView = this.followed.x  - this.xDeadZone;

                }
                if(this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH)
                {
                    // moves camera on vertical axis based on followed object position
                    if(this.followed.y - this.yView + this.yDeadZone > this.hView)
                        this.yView = this.followed.y - (this.hView - this.yDeadZone);
                    else if(this.followed.y - this.yDeadZone < this.yView)
                        this.yView = this.followed.y - this.yDeadZone;
                }						

            }		

            // update viewportRect
            this.viewportRect.set(this.xView, this.yView);
            console.log("Xv: " + this.xView + ", Yv: " + this.yView);

            // don't let camera leaves the world's boundary
            if(!this.viewportRect.within(this.worldRect))
            {
                console.warn("Camera left world boundaries");
                if(this.viewportRect.left < this.worldRect.left)
                    this.xView = this.worldRect.left;
                if(this.viewportRect.top < this.worldRect.top)					
                    this.yView = this.worldRect.top;
                if(this.viewportRect.right > this.worldRect.right)
                    this.xView = this.worldRect.right - this.wView;
                if(this.viewportRect.bottom > this.worldRect.bottom)					
                    this.yView = this.worldRect.bottom - this.hView;
            }

        };
        
        
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
            
            update: function() {
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
                
                if (player.x + player.w > 2000) {
                        console.log("Player hit right edge of screen");
                        player.x = canvas.width - player.w;
                        //player.velX *= -1;
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
                //context.drawImage(playerImg, player.x, player.y);
                //context.fillRect(, , this.width, this.height);
                context.drawImage(playerImg, (this.x-this.w/2) - camera.xView, (this.y-this.h/2) - camera.yView);

            }
        };
        

        function floor(ix, iy, itype) {
            this.x = ix;
            this.y = iy;
            this.w = 32;
            this.h = 32;
            this.type = itype;
            
            this.draw = function() {
				context.fillRect((this.x-this.w/2) - camera.xView, (this.y-this.h/2) - camera.yView, this.w, this.h);
            };
            
        }
        
/*
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
        world.init();

*/        
        
        var myFloor = new floor(100, 400, 1);
        
        
        function draw(){
				context.clearRect(0,0,canvas.width,canvas.height);
				//context.fillRect(player.x,player.y,player.w,player.h);
                player.draw();
                myFloor.draw();
//                world.draw();
                //context.drawImage(player.img, 0, 0);
                //handler.draw();
                
        }

        
        
        
        this.addEventListener("touchstart", touchstarthandler,false);
        this.addEventListener("touchend", touchendhandler,false);

        var camera = new Camera(0, 0, canvas.width, canvas.height, 2000, 2000);
		camera.follow(player, canvas.width/2, canvas.height/2);

        
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
            console.log("Player: X: " + player.x + ", Y: " + player.y + ", velX: " + player.velX + ", velY: " + player.velY); 
            player.update();
            camera.update();

        }

        var gameTimer = setInterval(game,1000/30);
		var drawTimer = setInterval(draw,1000/30);

        
    }, false);

}());
