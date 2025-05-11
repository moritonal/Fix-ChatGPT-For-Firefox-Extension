console.log('[FixChatGPTForFirefoxExtension] Performance API patch loaded');

(function patchPerformanceMark() {
    try {
        if (window.wrappedJSObject && window.wrappedJSObject.performance) {
            const originalMark = window.wrappedJSObject.performance.mark;

            const interceptedMark = function (markName, markOptions) {
                console.debug('[FixChatGPTForFirefoxExtension] performance.mark called', markName, markOptions);

                if (markOptions && typeof markOptions.startTime === 'number' && markOptions.startTime < 0) {
                    console.warn('[FixChatGPTForFirefoxExtension] performance.mark called with negative startTime', markOptions, 'converting to 0');
                    markOptions.startTime = 0;
                }

                return originalMark.call(window.wrappedJSObject.performance, markName, markOptions);
            };

            if (typeof exportFunction === 'function') {
                exportFunction(interceptedMark, window.wrappedJSObject.performance, { defineAs: 'mark' });
                console.debug('[FixChatGPTForFirefoxExtension] exportFunction used to override performance.mark');
            } else {
                // Fallback: directly assign interceptedMark if exportFunction is unavailable
                window.wrappedJSObject.performance.mark = interceptedMark;
                console.debug('[FixChatGPTForFirefoxExtension] exportFunction not available; attempting ro directly assigned interceptedMark');
            }
        } else {
            console.error('[FixChatGPTForFirefoxExtension] wrappedJSObject or performance not available.');
        }
    } catch (e) {
        console.error('[FixChatGPTForFirefoxExtension] Failed to override performance.mark:', e);
    }
})();
