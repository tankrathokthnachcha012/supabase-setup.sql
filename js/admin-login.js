const form = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.className = "message";
  if (!configReady) { message.textContent = "กรุณาตั้งค่า Supabase ใน js/config.js"; message.classList.add("error"); return; }
  const data = Object.fromEntries(new FormData(form).entries());
  const button = form.querySelector("button"); button.disabled = true; button.textContent = "กำลังเข้าสู่ระบบ...";
  const { data: loginData, error } = await supabaseClient.auth.signInWithPassword({ email: data.email, password: data.password });
  if (error) {
    message.textContent = "เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลและรหัสผ่าน";
    message.classList.add("error"); button.disabled = false; button.textContent = "เข้าสู่ระบบ"; return;
  }
  const { data: admin, error: adminError } = await supabaseClient.from("admin_users").select("user_id").eq("user_id", loginData.user.id).maybeSingle();
  if (adminError || !admin) {
    await supabaseClient.auth.signOut();
    message.textContent = "บัญชีนี้ยังไม่ได้รับสิทธิ์ Admin";
    message.classList.add("error"); button.disabled = false; button.textContent = "เข้าสู่ระบบ"; return;
  }
  window.location.href = "admin.html";
});
