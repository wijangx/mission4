document.getElementById("dateInput").valueAsDate = new Date();
let tasks = [];
let currPriority = "low";

function setPriority(level) {
  currPriority = level;
  document
    .querySelectorAll(".p-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(`btn-${level}`).classList.add("active");
}

function openModal(id) {
  if (id === "editModal") {
    document.getElementById("inpName").value =
      document.getElementById("nameLabel").innerText;
    document.getElementById("inpRole").value =
      document.getElementById("roleLabel").innerText;
  }
  document.getElementById(id).classList.add("active");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}

function saveProfile() {
  const name = document.getElementById("inpName").value.trim();
  const role = document.getElementById("inpRole").value.trim();
  if (name) {
    document.getElementById("nameLabel").innerText = name;
    document.getElementById("avatarBox").innerText = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }
  if (role) document.getElementById("roleLabel").innerText = role;
  closeModal("editModal");
}

function addTask() {
  const txt = document.getElementById("taskInput").value.trim();
  const date = document.getElementById("dateInput").value;
  if (!txt) return;
  tasks.push({
    id: Date.now(),
    text: txt,
    priority: currPriority,
    deadline: date,
    completed: false,
  });
  document.getElementById("taskInput").value = "";
  renderData();
}

function toggleItem(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    renderData();
  }
}

function deleteItem(id) {
  tasks = tasks.filter((t) => t.id !== id);
  renderData();
}

function deleteAll() {
  tasks = [];
  renderData();
  closeModal("deleteModal");
}

function renderData() {
  const todoList = document.getElementById("todoList");
  const doneList = document.getElementById("doneList");
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let todoTotal = 0;
  let doneTotal = 0;

  tasks.forEach((t) => {
    const date = new Date(t.deadline);
    date.setHours(0, 0, 0, 0);
    const isLate = !t.completed && date < today;
    const dateStr = new Date(t.deadline).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const box = document.createElement("div");
    box.className = `task-item ${t.completed ? "done" : ""} ${isLate ? "overdue" : ""}`;

    box.innerHTML = `
      <div class="task-left">
          <div class="checkbox-wrapper">
              <div class="custom-checkbox" data-id="${t.id}" data-action="toggle">
                  <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" stroke="white" stroke-width="3" fill="none"></polyline></svg>
              </div>
          </div>
          <div class="task-info">
              <div class="task-title">${t.text}</div>
              <div class="task-badges">
                  <span class="badge b-${t.priority}">${t.priority}</span>
                  <span class="b-date">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      ${dateStr}
                  </span>
                  ${isLate ? `<span class="b-late">LATE</span>` : ""}
              </div>
          </div>
      </div>
      <button class="btn-trash" data-id="${t.id}" data-action="delete" title="Hapus">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
      </button>
    `;

    if (t.completed) {
      doneList.prepend(box);
      doneTotal++;
    } else {
      todoList.prepend(box);
      todoTotal++;
    }
  });

  document.getElementById("todoCount").innerText = todoTotal;
  document.getElementById("doneCount").innerText = doneTotal;
  if (todoTotal === 0)
    todoList.innerHTML = `<div style="font-size:13px; color:#94a3b8; text-align:center; padding:12px;">Tidak ada tugas aktif.</div>`;
  if (doneTotal === 0)
    doneList.innerHTML = `<div style="font-size:13px; color:#94a3b8; text-align:center; padding:12px;">Belum ada tugas selesai.</div>`;
}

// 1. Tombol Add Task
document.getElementById("btnAddTask").addEventListener("click", addTask);

// 2. Tombol Edit Profile & Modal
document
  .getElementById("btnEditProfile")
  .addEventListener("click", () => openModal("editModal"));
document
  .getElementById("btnCancelEdit")
  .addEventListener("click", () => closeModal("editModal"));
document.getElementById("btnSaveEdit").addEventListener("click", saveProfile);

// 3. Tombol Delete All & Modal
document
  .getElementById("btnDeleteAll")
  .addEventListener("click", () => openModal("deleteModal"));
document
  .getElementById("btnCancelDelete")
  .addEventListener("click", () => closeModal("deleteModal"));
document
  .getElementById("btnConfirmDelete")
  .addEventListener("click", deleteAll);

// 4. Tombol Priority
document
  .getElementById("btn-high")
  .addEventListener("click", () => setPriority("high"));
document
  .getElementById("btn-medium")
  .addEventListener("click", () => setPriority("medium"));
document
  .getElementById("btn-low")
  .addEventListener("click", () => setPriority("low"));

// 5. EVENT DELEGATION (Khusus buat tombol di dalam list tugas)
document.addEventListener("click", function (event) {
  // Cek apakah area yang diklik adalah tombol centang (toggle)
  const toggleBtn = event.target.closest('[data-action="toggle"]');
  if (toggleBtn) {
    const taskId = parseInt(toggleBtn.getAttribute("data-id"));
    toggleItem(taskId);
    return;
  }

  // Cek apakah area yang diklik adalah tombol tong sampah (delete)
  const deleteBtn = event.target.closest('[data-action="delete"]');
  if (deleteBtn) {
    const taskId = parseInt(deleteBtn.getAttribute("data-id"));
    deleteItem(taskId);
    return;
  }
});

// Render pertama kali saat aplikasi dibuka
renderData();
