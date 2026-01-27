// client/src/utils/cookieUtils.ts
export const cookieUtils = {
    /**
     * Получить значение куки по имени
     */
    getCookie(name: string): string | null {
        const matches = document.cookie.match(
            new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/+^])/g, '\\$1') + '=([^;]*)')
        );
        return matches ? decodeURIComponent(matches[1]) : null;
    },

    /**
     * Получить totalCount из кук сервера
     */
    getTotalCount(): number {
        try {
            const totalCountStr = this.getCookie('totalCount');
            console.log('🍪 Cookie totalCount string:', totalCountStr);

            if (!totalCountStr) {
                console.log('🍪 No totalCount cookie found');
                return 0;
            }

            const value = parseInt(totalCountStr, 10);
            console.log('🍪 Parsed totalCount:', value);

            return isNaN(value) ? 0 : value;
        } catch (error) {
            console.error('🍪 Error reading totalCount from cookie:', error);
            return 0;
        }
    },

    /**
     * Показать все куки (для отладки)
     */
    listAllCookies(): Record<string, string> {
        const cookies: Record<string, string> = {};
        document.cookie.split(';').forEach(cookie => {
            const [name, ...valueParts] = cookie.trim().split('=');
            if (name) {
                cookies[name] = decodeURIComponent(valueParts.join('='));
            }
        });
        console.log('🍪 All cookies:', cookies);
        return cookies;
    },

    /**
     * Проверить, доступны ли куки
     */
    checkCookieSupport(): boolean {
        try {
            document.cookie = 'testCookie=1; max-age=60';
            const hasCookie = document.cookie.includes('testCookie');
            document.cookie = 'testCookie=; max-age=0';
            console.log('🍪 Cookie support check:', hasCookie);
            return hasCookie;
        } catch (error) {
            console.error('🍪 Cookie support check failed:', error);
            return false;
        }
    }
};