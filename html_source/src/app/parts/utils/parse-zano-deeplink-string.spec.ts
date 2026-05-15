import { parseDeeplinkString } from './parse-deeplink-string';

describe('parseZanoDeeplinkString', () => {
    it('returns null when amount and asset_id are missing', () => {
        const deeplink =
            'zano:action=send&address=ZxCkvE7zhS6JuFE5neAaTtcY8PUT2CwfLZJQWP32jrELB1Vg9oSJyGJDyRWurqX6SXSqxjGz2yrAKaMqmxDa7E8313igosBVT&comment=Some%20payment';

        const result = parseDeeplinkString(deeplink);

        expect(result).toBeNull();
    });

    it('parses full deeplink with custom asset hash', () => {
        const deeplink =
            'zano:action=send&address=ZxDoenyb2JD5zu4Jccqa5FWvt2E4jnePK8X7n9ecRJuGEnPXHPoaRHug1FAwAccTSDcsMWHbN12qJgvJvWTivVSS1gHJYwp19&asset_id=86143388bd056a8f0bab669f78f14873fac8e2dd8d57898cdb725a2d5e2e4f8f&amount=10&comment=test';

        const result = parseDeeplinkString(deeplink);

        expect(result).toEqual({
            action: 'send',
            address: 'ZxDoenyb2JD5zu4Jccqa5FWvt2E4jnePK8X7n9ecRJuGEnPXHPoaRHug1FAwAccTSDcsMWHbN12qJgvJvWTivVSS1gHJYwp19',
            asset_id: '86143388bd056a8f0bab669f78f14873fac8e2dd8d57898cdb725a2d5e2e4f8f',
            amount: '10',
            comment: 'test',
        });
    });

    it('returns null when action is missing', () => {
        expect(parseDeeplinkString('zano:address=abc&amount=1&asset_id=asset_1')).toBeNull();
    });

    it('returns null for zano://transfer format', () => {
        expect(parseDeeplinkString('zano://transfer/?address=abc&amount=1')).toBeNull();
    });

    it('returns null for unsupported params', () => {
        expect(parseDeeplinkString('zano:action=send&address=abc&amount=1&foo=bar')).toBeNull();
    });

    it('returns null for duplicate params', () => {
        expect(parseDeeplinkString('zano:action=send&address=abc&amount=1&amount=2')).toBeNull();
    });

    it('returns null for unsupported action', () => {
        expect(parseDeeplinkString('zano:action=escrow&address=abc&amount=1')).toBeNull();
    });

    it('returns null for wrong scheme', () => {
        expect(parseDeeplinkString('http:action=send&address=abc&amount=1&asset_id=asset_1')).toBeNull();
    });

    it('returns null for zano:// with double slash', () => {
        expect(parseDeeplinkString('zano://action=send&address=abc&amount=1&asset_id=asset_1')).toBeNull();
    });

    it('returns null for empty payload', () => {
        expect(parseDeeplinkString('zano:')).toBeNull();
    });

    it('returns null when key value separator is missing', () => {
        expect(parseDeeplinkString('zano:action=send&address&amount=1&asset_id=asset_1')).toBeNull();
    });

    it('parses action value with trailing spaces after decode', () => {
        expect(parseDeeplinkString('zano:action=send%20&address=abc&amount=1&asset_id=asset_1')).toEqual({
            action: 'send',
            address: 'abc',
            amount: '1',
            asset_id: 'asset_1',
        });
    });

    it('returns null for empty address', () => {
        expect(parseDeeplinkString('zano:action=send&address=&amount=1&asset_id=asset_1')).toBeNull();
    });

    it('returns null for empty amount', () => {
        expect(parseDeeplinkString('zano:action=send&address=abc&amount=&asset_id=asset_1')).toBeNull();
    });

    it('returns null for empty asset_id', () => {
        expect(parseDeeplinkString('zano:action=send&address=abc&amount=1&asset_id=')).toBeNull();
    });

    it('returns null when amount is missing', () => {
        expect(parseDeeplinkString('zano:action=send&address=abc&asset_id=asset_1')).toBeNull();
    });

    it('returns null when asset_id is missing', () => {
        expect(parseDeeplinkString('zano:action=send&address=abc&amount=1')).toBeNull();
    });

    it('returns null for duplicate address', () => {
        expect(parseDeeplinkString('zano:action=send&address=abc&address=def&amount=1&asset_id=asset_1')).toBeNull();
    });

    it('returns null for duplicate asset_id', () => {
        expect(parseDeeplinkString('zano:action=send&address=abc&amount=1&asset_id=asset_1&asset_id=asset_2')).toBeNull();
    });

    it('returns null for duplicate action', () => {
        expect(parseDeeplinkString('zano:action=send&action=send&address=abc&amount=1&asset_id=asset_1')).toBeNull();
    });

    it('returns null for malformed percent encoding', () => {
        expect(parseDeeplinkString('zano:action=send&address=abc%ZZ&amount=1&asset_id=asset_1')).toBeNull();
    });

    it('returns null for unsupported payment_id parameter', () => {
        expect(parseDeeplinkString('zano:action=send&address=abc&amount=1&asset_id=asset_1&payment_id=123')).toBeNull();
    });

    it('returns null when amount is text', () => {
        expect(parseDeeplinkString('zano:action=send&address=abc&amount=hello&asset_id=asset_1')).toBeNull();
    });

    it('returns null when amount contains non-numeric characters', () => {
        expect(parseDeeplinkString('zano:action=send&address=abc&amount=10abc&asset_id=asset_1')).toBeNull();
    });
});
