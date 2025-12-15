console.log('[FixChatGPTForFirefoxExtension] Performance API patch loaded');

(function patchPerformanceMark() {

    try {

        // This is the patch needed from 2025-05 for performance.mark
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
                window.wrappedJSObject.performance.mark = interceptedMark;
                console.debug('[FixChatGPTForFirefoxExtension] exportFunction not available; attempted direct assignment');
            }
        } else {
            console.error('[FixChatGPTForFirefoxExtension] wrappedJSObject or performance not available.');
        }

        // This is the patch needed from 2025-12 for performance.measure
        if (window.wrappedJSObject && window.wrappedJSObject.performance) {
            const originalMeasure = window.wrappedJSObject.performance.measure;

            const interceptedMeasure = function (measureName, measureOptions) {
                console.debug('[FixChatGPTForFirefoxExtension] performance.measure called', measureName, measureOptions);

                if (measureOptions && typeof measureOptions.start === 'number' && measureOptions.start < 0) {
                    console.warn('[FixChatGPTForFirefoxExtension] performance.measure called with negative start', measureOptions, 'converting to 0');
                    measureOptions.start = 0;
                }
                if (measureOptions && typeof measureOptions.end === 'number' && measureOptions.end < 0) {
                    console.warn('[FixChatGPTForFirefoxExtension] performance.measure called with negative end', measureOptions, 'converting to 0');
                    measureOptions.end = 0;
                }

                return originalMeasure.call(window.wrappedJSObject.performance, measureName, measureOptions);
            };

            if (typeof exportFunction === 'function') {
                exportFunction(interceptedMeasure, window.wrappedJSObject.performance, { defineAs: 'measure' });
                console.debug('[FixChatGPTForFirefoxExtension] exportFunction used to override performance.measure');
            } else {
                window.wrappedJSObject.performance.measure = interceptedMeasure;
                console.debug('[FixChatGPTForFirefoxExtension] exportFunction not available; attempted direct assignment');
            }
        } else {
            console.error('[FixChatGPTForFirefoxExtension] wrappedJSObject or performance not available.');
        }




    } catch (e) {
        console.error('[FixChatGPTForFirefoxExtension] Failed to override performance.mark:', e);
    }

})();

