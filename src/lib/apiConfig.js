import axios from 'axios';
import { auth } from './firebase';
import { signOut } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const RETRYABLE_STATUS = new Set([429, 503]);
const MAX_RETRIES = 2;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isIdempotent = (config) =>
  ['get', 'head', 'options'].includes((config?.method || 'get').toLowerCase());

// 429 means the request was rejected before processing, so retrying is safe for any method.
// 503 is only retried for idempotent requests to avoid duplicating writes.
const shouldRetry = (error) => {
  const config = error.config;
  const status = error.response?.status;
  if (!config || !RETRYABLE_STATUS.has(status)) return false;
  if ((config.__retryCount || 0) >= MAX_RETRIES) return false;
  if (status === 503 && !isIdempotent(config)) return false;
  return true;
};

const retryRequest = async (client, error) => {
  const config = error.config;
  config.__retryCount = (config.__retryCount || 0) + 1;

  const retryAfterSeconds = Number(error.response?.headers?.['retry-after']);
  const delay = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
    ? retryAfterSeconds * 1000
    : 400 * 2 ** (config.__retryCount - 1);

  await sleep(delay);
  return client(config);
};

const attachResponseInterceptors = (client) => {
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (shouldRetry(error)) {
        try {
          return await retryRequest(client, error);
        } catch (retryError) {
          return Promise.reject(retryError);
        }
      }

      if (error.response?.status === 401) {
        // Token hết hạn, logout user
        await signOut(auth);
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

const attachAuthInterceptor = (client) => {
  client.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken();
      config.headers['Authorization'] = `Bearer ${idToken}`;
    }
    return config;
  }, (error) => Promise.reject(error));
};

// Regular API instance for JSON requests
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: automatically add Authorization header if user is logged in
attachAuthInterceptor(api);
attachResponseInterceptors(api);

// Upload API instance for multipart/form-data
const uploadApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

// Add auth interceptor to uploadApi as well
attachAuthInterceptor(uploadApi);
attachResponseInterceptors(uploadApi);

export { api, uploadApi, API_URL };
