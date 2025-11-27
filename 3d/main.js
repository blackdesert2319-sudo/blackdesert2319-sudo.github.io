// Khởi tạo Three.js scene cơ bản
let scene, camera, renderer, controls;
let objectsGroup;

function init() {
  const container = document.getElementById("canvas-container");

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020617);

  const aspect = container.clientWidth / container.clientHeight;
  camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  camera.position.set(6, 6, 6);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(5, 10, 7);
  scene.add(dir);

  const grid = new THREE.GridHelper(20, 20, 0x4b5563, 0x1f2937);
  scene.add(grid);

  const axes = new THREE.AxesHelper(5);
  scene.add(axes);

  objectsGroup = new THREE.Group();
  scene.add(objectsGroup);

  window.addEventListener("resize", onWindowResize);

  animate();
}

function onWindowResize() {
  const container = document.getElementById("canvas-container");
  if (!container) return;
  const width = container.clientWidth;
  const height = container.clientHeight || 1;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Dọn các object đã vẽ trước đó
function clearObjects() {
  while (objectsGroup.children.length > 0) {
    const obj = objectsGroup.children[0];
    objectsGroup.remove(obj);
  }
}

// Parse đề bài
function parseProblem(text) {
  const lines = text.split(/\r?\n/);
  const points = {};
  const commands = [];
  const errors = [];

  lines.forEach((raw, index) => {
    const line = raw.trim();
    if (!line || line.startsWith("#") || line.startsWith("//")) return;

    const parts = line.split(/\s+/);
    const cmd = parts[0].toUpperCase();
    const lineNumber = index + 1;

    if (cmd === "POINT") {
      if (parts.length !== 5) {
        errors.push(`Dòng ${lineNumber}: POINT cần dạng "POINT Tên x y z"`);
        return;
      }
      const name = parts[1];
      const x = parseFloat(parts[2]);
      const y = parseFloat(parts[3]);
      const z = parseFloat(parts[4]);
      if ([x, y, z].some(v => Number.isNaN(v))) {
        errors.push(`Dòng ${lineNumber}: Tọa độ điểm không hợp lệ`);
        return;
      }
      points[name] = new THREE.Vector3(x, y, z);
      commands.push({ type: "POINT", name, x, y, z, lineNumber });
    } else if (cmd === "LINE") {
      if (parts.length !== 4) {
        errors.push(`Dòng ${lineNumber}: LINE cần dạng "LINE Tên Điểm1 Điểm2"`);
        return;
      }
      const name = parts[1];
      const p1 = parts[2];
      const p2 = parts[3];
      commands.push({ type: "LINE", name, p1, p2, lineNumber });
    } else if (cmd === "PLANE") {
      if (parts.length !== 6) {
        errors.push(`Dòng ${lineNumber}: PLANE cần dạng "PLANE Tên Điểm nx ny nz"`);
        return;
      }
      const name = parts[1];
      const pointName = parts[2];
      const nx = parseFloat(parts[3]);
      const ny = parseFloat(parts[4]);
      const nz = parseFloat(parts[5]);
      if ([nx, ny, nz].some(v => Number.isNaN(v))) {
        errors.push(`Dòng ${lineNumber}: Vector pháp tuyến không hợp lệ`);
        return;
      }
      commands.push({ type: "PLANE", name, pointName, nx, ny, nz, lineNumber });
    } else {
      errors.push(`Dòng ${lineNumber}: Lệnh không hỗ trợ "${cmd}". Dùng POINT / LINE / PLANE.`);
    }
  });

  return { points, commands, errors };
}

// Vẽ từ commands
function drawFromCommands(parseResult) {
  clearObjects();
  const { points, commands, errors } = parseResult;
  const extraErrors = [];

  const sphereGeometry = new THREE.SphereGeometry(0.08, 16, 16);
  const pointMaterial = new THREE.MeshStandardMaterial({ color: 0xfacc15 });

  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x22c55e });

  const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide
  });

  commands.forEach(cmd => {
    if (cmd.type === "POINT") {
      const sphere = new THREE.Mesh(sphereGeometry, pointMaterial);
      sphere.position.set(cmd.x, cmd.y, cmd.z);
      sphere.userData.label = cmd.name;
      objectsGroup.add(sphere);
    }
  });

  commands.forEach(cmd => {
    if (cmd.type === "LINE") {
      const p1 = points[cmd.p1];
      const p2 = points[cmd.p2];
      if (!p1 || !p2) {
        extraErrors.push(
          `Dòng ${cmd.lineNumber}: LINE "${cmd.name}" cần hai điểm đã khai báo trước (thiếu ${!p1 ? cmd.p1 : ""} ${!p2 ? cmd.p2 : ""})`
        );
        return;
      }

      const geometry = new THREE.BufferGeometry().setFromPoints([
        p1.clone().addScaledVector(p1.clone().sub(p2).normalize(), 5),
        p2.clone().addScaledVector(p2.clone().sub(p1).normalize(), 5)
      ]);
      const line = new THREE.Line(geometry, lineMaterial);
      line.userData.label = cmd.name;
      objectsGroup.add(line);
    }
  });

  commands.forEach(cmd => {
    if (cmd.type === "PLANE") {
      const basePoint = points[cmd.pointName];
      if (!basePoint) {
        extraErrors.push(
          `Dòng ${cmd.lineNumber}: PLANE "${cmd.name}" cần điểm "${cmd.pointName}" đã khai báo trước`
        );
        return;
      }
      const normal = new THREE.Vector3(cmd.nx, cmd.ny, cmd.nz);
      if (normal.length() === 0) {
        extraErrors.push(`Dòng ${cmd.lineNumber}: Vector pháp tuyến của PLANE "${cmd.name}" không được bằng (0,0,0)`);
        return;
      }
      normal.normalize();

      const planeSize = 20;
      const geometry = new THREE.PlaneGeometry(planeSize, planeSize);
      const plane = new THREE.Mesh(geometry, planeMaterial);

      const up = new THREE.Vector3(0, 1, 0);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);
      plane.quaternion.copy(quaternion);

      const distance = normal.dot(basePoint);
      plane.position.copy(normal.clone().multiplyScalar(distance));

      plane.userData.label = cmd.name;
      objectsGroup.add(plane);
    }
  });

  return errors.concat(extraErrors);
}

