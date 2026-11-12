ระบบลงทะเบียนนักเรียน + Admin
================================

ไฟล์ในโฟลเดอร์
- index.html             หน้าลงทะเบียนนักเรียน
- admin-login.html       หน้าเข้าสู่ระบบ Admin
- admin.html             หน้า Dashboard จัดการข้อมูล
- css/style.css          รูปแบบเว็บไซต์
- js/config.js           จุดใส่ค่า Supabase
- js/register.js         การบันทึกแบบฟอร์ม
- js/admin-login.js      การเข้าสู่ระบบและตรวจสิทธิ์
- js/admin.js            การแสดง/ค้นหา/แก้ไข/ลบข้อมูล
- supabase-setup.sql     คำสั่งสร้างตารางและกำหนดสิทธิ์

ขั้นตอนที่ 1: สร้าง Supabase โปรเจกต์ใหม่
1. เข้า https://supabase.com/ แล้วสร้าง Project ใหม่
2. ตั้งชื่อโปรเจกต์และรหัสผ่านฐานข้อมูล เก็บรหัสผ่านไว้เป็นความลับ
3. เข้าเมนู SQL Editor > New query
4. เปิดไฟล์ supabase-setup.sql คัดลอกทั้งหมดไปวาง แล้วกด Run

ขั้นตอนที่ 2: ตั้งค่า URL และ Key
1. ใน Supabase ไปที่ Project Settings > API (หรือ Data API / API Keys ตามหน้าตาเมนู)
2. คัดลอก Project URL
3. คัดลอก anon/public key หรือ publishable key
4. เปิดไฟล์ js/config.js แล้วแทนข้อความตัวอย่างในเครื่องหมายคำพูด
   SUPABASE_URL = "..."
   SUPABASE_ANON_KEY = "..."
5. ห้ามใช้ service_role key ในเว็บไซต์หรืออัปโหลดขึ้น GitHub เด็ดขาด

ขั้นตอนที่ 3: สร้างบัญชี Admin
1. ใน Supabase ไปที่ Authentication > Users
2. กด Add user / Create new user แล้วกำหนดอีเมลกับรหัสผ่านของผู้ดูแล
3. สร้างผู้ใช้ให้เรียบร้อย แล้วคัดลอก User UID ของบัญชีนั้น
4. เปิด SQL Editor แล้วรันคำสั่งนี้ โดยแทน UID ด้วยค่าจริง:

   insert into public.admin_users (user_id)
   values ('ใส่-USER-UID-ตรงนี้');

5. บัญชีนี้จึงจะเข้าสู่หน้า Admin ได้ บัญชีที่สมัครเองทั่วไปจะไม่มีสิทธิ์ Admin

ขั้นตอนที่ 4: ทดสอบเว็บไซต์
1. เปิด index.html ผ่าน Live Server ใน VS Code หรืออัปโหลดไฟล์ไป GitHub Pages
2. ทดลองลงทะเบียนข้อมูลนักเรียน
3. เปิด admin-login.html แล้วเข้าสู่ระบบด้วยอีเมลและรหัสผ่าน Admin
4. หน้า admin.html จะแสดงรายชื่อและจัดการข้อมูลได้

ขั้นตอนที่ 5: อัปโหลด GitHub
1. สร้าง Repository ใหม่ชื่อ student-registration-system
2. อัปโหลดไฟล์และโฟลเดอร์ทั้งหมด โดยคงโครงสร้างเดิม
3. เข้า Settings > Pages > Deploy from a branch > main > /(root) > Save
4. รอ GitHub Pages เผยแพร่ แล้วเปิด URL ที่แสดง

หมายเหตุด้านความปลอดภัย
- ห้ามเผยแพร่รหัสผ่าน Supabase หรือ service_role key
- anon/publishable key ใช้ในหน้าเว็บได้เมื่อเปิด RLS และตั้ง Policy ตามไฟล์ SQL นี้
- ข้อมูลนักเรียนเป็นข้อมูลส่วนบุคคล ควรจำกัดผู้ดูแลที่เข้าถึงได้ และแจ้งผู้ใช้ก่อนเก็บข้อมูล
- หากต้องการเปลี่ยนรายชื่อ/จำนวนระดับชั้น ให้แก้ตัวเลือกใน index.html ตามข้อมูลจริงของสถานศึกษา
