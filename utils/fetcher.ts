export const fetcher = (url: string, init?: RequestInit) =>
    fetch(`https://frontend-test-api.yoldi.agency/api${url}`, init)
        .then((response) => response.json());