// Preset ví dụ
function loadPreset(name) {
  const textarea = document.getElementById("problem-input");
  if (name === "basic") {
    textarea.value = [
      "# Ví dụ cơ bản: 2 điểm, 1 đường, 1 mặt phẳng",
      "POINT A 0 0 0",
      "POINT B 2 1 3",
      "LINE d A B",
      "PLANE (P) A 0 1 0"
    ].join("\n");
  } else if (name === "triangle") {
    textarea.value = [
      "# Tam giác ABC và mặt phẳng qua A có pháp tuyến (1,1,1)",
      "POINT A 0 0 0",
      "POINT B 2 0 0",
      "POINT C 1 2 1",
      "LINE AB A B",
      "LINE BC B C",
      "LINE CA C A",
      "PLANE (Q) A 1 1 1"
    ].join("\n");
  }
}

// Gắn sự kiện UI
window.addEventListener("DOMContentLoaded", () => {
  init();

  const drawBtn = document.getElementById("draw-btn");
  const textarea = document.getElementById("problem-input");
  const errorsEl = document.getElementById("errors");
  const presetButtons = document.querySelectorAll(".preset-btn");

  drawBtn.addEventListener("click", () => {
    errorsEl.textContent = "";
    const text = textarea.value.trim();
    if (!text) {
      errorsEl.textContent = "Hãy nhập đề bài theo cú pháp gợi ý rồi bấm 'Vẽ hình 3D'.";
      return;
    }
    const parseResult = parseProblem(text);
    const allErrors = drawFromCommands(parseResult);
    if (allErrors.length > 0) {
      errorsEl.textContent = allErrors.join("\n");
    } else {
      errorsEl.textContent = "✅ Parse thành công. Dùng chuột để xoay, cuộn để zoom.";
    }
  });

  presetButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-preset");
      loadPreset(name);
    });
  });

  loadPreset("basic");
});
