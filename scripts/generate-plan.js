import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const books = JSON.parse(readFileSync(join(__dirname, '../src/data/bible-books.json'), 'utf-8'));

// Verify total chapters
const totalChapters = books.reduce((sum, b) => sum + b.chapters, 0);
console.log(`Total chapters: ${totalChapters}`);

// Generate all reading dates (Mon-Sat, skipping Sundays)
// April 1, 2026 through March 31, 2027
const startDate = new Date(2026, 3, 1); // April 1, 2026
const endDate = new Date(2027, 2, 31);  // March 31, 2027

const readingDates = [];
const current = new Date(startDate);
while (current <= endDate) {
  if (current.getDay() !== 0) { // Skip Sundays (0)
    readingDates.push(new Date(current));
  }
  current.setDate(current.getDate() + 1);
}

console.log(`Reading days: ${readingDates.length}`);
console.log(`Sundays skipped: ${365 - readingDates.length}`);

// Distribute chapters across reading days
// 1189 / 313 = 3.80 => 250 days get 4, 63 days get 3
const basePerDay = Math.floor(totalChapters / readingDates.length); // 3
const extraChapters = totalChapters - (basePerDay * readingDates.length); // 1189 - 939 = 250
// So 250 days get 4 chapters (basePerDay + 1), 63 days get 3 chapters (basePerDay)

// Build flat list of all chapters
const allChapters = [];
for (const book of books) {
  for (let ch = 1; ch <= book.chapters; ch++) {
    allChapters.push({ book: book.name, chapter: ch });
  }
}

console.log(`Total chapters in list: ${allChapters.length}`);

// Assign chapters to days
const plan = [];
let chapterIndex = 0;

for (let i = 0; i < readingDates.length; i++) {
  // First 250 days get 4 chapters, remaining 63 get 3
  const chaptersToday = i < extraChapters ? basePerDay + 1 : basePerDay;
  const date = readingDates[i];
  const dateStr = date.toISOString().split('T')[0];
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const chapters = [];
  for (let j = 0; j < chaptersToday && chapterIndex < allChapters.length; j++) {
    chapters.push(allChapters[chapterIndex]);
    chapterIndex++;
  }

  plan.push({
    day: i + 1,
    date: dateStr,
    weekday: weekdays[date.getDay()],
    chapters
  });
}

// Verify
const assignedChapters = plan.reduce((sum, d) => sum + d.chapters.length, 0);
console.log(`Assigned chapters: ${assignedChapters}`);
console.log(`Days in plan: ${plan.length}`);
console.log(`First day: ${plan[0].date} (${plan[0].weekday}) - ${plan[0].chapters.map(c => `${c.book} ${c.chapter}`).join(', ')}`);
console.log(`Last day: ${plan[plan.length - 1].date} (${plan[plan.length - 1].weekday}) - ${plan[plan.length - 1].chapters.map(c => `${c.book} ${c.chapter}`).join(', ')}`);

if (assignedChapters !== totalChapters) {
  console.error(`ERROR: Assigned ${assignedChapters} but expected ${totalChapters}`);
  process.exit(1);
}

writeFileSync(
  join(__dirname, '../src/data/reading-plan.json'),
  JSON.stringify(plan, null, 2)
);

console.log('\nReading plan generated successfully!');
