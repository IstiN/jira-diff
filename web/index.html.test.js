/**
 * Unit tests for web/index.html
 * Uses Node.js built-in assert and fs modules — no external dependencies required.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const HTML_PATH = path.join(__dirname, 'index.html');
const html = fs.readFileSync(HTML_PATH, 'utf8');

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`  ✓ ${name}`);
        passed++;
    } catch (err) {
        console.error(`  ✗ ${name}`);
        console.error(`    ${err.message}`);
        failed++;
    }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function contains(text) {
    return html.includes(text);
}

function count(pattern) {
    return (html.match(new RegExp(pattern, 'g')) || []).length;
}

// ---------------------------------------------------------------------------
// Document structure
// ---------------------------------------------------------------------------

console.log('\nDocument structure');

test('has DOCTYPE declaration', () => {
    assert.ok(html.trimStart().startsWith('<!DOCTYPE html>'), 'Missing DOCTYPE');
});

test('has <html lang="en"> attribute', () => {
    assert.ok(contains('<html lang="en">'), 'Missing lang="en"');
});

test('has UTF-8 charset meta tag', () => {
    assert.ok(contains('charset="UTF-8"'), 'Missing charset meta');
});

test('has viewport meta tag', () => {
    assert.ok(contains('name="viewport"'), 'Missing viewport meta');
});

test('has meta description', () => {
    assert.ok(contains('name="description"'), 'Missing meta description');
});

test('has <title> tag', () => {
    assert.ok(/<title>[^<]+<\/title>/.test(html), 'Missing title tag');
});

test('title contains "Jira Diff"', () => {
    const match = html.match(/<title>([^<]+)<\/title>/);
    assert.ok(match && match[1].includes('Jira Diff'), 'Title does not contain "Jira Diff"');
});

test('has closing </html> tag', () => {
    assert.ok(contains('</html>'), 'Missing closing </html>');
});

// ---------------------------------------------------------------------------
// Hero / heading section
// ---------------------------------------------------------------------------

console.log('\nHero section');

test('h1 heading contains "Jira Diff"', () => {
    assert.ok(/<h1[^>]*>[\s\S]*?Jira Diff[\s\S]*?<\/h1>/.test(html), 'h1 does not contain "Jira Diff"');
});

test('tagline mentions Safari and Chrome', () => {
    assert.ok(contains('Safari') && contains('Chrome'), 'Tagline missing browser names');
});

test('tagline mentions diffs on Jira fields', () => {
    assert.ok(contains('diff') || contains('Diff'), 'Tagline missing diff mention');
});

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

console.log('\nBadges');

test('has Safari Extension badge', () => {
    assert.ok(contains('Safari Extension'), 'Missing Safari Extension badge');
});

test('has Chrome Extension badge', () => {
    assert.ok(contains('Chrome Extension'), 'Missing Chrome Extension badge');
});

test('has GitHub Actions badge', () => {
    assert.ok(contains('GitHub Actions'), 'Missing GitHub Actions badge');
});

test('has AI Automation badge', () => {
    assert.ok(contains('AI Automation'), 'Missing AI Automation badge');
});

// ---------------------------------------------------------------------------
// CTA buttons
// ---------------------------------------------------------------------------

console.log('\nCTA buttons');

test('primary GitHub link is present', () => {
    assert.ok(contains('View on GitHub'), 'Missing "View on GitHub" link text');
});

test('GitHub link opens in new tab (target="_blank")', () => {
    const match = html.match(/<a[^>]+View on GitHub[\s\S]*?>/s) ||
                  html.match(/href="[^"]*github\.com[^"]*"[^>]*target="_blank"/);
    // Check that there is at least one anchor with target="_blank" and github.com
    assert.ok(
        /href="[^"]*github\.com[^"]*"[^>]*target="_blank"/.test(html) ||
        /target="_blank"[^>]*href="[^"]*github\.com[^"]*"/.test(html),
        'GitHub link missing target="_blank"'
    );
});

test('GitHub link has rel="noopener noreferrer"', () => {
    assert.ok(contains('rel="noopener noreferrer"'), 'Missing rel="noopener noreferrer" on external link');
});

test('"Report an Issue" button is present', () => {
    assert.ok(contains('Report an Issue'), 'Missing "Report an Issue" button');
});

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

console.log('\nContent sections');

test('has "Browser Extensions" section', () => {
    assert.ok(contains('Browser Extensions'), 'Missing "Browser Extensions" section');
});

test('has "Key Features" section', () => {
    assert.ok(contains('Key Features'), 'Missing "Key Features" section');
});

test('has "AI Automation Workflow" section', () => {
    assert.ok(contains('AI Automation Workflow'), 'Missing "AI Automation Workflow" section');
});

test('has "Tech Stack" section', () => {
    assert.ok(contains('Tech Stack'), 'Missing "Tech Stack" section');
});

// ---------------------------------------------------------------------------
// Extension platform cards
// ---------------------------------------------------------------------------

console.log('\nPlatform cards');

test('has Safari platform card with description', () => {
    assert.ok(
        /<div[^>]*class="platform-card"[\s\S]*?Safari[\s\S]*?<\/div>/s.test(html),
        'Missing Safari platform card'
    );
});

test('has Chrome platform card with description', () => {
    assert.ok(
        /<div[^>]*class="platform-card"[\s\S]*?Chrome[\s\S]*?<\/div>/s.test(html),
        'Missing Chrome platform card'
    );
});

// ---------------------------------------------------------------------------
// Feature cards
// ---------------------------------------------------------------------------

console.log('\nFeature cards');

test('has "Inline Field Diffs" feature card', () => {
    assert.ok(contains('Inline Field Diffs'), 'Missing "Inline Field Diffs" feature card');
});

test('has "AI Ticket Automation" feature card', () => {
    assert.ok(contains('AI Ticket Automation'), 'Missing "AI Ticket Automation" feature card');
});

test('has "GitHub Actions CI/CD" feature card', () => {
    assert.ok(contains('GitHub Actions CI/CD'), 'Missing "GitHub Actions CI/CD" feature card');
});

test('has "WIP Label Protection" feature card', () => {
    assert.ok(contains('WIP Label Protection'), 'Missing "WIP Label Protection" feature card');
});

// ---------------------------------------------------------------------------
// Workflow steps
// ---------------------------------------------------------------------------

console.log('\nWorkflow steps');

test('has "Ticket Selection" step', () => {
    assert.ok(contains('Ticket Selection'), 'Missing "Ticket Selection" workflow step');
});

test('has "Pre-Action Check" step', () => {
    assert.ok(contains('Pre-Action Check'), 'Missing "Pre-Action Check" workflow step');
});

test('has "AI Processing" step', () => {
    assert.ok(contains('AI Processing'), 'Missing "AI Processing" workflow step');
});

test('has "Post-Action" step', () => {
    assert.ok(contains('Post-Action'), 'Missing "Post-Action" workflow step');
});

test('workflow list has exactly 4 steps', () => {
    const steps = (html.match(/<li>/g) || []).length;
    assert.strictEqual(steps, 4, `Expected 4 workflow steps, got ${steps}`);
});

// ---------------------------------------------------------------------------
// Tech stack tags
// ---------------------------------------------------------------------------

console.log('\nTech stack');

const expectedTechTags = [
    'JavaScript (GraalJS)',
    'GitHub Actions',
    'DMTools CLI',
    'Cursor Agent',
    'Jira REST API',
    'Confluence API',
    'Figma API',
    'Gemini LLM',
    'Safari WebExtension',
    'Chrome Extension',
];

expectedTechTags.forEach(tag => {
    test(`tech stack includes "${tag}"`, () => {
        assert.ok(contains(tag), `Missing tech tag: ${tag}`);
    });
});

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

console.log('\nFooter');

test('has footer element', () => {
    assert.ok(contains('<footer>'), 'Missing <footer> element');
});

test('footer mentions MIT License', () => {
    assert.ok(contains('MIT License'), 'Footer missing MIT License link');
});

test('footer mentions GitHub Actions deployment', () => {
    assert.ok(contains('GitHub Actions'), 'Footer missing GitHub Actions mention');
});

// ---------------------------------------------------------------------------
// Accessibility & best practices
// ---------------------------------------------------------------------------

console.log('\nAccessibility & best practices');

test('all external links have rel="noopener noreferrer"', () => {
    const targetBlankLinks = (html.match(/target="_blank"/g) || []).length;
    const safeLinks = (html.match(/rel="noopener noreferrer"/g) || []).length;
    assert.ok(safeLinks >= targetBlankLinks, `Found ${targetBlankLinks} target="_blank" links but only ${safeLinks} with rel="noopener noreferrer"`);
});

test('has responsive viewport meta', () => {
    assert.ok(contains('width=device-width'), 'Missing width=device-width in viewport');
});

test('h1 appears exactly once', () => {
    const h1count = count('<h1');
    assert.strictEqual(h1count, 1, `Expected 1 h1, found ${h1count}`);
});

test('has mobile media query', () => {
    assert.ok(contains('@media'), 'Missing responsive @media query');
});

test('does not use deprecated <font> tag', () => {
    assert.ok(!contains('<font'), 'Found deprecated <font> tag');
});

test('does not use inline event handlers (onclick, onload etc.)', () => {
    assert.ok(!/ on\w+="/.test(html), 'Found inline event handler attribute');
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${'─'.repeat(40)}`);
console.log(`Tests: ${passed + failed}  Passed: ${passed}  Failed: ${failed}`);
console.log('─'.repeat(40));

if (failed > 0) {
    process.exit(1);
}
