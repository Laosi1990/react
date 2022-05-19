export default function formatDate(date) {
  const d = date ? new Date(date) : Date.now();
  const year = d.getFullYear();// 年份
  const month = (d.getMonth() + 1).toString().padStart(2, '0') // 月份
  const day = d.getDate().toString().padStart(2, '0') // 日
  const hh = d.getHours().toString().padStart(2, '0') // 小时
  const mm = d.getMinutes().toString().padStart(2, '0') // 分钟
  const ss = d.getSeconds().toString().padStart(2, '0')// 秒
  return `${year}-${month}-${day} ${hh}: ${mm}: ${ss}`;
}