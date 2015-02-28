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
        
        
        
        /*
        
            // load and draw image on the canvas
            img.onload = function() {
                context.drawImage(img, (width - img.width) / 2, (height - img.height) / 2);
            };
            img.src = "asset/9ja.png";
        
        */

        
        var player = {
            x: 0,
            y: 0,
            velX: 0,
            velY: 0,
            w: 128,
            h: 128,
        }
        

        var playerImg = new Image();
        playerImg.src = "asset/9ja.png";
        
        var gravity = 10;

        function draw(){
				context.clearRect(0,0,canvas.width,canvas.height);
				//context.fillRect(player.x,player.y,player.w,player.h);
                context.drawImage(playerImg, player.x, player.y);
                //context.drawImage(player.img, 0, 0);
                
        }
        
        function game() {
            console.log("Player: X: " + player.x + ", Y: " + player.y + ", velX: " + player.velX + ", velY: " + player.velY); 
            player.x += player.velX;
            player.y += player.velY;
            player.velY += gravity;
            if (player.velY > 20) {
                player.velY = 20;
            }
            if (player.velY < -20) {
                player.velY = -20;
            }

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
                    player.velY *= -.75;
            }
        }

        var gameTimer = setInterval(game,1000/30);
		var drawTimer = setInterval(draw,1000/30);

        
    }, false);

}());
