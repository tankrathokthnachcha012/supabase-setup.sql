const rows = document.getElementById("studentRows");
const msg = document.getElementById("adminMessage");
const search = document.getElementById("searchInput");
let students = [];

function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
async function init() {
  if (!configReady) { msg.textContent = "กรุณาตั้งค่า Supabase ใน js/config.js"; msg.classList.add("error"); return; }
  const { data: sessionData } = await supabaseClient.auth.getSession();
  if (!sessionData.session) { location.href = "admin-login.html"; return; }
  const { data: admin } = await supabaseClient.from("admin_users").select("user_id").eq("user_id", sessionData.session.user.id).maybeSingle();
  if (!admin) { await supabaseClient.auth.signOut(); location.href = "admin-login.html"; return; }
  await loadStudents();
}
async function loadStudents() {
  msg.textContent = "กำลังโหลดข้อมูล...";
  const { data, error } = await supabaseClient.from("students").select("*").order("created_at", {ascending:false});
  if (error) { msg.textContent = "โหลดข้อมูลไม่สำเร็จ: " + error.message; msg.classList.add("error"); return; }
  students = data || []; document.getElementById("totalCount").textContent = students.length.toLocaleString("th-TH");
  render();
}
function render() {
  const term = search.value.trim().toLowerCase();
  const filtered = students.filter(s => [s.student_id,s.first_name,s.last_name,s.department,s.major].join(" ").toLowerCase().includes(term));
  rows.innerHTML = filtered.length ? filtered.map(s => `<tr>
    <td>${safe(s.student_id)}</td><td>${safe(s.first_name)} ${safe(s.last_name)}<br><small>${safe(s.username)}</small></td>
    <td>${safe(s.age)}</td><td>${safe(s.department)}</td><td>${safe(s.major)}</td><td>${safe(s.level)}</td><td>${safe(s.motto)}</td>
    <td><button class="action-btn edit" data-edit="${s.id}">แก้ไข</button><button class="action-btn delete" data-delete="${s.id}">ลบ</button></td></tr>`).join("") : '<tr><td colspan="8">ไม่พบข้อมูล</td></tr>';
}
search.addEventListener("input", render);
rows.addEventListener("click", async (event) => {
  const editId = event.target.dataset.edit, deleteId = event.target.dataset.delete;
  if (editId) {
    const s = students.find(item => item.id === Number(editId));
    const first = prompt("ชื่อ", s.first_name); if (first === null) return;
    const last = prompt("นามสกุล", s.last_name); if (last === null) return;
    const age = prompt("อายุ", s.age); if (age === null) return;
    const department = prompt("แผนก", s.department); if (department === null) return;
    const major = prompt("สาขา", s.major); if (major === null) return;
    const level = prompt("ระดับชั้น", s.level); if (level === null) return;
    const motto = prompt("คติประจำใจ", s.motto || ""); if (motto === null) return;
    const { error } = await supabaseClient.from("students").update({first_name:first.trim(),last_name:last.trim(),age:Number(age),department:department.trim(),major:major.trim(),level,motto}).eq("id",s.id);
    msg.textContent = error ? "แก้ไขไม่สำเร็จ: " + error.message : "แก้ไขข้อมูลเรียบร้อย"; if (error) msg.classList.add("error"); await loadStudents();
  }
  if (deleteId && confirm("ยืนยันลบข้อมูลนักเรียนรายการนี้หรือไม่?")) {
    const { error } = await supabaseClient.from("students").delete().eq("id", Number(deleteId));
    msg.textContent = error ? "ลบไม่สำเร็จ: " + error.message : "ลบข้อมูลเรียบร้อย"; if (error) msg.classList.add("error"); await loadStudents();
  }
});
document.getElementById("logoutBtn").addEventListener("click", async () => { await supabaseClient.auth.signOut(); location.href = "admin-login.html"; });
init();
