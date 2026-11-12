const form = document.getElementById("registerForm");
const message = document.getElementById("formMessage");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.className = "message";
  if (!configReady) {
    message.textContent = "กรุณาตั้งค่า Supabase URL และ anon/publishable key ในไฟล์ js/config.js ก่อน";
    message.classList.add("error"); return;
  }
  const data = Object.fromEntries(new FormData(form).entries());
  data.age = Number(data.age);
  const button = form.querySelector("button[type=submit]");
  button.disabled = true; button.textContent = "กำลังบันทึก...";
  const { error } = await supabaseClient.from("students").insert(data);
  button.disabled = false; button.textContent = "ส่งข้อมูลลงทะเบียน";
  if (error) {
    message.textContent = error.code === "23505" ? "เลขประจำตัวนักศึกษานี้ลงทะเบียนแล้ว" : "บันทึกไม่สำเร็จ: " + error.message;
    message.classList.add("error");
  } else {
    form.reset(); message.textContent = "ลงทะเบียนสำเร็จ ขอบคุณที่กรอกข้อมูล";
  }
});
