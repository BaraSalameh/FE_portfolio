import { expect, test } from '@playwright/test';
import { getApiErrorMessage } from '../src/lib/api/errors';

test('validation problem details prefer field messages over the generic title', () => {
    const message = getApiErrorMessage({
        title: 'One or more validation errors occurred.',
        errors: {
            Password: ['Password must be at least 8 characters.'],
        },
    }, 'Registration failed.');

    expect(message).toBe('Password must be at least 8 characters.');
});

test('problem details still use the title when no field messages are available', () => {
    expect(getApiErrorMessage(
        { title: 'The request could not be completed.' },
        'Request failed.',
    )).toBe('The request could not be completed.');
});
