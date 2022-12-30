const overlayStyles: Partial<CSSStyleDeclaration> = {
    display: 'none',
    position: 'fixed',
    top: '0',
    right: '0',
    width: '100%',
    height: '100%',
    borderRadius: '0',
    border: 'none',
    zIndex: '2147483647',
};

function applyOverlayStyles(elem: HTMLElement) {
    for (const [cssProperty, value] of Object.entries(overlayStyles)) {
        (elem.style as any)[cssProperty as any] = value;
    }
}

class Ready {
    private _isCompleted = false;
    // Wait for resolve, resolve if iframe becomes ready state.
    private _eventListeners = Array<() => void>();
    complete = () => {
        this._isCompleted = true;
        this._eventListeners.forEach((eventListener) => eventListener());
    };

    add = (eventListener: () => void) => {
        this._eventListeners.push(eventListener);
    };

    isCompleted = () => {
        return this._isCompleted;
    };
}

export class Iframe {
    private readonly _iframe!: Promise<HTMLIFrameElement>;
    private readonly _ready = new Ready();
    private activeElement: any = null;
    private requestIndex = 1;

    constructor(iframeUrl: string) {
        if (document.getElementById('face-iframe')) {
            console.error('Face is already initialized, Face can be initialized once.');
            return;
        }

        this._iframe = new Promise((resolve) => {
            const onload = () => {
                if (!document.getElementById('face-iframe')) {
                    const iframe = document.createElement('iframe');
                    iframe.id = 'face-iframe';
                    iframe.title = 'Secure Modal';
                    iframe.src = new URL(`${iframeUrl}`).href;
                    iframe.allow = 'clipboard-read; clipboard-write';
                    iframe.onload = () => {
                        this._ready.complete();
                    };
                    applyOverlayStyles(iframe);
                    document.body.appendChild(iframe);
                    resolve(iframe);
                }
            };

            if (['loaded', 'interactive', 'complete'].includes(document.readyState)) {
                onload();
            } else {
                window.addEventListener('load', onload, false);
            }
        });
    }

    async ready(): Promise<void> {
        return new Promise(async (resolve) => {
            if (this._ready.isCompleted()) {
                resolve();
                return;
            }

            this._ready.add(() => {
                resolve();
            });
        });
    }

    /**
     * iframe으로 데이터 전송한다.
     * iframe에서는 window.removeEventListener('message', listener) 를 통해 데이터를 받을 수 있다.
     * @param {object} data - iframe으로 전송하고자 하는 데이터
     * @returns {string} - 전송한 메시지에 할당된 id 값. 이 값으로 해당 메시지에 대한 응답을 받을 수 있다.
     */
    async postMessage(data: any): Promise<string> {
        await this.ready();
        data.id = (this.requestIndex++).toString();
        (await this._iframe)?.contentWindow?.postMessage(data, '*');
        return data.id;
    }

    /**
     * requestId에 해당하는 응답 메시지를 받으면 그 결과를 반환한다.
     * requestId는 this.postMessage에서 메시지에 할당해준다.
     * @param {string} requestId - 응답을 받고자 하는 메시지의 id
     * @returns {any} - 응답 메시지 데이터
     */
    waitForMessage<T>(requestId?: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const listener = (event: MessageEvent) => {
                const response = event.data;
                if (requestId && response.id !== requestId) {
                    return;
                }
                window.removeEventListener('message', listener);

                if (response.error) {
                    reject(response.error);
                }
                resolve(response.result as T);
            };
            window.addEventListener('message', listener);
        });
    }

    /**
     * iframe 요소를 화면에 보여준다.
     */
    async showOverlay() {
        await this.ready();
        const iframe = await this._iframe;
        iframe.style.display = 'block';
        this.activeElement = document.activeElement;
        iframe.focus();
    }
    /**
     * iframe 요소를 숨긴다.
     */
    async hideOverlay() {
        await this.ready();
        const iframe = await this._iframe;
        iframe.style.display = 'none';
        if (this.activeElement?.focus) this.activeElement.focus();
        this.activeElement = null;
    }
}
