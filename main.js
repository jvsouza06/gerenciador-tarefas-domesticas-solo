const memberInput = document.getElementById('memberInput');
const taskInput = document.getElementById('taskInput');
const descInput = document.getElementById('descInput');
const addBtn = document.getElementById('addBtn');
const filterSelect = document.getElementById('filterSelect');
const taskList = document.getElementById('taskList');
const detailModal = document.getElementById('detailModal');
const modalMember = document.getElementById('modalMember');
const modalTask = document.getElementById('modalTask');
const modalDesc = document.getElementById('modalDesc');
const closeModal = document.getElementById('closeModal');

descInput.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
});

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks = tasks.map(t => ({ member: t.member, text: t.text, description: t.description || '', completed: t.completed || false }));

function saveTasks() { localStorage.setItem('tasks', JSON.stringify(tasks)); }
function updateFilterOptions() {
  const cur = filterSelect.value;
  const mems = [...new Set(tasks.map(t => t.member))];
  filterSelect.innerHTML = '<option value="">Todos</option>';
  mems.forEach(m => { const o = document.createElement('option'); o.value = m; o.textContent = m; filterSelect.appendChild(o); });
  filterSelect.value = cur;
}

function renderTasks() {
  const f = filterSelect.value;
  taskList.innerHTML = '';
  tasks.forEach((t, i) => {
    if (!f || t.member === f) {
      const li = document.createElement('li');
      if (t.completed) li.classList.add('completed');
      li.dataset.index = i;

      const cb = document.createElement('input');
      cb.type = 'checkbox'; cb.checked = t.completed;
      cb.addEventListener('change', () => { t.completed = cb.checked; saveTasks(); renderTasks(); });

      const info = document.createElement('div'); info.className = 'info';
      const hdr = document.createElement('div'); hdr.className = 'header';
      const mb = document.createElement('span'); mb.className = 'member'; mb.textContent = t.member;
      hdr.appendChild(mb);

      if (t.completed) {
        const cl = document.createElement('span'); cl.className = 'completed-label'; cl.textContent = 'MISSÃO CONCLUÍDA';
        hdr.appendChild(cl);
      }
      const sp = document.createElement('span'); sp.className = 'task-text'; sp.textContent = t.text;
      hdr.appendChild(sp);
      info.appendChild(hdr);

      const acts = document.createElement('div'); acts.className = 'actions';
      const ex = document.createElement('button'); ex.className = 'exibir-btn'; ex.innerHTML = '<span class="material-icons">visibility</span>'; ex.title = 'Exibir';
      ex.addEventListener('click', () => { modalMember.textContent = t.member; modalTask.textContent = t.text; modalDesc.textContent = t.description; detailModal.classList.add('open'); });
      const dl = document.createElement('button'); dl.className = 'delete-btn'; dl.innerHTML = '<span class="material-icons">delete</span>'; dl.title = 'Excluir';
      dl.addEventListener('click', () => { tasks.splice(i,1); saveTasks(); renderTasks(); });
      acts.appendChild(ex); acts.appendChild(dl);

      li.appendChild(cb); li.appendChild(info); li.appendChild(acts);
      taskList.appendChild(li);
    }
  });
  updateFilterOptions();
}

closeModal.addEventListener('click', () => detailModal.classList.remove('open'));
detailModal.addEventListener('click', e => { if (e.target === detailModal) detailModal.classList.remove('open'); });

addBtn.addEventListener('click', () => {
  const m = memberInput.value.trim(); const ti = taskInput.value.trim(); const d = descInput.value.trim();
  if (!m || !ti) return;
  tasks.push({ member: m, text: ti, description: d, completed: false }); saveTasks(); renderTasks();
  memberInput.value = '';
  taskInput.value = '';
  descInput.value = '';
  descInput.style.height = 'auto';
});

filterSelect.addEventListener('change', renderTasks);
renderTasks();