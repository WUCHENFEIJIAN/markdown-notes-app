import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/** 格式化为 yyyy-MM-dd HH:mm。 */
export function formatTime(ts: number): string {
  return format(ts, 'yyyy-MM-dd HH:mm');
}

/** 相对时间，如“3 分钟前”。 */
export function formatRelative(ts: number): string {
  return formatDistanceToNow(ts, { addSuffix: true, locale: zhCN });
}

/**
 * 从 Markdown 原文中提取纯文本摘要：
 * 去除代码块、Markdown 符号，压缩空白后截断。
 */
export function getSummary(content: string, maxLen = 60): string {
  const text = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/[#>*_~\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return '无内容';
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
}
