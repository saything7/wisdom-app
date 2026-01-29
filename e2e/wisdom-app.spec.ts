import { test, expect } from '@playwright/test';

test.describe('Wisdom App E2E Tests', () => {
    test.beforeEach(async ({ page, context }) => {
        // Очищаем localStorage через контекст браузера
        await context.clearCookies();
        await context.addInitScript(() => {
            window.localStorage.clear();
            window.sessionStorage.clear();
        });

        // Сбрасываем все моки
        await page.unroute('**/api/quotes/random');

        // Переходим на главную страницу
        await page.goto('http://localhost:3000');
        await page.waitForLoadState('networkidle');

        // Ждем загрузки начальной кнопки
        await expect(page.getByRole('button', { name: /Поделись со мной своей мудростью/i })).toBeVisible();
    });

    test('should load the main page', async ({ page }) => {
        // Проверяем заголовок
        await expect(page.getByRole('heading', { name: /Цитатник Джейсона Стетхема/i })).toBeVisible();

        // Начальная кнопка
        await expect(page.getByRole('button', { name: /Поделись со мной своей мудростью/i })).toBeVisible();

        // Проверяем счетчики
        await expect(page.getByText(/Запросов в сессии:/i)).toBeVisible();
        await expect(page.getByText(/Всего получено:/i)).toBeVisible();
        await expect(page.getByText(/Осталось 3 запроса из 3-х запросов/i)).toBeVisible();
    });

    test('should display a quote and change button text to Новая цитата', async ({ page }) => {
        // Мокаем успешный ответ
        await page.route('**/api/quotes/random', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    quote: 'Тестовая цитата для E2E теста',
                    count: 1,
                    totalCount: 100,
                    userId: 'test-user',
                    timestamp: new Date().toISOString(),
                }),
            });
        });

        // Нажимаем начальную кнопку
        await page.getByRole('button', { name: /Поделись со мной своей мудростью/i }).click();

        // Ждем появления цитаты
        await expect(page.locator('blockquote, [class*="quote"]').first()).toBeVisible();
        await expect(page.getByText('Тестовая цитата для E2E теста')).toBeVisible();

        // Проверяем что кнопка изменилась на "Новая цитата" и активна
        const newQuoteButton = page.getByRole('button', { name: /Новая цитата/i });
        await expect(newQuoteButton).toBeVisible();
        await expect(newQuoteButton).toBeEnabled();
    });

    test('should disable Новая цитата button after 3 quotes with hourly timer', async ({ page, context }) => {
        let requestCount = 0;
        await page.route('**/api/quotes/random', async (route) => {
            requestCount++;

            if (requestCount <= 3) {
                // Первые 3 запроса - успешные
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        quote: `Цитата ${requestCount}`,
                        count: requestCount,
                        totalCount: 100,
                        userId: 'test-user',
                        timestamp: new Date().toISOString(),
                    }),
                });
            } else {
                // 4-й запрос - rate limit (но кнопка уже неактивна, так что этот запрос не должен уйти)
                await route.fulfill({
                    status: 429,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        message: 'Стетхем устал. Попробуйте позже!',
                        retryAfter: 3600,
                    }),
                });
            }
        });

        // Первый клик - начальная кнопка
        await page.getByRole('button', { name: /Поделись со мной своей мудростью/i }).click();
        await expect(page.getByText('Цитата 1')).toBeVisible();

        // Кнопка стала "Новая цитата"
        const newQuoteButton = page.getByRole('button', { name: /Новая цитата/i });
        await expect(newQuoteButton).toBeVisible();
        await expect(newQuoteButton).toBeEnabled();

        // Второй клик
        await newQuoteButton.click();
        await expect(page.getByText('Цитата 2')).toBeVisible();

        // Третий клик
        await newQuoteButton.click();
        await expect(page.getByText('Цитата 3')).toBeVisible();

        // После 3 цитат кнопка должна стать неактивной
        await expect(newQuoteButton).toBeDisabled();

        // Проверяем что при попытке кликать на неактивную кнопку ничего не происходит
        await newQuoteButton.click({ force: true }); // force:true чтобы кликнуть даже на disabled
        // Ждем немного и проверяем что не появилось новых цитат
        await page.waitForTimeout(500);
        // Все еще должна отображаться последняя цитата
        await expect(page.getByText('Цитата 3')).toBeVisible();
        await expect(page.getByText('Цитата 4')).not.toBeVisible();

        // Проверяем наличие таймера (формат 00:59:59)
        const timer = page.locator('[class*="timeValue"]').first();
        await expect(timer).toBeVisible({ timeout: 5000 });
    });

    test('should show cheater button after localStorage reset and page reload', async ({ page, context }) => {
        // 1. Симулируем протухший лимит в localStorage через контекст
        await context.addInitScript(() => {
            window.localStorage.setItem('quotesUsed', '3');
            window.localStorage.setItem('limitExhaustedTime', (Date.now() - 1000).toString());
        });

        // 2. Обновляем страницу
        await page.reload();
        await page.waitForLoadState('networkidle');

        // 3. Мокаем immediate rate limit (без retryAfter)
        await page.route('**/api/quotes/random', async (route) => {
            await route.fulfill({
                status: 429,
                contentType: 'application/json',
                body: JSON.stringify({
                    message: 'Стетхем устал. Попробуйте позже!',
                }),
            });
        });

        // 4. Нажимаем начальную кнопку (активна, так как localStorage протух)
        const initialButton = page.getByRole('button', { name: /Поделись со мной своей мудростью/i });
        await expect(initialButton).toBeVisible();
        await expect(initialButton).toBeEnabled();

        await initialButton.click();

        // 5. Проверяем ошибку с ❌
        await expect(page.getByText(/Стетхем устал/i)).toBeVisible();
        await expect(page.getByText('❌')).toBeVisible();

        // 6. Кнопка должна измениться на "читер"
        const cheaterButton = page.locator('button:has-text("читер")');
        await expect(cheaterButton).toBeVisible();
        // 7. НЕ должно быть таймера
        const timer = page.locator('[class*="timeValue"]').first();
        await expect(timer).not.toBeVisible();
    });

    test('should reset button text to initial after page reload', async ({ page }) => {
        // Мокаем успешный ответ
        await page.route('**/api/quotes/random', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    quote: 'Тестовая цитата',
                    count: 1,
                    totalCount: 100,
                    userId: 'test-user',
                    timestamp: new Date().toISOString(),
                }),
            });
        });

        // Получаем цитату
        await page.getByRole('button', { name: /Поделись со мной своей мудростью/i }).click();
        await expect(page.locator('blockquote, [class*="quote"]').first()).toBeVisible();

        // Проверяем что кнопка изменилась на "Новая цитата"
        await expect(page.getByRole('button', { name: /Новая цитата/i })).toBeVisible();

        // Обновляем страницу
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Проверяем что кнопка вернулась к начальному тексту
        await expect(page.getByRole('button', { name: /Поделись со мной своей мудростью/i })).toBeVisible();
    });
});
