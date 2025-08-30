//Js: Timers: setInterval, requestAnimationFrame(libry)

// JQuery: Dom Maninpulation: to easily select elements, change text
           //Event Handling
           //Animations



$(document).ready(function() {
    // Game state variables
    let score = 0;
    let ballX = 0;
    let ballY = 0;
    let ballSpeedX = 4; // Initial horizontal speed
    let ballSpeedY = 4; // Initial vertical speed
    let paddleX = 0;
    const paddleSpeed = 8; // How fast the paddle moves
    const ballSize = 20;
    const paddleWidth = 100;
    const paddleHeight = 15;

    let gameAreaWidth;
    let gameAreaHeight;

    let animationFrameId; // To control requestAnimationFrame
    let isGameRunning = false;

    // jQuery element references
    const $scoreDisplay = $("#score");
    const $startButton = $("#start-button");
    const $restartButton = $("#restart-button");
    const $gameArea = $("#game-area");
    const $ball = $("#ball");
    const $paddle = $("#paddle");
    const $gameOverMessage = $("#game-over-message");
    const $finalScoreDisplay = $("#final-score");

    // --- Game Initialization & Reset ---
    function initializeGame() {
        gameAreaWidth = $gameArea.width();
        gameAreaHeight = $gameArea.height();

        score = 0;
        $scoreDisplay.text(score);
        $gameOverMessage.hide();
        $startButton.show();
        $startButton.prop('disabled', false).text("Start Game");

        // Center ball and paddle
        ballX = gameAreaWidth / 2 - ballSize / 2;
        ballY = gameAreaHeight / 2 - ballSize / 2;
        paddleX = gameAreaWidth / 2 - paddleWidth / 2;

        // Reset ball speed (can add randomness here if you like)
        ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 4; // Random initial direction
        ballSpeedY = 4;

        updateElementPositions(); // Set initial positions
    }

    // --- Game Loop (Main animation logic) ---
    function gameLoop() {
        if (!isGameRunning) return;

        // 1. Update Ball Position
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // 2. Collision Detection: Walls
        // Left/Right walls
        if (ballX + ballSize > gameAreaWidth || ballX < 0) {
            ballSpeedX *= -1; // Reverse horizontal direction
            // Keep ball within bounds to prevent sticking
            ballX = Math.max(0, Math.min(ballX, gameAreaWidth - ballSize));
        }

        // Top wall
        if (ballY < 0) {
            ballSpeedY *= -1; // Reverse vertical direction
            ballY = 0; // Prevent sticking
        }

        // 3. Collision Detection: Paddle
        // Check if ball is at paddle's height AND within paddle's horizontal range
        const ballBottom = ballY + ballSize;
        const paddleTop = gameAreaHeight - paddleHeight;
        const paddleLeft = paddleX;
        const paddleRight = paddleX + paddleWidth;

        if (ballBottom >= paddleTop &&
            ballX + ballSize > paddleLeft &&
            ballX < paddleRight) {
            // Ball hit paddle
            ballSpeedY *= -1; // Reverse vertical direction
            ballY = paddleTop - ballSize; // Adjust ball position to prevent sticking inside paddle

            score++;
            $scoreDisplay.text(score);

            // Increase speed as score increases (difficulty curve)
            // Cap speed to prevent it from becoming unplayable
            if (Math.abs(ballSpeedY) < 15) { // Max speed
                ballSpeedY *= 1.05; // Increase by 5%
            }
            if (Math.abs(ballSpeedX) < 15) {
                ballSpeedX *= 1.05;
            }
        }

        // 4. Game Over Condition: Ball misses paddle
        if (ballY + ballSize > gameAreaHeight) {
            endGame();
            return; // Stop the loop immediately
        }

        // 5. Update DOM Elements
        updateElementPositions();

        // Request next frame
        animationFrameId = requestAnimationFrame(gameLoop);
    }

    // --- Update Element Positions in DOM (DOM Manipulation) ---
    function updateElementPositions() {
        // jQuery .css() for setting positions
        $ball.css({ left: ballX + "px", top: ballY + "px" });
        $paddle.css({ left: paddleX + "px" });
    }

    // --- Paddle Movement (Keyboard Input) ---
    // Track pressed keys for smooth movement (allow holding down keys)
    let keysPressed = {};
    $(document).on("keydown", function(e) {
        keysPressed[e.key] = true;
    });

    $(document).on("keyup", function(e) {
        keysPressed[e.key] = false;
    });

    // Function to handle paddle movement based on pressed keys
    function handlePaddleMovement() {
        if (isGameRunning) {
            if (keysPressed['ArrowLeft'] || keysPressed['a']) {
                paddleX -= paddleSpeed;
            }
            if (keysPressed['ArrowRight'] || keysPressed['d']) {
                paddleX += paddleSpeed;
            }

            // Keep paddle within game area bounds
            paddleX = Math.max(0, Math.min(paddleX, gameAreaWidth - paddleWidth));
            updateElementPositions(); // Update paddle position immediately
        }
        requestAnimationFrame(handlePaddleMovement); // Keep checking for movement
    }


    // --- Game Start/End Functions ---
    function startGame() {
        if (isGameRunning) return; // Prevent multiple starts
        isGameRunning = true;
        $startButton.prop("disabled", true).text("Game Running...");
        $gameOverMessage.hide(); // Hide game over message

        initializeGame(); // Reset positions and score
        animationFrameId = requestAnimationFrame(gameLoop); // Start the ball movement
        requestAnimationFrame(handlePaddleMovement); // Start listening for paddle movement
    }

    function endGame() {
        isGameRunning = false;
        cancelAnimationFrame(animationFrameId); // Stop the game loop
        $gameOverMessage.show();
        $finalScoreDisplay.text(score);
        $startButton.hide(); // Hide the initial start button
    }

    // --- Event Listeners (using jQuery) ---
    $startButton.on("click", startGame);
    $restartButton.on("click", startGame); // Restart button just calls startGame again

    // Initial setup when the page loads
    initializeGame();
});
