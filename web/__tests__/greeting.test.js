const fs = require('fs');
const path = require('path');

describe('greeting module', () => {
    const greeting = require('../js/greeting.js');

    describe('getGreeting', () => {
        it('returns "Hello"', () => {
            expect(greeting.getGreeting()).toBe('Hello');
        });
    });

    describe('getPageTitle', () => {
        it('returns "Hello Jira Diff"', () => {
            expect(greeting.getPageTitle()).toBe('Hello Jira Diff');
        });

        it('includes greeting from getGreeting', () => {
            const title = greeting.getPageTitle();
            const hello = greeting.getGreeting();
            expect(title).toContain(hello);
            expect(title).toBe(hello + ' Jira Diff');
        });
    });

    describe('attachToGlobal', () => {
        it('attaches getGreeting and getPageTitle to given object', () => {
            const globalObj = {};
            greeting.attachToGlobal(globalObj);
            expect(globalObj.getGreeting()).toBe('Hello');
            expect(globalObj.getPageTitle()).toBe('Hello Jira Diff');
        });

        it('exposes same functions as module exports', () => {
            const globalObj = {};
            greeting.attachToGlobal(globalObj);
            expect(globalObj.getGreeting).toBe(greeting.getGreeting);
            expect(globalObj.getPageTitle).toBe(greeting.getPageTitle);
        });
    });
});

describe('index.html integration', () => {
    it('contains greeting script reference', () => {
        const htmlPath = path.join(__dirname, '../index.html');
        const html = fs.readFileSync(htmlPath, 'utf-8');
        expect(html).toContain('js/greeting-browser.js');
    });

    it('contains getPageTitle call', () => {
        const htmlPath = path.join(__dirname, '../index.html');
        const html = fs.readFileSync(htmlPath, 'utf-8');
        expect(html).toContain('getPageTitle()');
    });

    it('contains greeting-title element for dynamic content', () => {
        const htmlPath = path.join(__dirname, '../index.html');
        const html = fs.readFileSync(htmlPath, 'utf-8');
        expect(html).toContain('greeting-title');
    });
});

describe('greeting-browser.js', () => {
    it('contains greeting values from greeting module', () => {
        const greeting = require('../js/greeting.js');
        const browserPath = path.join(__dirname, '../js/greeting-browser.js');
        const browserContent = fs.readFileSync(browserPath, 'utf-8');
        expect(browserContent).toContain(JSON.stringify(greeting.getGreeting()));
        expect(browserContent).toContain(JSON.stringify(greeting.getPageTitle()));
    });
});

describe('build-greeting-browser.js', () => {
    it('generates greeting-browser.js with correct content', () => {
        const greeting = require('../js/greeting.js');
        require('../scripts/build-greeting-browser.js');
        const browserPath = path.join(__dirname, '../js/greeting-browser.js');
        const browserContent = fs.readFileSync(browserPath, 'utf-8');
        expect(browserContent).toContain('window.getGreeting');
        expect(browserContent).toContain('window.getPageTitle');
        expect(browserContent).toContain(JSON.stringify(greeting.getGreeting()));
        expect(browserContent).toContain(JSON.stringify(greeting.getPageTitle()));
    });
});
