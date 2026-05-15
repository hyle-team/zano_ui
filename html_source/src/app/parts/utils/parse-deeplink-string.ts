import { DeeplinkResponse } from '@api/models/deeplink.model';

type SupportedSendKey = 'action' | 'address' | 'amount' | 'asset_id' | 'comment';

const SUPPORTED_PREFIX = 'zano:';
const SUPPORTED_SEND_KEYS = new Set<SupportedSendKey>(['address', 'amount', 'asset_id', 'comment']);
const NUMERIC_VALUE_REGEX = /^\d+(?:\.\d+)?$/;

const isNumericString = (value: string): boolean => NUMERIC_VALUE_REGEX.test(value);

export const parseDeeplinkString = (deeplink: string): DeeplinkResponse | null => {
    if (!deeplink.toLowerCase().startsWith(SUPPORTED_PREFIX)) {
        return null;
    }

    const payload = deeplink.slice(SUPPORTED_PREFIX.length).trim();
    if (!payload || payload.startsWith('//')) {
        return null;
    }

    const parsedDeeplink: DeeplinkResponse = {
        action: 'send',
        address: '',
        amount: '',
        asset_id: '',
    };

    const seenKeys = new Set<string>();
    const parts = payload.split('&').filter(Boolean);
    let parsedAction = '';

    for (const part of parts) {
        const separatorIndex = part.indexOf('=');
        if (separatorIndex < 0) {
            return null;
        }

        const rawKey = part.slice(0, separatorIndex).trim();
        const rawValue = part.slice(separatorIndex + 1);

        let normalizedKey: SupportedSendKey;
        let normalizedValue: string;
        try {
            normalizedKey = decodeURIComponent(rawKey).trim().toLowerCase() as SupportedSendKey;
            normalizedValue = decodeURIComponent(rawValue).replace(/'|"|”/g, '').trim();
        } catch {
            return null;
        }

        if (normalizedKey === 'action') {
            if (parsedAction) {
                return null;
            }
            parsedAction = normalizedValue.toLowerCase();
            continue;
        }

        if (!SUPPORTED_SEND_KEYS.has(normalizedKey) || seenKeys.has(normalizedKey)) {
            return null;
        }

        seenKeys.add(normalizedKey);
        parsedDeeplink[normalizedKey] = normalizedValue;
    }

    if (parsedAction !== 'send' || !parsedDeeplink.address || !parsedDeeplink.amount || !parsedDeeplink.asset_id) {
        return null;
    }

    if (!isNumericString(parsedDeeplink.amount)) {
        return null;
    }

    return parsedDeeplink;
};
