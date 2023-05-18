import React, {useEffect} from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react';
import WatchCat from '../index';
import WatchCatTestClient from "./watchcat_test_client";

describe('ErrorBoundary test', () => {
    let client: WatchCatTestClient

    beforeEach(() => {
        client = new WatchCatTestClient({
            token: "app_12345"
        })
        WatchCat.initFromInstance(client)
    })

    test('renders content in case of no error', async () => {
        const fallback = <p>Oops, something went wrong.</p>;

        const Content = () => {
            return <p>Component content.</p>
        };

        const {getByText} = render(
            <WatchCat.ErrorBoundary fallback={fallback}>
                <Content/>
            </WatchCat.ErrorBoundary>
        );

        await waitFor(() => {
            expect(getByText('Component content.')).toBeInTheDocument();
            expect(client.callCount).toBe(0)
        });
    });

    test('renders the fallback component in case of an error', async () => {
        const fallback = <p>Oops, something went wrong.</p>;
        const e = new Error('error in child component')

        const ErrorChild = () => {
            throw e;
        };

        const {getByText} = render(
            <WatchCat.ErrorBoundary fallback={fallback}>
                <ErrorChild/>
            </WatchCat.ErrorBoundary>
        );

        await waitFor(() => {
            expect(getByText('Oops, something went wrong.')).toBeInTheDocument();
            expect(client.lastError).toBe(e)
            expect(client.callCount).toBe(1)
        });
    });

    test('renders the fallback component when error happen in hook', async () => {
        const fallback = <p>Oops, something went wrong.</p>;
        const e = new Error('error in child component')

        const ErrorChild = () => {
            useEffect(() => {
                throw e;
            })
            return (<></>)
        };

        const {getByText} = render(
            <WatchCat.ErrorBoundary fallback={fallback}>
                <ErrorChild/>
            </WatchCat.ErrorBoundary>
        );

        await waitFor(() => {
            expect(getByText('Oops, something went wrong.')).toBeInTheDocument();
            expect(client.lastError).toBe(e)
            expect(client.callCount).toBe(1)
        });
    });

    test('catch error in event handler', async () => {
        const fallback = <p>Oops, something went wrong.</p>;
        const e = new Error('error in child component')

        const throwError = () => {
            throw e
        }

        const {getByText} = render(
            <WatchCat.ErrorBoundary fallback={fallback}>
                <p>Content</p>
                <button onClick={throwError}>Throw error</button>
            </WatchCat.ErrorBoundary>
        );

        fireEvent(
            getByText('Throw error'),
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
            }),
        )

        await waitFor(() => {
            expect(getByText('Content')).toBeInTheDocument();
            expect(client.lastError).toBe(e)
            expect(client.callCount).toBe(1)
        });
    });
});
