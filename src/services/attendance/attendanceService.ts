export interface AttendanceRecord {
  id: string;
  userId?: string;
  studentName: string;
  email?: string;
  date: string; // YYYY-MM-DD e.g. "2026-07-27"
  dayName: string; // e.g. "الإثنين"
  loginTime: string; // e.g. "09:30:15 ص"
  logoutTime?: string; // e.g. "10:15:00 ص" or "نشط الآن"
  durationSeconds: number;
  durationFormatted: string; // e.g. "45 دقيقة"
  timestamp: number; // Unix timestamp ms for sorting
  year: number; // e.g. 2026
  month: number; // 1-12
  monthName: string; // e.g. "يوليو"
  deviceInfo: string; // e.g. "Google Chrome / Desktop"
  status: 'نشط الآن' | 'مكتملة' | 'مكتملة جزئياً';
  gradeName?: string;
}

const STORAGE_KEY = '4u_student_attendance_logs_v1';
const ACTIVE_SESSION_KEY = '4u_current_active_session_id';

export const ARABIC_MONTHS = [
  { value: 1, name: 'يناير' },
  { value: 2, name: 'فبراير' },
  { value: 3, name: 'مارس' },
  { value: 4, name: 'أبريل' },
  { value: 5, name: 'مايو' },
  { value: 6, name: 'يونيو' },
  { value: 7, name: 'يوليو' },
  { value: 8, name: 'أغسطس' },
  { value: 9, name: 'سبتمبر' },
  { value: 10, name: 'أكتوبر' },
  { value: 11, name: 'نوفمبر' },
  { value: 12, name: 'ديسمبر' }
];

export const ARABIC_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export function formatSecondsToArabic(totalSeconds: number): string {
  if (totalSeconds < 60) {
    return `${Math.max(1, totalSeconds)} ثانية`;
  }
  const mins = Math.floor(totalSeconds / 60);
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;

  if (hours === 0) {
    return `${mins} دقيقة`;
  } else if (hours === 1) {
    return remMins > 0 ? `ساعة و ${remMins} دقيقة` : `ساعة واحدة`;
  } else if (hours === 2) {
    return remMins > 0 ? `ساعتان و ${remMins} دقيقة` : `ساعتان`;
  } else if (hours <= 10) {
    return remMins > 0 ? `${hours} ساعات و ${remMins} دقيقة` : `${hours} ساعات`;
  } else {
    return remMins > 0 ? `${hours} ساعة و ${remMins} دقيقة` : `${hours} ساعة`;
  }
}

export function getRealDeviceInfo(): string {
  if (typeof navigator === 'undefined') return 'متصفح الإنترنت';
  const ua = navigator.userAgent;
  let browser = 'متصفح الإنترنت';
  if (ua.includes('Edg/')) browser = 'Microsoft Edge';
  else if (ua.includes('Chrome/')) browser = 'Google Chrome';
  else if (ua.includes('Firefox/')) browser = 'Mozilla Firefox';
  else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Apple Safari';
  else if (ua.includes('Opera') || ua.includes('OPR/')) browser = 'Opera';

  let os = 'جهاز المستخدم';
  if (ua.includes('Windows NT 10.0')) os = 'Windows 10/11';
  else if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone')) os = 'iPhone (iOS)';
  else if (ua.includes('iPad')) os = 'iPad (iPadOS)';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  return `${browser} • ${os} (${isMobile ? 'هاتف محمول' : 'كمبيوتر'})`;
}

