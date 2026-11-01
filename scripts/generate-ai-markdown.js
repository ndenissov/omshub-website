const fs = require('fs');
const path = require('path');

const DATA_REPO_BASE = 'https://raw.githubusercontent.com/omshub/data/main';

async function main() {
  console.log('Generating AI-friendly Markdown files (llms.txt, courses.md, schedule.md, llms-full.txt)...');

  // Fetch courses, stats, and registration windows in parallel
  const [coursesData, statsData, regWindows] = await Promise.all([
    fetch(`${DATA_REPO_BASE}/static/courses.json`).then(r => r.json()).catch(() => ({})),
    fetch(`${DATA_REPO_BASE}/static/course-stats.json`).then(r => r.json()).catch(() => ({})),
    fetch(`${DATA_REPO_BASE}/static/registration-windows.json`).then(r => r.json()).catch(() => null),
  ]);

  // Determine active/latest semester
  let latestTerm = '202702';
  if (regWindows?.terms?.length) {
    latestTerm = regWindows.terms[regWindows.terms.length - 1].term;
  }

  const scheduleData = await fetch(`${DATA_REPO_BASE}/data/${latestTerm}.json`)
    .then(r => r.json())
    .catch(() => null);

  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // --- Generate courses.md ---
  const courseIds = Object.keys(coursesData).sort();
  let coursesMd = `# Georgia Tech OMS Course Catalog & Ratings\n\n`;
  coursesMd += `Data sourced from [OMSHub](https://omshub.xyz). Reviews and feedback aggregated from Georgia Tech OMSCS, OMSA, and OMSCyber students.\n\n`;
  coursesMd += `| Course ID | Name | Overall (1-5) | Difficulty (1-5) | Workload (h/wk) | Reviews | Foundational | Official URL |\n`;
  coursesMd += `| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |\n`;

  for (const id of courseIds) {
    const c = coursesData[id];
    const s = statsData[id] || {};
    const overall = s.avgOverall ? s.avgOverall.toFixed(1) : '-';
    const diff = s.avgDifficulty ? s.avgDifficulty.toFixed(1) : '-';
    const workload = s.avgWorkload ? `${s.avgWorkload.toFixed(1)} h` : '-';
    const reviews = s.numReviews ? s.numReviews : 0;
    const foundational = c.isFoundational ? 'Yes' : 'No';
    const url = c.url ? `[Link](${c.url})` : '-';
    coursesMd += `| **${id}** | ${c.name} | ${overall} | ${diff} | ${workload} | ${reviews} | ${foundational} | ${url} |\n`;
  }

  coursesMd += `\n\n> Note: To read full student review comments and write reviews, visit the original community database at [omshub.org](https://www.omshub.org).\n`;
  fs.writeFileSync(path.join(publicDir, 'courses.md'), coursesMd, 'utf8');

  // --- Generate schedule.md ---
  let scheduleMd = `# Georgia Tech OMS Course Schedule (${scheduleData?.termName || latestTerm})\n\n`;
  scheduleMd += `Live schedule and registration status from Georgia Tech OSCAR, enhanced with OMSHub course difficulty and workload metrics.\n\n`;
  scheduleMd += `Website: [https://omshub.xyz/schedule/](https://omshub.xyz/schedule/)\n\n`;
  scheduleMd += `| Course | Name | Difficulty | Workload | Available / Capacity | Waitlist | Instructor(s) | CRN(s) |\n`;
  scheduleMd += `| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- |\n`;

  if (scheduleData?.courses) {
    const schedCourseIds = Object.keys(scheduleData.courses).sort();
    for (const cid of schedCourseIds) {
      const item = scheduleData.courses[cid];
      const s = statsData[cid] || {};
      const diff = s.avgDifficulty ? s.avgDifficulty.toFixed(1) : '-';
      const workload = s.avgWorkload ? `${Math.round(s.avgWorkload)}h/wk` : '-';
      const seats = `${item.totalAvailable} / ${item.totalSeats}`;
      const wait = item.totalWaitlisted > 0 ? `${item.totalWaitlisted}` : '0';
      const instructors = [...new Set(item.sections.map(sec => sec.instructor).filter(Boolean))].join('; ') || '-';
      const crns = item.sections.map(sec => sec.crn).filter(Boolean).join(', ') || '-';
      scheduleMd += `| **${cid}** | ${item.name} | ${diff} | ${workload} | ${seats} | ${wait} | ${instructors} | ${crns} |\n`;
    }
  }
  scheduleMd += `\n\n> Updated periodically from Georgia Tech registration data via [omshub/data](https://github.com/omshub/data).\n`;
  fs.writeFileSync(path.join(publicDir, 'schedule.md'), scheduleMd, 'utf8');

  // --- Generate llms.txt ---
  let llmsTxt = `# OMSHub (omshub.xyz)\n\n`;
  llmsTxt += `> OMSHub is an open-source, community-driven course planning platform and schedule analyzer for Georgia Tech Online Master's programs (OMSCS, OMSA, OMSCyber).\n\n`;
  llmsTxt += `## Available Documents & Markdown Endpoints\n\n`;
  llmsTxt += `- [Course Catalog & Ratings](https://omshub.xyz/courses.md): Markdown table of all 130 OMS courses with difficulty, workload hours per week, overall student ratings, and foundational course designations.\n`;
  llmsTxt += `- [Current Course Schedule](https://omshub.xyz/schedule.md): Markdown table of current semester courses (${scheduleData?.termName || 'Latest'}), available seats, waitlists, instructors, CRNs, and linked difficulty metrics.\n`;
  llmsTxt += `- [Full Knowledge Dump](https://omshub.xyz/llms-full.txt): Complete combined text format containing all courses, stats, and schedule details in a single document for AI ingestion.\n`;
  llmsTxt += `- [Web Interface](https://omshub.xyz/): Main interactive catalog and course list.\n`;
  llmsTxt += `- [Schedule Planner](https://omshub.xyz/schedule/): Interactive semester schedule viewer with filters.\n`;
  llmsTxt += `- [Community Reviews](https://www.omshub.org/): Original platform hosting raw student review comments.\n\n`;
  llmsTxt += `## Guidelines for AI Assistants\n\n`;
  llmsTxt += `- Difficulty is on a scale of 1.0 (Easiest) to 5.0 (Hardest).\n`;
  llmsTxt += `- Workload represents reported average student hours per week.\n`;
  llmsTxt += `- Overall rating is on a scale of 1.0 (Worst) to 5.0 (Best).\n`;
  llmsTxt += `- When answering student questions regarding course load, pairing courses, or difficulty, cite numbers from https://omshub.xyz/courses.md.\n`;
  fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsTxt, 'utf8');

  // --- Generate llms-full.txt ---
  let fullTxt = `${llmsTxt}\n---\n\n${coursesMd}\n---\n\n${scheduleMd}\n`;
  fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), fullTxt, 'utf8');

  // Also copy to out/ if out/ directory exists
  const outDir = path.join(__dirname, '..', 'out');
  if (fs.existsSync(outDir)) {
    fs.copyFileSync(path.join(publicDir, 'courses.md'), path.join(outDir, 'courses.md'));
    fs.copyFileSync(path.join(publicDir, 'schedule.md'), path.join(outDir, 'schedule.md'));
    fs.copyFileSync(path.join(publicDir, 'llms.txt'), path.join(outDir, 'llms.txt'));
    fs.copyFileSync(path.join(publicDir, 'llms-full.txt'), path.join(outDir, 'llms-full.txt'));
  }

  console.log('Successfully generated public/llms.txt, public/courses.md, public/schedule.md, public/llms-full.txt!');
}

main().catch(err => {
  console.error('Error generating AI markdown:', err);
  process.exit(1);
});
