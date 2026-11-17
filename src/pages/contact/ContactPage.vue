<script lang="ts" setup>
import {onBeforeUnmount, onMounted, reactive, ref} from 'vue';

// hCaptcha's global, once its script has loaded (only the parts used here)
declare global {
    interface Window {
        hcaptcha?: {
            render(container: HTMLElement, options: Record<string, unknown>): string;
            reset(widgetId?: string): void;
            remove(widgetId?: string): void;
        };
    }
}

// Injected at build time from the WEB3FORMS_ACCESS_KEY repo secret (see deploy.yml), or from
// .env.local in development
const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? '';

// Web3Forms' shared hCaptcha site key (free plan) - it validates the token on their side
const HCAPTCHA_SITE_KEY = '50b2fe65-b00b-4b9e-ad62-3ba471098be2';
const HCAPTCHA_SCRIPT = 'https://js.hcaptcha.com/1/api.js?render=explicit&recaptchacompat=off';

const form = reactive({name: '', email: '', subject: '', message: '', botcheck: false});
const captchaToken = ref('');
const captchaEl = ref<HTMLElement | null>(null);
const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle');
const errorMessage = ref('');
const validated = ref(false);

let widgetId: string | undefined;

/** Loads the hCaptcha script once per page load, however often the contact page is visited. */
function loadHCaptcha(): Promise<void> {
    if (window.hcaptcha) {
        return Promise.resolve();
    }
    let script = document.querySelector<HTMLScriptElement>(`script[src="${HCAPTCHA_SCRIPT}"]`);
    if (!script) {
        script = document.createElement('script');
        script.src = HCAPTCHA_SCRIPT;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    }
    return new Promise((resolve, reject) => {
        script!.addEventListener('load', () => resolve(), {once: true});
        script!.addEventListener('error', () => reject(new Error('hCaptcha failed to load')), {once: true});
    });
}

onMounted(async () => {
    try {
        await loadHCaptcha();
    } catch {
        errorMessage.value = 'The captcha could not be loaded. Please check your connection and refresh the page.';
        status.value = 'error';
        return;
    }
    if (!captchaEl.value || !window.hcaptcha) {
        return;
    }
    widgetId = window.hcaptcha.render(captchaEl.value, {
        sitekey: HCAPTCHA_SITE_KEY,
        theme: document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light',
        callback: (token: string) => (captchaToken.value = token),
        'expired-callback': () => (captchaToken.value = ''),
        'error-callback': () => (captchaToken.value = ''),
    });
});

onBeforeUnmount(() => {
    if (widgetId !== undefined) {
        window.hcaptcha?.remove(widgetId);
    }
});

function resetCaptcha() {
    captchaToken.value = '';
    window.hcaptcha?.reset(widgetId);
}

async function submit(event: Event) {
    validated.value = true;
    if (!(event.target as HTMLFormElement).checkValidity() || !captchaToken.value) {
        return;
    }

    status.value = 'sending';
    errorMessage.value = '';
    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', Accept: 'application/json'},
            body: JSON.stringify({
                access_key: accessKey,
                subject: form.subject || `New message from ${form.name}`,
                from_name: 'awstam.com website',
                name: form.name,
                email: form.email,
                message: form.message,
                botcheck: form.botcheck,
                'h-captcha-response': captchaToken.value,
            }),
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Something went wrong.');
        }
        status.value = 'success';
        Object.assign(form, {name: '', email: '', subject: '', message: '', botcheck: false});
        validated.value = false;
    } catch (e) {
        status.value = 'error';
        errorMessage.value = e instanceof Error ? e.message : 'Something went wrong.';
    } finally {
        // A captcha token can only be used once
        resetCaptcha();
    }
}
</script>

<template>
    <div class="container py-5">
        <h1>Contact</h1>
        <p class="text-body-secondary">Have a question? Send us a message and we'll get back to you.</p>

        <div v-if="!accessKey" class="alert alert-warning" role="alert">
            The contact form isn't configured: <code>VITE_WEB3FORMS_ACCESS_KEY</code> is not set.
        </div>

        <div v-if="status === 'success'" class="alert alert-success" role="status">
            Thanks! Your message has been sent.
        </div>
        <div v-else-if="status === 'error'" class="alert alert-danger" role="alert">
            Sorry, your message couldn't be sent. {{ errorMessage }}
        </div>

        <form
            :class="{'was-validated': validated}"
            class="row g-3"
            novalidate
            style="max-width: 40rem"
            @submit.prevent="submit"
        >
            <div class="col-md-6">
                <label class="form-label" for="contact-name">Name</label>
                <input id="contact-name" v-model.trim="form.name" autocomplete="name" class="form-control" required
                       type="text"/>
                <div class="invalid-feedback">Please enter your name.</div>
            </div>
            <div class="col-md-6">
                <label class="form-label" for="contact-email">Email</label>
                <input id="contact-email" v-model.trim="form.email" autocomplete="email" class="form-control"
                       required type="email"/>
                <div class="invalid-feedback">Please enter a valid email address.</div>
            </div>
            <div class="col-12">
                <label class="form-label" for="contact-subject">
                    Subject <span class="text-body-secondary">(optional)</span>
                </label>
                <input id="contact-subject" v-model.trim="form.subject" class="form-control" type="text"/>
            </div>
            <div class="col-12">
                <label class="form-label" for="contact-message">Message</label>
                <textarea id="contact-message" v-model.trim="form.message" class="form-control" required
                          rows="6"></textarea>
                <div class="invalid-feedback">Please enter a message.</div>
            </div>

            <!-- Honeypot: hidden from people, bots fill it in and Web3Forms drops the submission -->
            <input v-model="form.botcheck" aria-hidden="true" class="d-none" name="botcheck" tabindex="-1"
                   type="checkbox"/>

            <div class="col-12">
                <div ref="captchaEl"></div>
                <div v-if="validated && !captchaToken" class="text-danger small mt-1">
                    Please complete the captcha.
                </div>
            </div>

            <div class="col-12">
                <button :disabled="status === 'sending' || !accessKey" class="btn btn-primary" type="submit">
                    <span v-if="status === 'sending'" aria-hidden="true"
                          class="spinner-border spinner-border-sm me-1"></span>
                    <font-awesome-icon v-else class="me-1" icon="fa-solid fa-paper-plane"/>
                    {{ status === 'sending' ? 'Sending…' : 'Send message' }}
                </button>
            </div>
        </form>
    </div>
</template>
