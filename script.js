/* =============================
   Global Utility Functions
============================= */

// Dummy logout
function logout() {
  alert("You have been logged out!");
  window.location.href = "index.html";
}

// Toggle settings
function showSettings() {
  window.location.href = "settings.html";
}

/* =============================
   Dashboard → Concept Linking
============================= */
function openConcept(topic) {
  window.location.href = `concept.html?topic=${topic}`;
}

/* =============================
   Concept Page Logic
============================= */
document.addEventListener("DOMContentLoaded", () => {
  const conceptPage = document.getElementById("concept-page");
  if (!conceptPage) return; // Only run if on concept.html

  const concepts = {
    "cell": {
      title: "Cell Structure",
      description: "Explore the building blocks of life with interactive 3D models of animal and plant cells.",
      icon: "fas fa-microscope",
      model: "models/cell.glb"
    },
    "dna": {
      title: "DNA & Genetics",
      description: "Unravel the mysteries of genetics with our interactive DNA model and inheritance simulations.",
      icon: "fas fa-dna",
      model: "models/dna.glb"
    },
    "human-brain": {
      title: "Human Brain",
      description: "Discover the complexities of the human brain with our detailed 3D model and functional areas.",
      icon: "fas fa-brain",
      model: "models/brain.glb"
    },
    "human-heart": {
      title: "Human Heart",
      description: "Explore the human cardiovascular system with our beating heart model and blood flow simulation.",
      icon: "fas fa-heart",
      model: "models/heart.glb"
    }
  };

  // Get topic from URL
  const params = new URLSearchParams(window.location.search);
  const topic = params.get("topic") || "cell";
  const concept = concepts[topic];

  // Update Nav
  document.getElementById("concept-nav").innerHTML = `
    <li><a href="#" class="active">${concept.title}</a></li>
    <li><a href="#">3D Model</a></li>
    <li><a href="#">AI Tutor</a></li>
    <li><a href="quiz.html?topic=${topic}">Quiz</a></li>
  `;

  // Update AI Tutor text
  document.getElementById("chat-title").innerText = `AI Tutor - ${concept.title}`;
  document.getElementById("chat-intro").innerText = `Hi! I'm your tutor. What would you like to know about ${concept.title}?`;

  // Load 3D model if exists
  if (concept.model) {
    load3DModel("model-placeholder", concept.model);
  } else {
    document.getElementById("model-placeholder").innerHTML = `
      <div style="text-align:center;">
        <i class="${concept.icon}" style="font-size:3rem; margin-bottom:10px;"></i>
        <p>${concept.title}</p>
        <p>${concept.description}</p>
      </div>`;
  }
});

/* =============================
   3D Model Loader (Three.js)
============================= */
function load3DModel(containerId, modelPath) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const width = container.offsetWidth;
  const height = container.offsetHeight || 400;
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, 1.5, 5);

  // Lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 7.5);
  scene.add(dirLight);

  // Load model
  const loader = new THREE.GLTFLoader();
  loader.load(
    modelPath,
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(2, 2, 2);
      model.position.y = -1;
      scene.add(model);

      // OrbitControls (for rotation/zoom)
      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;

      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
      animate();
    },
    undefined,
    (error) => {
      console.error("Error loading model:", error);
      container.innerHTML = `<p style="color:red;">⚠️ Failed to load 3D model</p>`;
    }
  );

  // Handle resizing
  window.addEventListener("resize", () => {
    const newWidth = container.offsetWidth;
    const newHeight = container.offsetHeight || 400;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
}

/* =============================
   Quiz Page Placeholder Logic
============================= */
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("quiz-page")) {
    console.log("Quiz page loaded. TODO: Load quiz questions dynamically.");
  }
});