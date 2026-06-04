"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfService = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const env_1 = require("../config/env");
exports.pdfService = {
    generate: async (paper) => {
        const assignment = paper.assignmentId;
        const metadata = paper.metadata;
        let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Question Paper</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          width: 794px;
          color: #000;
        }
        .header { text-align: center; font-weight: bold; font-size: 16pt; margin-bottom: 10px; }
        .sub-header { text-align: center; font-size: 12pt; margin-bottom: 10px; }
        .meta-row { display: flex; justify-content: space-between; font-size: 12pt; margin-bottom: 10px; }
        .student-info { display: flex; justify-content: space-between; font-size: 12pt; margin-bottom: 15px; }
        .instructions { font-style: italic; font-size: 10pt; margin-bottom: 20px; }
        hr { border: 1px solid #000; margin-bottom: 15px; }
        .section-title { font-weight: bold; text-decoration: underline; font-size: 13pt; margin-top: 20px; margin-bottom: 5px; }
        .section-instructions { font-style: italic; font-size: 11pt; margin-bottom: 15px; }
        .question-container { margin-bottom: 15px; page-break-inside: avoid; }
        .question-header { display: flex; justify-content: space-between; align-items: baseline; }
        .question-text { font-size: 12pt; flex: 1; margin-right: 15px; }
        .marks { font-weight: bold; font-size: 11pt; white-space: nowrap; }
        .options-list { list-style-type: lower-alpha; margin-top: 5px; margin-bottom: 5px; padding-left: 20px; }
        .dotted-lines { border-bottom: 1px dotted #999; margin-top: 25px; width: 100%; height: 1px; }
        .badge { font-size: 8pt; color: #666; background: #eee; padding: 2px 6px; border-radius: 4px; margin-left: 5px; }
      </style>
    </head>
    <body>
      <div class="header">${metadata.school || 'School Name'}</div>
      <div class="sub-header">Subject: ${assignment.subject} | Grade: ${assignment.grade} | Class: ${metadata.grade || '___'}</div>
      <div class="meta-row">
        <span>Time: ${metadata.duration || '2 Hours'}</span>
        <span>Maximum Marks: ${assignment.totalMarks}</span>
      </div>
      <hr />
      <div class="student-info">
        <span>Name: ________________________</span>
        <span>Roll No: ___________</span>
        <span>Section: ___________</span>
      </div>
      <div class="instructions">
        <b>General Instructions:</b><br/>
        <ol>
          <li>Read all questions carefully before answering.</li>
          <li>Write neatly and legibly.</li>
        </ol>
      </div>
    `;
        let globalQuestionNum = 1;
        paper.sections.forEach((section) => {
            html += `<div class="section-title">${section.title}</div>`;
            if (section.instructions) {
                html += `<div class="section-instructions">${section.instructions}</div>`;
            }
            section.questions.forEach((q) => {
                let difficultyTag = q.difficulty === 'easy' ? 'Easy' : q.difficulty === 'medium' ? 'Moderate' : 'Hard';
                html += `<div class="question-container">`;
                html += `<div class="question-header">`;
                html += `<div class="question-text"><b>Q${globalQuestionNum}.</b> ${q.text} <span class="badge">[${difficultyTag}]</span></div>`;
                html += `<div class="marks">[${q.marks}]</div>`;
                html += `</div>`;
                if (q.type === 'MCQ' && q.options && q.options.length > 0) {
                    html += `<ol class="options-list">`;
                    q.options.forEach((opt) => {
                        html += `<li>${opt}</li>`;
                    });
                    html += `</ol>`;
                }
                else if (q.type === 'ShortAnswer') {
                    html += `<div class="dotted-lines"></div>`.repeat(3);
                }
                else if (q.type === 'LongAnswer') {
                    html += `<div class="dotted-lines"></div>`.repeat(8);
                }
                else if (q.type === 'FillBlank') {
                    html += `<div class="dotted-lines"></div>`;
                }
                html += `</div>`;
                globalQuestionNum++;
            });
        });
        html += `<div style="text-align: center; font-style: italic; margin-top: 40px;">— End of Question Paper —</div>`;
        html += `</body></html>`;
        // Ensure output dir exists
        const outputDir = path.resolve(env_1.env.PDF_OUTPUT_DIR);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        const fileName = `${paper._id}.pdf`;
        const outputPath = path.join(outputDir, fileName);
        const browser = await puppeteer_1.default.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 794, height: 1122 });
        await page.setContent(html, { waitUntil: 'load' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
            displayHeaderFooter: true,
            headerTemplate: '<span></span>',
            footerTemplate: `
        <div style="width: 100%; font-size: 10px; text-align: center; color: #000; padding-top: 5px;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `
        });
        await fs.promises.writeFile(outputPath, pdfBuffer);
        await browser.close();
        return outputPath;
    }
};
