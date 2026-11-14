/**
 * Google Sheets → LINE Group: schedule helper
 * Reads only general schedule fields from the selected row.
 * Sheet columns: A=date, B=time, C=activity, D=location.
 * Configure LINE_TOKEN and LINE_GROUP_ID in Apps Script Script Properties.
 */
const SETTINGS = Object.freeze({
  FIRST_DATA_ROW: 2,
  DATE_COL: 1,
  TIME_COL: 2,
  ACTIVITY_COL: 3,
  LOCATION_COL: 4
});

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📨 ตารางนัดหมาย LINE')
    .addItem('ดูตัวอย่างแถวที่เลือก', 'previewSelectedSchedule')
    .addItem('ส่งแถวที่เลือกเข้า LINE', 'sendSelectedSchedule')
    .addToUi();
}

function getSelectedSchedule_() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getActiveRange();
  if (!range) throw new Error('กรุณาเลือกเซลล์ในแถวข้อมูลก่อน');

  const row = range.getRow();
  if (row < SETTINGS.FIRST_DATA_ROW) {
    throw new Error('กรุณาเลือกแถวข้อมูลตั้งแต่แถว 2 เป็นต้นไป');
  }

  const values = sheet.getRange(row, 1, 1, SETTINGS.LOCATION_COL).getDisplayValues()[0];
  const data = {
    date: String(values[SETTINGS.DATE_COL - 1] || '').trim(),
    time: String(values[SETTINGS.TIME_COL - 1] || '').trim(),
    activity: String(values[SETTINGS.ACTIVITY_COL - 1] || '').trim(),
    location: String(values[SETTINGS.LOCATION_COL - 1] || '').trim()
  };

  if (!data.activity) throw new Error('ไม่พบรายการนัดหมายในคอลัมน์ C');

  return data;
}

function formatSchedule_(d) {
  return [
    '📅 แจ้งเตือนตารางนัดหมาย',
    'วันที่: ' + (d.date || '-'),
    'เวลา: ' + (d.time || '-'),
    'รายการ: ' + d.activity,
    'สถานที่: ' + (d.location || '-')
  ].join('\n');
}

function previewSelectedSchedule() {
  try {
    SpreadsheetApp.getUi().alert(formatSchedule_(getSelectedSchedule_()));
  } catch (err) {
    SpreadsheetApp.getUi().alert('ตรวจสอบไม่สำเร็จ: ' + err.message);
  }
}

function sendSelectedSchedule() {
  const ui = SpreadsheetApp.getUi();
  try {
    const message = formatSchedule_(getSelectedSchedule_());
    const answer = ui.alert(
      'ยืนยันการส่ง',
      message + '\n\nส่งข้อความนี้เข้า LINE Group หรือไม่?',
      ui.ButtonSet.YES_NO
    );
    if (answer !== ui.Button.YES) return;

    const props = PropertiesService.getScriptProperties();
    const token = props.getProperty('LINE_TOKEN');
    const groupId = props.getProperty('LINE_GROUP_ID');

    if (!token || !groupId) {
      throw new Error('กรุณาตั้งค่า LINE_TOKEN และ LINE_GROUP_ID ใน Project Settings → Script properties');
    }

    const response = UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token
      },
      payload: JSON.stringify({
        to: groupId,
        messages: [{ type: 'text', text: message }]
      }),
      muteHttpExceptions: true
    });

    const code = response.getResponseCode();
    if (code < 200 || code >= 300) {
      throw new Error('LINE API ตอบกลับ ' + code + ': ' + response.getContentText());
    }

    ui.alert('ส่งตารางนัดหมายเข้า LINE สำเร็จ');
  } catch (err) {
    ui.alert('ส่งไม่สำเร็จ: ' + err.message);
  }
}