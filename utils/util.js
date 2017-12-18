const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const toDate = number =>{
  var n = number * 1000;
  var date = new Date(n);
  var Y = date.getFullYear() + '/';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return (Y + M + D)
}  

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const getTwoLength = data =>{
  data = Math.floor(data);
  if (data < 10) {
    return "0" + data;
  } else {
    return "" + data;
  }
}
const formatDuring = mss =>{
  var hour = 0;
  var minute = 0;
  var second = 0;

  second = mss / 1000;

  if (second > 60) {
    minute = second / 60;
    second = second % 60;
  }
  if (minute > 60) {
    hour = minute / 60;
    minute = minute % 60;
  }
  return (getTwoLength(hour) + ":" + getTwoLength(minute) + ":" + getTwoLength(second));
}
const timeRange = (beginTime,endTime)=>{
  var beginSeconds = new Date(beginTime).getTime();
  var endSeconds = new Date(endTime).getTime();
  return endSeconds - beginSeconds;

}
const timeFormat = (mss)=>{
  var days = parseInt(mss / (1000 * 60 * 60 * 24));
  var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = parseInt((mss % (1000 * 60)) / 1000);
  return days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 ";
}
const sec_to_time = (s) =>{
  var t;
  if (s > -1) {
    var hour = Math.floor(s / 3600);
    var min = Math.floor(s / 60) % 60;
    var sec = s % 60;
    if (hour < 10) {
      t = '0' + hour + ":";
    } else {
      t = hour + ":";
    }

    if (min < 10) { t += "0"; }
    t += min + ":";
    if (sec < 10) { t += "0"; }
    t += sec.toFixed(2);
  }
  return t;
}

const getDistance = (lat1, lng1, lat2, lng2) => {
  var dis = 0
  var radLat1 = toRadians(lat1)
  var radLat2 = toRadians(lat2)
  var deltaLat = radLat1 - radLat2
  var deltaLng = toRadians(lng1) - toRadians(lng2)
  var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)))
  dis = dis * 6378137
  return Math.round(dis * 10000) / 10000.0
}

const toRadians = (d) => {
  return d * Math.PI / 180.0
}

module.exports = {
  formatTime: formatTime,
  toDate:toDate,
  timeRange:timeRange,
  formatDuring:formatDuring,
  timeFormat: timeFormat,
  sec_to_time: sec_to_time,
  getDistance: getDistance,
}
