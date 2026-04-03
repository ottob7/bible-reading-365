export const START_DATE = '2026-04-01'
export const END_DATE = '2027-03-31'

export function getTodayString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isSunday(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.getDay() === 0
}

export function getMonthName(monthIndex) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[monthIndex]
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export function formatDateShort(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatChapters(chapters) {
  if (!chapters || chapters.length === 0) return ''

  // Group consecutive chapters from the same book
  const groups = []
  let currentGroup = { book: chapters[0].book, start: chapters[0].chapter, end: chapters[0].chapter }

  for (let i = 1; i < chapters.length; i++) {
    const ch = chapters[i]
    if (ch.book === currentGroup.book && ch.chapter === currentGroup.end + 1) {
      currentGroup.end = ch.chapter
    } else {
      groups.push(currentGroup)
      currentGroup = { book: ch.book, start: ch.chapter, end: ch.chapter }
    }
  }
  groups.push(currentGroup)

  return groups.map(g => {
    if (g.start === g.end) return `${g.book} ${g.start}`
    return `${g.book} ${g.start}-${g.end}`
  }).join(', ')
}

export function formatChaptersShort(chapters) {
  if (!chapters || chapters.length === 0) return ''

  const groups = []
  let currentGroup = { book: chapters[0].book, start: chapters[0].chapter, end: chapters[0].chapter }

  for (let i = 1; i < chapters.length; i++) {
    const ch = chapters[i]
    if (ch.book === currentGroup.book && ch.chapter === currentGroup.end + 1) {
      currentGroup.end = ch.chapter
    } else {
      groups.push(currentGroup)
      currentGroup = { book: ch.book, start: ch.chapter, end: ch.chapter }
    }
  }
  groups.push(currentGroup)

  // Abbreviate book names
  const abbrev = {
    'Genesis': 'Gen', 'Exodus': 'Exo', 'Leviticus': 'Lev', 'Numbers': 'Num',
    'Deuteronomy': 'Deut', 'Joshua': 'Josh', 'Judges': 'Judg', 'Ruth': 'Ruth',
    '1 Samuel': '1 Sam', '2 Samuel': '2 Sam', '1 Kings': '1 Kgs', '2 Kings': '2 Kgs',
    '1 Chronicles': '1 Chr', '2 Chronicles': '2 Chr', 'Ezra': 'Ezra',
    'Nehemiah': 'Neh', 'Esther': 'Esth', 'Job': 'Job', 'Psalms': 'Ps',
    'Proverbs': 'Prov', 'Ecclesiastes': 'Eccl', 'Song of Solomon': 'Song',
    'Isaiah': 'Isa', 'Jeremiah': 'Jer', 'Lamentations': 'Lam', 'Ezekiel': 'Ezek',
    'Daniel': 'Dan', 'Hosea': 'Hos', 'Joel': 'Joel', 'Amos': 'Amos',
    'Obadiah': 'Obad', 'Jonah': 'Jonah', 'Micah': 'Mic', 'Nahum': 'Nah',
    'Habakkuk': 'Hab', 'Zephaniah': 'Zeph', 'Haggai': 'Hag', 'Zechariah': 'Zech',
    'Malachi': 'Mal', 'Matthew': 'Matt', 'Mark': 'Mark', 'Luke': 'Luke',
    'John': 'John', 'Acts': 'Acts', 'Romans': 'Rom', '1 Corinthians': '1 Cor',
    '2 Corinthians': '2 Cor', 'Galatians': 'Gal', 'Ephesians': 'Eph',
    'Philippians': 'Phil', 'Colossians': 'Col', '1 Thessalonians': '1 Thess',
    '2 Thessalonians': '2 Thess', '1 Timothy': '1 Tim', '2 Timothy': '2 Tim',
    'Titus': 'Titus', 'Philemon': 'Phlm', 'Hebrews': 'Heb', 'James': 'Jas',
    '1 Peter': '1 Pet', '2 Peter': '2 Pet', '1 John': '1 John', '2 John': '2 John',
    '3 John': '3 John', 'Jude': 'Jude', 'Revelation': 'Rev'
  }

  return groups.map(g => {
    const name = abbrev[g.book] || g.book
    if (g.start === g.end) return `${name} ${g.start}`
    return `${name} ${g.start}-${g.end}`
  }).join(', ')
}
