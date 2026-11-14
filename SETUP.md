# ติดตั้ง Google Sheets → LINE Group (ตารางนัดหมาย)

ตัวอย่างนี้อ่านข้อมูลนัดหมายทั่วไปจากแถวที่เลือกใน Google Sheets แล้วส่งเป็นข้อความไปยัง LINE Group

## รูปแบบชีต

ใส่หัวคอลัมน์ในแถว 1 และข้อมูลตั้งแต่แถว 2:

| คอลัมน์ | ข้อมูล |
|---|---|
| A | วันที่ |
| B | เวลา |
| C | รายการนัดหมาย (จำเป็น) |
| D | สถานที่ |

## ติดตั้งและใช้งาน

1. เปิด Google Sheet → Extensions → Apps Script
2. วางเนื้อหา `Code.gs` ใน Apps Script แล้วกด Save
3. ใน Apps Script ไปที่ Project Settings → Script properties แล้วเพิ่ม:
   - `LINE_TOKEN` = LINE Messaging API channel access token
   - `LINE_GROUP_ID` = Group ID ที่บอตมีสิทธิ์ส่งข้อความ
4. เพิ่ม LINE bot เข้า group และตรวจการตั้งค่า Messaging API
5. กลับไปชีตแล้ว reload หน้า
6. เลือกเซลล์ในแถวข้อมูล แล้วเปิดเมนู 📨 ตารางนัดหมาย LINE → ดูตัวอย่างแถวที่เลือก
7. เมื่อตรวจสอบแล้ว เลือก ส่งแถวที่เลือกเข้า LINE และอนุมัติสิทธิ์เมื่อระบบถาม

การส่งข้อความ push ไม่ต้อง deploy Apps Script เป็น Web App หากตั้งค่า Group ID ไว้แล้ว

## ความปลอดภัยและความเป็นส่วนตัว

เก็บ token ใน Script Properties เท่านั้น ห้ามใส่ใน source code, cell, issue หรือ commit สาธารณะ หาก token เผยแพร่ ให้ revoke และออก token ใหม่ ส่งเฉพาะข้อมูลที่ได้รับอนุญาตให้แชร์ในกลุ่ม และไม่ใช้กับข้อมูลบัตรประชาชนหรือเอกสารระบุตัวตน

## เอกสารอ้างอิง

- Google Apps Script Spreadsheet service: https://developers.google.com/apps-script/reference/spreadsheet?hl=th
- LINE Messaging API: https://developers.line.biz/en/docs/messaging-api/