const readline = require('readline');

// 사용자로부터 입력을 받기 위한 readline 인터페이스 생성
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 시간표 객체
const timetable = {
  'M': Array(11).fill("    "),
  'T': Array(11).fill("    "),
  'W': Array(11).fill("    "),
  'H': Array(11).fill("    "),
  'F': Array(11).fill("    ")
};

const days = Object.keys(timetable);

const timetableCheck = {
  'M': Array(11).fill(false),
  'T': Array(11).fill(false),
  'W': Array(11).fill(false),
  'H': Array(11).fill(false),
  'F': Array(11).fill(false)
};

let redundantTimeTable = "";


// app 시작
function app() {
  rl.question('시간표를 입력하세요: ', processInput);
}

// 입력값 처리 함수
function processInput(input) {
  const scheduleList = input.replace(/[^A-Za-z\d가-힣 ]/g, '').split(' ');
  if (scheduleList) {
    for (let i = 0; i < scheduleList.length; i += 2) {
      const day = scheduleList[i][0];
      const startHour = parseInt(scheduleList[i].substring(1, 3));
      const endHour = parseInt(scheduleList[i].substring(3, 5));
      const schedule = scheduleList[i+1];
      addSchedule(day, startHour, endHour, schedule);
    }
  }
  printTimetable();
  console.log(redundantTimeTable);
}

// 시간표에 일정 추가하는 함수
function addSchedule(day, startHour, endHour, schedule) {
  if (endHour - startHour < 2 || endHour - startHour > 4 || endHour > 19) return;
  if (checkRedundancy(day, startHour, endHour)) {
    addRedundanctTimeTable(day, startHour, endHour, schedule);
    return;
  }
  const startIdx = startHour - 9
  let scheduleArray = makeScheduleArray(schedule, endHour - startHour);
  for (let i = startIdx; i < startIdx + scheduleArray.length; i++) {
    timetable[day][i] = scheduleArray[i - startIdx];
    timetableCheck[day][i] = true;
  }
}

// 일정 시간 중복 체크 함수
function checkRedundancy(day, startHour, endHour) {
  for (let i = startHour - 9; i < (endHour - 9); i++) {
    if (timetableCheck[day][i]) {
      return true;
    }
  }
  return false;
}

// 중복 시간표에 일정 추가하는 함수
function addRedundanctTimeTable(day, startHour, endHour, schedule) {
  for (let i = 0; i < (endHour - startHour); i++) {
    const hour = (i + startHour).toString().padStart(2, '0');
    redundantTimeTable += `| ${hour} |`;
    let scheduleArray = makeScheduleArray(schedule, endHour - startHour);
    for (let j = 0; j < days.length; j++) {
      if (day == days[j]) {
        const schedule = scheduleArray[i];
        redundantTimeTable += `${schedule}|`;
      }
      else {
        redundantTimeTable += '    |';
      }
    }
    redundantTimeTable += '\n';
  }
}

// 일정 문자열 생성 함수
function makeScheduleArray(schedule, hour) {
  let scheduleArray = [];
  if (/^[가-힣]+$/.test(schedule))
    scheduleArray = schedule.match(/[가-힣]{2}/g);
  else
    scheduleArray.push(schedule);
  for (let i = scheduleArray.length; i < hour - 1; i++) {
    scheduleArray.push("    ");
  }
  scheduleArray[hour - 1] = "----";
  return scheduleArray;
}


// 시간표 출력 함수
function printTimetable() {
  const hours = Array.from({ length: 11 }, (_, index) => (index + 9).toString().padStart(2, '0'));

  console.log('|시간| 월 | 화 | 수 | 목 | 금 |');
  console.log('-------------------------------');

  for (let i = 0; i < hours.length; i++) {
    const hour = hours[i];
    let row = `| ${hour} |`;

    for (let j = 0; j < days.length; j++) {
      const day = days[j];
      const schedule = timetable[day][i];

      row += `${schedule}|`;
    }

    console.log(row);
  }

  console.log('-------------------------------');
}
app();