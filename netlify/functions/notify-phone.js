const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const params = new URLSearchParams(event.body);
        const data = Object.fromEntries(params);

        console.log('New appointment:', data);

        const message = `🚨 NEW APPOINTMENT!!
Name: ${data.name}
State ID: ${data.state_id}
Phone: ${data.phone}
Car: ${data.car_interest}
Financing: ${data.financing}
Time: ${data.appointment_time}
Notes: ${data.notes || 'None'}`;

        // Launch with serverless Chromium
        const browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 375, height: 812 });

        await page.goto(process.env.ONX_PHONE_URL, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        await page.waitForTimeout(3000);

        const groupName = process.env.EMPLOYEE_GROUP || 'Black Label';

        // Check if already in chat
        const alreadyInChat = await page.evaluate((group) => {
            const headers = document.querySelectorAll('h1, h2, h3, .chat-header, .group-name');
            for (const header of headers) {
                if (header.textContent.includes(group)) return true;
            }
            const inputs = document.querySelectorAll('input[type="text"], textarea');
            const apps = document.querySelectorAll('[class*="app"]');
            return inputs.length > 0 && apps.length < 5;
        }, groupName);

        if (!alreadyInChat) {
            try {
                await page.waitForSelector('text=Messages', { timeout: 5000 });
                await page.click('text=Messages');
                await page.waitForTimeout(2000);

                await page.waitForSelector('text=Groups', { timeout: 5000 });
                await page.click('text=Groups');
                await page.waitForTimeout(1500);

                await page.waitForSelector(`text=${groupName}`, { timeout: 5000 });
                await page.click(`text=${groupName}`);
                await page.waitForTimeout(1500);
            } catch (e) {
                console.log('Navigation error:', e.message);
            }
        }

        // Find message input
        const inputSelectors = [
            'input[type="text"]',
            'textarea',
            '[placeholder*="message" i]',
            '[contenteditable="true"]'
        ];

        let messageInput = null;
        for (const selector of inputSelectors) {
            const elements = await page.$$(selector);
            if (elements.length > 0) {
                messageInput = elements[elements.length - 1];
                break;
            }
        }

        if (messageInput) {
            await messageInput.click();
            await page.waitForTimeout(300);
            await messageInput.type(message);
            await page.waitForTimeout(300);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(1000);
        }

        await browser.close();

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Appointment booked! Staff notified.'
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};