export const attendanceService = {
  /**
   * Retrieves all attendance logs sorted descending (newest first).
   * Strips out any legacy mock logs if present.
   */
  getLogs(studentName = 'طالب المنصة', email = 'student@gmail.com'): AttendanceRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }
      const parsed: AttendanceRecord[] = JSON.parse(stored);
      // Remove any legacy mock/fake records generated with att_init_
      const realOnly = parsed.filter(r => r && r.id && !r.id.startsWith('att_init_'));
      if (realOnly.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(realOnly));
      }
      // Ensure records are always sorted descending by timestamp
      return realOnly.sort((a, b) => b.timestamp - a.timestamp);
    } catch (e) {
      console.error('Error loading attendance records:', e);
      return [];
    }
  },

  /**
   * Gets logs specifically for a given student email/name.
   * Returns purely real records (never generates fake data).
   */
  getStudentLogs(studentName = 'طالب المنصة', email = 'student@gmail.com'): AttendanceRecord[] {
    try {
      const allLogs = this.getLogs(studentName, email);
      if (!email && !studentName) return allLogs;

      const filtered = allLogs.filter(r => {
        const matchEmail = email && r.email && r.email.toLowerCase().trim() === email.toLowerCase().trim();
        const matchName = studentName && r.studentName && r.studentName.toLowerCase().trim() === studentName.toLowerCase().trim();
        return matchEmail || matchName;
      });

      return filtered.sort((a, b) => b.timestamp - a.timestamp);
    } catch (e) {
      console.error('Error loading student attendance records:', e);
      return [];
    }
  },

  /**
   * Saves attendance records to LocalStorage & dispatches update event.
   */
  saveLogs(logs: AttendanceRecord[]): void {
    try {
      // Sort descending by timestamp before saving so latest is top
      logs.sort((a, b) => b.timestamp - a.timestamp);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      window.dispatchEvent(new Event('student_attendance_updated'));
    } catch (e) {
      console.error('Failed to save attendance records:', e);
    }
  },

  /**
   * Initializes or gets the active session for the logged in student.
   * NEVER deletes or overrides previous records!
   */
  startOrResumeSession(studentName = 'طالب المنصة', email = 'student@gmail.com', gradeName = 'تاسع عام'): AttendanceRecord {
    let logs = this.getLogs(studentName, email);
    const existingSessionId = sessionStorage.getItem(ACTIVE_SESSION_KEY) || localStorage.getItem(ACTIVE_SESSION_KEY);

    if (existingSessionId) {
      const existingRecord = logs.find(r => r.id === existingSessionId);
      if (existingRecord) {
        return existingRecord;
      }
    }

    // Otherwise create a NEW session record at the TOP of the log!
    const now = new Date();
    const dayName = ARABIC_DAYS[now.getDay()];
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const monthName = ARABIC_MONTHS[month - 1]?.name || 'شهر';
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const loginHours = now.getHours();
    const loginMins = now.getMinutes();
    const ampm = loginHours >= 12 ? 'م' : 'ص';
    const displayHours = loginHours % 12 || 12;
    const loginTimeStr = `${String(displayHours).padStart(2, '0')}:${String(loginMins).padStart(2, '0')} ${ampm}`;

    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId: email ? `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}` : 'user_guest',
      studentName: studentName || 'طالب المنصة',
      email: email || 'student@gmail.com',
      date: formattedDate,
      dayName,
      loginTime: loginTimeStr,
      logoutTime: 'نشط الآن',
      durationSeconds: 60, // Starts at 1 minute
      durationFormatted: formatSecondsToArabic(60),
      timestamp: now.getTime(),
      year,
      month,
      monthName,
      deviceInfo: getRealDeviceInfo(),
      status: 'نشط الآن',
      gradeName: gradeName || 'تاسع عام'
    };

    // Unshift to TOP (most recent first)
    logs.unshift(newRecord);
    this.saveLogs(logs);

    sessionStorage.setItem(ACTIVE_SESSION_KEY, newRecord.id);
    localStorage.setItem(ACTIVE_SESSION_KEY, newRecord.id);

    return newRecord;
  },

  /**
   * Increment duration for active session
   */
  updateSessionDuration(sessionId: string, addedSeconds: number): void {
    const logs = this.getLogs();
    const recordIndex = logs.findIndex(r => r.id === sessionId);
    if (recordIndex !== -1) {
      const record = logs[recordIndex];
      const newDuration = record.durationSeconds + addedSeconds;
      
      const now = new Date();
      const logoutHours = now.getHours();
      const logoutMins = now.getMinutes();
      const logoutAmpm = logoutHours >= 12 ? 'م' : 'ص';
      const displayLogoutHours = logoutHours % 12 || 12;
      const logoutTimeStr = `${String(displayLogoutHours).padStart(2, '0')}:${String(logoutMins).padStart(2, '0')} ${logoutAmpm}`;

      logs[recordIndex] = {
        ...record,
        durationSeconds: newDuration,
        durationFormatted: formatSecondsToArabic(newDuration),
        logoutTime: logoutTimeStr
      };
      this.saveLogs(logs);
    }
  },

  /**
   * Add a custom/manual attendance record
   */
  addManualRecord(item: {
    studentName: string;
    date: string; // YYYY-MM-DD
    loginTime: string;
    logoutTime: string;
    durationMinutes: number;
    deviceInfo?: string;
    gradeName?: string;
  }): AttendanceRecord {
    const logs = this.getLogs(item.studentName);

    const dateObj = new Date(item.date);
    const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;
    
    const dayName = ARABIC_DAYS[validDate.getDay()];
    const year = validDate.getFullYear();
    const month = validDate.getMonth() + 1;
    const monthName = ARABIC_MONTHS[month - 1]?.name || 'شهر';
    const durationSec = (item.durationMinutes || 30) * 60;

    const newRecord: AttendanceRecord = {
      id: `att_manual_${Date.now()}`,
      userId: 'user_manual',
      studentName: item.studentName || 'طالب المنصة',
      date: item.date,
      dayName,
      loginTime: item.loginTime || '08:00 ص',
      logoutTime: item.logoutTime || '09:00 ص',
      durationSeconds: durationSec,
      durationFormatted: formatSecondsToArabic(durationSec),
      timestamp: validDate.getTime(),
      year,
      month,
      monthName,
      deviceInfo: item.deviceInfo || 'تسجيل يدوي من اللوحة',
      status: 'مكتملة',
      gradeName: item.gradeName || 'تاسع عام'
    };

    logs.unshift(newRecord); // Place at TOP
    this.saveLogs(logs);
    return newRecord;
  },

  /**
   * Filters attendance records by Month, Year, and Search text.
   * ALWAYS preserves descending order (newest first).
   */
  filterLogs(
    logs: AttendanceRecord[],
    monthFilter: number | 'ALL',
    yearFilter: number | 'ALL',
    searchQuery = '',
    sortOrder: 'desc' | 'asc' = 'desc'
  ): AttendanceRecord[] {
    return logs.filter(record => {
      // Month check
      if (monthFilter !== 'ALL' && record.month !== monthFilter) {
        return false;
      }
      // Year check
      if (yearFilter !== 'ALL' && record.year !== yearFilter) {
        return false;
      }
      // Search check
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesDate = record.date.includes(query);
        const matchesDay = record.dayName.includes(query);
        const matchesTime = record.loginTime.toLowerCase().includes(query) || (record.logoutTime && record.logoutTime.toLowerCase().includes(query));
        const matchesDevice = record.deviceInfo.toLowerCase().includes(query);
        const matchesStatus = record.status.includes(query);
        const matchesMonthName = record.monthName.includes(query);
        const matchesStudentName = record.studentName.toLowerCase().includes(query);
        return matchesDate || matchesDay || matchesTime || matchesDevice || matchesStatus || matchesMonthName || matchesStudentName;
      }
      return true;
    }).sort((a, b) => sortOrder === 'asc' ? a.timestamp - b.timestamp : b.timestamp - a.timestamp);
  },

  /**
   * Export records to a Excel-compatible CSV file download with Arabic UTF-8 BOM
   */
  exportToCSV(logs: AttendanceRecord[], filename = 'سجل_حضور_الطالب_المنصة.csv'): void {
    if (!logs || logs.length === 0) return;

    const headers = [
      'المعرّف',
      'اسم الطالب',
      'اليوم',
      'التاريخ',
      'تاريخ تسجيل الدخول',
      'وقت تسجيل الخروج / آخر نشاط',
      'مدة البقاء في المنصة',
      'مدة البقاء (بالثواني)',
      'السنة',
      'الشهر',
      'حالة الجلسة',
      'الجهاز / المتصفح'
    ];

    const rows = logs.map((log, index) => [
      `#${index + 1}`,
      `"${log.studentName.replace(/"/g, '""')}"`,
      `"${log.dayName}"`,
      `"${log.date}"`,
      `"${log.loginTime}"`,
      `"${log.logoutTime || 'نشط الآن'}"`,
      `"${log.durationFormatted}"`,
      log.durationSeconds,
      log.year,
      `"${log.monthName} (${log.month})"`,
      `"${log.status}"`,
      `"${log.deviceInfo.replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
