const ValentineSurprise = {
    herName: "Heena",
    countdownDate: new Date("February 14, 2025 23:07:00").getTime(),
    timerElement: document.getElementById("timer"),
    gifContainer: document.getElementById("gif-container"),
    backgroundMusic: document.getElementById("background-music"),
    quizModal: document.getElementById("quiz-modal"),
    quizQuestionElement: document.getElementById("quiz-question"),
    quizOptionsElement: document.getElementById("quiz-options"),
    nextButton: null,
    closeButton: null,
    retakeButton: null,
    currentQuestionIndex: 0,
    score: 0,
    quizQuestions: [
        { question: "Where was our first date?", options: ["Palladium Mall", "AlphOne Mall"], answer: "Palladium Mall" },
        { question: "What's my favorite Shak?", options: ["Cobbie", "Bataka", "Ringan"], answer: "Cobbie" },
        { question: "What is our favorite Food?", options: ["Panjabi", "Chinese", "Gujarati"], answer: "Chinese" },
        { question: "What is my dream honeymoon destination?", options: ["Shimla", "Ladakh", "Andaman-Nicobar"], answer: "Andaman-Nicobar" },
        { question: "Who is my favorite Heroine?", options: ["Karina Kapoor", "Kriti Sanon", "Heena ❤️"], answer: "Heena ❤️" }
    ],
    cubes: [],
    numCubes: 5,
    initialRotationX: [],
    initialRotationY: [],
    autoRotate: true,
    rotationSpeed: 0.0005,
    containers: [],
    scenes: [],
    cameras: [],
    renderers: [],
    touchStartX: [],
    touchStartY: [],
    isDragging: [],
    dragSensitivity: 0.0095,
    musicPlayed: false,

    init: function() {
        try {
            this.insertName();
            this.setupCountdown();
            this.setupGif();
            this.autoplayMusic(); // Call autoplayMusic instead of setupMusic
            this.setupQuiz();
            this.setupCubes();
        } catch (error) {
            console.error("Initialization error:", error);
        }
    },

    insertName: function() {
        try {
            document.querySelectorAll(".her-name").forEach(element => {
                element.textContent = this.herName;
            });
        } catch (error) {
            console.error("Error inserting name:", error);
        }
    },

    setupCountdown: function() {
        try {
            const countdown = () => {
                const now = new Date().getTime();
                const distance = this.countdownDate - now;

                if (distance < 0) {
                    clearInterval(this.countdownInterval);
                    this.timerElement.innerHTML = "The Surprise is here!";
                    // this.showBigReveal();
                    return;
                }

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                this.timerElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            };

            countdown();
            this.countdownInterval = setInterval(countdown, 1000);
        } catch (error) {
            console.error("Error setting up countdown:", error);
        }
    },

    setupGif: function() {
        try {
            const showGifHandler = () => this.showGif();
            const showGifButton = document.getElementById("showGif");
            showGifButton.dataset.showGifHandler = showGifHandler;
            showGifButton.addEventListener('click', showGifHandler);
        } catch (error) {
            console.error("Error setting up GIF:", error);
        }
    },

    showGif: function() {
        try {
            this.gifContainer.innerHTML = '';
            setTimeout(() => {
                this.gifContainer.innerHTML = `<img src="surprise-gif.gif?timestamp=${Date.now()}" alt="Surprise GIF" class="gif-surprise">`;
            }, 100);
            this.autoplayMusic();
        } catch (error) {
            console.error("Error showing GIF:", error);
        }
    },

    autoplayMusic: function() {
        try {
            if (this.musicPlayed) {
                console.log("Music already played, skipping autoplay.");
                return; // Don't play again
            }
            // Attempt to play the music
            const playPromise = this.backgroundMusic.play();
            console.log("Attempting to play the music...", playPromise);
            // Handle the promise for autoplay restrictions
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Autoplay started!
                    console.log("Autoplay started successfully!");
                    this.musicPlayed = true; 
                }).catch(error => {
                    // Autoplay was prevented.
                    console.warn("Autoplay was prevented.  Waiting for user interaction.");
                    // Optionally, show a message to the user or add a button to start the music
                });
            }
        } catch (error) {
            console.error("Error setting up music:", error);
        }
    },

    setupQuiz: function() {
        try {
            const startQuizButton = document.getElementById("start-quiz");
            if (startQuizButton) {
                startQuizButton.addEventListener("click", () => this.startQuiz());
            }

            this.closeButton = this.quizModal.querySelector('.close-button');
            this.closeButton.addEventListener("click", () => this.closeQuizModal());
        } catch (error) {
            console.error("Error setting up quiz:", error);
        }
    },

    startQuiz: function() {
        try {
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.quizModal.style.display = "block";

            // **Important:** Get the nextButton *after* the modal is displayed, inside a setTimeout
            setTimeout(() => {
                this.nextButton = document.getElementById("next-question");
                console.log("Next button:", this.nextButton);

                if (this.nextButton) {
                    this.nextButton.addEventListener("click", () => {
                        console.log("Next button clicked");
                        this.loadQuizQuestion();
                    });
                } else {
                    console.warn("Next button not found!");
                }

                this.loadQuizQuestion();
            }, 100); // A small delay to ensure the DOM is updated
        } catch (error) {
            console.error("Error starting quiz:", error);
        }
    },

    closeQuizModal: function() {
        try {
            this.quizModal.style.display = "none";
        } catch (error) {
            console.error("Error closing quiz modal:", error);
        }
    },

    loadQuizQuestion: function() {
        console.log("loadQuizQuestion called");
        try {
            if (this.currentQuestionIndex >= this.quizQuestions.length) {
                this.showResults();
                return;
            }

            const q = this.quizQuestions[this.currentQuestionIndex];
            this.quizQuestionElement.innerText = q.question;
            this.quizOptionsElement.innerHTML = "";

            q.options.forEach((option, i) => {
                const button = document.createElement("button");
                button.classList.add("quiz-option");
                button.textContent = option;

                button.addEventListener("click", (event) => this.handleAnswer(event, option, q.answer));
                this.quizOptionsElement.appendChild(button);
            });

            if (this.nextButton) {
                this.nextButton.style.display = "none";
            } else {
                console.warn("Next button not found in loadQuizQuestion");
            }
        } catch (error) {
            console.error("Error loading quiz question:", error);
        }
    },

    handleAnswer: function(event, selectedOption, correctAnswer) {
        try {
            const options = document.querySelectorAll(".quiz-option");
            options.forEach(btn => {
                btn.disabled = true;
                btn.classList.remove("correct", "incorrect");
            });

            if (selectedOption === correctAnswer) {
                event.target.classList.add("correct");
                this.score++;
            } else {
                event.target.classList.add("incorrect");
            }

            this.currentQuestionIndex++;

            if (this.nextButton) {
                this.nextButton.style.display = "block";
            } else {
                console.warn("Next button not found in handleAnswer");
            }

        } catch (error) {
            console.error("Error handling answer:", error);
        }
    },

    showResults: function() {
        try {
            let resultMessage = `Quiz Complete! 🎉 Your Score: ${this.score}/${this.quizQuestions.length}. `;
            if (this.score === this.quizQuestions.length) {
                resultMessage += "You know me inside and out! ❤️";
                this.fireConfetti(); // Trigger Confetti
            } else if (this.score >= this.quizQuestions.length / 2) {
                resultMessage += "Not bad! You know me pretty well. 😊";
            } else {
                resultMessage += "Oops! We need to spend more time together. 😉";
            }

            this.quizQuestionElement.innerText = resultMessage;
            this.quizOptionsElement.innerHTML = "";

            if (this.nextButton) {
                this.nextButton.style.display = "none";
            } else {
                console.warn("Next button not found in showResults");
            }
        } catch (error) {
            console.error("Error showing results:", error);
        }
    },

    fireConfetti: function() {
        const end = Date.now() + (3 * 1000);

        // go Buckeyes!
        const colors = ['#bb0000', '#ffffff'];

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    },

    showBigReveal: function() {
        try {
            const revealSection = document.createElement("section");
            revealSection.id = "big-reveal";
            revealSection.innerHTML = `
                <h2>Happy Valentine's Day, ${this.herName}!</h2>
                <p>I hope you enjoyed your surprise. I love you more than words can say!</p>
                <img src="reveal-image.jpg" alt="Your Surprise">
            `;
            document.body.appendChild(revealSection);
        } catch (error) {
            console.error("Error showing big reveal:", error);
        }
    },

    setupCubes: function() {
        try {
            this.containers = document.querySelectorAll('.cube-container');
            this.numCubes = this.containers.length;

            for (let i = 0; i < this.numCubes; i++) {
                this.touchStartX[i] = 0;
                this.touchStartY[i] = 0;
                this.initialRotationX[i] = Math.random() * 2 * Math.PI;
                this.initialRotationY[i] = Math.random() * 2 * Math.PI;
                this.isDragging[i] = false;

                const container = this.containers[i];
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
                const renderer = new THREE.WebGLRenderer({ alpha: true });
                renderer.setSize(container.offsetWidth, container.offsetHeight);
                container.appendChild(renderer.domElement);

                this.scenes[i] = scene;
                this.cameras[i] = camera;
                this.renderers[i] = renderer;

                const geometry = new THREE.BoxGeometry(8, 8, 8);
                const materials = [];
                for (let j = 1; j <= 6; j++) {
                    const texture = new THREE.TextureLoader().load(`${i+1}_${j}.jpg`);
                    materials.push(new THREE.MeshLambertMaterial({ map: texture }));
                }

                const cube = new THREE.Mesh(geometry, materials);
                scene.add(cube);
                this.cubes.push(cube);
                camera.position.z = 15;
                cube.rotation.x = this.initialRotationX[i];
                cube.rotation.y = this.initialRotationY[i];

                const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                scene.add(ambientLight);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
                directionalLight.position.set(0, 1, 1);
                scene.add(directionalLight);

                const canvas = renderer.domElement;
                canvas.addEventListener('touchstart', (event) => {
                    this.autoRotate = false;
                    this.touchStartX[i] = event.touches[0].clientX;
                    this.touchStartY[i] = event.touches[0].clientY;
                    this.isDragging[i] = true;
                }, { passive: false });

                canvas.addEventListener('touchmove', (event) => {
                    if (!this.isDragging[i]) return;
                    event.preventDefault();

                    const touchX = event.touches[0].clientX;
                    const touchY = event.touches[0].clientY;

                    const deltaX = touchX - this.touchStartX[i];
                    const deltaY = touchY - this.touchStartY[i];

                    this.cubes[i].rotation.y += deltaX * this.dragSensitivity;
                    this.cubes[i].rotation.x += deltaY * this.dragSensitivity;

                    this.touchStartX[i] = touchX;
                    this.touchStartY[i] = touchY;
                }, { passive: false });

                canvas.addEventListener('touchend', () => {
                    this.autoRotate = true;
                    this.isDragging[i] = false;
                }, { passive: false });

                canvas.addEventListener('touchcancel', () => {
                    this.autoRotate = true;
                    this.isDragging[i] = false;
                }, { passive: false });
            }

            const animate = () => {
                requestAnimationFrame(animate);

                for (let i = 0; i < this.numCubes; i++) {
                    if (this.autoRotate && !this.isDragging[i]) {
                        this.cubes[i].rotation.x += this.rotationSpeed * 10;
                        this.cubes[i].rotation.y += this.rotationSpeed * 15;
                    }
                    this.renderers[i].render(this.scenes[i], this.cameras[i]);
                }
            };

            animate();
        } catch (error) {
            console.error("Error setting up cubes:", error);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ValentineSurprise.init();
});
